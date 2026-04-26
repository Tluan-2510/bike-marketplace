<!-- Kiểm tra login -->

<?php
function checkAuth() {
    $headers = getallheaders();

    if (!isset($headers['Authorization'])) {
        response("Chưa xác thực", false);
        exit();
    }

    // demo: BE1 sẽ xử lý JWT
}
?>
