<?php

require_once __DIR__ . "/../models/Product.php";

class ProductController {
    private $productModel;

    public function __construct() {
        $this->productModel = new Product();
    }

    private function jsonResponse($success, $data = null, $message = "") {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            "success" => $success,
            "data" => $data,
            "message" => $message
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    public function index() {
        if (isset($_GET['id'])) {
            $product = $this->productModel->findById((int) $_GET['id']);

            if ($product) {
                $this->jsonResponse(true, $product);
            }

            http_response_code(404);
            $this->jsonResponse(false, null, "Không tìm thấy sản phẩm");
        }

        if (method_exists($this->productModel, "getAdvanced")) {
            $filters = [
                'page' => $_GET['page'] ?? 1,
                'limit' => $_GET['limit'] ?? 12,
                'min_price' => $_GET['min_price'] ?? null,
                'max_price' => $_GET['max_price'] ?? null,
                'category_id' => $_GET['category_id'] ?? null,
                'category' => $_GET['category'] ?? null,
                'keyword' => $_GET['keyword'] ?? null,
                'seller_id' => $_GET['seller_id'] ?? null,
                'price_range' => $_GET['price_range'] ?? null
            ];
            $this->jsonResponse(true, $this->productModel->getAdvanced($filters));
        }

        $this->jsonResponse(true, $this->productModel->getAll());
    }

    public function store() {
        $seller_id = $_POST['seller_id'] ?? null;
        $category_id = $_POST['category_id'] ?? null;
        $brand_id = $_POST['brand_id'] ?? null;
        $title = $_POST['title'] ?? ($_POST['name'] ?? '');
        $description = $_POST['description'] ?? '';
        $price = $_POST['price'] ?? 0;
        $condition_state = $_POST['condition_state'] ?? ($_POST['condition'] ?? 'Sử dụng tốt');
        $frame_material = $_POST['frame_material'] ?? ($_POST['frame'] ?? null);
        $wheel_size = $_POST['wheel_size'] ?? ($_POST['wheel'] ?? ($_POST['size'] ?? null));
        $groupset = $_POST['groupset'] ?? null;
        $brake_type = $_POST['brake_type'] ?? ($_POST['brake'] ?? null);
        $location = $_POST['location'] ?? '';
        $delivery_type = $_POST['delivery_type'] ?? '';

        if (!$seller_id || empty($title) || empty($price)) {
            $this->jsonResponse(false, null, "Thiếu thông tin bắt buộc");
        }

        $product_id = $this->productModel->create(
            (int) $seller_id,
            $category_id ? (int) $category_id : null,
            $brand_id ? (int) $brand_id : null,
            $title,
            $description,
            (float) $price,
            $condition_state,
            $frame_material,
            $wheel_size,
            $groupset,
            $brake_type,
            $location,
            $delivery_type
        );

        if (!$product_id) {
            $this->jsonResponse(false, null, "Không thể tạo sản phẩm");
        }

        $this->storeUploadedImages((int) $product_id);
        $this->jsonResponse(true, ["product_id" => $product_id], "Tạo sản phẩm thành công");
    }

    private function storeUploadedImages($product_id) {
        if (!isset($_FILES['images'])) {
            return;
        }

        $upload_dir = __DIR__ . '/../uploads/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $files = $_FILES['images'];
        $allowed_ext = ['jpg', 'jpeg', 'png', 'webp'];
        $total_files = count($files['name']);
        $saved_count = 0;

        for ($i = 0; $i < $total_files; $i++) {
            if ($files['error'][$i] !== UPLOAD_ERR_OK) {
                continue;
            }

            $original_name = basename($files['name'][$i]);
            $ext = strtolower(pathinfo($original_name, PATHINFO_EXTENSION));

            if (!in_array($ext, $allowed_ext, true)) {
                continue;
            }

            $new_name = 'prod_' . bin2hex(random_bytes(8)) . '.jpg';
            $destination = $upload_dir . $new_name;
            $saved = $this->processImage($files['tmp_name'][$i], $destination, 1200, 75);

            if (!$saved) {
                $new_name = 'bike_' . bin2hex(random_bytes(8)) . '.' . $ext;
                $destination = $upload_dir . $new_name;
                $saved = move_uploaded_file($files['tmp_name'][$i], $destination);
            }

            if ($saved) {
                $image_url = '/backend/uploads/' . $new_name;
                $this->productModel->addImage($product_id, $image_url, $saved_count === 0 ? 1 : 0);
                $saved_count++;
            }
        }
    }

    private function processImage($source, $destination, $maxWidth, $quality) {
        if (
            !function_exists('getimagesize') ||
            !function_exists('imagecreatetruecolor') ||
            !function_exists('imagejpeg')
        ) {
            return false;
        }

        $imageInfo = getimagesize($source);
        if ($imageInfo === false) {
            return false;
        }

        [$width, $height, $type] = $imageInfo;
        if ($width <= 0 || $height <= 0) {
            return false;
        }

        switch ($type) {
            case IMAGETYPE_JPEG:
                $srcImg = function_exists('imagecreatefromjpeg') ? imagecreatefromjpeg($source) : false;
                break;
            case IMAGETYPE_PNG:
                $srcImg = function_exists('imagecreatefrompng') ? imagecreatefrompng($source) : false;
                break;
            case IMAGETYPE_WEBP:
                $srcImg = function_exists('imagecreatefromwebp') ? imagecreatefromwebp($source) : false;
                break;
            default:
                return false;
        }

        if (!$srcImg) {
            return false;
        }

        $newWidth = $width > $maxWidth ? $maxWidth : $width;
        $newHeight = (int) round(($height / $width) * $newWidth);
        $dstImg = imagecreatetruecolor($newWidth, $newHeight);

        if (!$dstImg) {
            imagedestroy($srcImg);
            return false;
        }

        $white = imagecolorallocate($dstImg, 255, 255, 255);
        imagefilledrectangle($dstImg, 0, 0, $newWidth, $newHeight, $white);
        imagecopyresampled($dstImg, $srcImg, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        $saved = imagejpeg($dstImg, $destination, $quality);

        imagedestroy($srcImg);
        imagedestroy($dstImg);

        return $saved;
    }
}
