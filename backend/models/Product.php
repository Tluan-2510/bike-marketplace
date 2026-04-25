<?php

require_once __DIR__ . "/../config/database.php";

class Product {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }

    public function getAll() {
        $query = "
            SELECT p.*, p.title as name, c.name as category_name, b.name as brand_name, pi.image_url as image_url
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
            ORDER BY p.created_at DESC
        ";
        $result = $this->conn->query($query);
        $products = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $products[] = $row;
            }
        }
        return $products;
    }

    public function getAdvanced($params) {
        $page = isset($params['page']) ? max(1, (int)$params['page']) : 1;
        $limit = isset($params['limit']) ? max(1, (int)$params['limit']) : 12;
        $offset = ($page - 1) * $limit;

        $conditions = ["1=1"];
        $bind_params = [];
        $types = "";
        $priceRange = $this->parsePriceRange($params['price_range'] ?? null);
        $minPrice = $params['min_price'] ?? $priceRange['min'];
        $maxPrice = $params['max_price'] ?? $priceRange['max'];

        if ($minPrice !== null && $minPrice !== '') {
            $conditions[] = "p.price >= ?";
            $bind_params[] = (float)$minPrice;
            $types .= "d";
        }
        if ($maxPrice !== null && $maxPrice !== '') {
            $conditions[] = "p.price <= ?";
            $bind_params[] = (float)$maxPrice;
            $types .= "d";
        }
        if (!empty($params['category_id'])) {
            $conditions[] = "p.category_id = ?";
            $bind_params[] = (int)$params['category_id'];
            $types .= "i";
        } elseif (!empty($params['category']) && $params['category'] !== 'all') {
            $conditions[] = "p.category_id = (SELECT id FROM categories WHERE slug = ? LIMIT 1)";
            $bind_params[] = $this->normalizeCategorySlug($params['category']);
            $types .= "s";
        }
        if (!empty($params['seller_id'])) {
            $conditions[] = "p.seller_id = ?";
            $bind_params[] = (int)$params['seller_id'];
            $types .= "i";
        }
        if (!empty($params['keyword'])) {
            $conditions[] = "(p.title LIKE ? OR p.description LIKE ?)";
            $keyword = "%" . $params['keyword'] . "%";
            $bind_params[] = $keyword;
            $bind_params[] = $keyword;
            $types .= "ss";
        }

        $whereSql = implode(" AND ", $conditions);

        $countQuery = "SELECT COUNT(*) as total FROM products p WHERE $whereSql";
        $stmtCount = $this->conn->prepare($countQuery);
        if (!empty($types)) {
            $stmtCount->bind_param($types, ...$bind_params);
        }
        $stmtCount->execute();
        $total_items = (int)$stmtCount->get_result()->fetch_assoc()['total'];

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
        $queryTypes = $types . "ii";
        $queryParams = array_merge($bind_params, [$limit, $offset]);
        $stmt->bind_param($queryTypes, ...$queryParams);
        $stmt->execute();

        $result = $stmt->get_result();
        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }

        return [
            "items" => $items,
            "total_items" => $total_items,
            "current_page" => $page,
            "total_pages" => (int)ceil($total_items / $limit)
        ];
    }

    private function parsePriceRange($priceRange) {
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

    private function normalizeCategorySlug($category) {
        $slug = strtolower(trim((string)$category));
        $aliases = [
            'fixed' => 'fixed-gear'
        ];

        return $aliases[$slug] ?? $slug;
    }

    public function findById($id) {
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
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $product = $stmt->get_result()->fetch_assoc();

        if ($product) {
            $imgQuery = "SELECT image_url, is_primary FROM product_images WHERE product_id = ?";
            $imgStmt = $this->conn->prepare($imgQuery);
            $imgStmt->bind_param("i", $id);
            $imgStmt->execute();
            $imgResult = $imgStmt->get_result();
            $images = [];
            while ($img = $imgResult->fetch_assoc()) {
                $images[] = $img;
            }
            $product['images'] = $images;
            $product['image_url'] = $images[0]['image_url'] ?? null;
        }

        return $product;
    }

    public function create($seller_id, $category_id, $brand_id, $title, $description, $price, $condition_state, $frame_material, $wheel_size, $groupset, $brake_type, $location, $delivery_type) {
        $query = "INSERT INTO products (seller_id, category_id, brand_id, title, description, price, condition_state, frame_material, wheel_size, groupset, brake_type, location, delivery_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iiissdsssssss", $seller_id, $category_id, $brand_id, $title, $description, $price, $condition_state, $frame_material, $wheel_size, $groupset, $brake_type, $location, $delivery_type);

        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        return false;
    }

    public function addImage($product_id, $image_url, $is_primary = 0) {
        $query = "INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("isi", $product_id, $image_url, $is_primary);
        return $stmt->execute();
    }
}
