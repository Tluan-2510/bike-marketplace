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
     * Tìm yêu cầu theo ID
     */
    public function find(int $id): array|false {
        $query = "SELECT * FROM " . $this->table . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    /**
     * Lấy danh sách yêu cầu mua của người dùng (với tư cách là người bán hoặc người mua)
     */
    public function getByUserId(int $userId, string $role = 'buyer'): array {
        if ($role === 'buyer') {
            // Lấy danh sách yêu cầu mua mà USER đã gửi (Mua hàng)
            $query = "SELECT br.*, 
                             p.title as title, 
                             p.price as price,
                             p.seller_id,
                             u_seller.full_name as seller_name,
                             u_seller.phone_number as seller_phone,
                             pi.image_url as image_url
                      FROM " . $this->table . " br
                      JOIN products p ON br.product_id = p.id
                      JOIN users u_seller ON p.seller_id = u_seller.id
                      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
                      WHERE br.buyer_id = ?
                      ORDER BY br.created_at DESC";
        } else {
            // Lấy danh sách yêu cầu mua gửi đến SẢN PHẨM của USER (Yêu cầu từ khách)
            $query = "SELECT br.*, 
                             p.title as title, 
                             p.price as price,
                             p.seller_id,
                             u_buyer.full_name as buyer_name,
                             u_buyer.phone_number as buyer_phone,
                             u_buyer.email as buyer_email,
                             pi.image_url as image_url
                      FROM " . $this->table . " br
                      JOIN products p ON br.product_id = p.id
                      JOIN users u_buyer ON br.buyer_id = u_buyer.id
                      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
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

    /**
     * Tự động cập nhật các yêu cầu liên quan khi sản phẩm được đánh dấu Đã bán
     */
    public function completeRequestsForProduct(int $productId): bool {
        // 1. Chuyển các yêu cầu đang 'accepted' (đã chấp nhận mua) sang 'completed' (đã mua xong)
        $q1 = "UPDATE " . $this->table . " SET status = 'completed' WHERE product_id = ? AND status = 'accepted'";
        $stmt1 = $this->conn->prepare($q1);
        $stmt1->execute([$productId]);
        
        // 2. Nếu không có cái nào đang 'accepted', hãy lấy cái 'pending' mới nhất để làm 'completed' (giả định đây là khách đã mua)
        $checkQuery = "SELECT COUNT(*) FROM " . $this->table . " WHERE product_id = ? AND status = 'completed'";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->execute([$productId]);
        if ($checkStmt->fetchColumn() == 0) {
            $q2 = "UPDATE " . $this->table . " SET status = 'completed' WHERE product_id = ? AND status = 'pending' ORDER BY created_at DESC LIMIT 1";
            $this->conn->prepare($q2)->execute([$productId]);
        }

        // 3. Các yêu cầu 'pending' còn lại chuyển sang 'rejected' (vì xe đã bán cho người khác)
        $q3 = "UPDATE " . $this->table . " SET status = 'rejected' WHERE product_id = ? AND status = 'pending'";
        $this->conn->prepare($q3)->execute([$productId]);
        
        return true;
    }
}
