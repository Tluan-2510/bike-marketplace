<?php

require_once __DIR__ . "/../config/database.php";

class BuyRequest {
    private $conn;
    private $table = 'buy_requests';

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }

    /**
     * Tạo yêu cầu mua mới
     * Logic: Khi người mua bấm "Liên hệ", lưu vào bảng buy_requests.
     */
    public function create($product_id, $buyer_id, $seller_id, $message) {
        $query = "INSERT INTO " . $this->table . " 
                  (product_id, buyer_id, seller_id, message, status) 
                  VALUES (?, ?, ?, ?, 0)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iiis", $product_id, $buyer_id, $seller_id, $message);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    /**
     * Lấy danh sách yêu cầu mua của người bán
     * API GET /api/buy-requests?seller_id=...
     */
    public function getBySeller($seller_id) {
        $query = "SELECT br.*, p.title as product_title, p.price as product_price, u.full_name as buyer_name 
                  FROM " . $this->table . " br
                  JOIN products p ON br.product_id = p.id
                  JOIN users u ON br.buyer_id = u.id
                  WHERE br.seller_id = ?
                  ORDER BY br.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $seller_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $requests = [];
        while ($row = $result->fetch_assoc()) {
            $requests[] = $row;
        }
        return $requests;
    }

    /**
     * Cập nhật trạng thái yêu cầu
     * Trạng thái (Status):
     * 0: Chờ xử lý (Mặc định).
     * 1: Đã liên hệ/Đang thương lượng.
     * 2: Thành công (Xe đã bán).
     * 3: Đã hủy.
     */
    public function updateStatus($id, $status) {
        $query = "UPDATE " . $this->table . " SET status = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $status, $id);
        
        return $stmt->execute();
    }
}
