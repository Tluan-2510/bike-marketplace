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
    public function create(int $product_id, int $buyer_id, int $seller_id, string $message): int|false {
        $query = "INSERT INTO " . $this->table . " 
                  (product_id, buyer_id, seller_id, message, status) 
                  VALUES (?, ?, ?, ?, 'pending')";
        
        $stmt = $this->conn->prepare($query);

        if ($stmt->execute([$product_id, $buyer_id, $seller_id, $message])) {
            return (int)$this->conn->lastInsertId();
        }
        return false;
    }

    /**
     * Lấy danh sách yêu cầu mua của người dùng (với tư cách là người bán hoặc người mua)
     */
    public function getByUserId(int $userId, string $role = 'seller'): array {
        $column = ($role === 'buyer') ? 'buyer_id' : 'seller_id';
        
        $query = "SELECT br.*, p.title as product_title, p.price as product_price, 
                         u_buyer.full_name as buyer_name, u_seller.full_name as seller_name
                  FROM " . $this->table . " br
                  JOIN products p ON br.product_id = p.id
                  JOIN users u_buyer ON br.buyer_id = u_buyer.id
                  JOIN users u_seller ON br.seller_id = u_seller.id
                  WHERE br.$column = ?
                  ORDER BY br.created_at DESC";

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
