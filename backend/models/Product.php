<?php

require_once __DIR__ . "/../config/database.php";

class Product {
    private \PDO $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }

    public function getAll(): array {
        $query = "
            SELECT p.*, p.title as name, c.name as category_name, b.name as brand_name, pi.image_url as image_url
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
            ORDER BY p.created_at DESC
        ";
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll();
    }

    public function getAdvanced(array $params): array {
        $page = isset($params['page']) ? max(1, (int)$params['page']) : 1;
        $limit = isset($params['limit']) ? max(1, (int)$params['limit']) : 12;
        $offset = ($page - 1) * $limit;

        $conditions = ["1=1"];
        $bind_params = [];
        
        $priceRange = $this->parsePriceRange($params['price_range'] ?? null);
        $minPrice = $params['min_price'] ?? $priceRange['min'];
        $maxPrice = $params['max_price'] ?? $priceRange['max'];

        if ($minPrice !== null && $minPrice !== '') {
            $conditions[] = "p.price >= ?";
            $bind_params[] = (float)$minPrice;
        }
        if ($maxPrice !== null && $maxPrice !== '') {
            $conditions[] = "p.price <= ?";
            $bind_params[] = (float)$maxPrice;
        }
        if (!empty($params['category_id'])) {
            $conditions[] = "p.category_id = ?";
            $bind_params[] = (int)$params['category_id'];
        } elseif (!empty($params['category']) && $params['category'] !== 'all') {
            $conditions[] = "p.category_id = (SELECT id FROM categories WHERE slug = ? LIMIT 1)";
            $bind_params[] = $this->normalizeCategorySlug($params['category']);
        }
        if (!empty($params['seller_id'])) {
            $conditions[] = "p.seller_id = ?";
            $bind_params[] = (int)$params['seller_id'];
        }
        if (!empty($params['keyword'])) {
            $conditions[] = "(p.title LIKE ? OR p.description LIKE ?)";
            $keyword = "%" . $params['keyword'] . "%";
            $bind_params[] = $keyword;
            $bind_params[] = $keyword;
        }

        $whereSql = implode(" AND ", $conditions);

        // Count total
        $countQuery = "SELECT COUNT(*) as total FROM products p WHERE $whereSql";
        $stmtCount = $this->conn->prepare($countQuery);
        $stmtCount->execute($bind_params);
        $total_items = (int)$stmtCount->fetch()['total'];

        // Get items
        $query = "
            SELECT p.*, p.title as name, c.name as category_name, b.name as brand_name, pi.image_url as image_url
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
            WHERE $whereSql
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        ";

        $stmt = $this->conn->prepare($query);
        // PDO with emulated prepares disabled needs parameters for LIMIT/OFFSET to be integers or passed correctly
        $finalParams = array_merge($bind_params, [$limit, $offset]);
        $stmt->execute($finalParams);
        $items = $stmt->fetchAll();

        return [
            "items" => $items,
            "total_items" => $total_items,
            "current_page" => $page,
            "total_pages" => (int)ceil($total_items / $limit)
        ];
    }

    private function parsePriceRange(?string $priceRange): array {
        if (empty($priceRange) || $priceRange === 'all') {
            return ['min' => null, 'max' => null];
        }

        $parts = explode('-', $priceRange);
        if (count($parts) !== 2 || !is_numeric($parts[0]) || !is_numeric($parts[1])) {
            return ['min' => null, 'max' => null];
        }

        return [
            'min' => (float)$parts[0] * 1000000,
            'max' => (float)$parts[1] * 1000000
        ];
    }

    private function normalizeCategorySlug(string $category): string {
        $slug = strtolower(trim($category));
        $aliases = ['fixed' => 'fixed-gear'];
        return $aliases[$slug] ?? $slug;
    }

    public function findById(int $id): array|false {
        $query = "
            SELECT p.*, p.title as name, c.name as category_name, b.name as brand_name,
                   u.full_name as seller_name, u.phone_number as seller_phone
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN users u ON p.seller_id = u.id
            WHERE p.id = ?
        ";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        $product = $stmt->fetch();

        if ($product) {
            $imgQuery = "SELECT image_url, is_primary FROM product_images WHERE product_id = ?";
            $imgStmt = $this->conn->prepare($imgQuery);
            $imgStmt->execute([$id]);
            $images = $imgStmt->fetchAll();
            
            $product['images'] = $images;
            $product['image_url'] = $images[0]['image_url'] ?? null;
        }

        return $product;
    }

    public function create(array $data): int|false {
        $query = "INSERT INTO products 
            (seller_id, category_id, brand_id, title, description, price, condition_state, frame_material, wheel_size, groupset, brake_type, location, delivery_type) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        $params = [
            (int)$data['seller_id'],
            (int)$data['category_id'],
            (int)($data['brand_id'] ?? null),
            $data['title'],
            $data['description'],
            (float)$data['price'],
            $data['condition_state'],
            $data['frame_material'],
            $data['wheel_size'],
            $data['groupset'],
            $data['brake_type'],
            $data['location'],
            $data['delivery_type']
        ];

        if ($stmt->execute($params)) {
            return (int)$this->conn->lastInsertId();
        }
        return false;
    }

    public function addImage(int $product_id, string $image_url, int $is_primary = 0): bool {
        $query = "INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$product_id, $image_url, $is_primary]);
    }

    public function getSimilar(int $product_id, int $category_id, int $limit = 4): array {
        $query = "
            SELECT p.*, c.name as category_name, b.name as brand_name, pi.image_url as primary_image
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
            WHERE p.category_id = ? AND p.id != ?
            ORDER BY RAND()
            LIMIT ?
        ";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$category_id, $product_id, $limit]);
        return $stmt->fetchAll();
    }
}
