<?php

require_once __DIR__ . "/../config/database.php";

class BuyRequest {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }

    public function create($buyer_id, $product_id, $message) {
        $query = "INSERT INTO buy_requests (buyer_id, product_id, message) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iis", $buyer_id, $product_id, $message);
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        return false;
    }

    public function getByUserId($user_id) {
        $query = "
            SELECT br.*, p.title as product_title, p.price as product_price, pi.image_url as product_image
            FROM buy_requests br
            JOIN products p ON br.product_id = p.id
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
            WHERE br.buyer_id = ?
            ORDER BY br.created_at DESC
        ";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $requests = [];
        while ($row = $result->fetch_assoc()) {
            $requests[] = $row;
        }
        return $requests;
    }
}
