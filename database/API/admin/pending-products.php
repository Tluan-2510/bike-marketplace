<?php
// File: api/admin/pending-products.php
header('Content-Type: application/json');
require 'db.php'; // Gọi file kết nối CSDL

try {
    // Viết câu lệnh SQL tìm xe chưa duyệt
    $stmt = $pdo->prepare("SELECT * FROM bikes WHERE is_approved = 0 ORDER BY created_at DESC");
    $stmt->execute();
    $pending_bikes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Trả kết quả về dạng JSON cho Frontend
    echo json_encode([
        "status" => "success",
        "data" => $pending_bikes
    ]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>