<?php

require_once __DIR__ . "/../config/database.php";

class Favorite {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }

    public function add($user_id, $product_id) {
        $query = "INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $user_id, $product_id);
        return $stmt->execute();
    }

    public function remove($user_id, $product_id) {
        $query = "DELETE FROM favorites WHERE user_id = ? AND product_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $user_id, $product_id);
        return $stmt->execute();
    }

    public function getByUserId($user_id) {
        $query = "
            SELECT p.*, p.title as name, pi.image_url as image_url
            FROM favorites f
            JOIN products p ON f.product_id = p.id
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
            WHERE f.user_id = ?
            ORDER BY f.created_at DESC
        ";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $favorites = [];
        while ($row = $result->fetch_assoc()) {
            $favorites[] = $row;
        }
        return $favorites;
    }
}
