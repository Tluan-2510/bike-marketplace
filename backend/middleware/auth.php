<!-- Kiểm tra login -->

<?php
function checkAuth() {
    $headers = getallheaders();

    if (!isset($headers['Authorization'])) {
        response("Unauthorized", false);
        exit();
    }

    // demo: BE1 sẽ xử lý JWT
}
?>