<?php

require_once __DIR__ . "/../models/Product.php";
require_once __DIR__ . "/../middleware/AuthMiddleware.php";

class ProductController {
    private Product $productModel;

    public function __construct() {
        $this->productModel = new Product();
    }

    private function jsonResponse(bool $success, mixed $data = null, string $message = '', int $statusCode = 200): never {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => $success,
            'data'    => $data,
            'message' => $message,
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    public function index(): never {
        if (isset($_GET['id'])) {
            $product = $this->productModel->findById((int)$_GET['id']);
            if ($product) {
                $this->jsonResponse(true, $product);
            }
            $this->jsonResponse(false, null, "Không tìm thấy sản phẩm", 404);
        }

        $filters = [
            'page'        => $_GET['page'] ?? 1,
            'limit'       => $_GET['limit'] ?? 12,
            'min_price'   => $_GET['min_price'] ?? null,
            'max_price'   => $_GET['max_price'] ?? null,
            'category_id' => $_GET['category_id'] ?? null,
            'category'    => $_GET['category'] ?? null,
            'keyword'     => $_GET['keyword'] ?? null,
            'seller_id'   => $_GET['seller_id'] ?? null,
            'price_range' => $_GET['price_range'] ?? null
        ];

        $result = $this->productModel->getAdvanced($filters);
        $this->jsonResponse(true, $result);
    }

    public function store(): never {
        $user = AuthMiddleware::authenticate();

        $data = [
            'seller_id'       => $user['user_id'],
            'category_id'     => $_POST['category_id'] ?? null,
            'brand_id'        => $_POST['brand_id'] ?? null,
            'title'           => $_POST['title'] ?? ($_POST['name'] ?? ''),
            'description'     => $_POST['description'] ?? '',
            'price'           => $_POST['price'] ?? 0,
            'condition_state' => $_POST['condition_state'] ?? ($_POST['condition'] ?? 'Sử dụng tốt'),
            'frame_material'  => $_POST['frame_material'] ?? ($_POST['frame'] ?? null),
            'wheel_size'      => $_POST['wheel_size'] ?? ($_POST['wheel'] ?? ($_POST['size'] ?? null)),
            'groupset'        => $_POST['groupset'] ?? null,
            'brake_type'      => $_POST['brake_type'] ?? ($_POST['brake'] ?? null),
            'location'        => $_POST['location'] ?? '',
            'delivery_type'   => $_POST['delivery_type'] ?? ''
        ];

        if (empty($data['title']) || empty($data['price'])) {
            $this->jsonResponse(false, null, "Thiếu thông tin bắt buộc (Tiêu đề, Giá)", 422);
        }

        $product_id = $this->productModel->create($data);

        if (!$product_id) {
            $this->jsonResponse(false, null, "Không thể tạo sản phẩm", 500);
        }

        $this->storeUploadedImages((int)$product_id);
        $this->jsonResponse(true, ["product_id" => $product_id], "Đăng tin thành công", 201);
    }

    private function storeUploadedImages(int $product_id): void {
        if (!isset($_FILES['images'])) return;

        $upload_dir = __DIR__ . '/../uploads/';
        if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

        $files = $_FILES['images'];
        $allowed_ext = ['jpg', 'jpeg', 'png', 'webp'];
        $total_files = is_array($files['name']) ? count($files['name']) : 0;
        $saved_count = 0;

        for ($i = 0; $i < $total_files; $i++) {
            if ($files['error'][$i] !== UPLOAD_ERR_OK) continue;

            $ext = strtolower(pathinfo($files['name'][$i], PATHINFO_EXTENSION));
            if (!in_array($ext, $allowed_ext, true)) continue;

            $new_name = 'prod_' . bin2hex(random_bytes(8)) . '.jpg';
            $destination = $upload_dir . $new_name;
            
            $saved = $this->processImage($files['tmp_name'][$i], $destination, 1200, 80);
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

    private function processImage(string $source, string $destination, int $maxWidth, int $quality): bool {
        if (!function_exists('imagecreatefromjpeg')) return false;

        $info = getimagesize($source);
        if (!$info) return false;

        [$width, $height, $type] = $info;
        switch ($type) {
            case IMAGETYPE_JPEG: $srcImg = imagecreatefromjpeg($source); break;
            case IMAGETYPE_PNG:  $srcImg = imagecreatefrompng($source);  break;
            case IMAGETYPE_WEBP: $srcImg = imagecreatefromwebp($source); break;
            default: return false;
        }

        if (!$srcImg) return false;

        $newWidth = $width > $maxWidth ? $maxWidth : $width;
        $newHeight = (int)round(($height / $width) * $newWidth);
        $dstImg = imagecreatetruecolor($newWidth, $newHeight);

        imagecopyresampled($dstImg, $srcImg, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
        $saved = imagejpeg($dstImg, $destination, $quality);

        imagedestroy($srcImg);
        imagedestroy($dstImg);
        return $saved;
    }
}
