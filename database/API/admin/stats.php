<?php
// File: api/admin/stats.php
header('Content-Type: application/json');
require 'db.php';

try {
    // 1. Đếm tổng số User
    $stmtUser = $pdo->query("SELECT COUNT(*) as total FROM users");
    $totalUsers = $stmtUser->fetch(PDO::FETCH_ASSOC)['total'];

    // 2. Đếm tổng số Xe đã bán (status = 'sold')
    $stmtSold = $pdo->query("SELECT COUNT(*) as total FROM bikes WHERE status = 'sold'");
    $totalSold = $stmtSold->fetch(PDO::FETCH_ASSOC)['total'];

    // 3. Đếm tổng số Xe đang treo bán (status = 'available' VÀ đã duyệt)
    $stmtSelling = $pdo->query("SELECT COUNT(*) as total FROM bikes WHERE status = 'available' AND is_approved = 1");
    $totalSelling = $stmtSelling->fetch(PDO::FETCH_ASSOC)['total'];

    // Gộp tất cả lại và trả về JSON
    echo json_encode([
        "status" => "success",
        "data" => [
            "tong_so_user" => $totalUsers,
            "tong_xe_da_ban" => $totalSold,
            "tong_xe_dang_ban" => $totalSelling
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>