<?php

require_once __DIR__ . "/../models/Product.php";

class ProductController {
    private $productModel;

    public function __construct() {
        $this->productModel = new Product();
    }

    private function jsonResponse($success, $data = null, $message = "") {
        header('Content-Type: application/json');
        echo json_encode([
            "success" => $success,
            "data" => $data,
            "message" => $message
        ]);
        exit();
    }

    public function index() {
    if (isset($_GET['id'])) {
        // ... giữ nguyên logic findById cũ ...
    } else {
        // Gọi hàm lọc và phân trang mới
        $filters = [
            'page' => $_GET['page'] ?? 1,
            'limit' => $_GET['limit'] ?? 12,
            'min_price' => $_GET['min_price'] ?? null,
            'max_price' => $_GET['max_price'] ?? null,
            'category_id' => $_GET['category_id'] ?? null,
            'keyword' => $_GET['keyword'] ?? null
        ];
        $result = $this->productModel->getAdvanced($filters);
        $this->jsonResponse(true, $result);
    }
}

    public function store() {
        // ... (Phần nhận $_POST giữ nguyên) ...

        $product_id = $this->productModel->create(...);

        if ($product_id && isset($_FILES['images'])) {
            $upload_dir = __DIR__ . '/../uploads/';
            $files = $_FILES['images'];
            $allowed_ext = ['jpg', 'jpeg', 'png', 'webp'];

            for ($i = 0; $i < count($files['name']); $i++) {
                $ext = strtolower(pathinfo($files['name'][$i], PATHINFO_EXTENSION));
                
                // 1. Kiểm tra định dạng
                if (!in_array($ext, $allowed_ext)) continue;

                // 2. Tạo tên file ngẫu nhiên
                $new_name = 'prod_' . bin2hex(random_bytes(8)) . '.jpg'; // Ép về jpg để tối ưu
                $destination = $upload_dir . $new_name;

                // 3. Xử lý Image (Resize & Nén) bằng GD Library
                $tmp_path = $files['tmp_name'][$i];
                $this->processImage($tmp_path, $destination, 1200, 75);

                // 4. Lưu vào Database
                $is_primary = ($i === 0) ? 1 : 0;
                $image_url = '/backend/uploads/' . $new_name;
                $this->productModel->addImage($product_id, $image_url, $is_primary);
            }
            $this->jsonResponse(true, ["product_id" => $product_id], "Product created successfully");
        }
    }

// Hàm hỗ trợ xử lý ảnh
    private function processImage($source, $destination, $maxWidth, $quality) {
        list($width, $height, $type) = getimagesize($source);
        
        // Tính toán tỷ lệ Resize
        $newWidth = $width;
        $newHeight = $height;
        if ($width > $maxWidth) {
            $newWidth = $maxWidth;
            $newHeight = ($height / $width) * $newWidth;
        }

        // Tạo resource ảnh từ file nguồn
        switch ($type) {
            case IMAGETYPE_JPEG: $srcImg = imagecreatefromjpeg($source); break;
            case IMAGETYPE_PNG:  $srcImg = imagecreatefrompng($source); break;
            case IMAGETYPE_WEBP: $srcImg = imagecreatefromwebp($source); break;
            default: return false;
        }

        $dstImg = imagecreatetruecolor($newWidth, $newHeight);
        
        // Giữ độ trong suốt nếu là PNG/WEBP
        imagealphablending($dstImg, false);
        imagesavealpha($dstImg, true);

        imagecopyresampled($dstImg, $srcImg, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        // Lưu ảnh với chất lượng nén 70-80%
        imagejpeg($dstImg, $destination, $quality); 
        
        imagedestroy($srcImg);
        imagedestroy($dstImg);
    }
}
