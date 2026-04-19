<!-- format JSON -->

<?php
function response($data, $success = true) {
    echo json_encode([
        "success" => $success,
        "data" => $data
    ]);
}
?>