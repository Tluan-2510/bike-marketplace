<?php
// File: api/admin/approve.php
header('Content-Type: application/json');
require 'db.php';

// Chỉ nhận phương thức POST theo đúng yêu cầu đề bài
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die(json_encode(["status" => "error", "message" => "Vui lòng dùng phương thức POST"]));
}

// Lấy product_id từ Frontend gửi lên (qua Form Data hoặc JSON)
$product_id = $_POST['product_id'] ?? null;

if (!$product_id) {
    // Nếu Frontend gửi JSON raw
    $data = json_decode(file_get_contents("php://input"), true);
    $product_id = $data['product_id'] ?? null;
}

if ($product_id) {
    try {
        // Viết câu lệnh SQL cập nhật trạng thái duyệt
        $stmt = $pdo->prepare("UPDATE bikes SET is_approved = 1 WHERE id = :id");
        $stmt->execute(['id' => $product_id]);

        echo json_encode(["status" => "success", "message" => "Đã duyệt tin thành công cho xe có ID: " . $product_id]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Thiếu product_id"]);
}
?>