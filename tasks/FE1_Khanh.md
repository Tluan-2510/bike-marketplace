# Task: FE1 - Huỳnh Văn Khánh
**Branch:** `FE1-Home-Profile`

## 🎯 Mục tiêu chính
Chuyển đổi toàn bộ giao diện sang PHP và tối ưu hóa trải nghiệm tải trang tại Trang chủ và Profile.

## 📋 Hướng dẫn chi tiết

### 1. Chuyển đổi PHP Includes (Ưu tiên số 1)
- **Bước 1:** Đổi tên tất cả các file từ `.html` sang `.php` (ví dụ: `index.html` -> `index.php`).
- **Bước 2:** Tạo thư mục `frontend/includes/`.
- **Bước 3:** Tách mã nguồn thành các module:
    - `head.php`: Chứa từ `<!DOCTYPE html>` đến hết thẻ `</head>`. Đảm bảo các link CSS dùng đường dẫn tuyệt đối hoặc tương đối chuẩn.
    - `navbar.php`: Chứa toàn bộ thẻ `<header>`. Cập nhật các link `href="index.html"` thành `href="index.php"`.
    - `footer.php`: Chứa toàn bộ thẻ `<footer>`.
    - `scripts.php`: Chứa các thẻ `<script>` ở cuối file.
- **Bước 4:** Tại các trang chính, dùng cú pháp:
  ```php
  <?php include 'includes/head.php'; ?>
  <?php include 'includes/navbar.php'; ?>
  <!-- Nội dung trang -->
  <?php include 'includes/footer.php'; ?>
  <?php include 'includes/scripts.php'; ?>
  ```

### 2. Triển khai Skeleton Loading
- **Yêu cầu:** Khi mảng `products` đang được fetch, hiển thị 6-8 card trống có hiệu ứng nhấp nháy.
- **Cách làm:**
    - Tạo một function `renderSkeletons(containerId, count)`.
    - Dùng CSS `@keyframes shimmer` để tạo hiệu ứng chuyển động màu xám.
    - Khi API trả về dữ liệu, xóa toàn bộ skeleton rồi mới render card thật.

### 3. Hoàn thiện Trang Cá Nhân (User Profile)
- **Danh sách xe:** Gọi API `GET /api/products?seller_id=current_user_id`.
- **Chỉnh sửa thông tin:** Xây dựng form cho phép đổi Avatar (dùng `input type="file"`) và cập nhật Tên/SĐT thông qua `POST /api/user/update`.
- **Quản lý tin:** Mỗi card xe của chính mình phải có thêm 2 nút:
    - **Sửa:** Chuyển hướng sang `create_product.php?edit_id=...`
    - **Xóa:** Hiển thị Popup xác nhận trước khi gọi `DELETE /api/products/:id`.

---
*Ghi chú: Đảm bảo kiểm tra link điều hướng trên toàn bộ các trang sau khi đổi đuôi file.*
