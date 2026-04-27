<?php

require_once __DIR__ . "/../config/database.php";

class BuyRequest {
    private \PDO $conn;
    private string $table = 'buy_requests';

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }

    /**
     * Tạo yêu cầu mua mới
     */
    public function create(int $product_id, int $buyer_id, string $message): int|false {
        $query = "INSERT INTO " . $this->table . " 
                  (product_id, buyer_id, message, status) 
                  VALUES (?, ?, ?, 'pending')";
        
        $stmt = $this->conn->prepare($query);

        if ($stmt->execute([$product_id, $buyer_id, $message])) {
            return (int)$this->conn->lastInsertId();
        }
        return false;
    }

    /**
     * Lấy danh sách yêu cầu mua của người dùng (với tư cách là người bán hoặc người mua)
     */
    public function getByUserId(int $userId, string $role = 'buyer'): array {
        if ($role === 'buyer') {
            // Lấy danh sách yêu cầu mua mà USER đã gửi
            $query = "SELECT br.*, p.title as product_title, p.price as product_price,
                             p.seller_id,
                             u_seller.full_name as seller_name,
                             u_seller.phone_number as seller_phone
                      FROM " . $this->table . " br
                      JOIN products p ON br.product_id = p.id
                      JOIN users u_seller ON p.seller_id = u_seller.id
                      WHERE br.buyer_id = ?
                      ORDER BY br.created_at DESC";
        } else {
            // Lấy danh sách yêu cầu mua gửi đến SẢN PHẨM của USER (vai trò người bán)
            $query = "SELECT br.*, p.title as product_title, p.price as product_price,
                             p.seller_id,
                             u_buyer.full_name as buyer_name,
                             u_buyer.phone_number as buyer_phone
                      FROM " . $this->table . " br
                      JOIN products p ON br.product_id = p.id
                      JOIN users u_buyer ON br.buyer_id = u_buyer.id
                      WHERE p.seller_id = ?
                      ORDER BY br.created_at DESC";
        }

        $stmt = $this->conn->prepare($query);
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    /**
     * Cập nhật trạng thái yêu cầu
     */
    public function updateStatus(int $id, string $status): bool {
        $query = "UPDATE " . $this->table . " SET status = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$status, $id]);
    }
}
