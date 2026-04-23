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

    public function findById($id) {
        $query = "
            SELECT p.*, p.title as name, c.name as category_name, b.name as brand_name, u.full_name as seller_name, u.phone_number as seller_phone
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
            // Get all images
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
