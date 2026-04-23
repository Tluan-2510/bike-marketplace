<!-- format JSON -->

<?php
function response($data, $success = true) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        "success" => $success,
        "data" => $data
    ], JSON_UNESCAPED_UNICODE);
}
?>
