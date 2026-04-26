<?php
// File: api/admin/db.php
$host = '127.0.0.1';
$db   = 'bicycle_shop';
$user = 'root'; // User mặc định của XAMPP thường là root
$pass = '123456';     // Pass mặc định thường để trống

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["status" => "error", "message" => "Lỗi kết nối CSDL: " . $e->getMessage()]));
}
?>