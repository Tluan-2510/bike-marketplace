# Task: BE1 - Vạn Tường Ceasar
**Branch:** `BE1-Auth-Fav`

## 🎯 Mục tiêu chính
Xây dựng nền tảng bảo mật vững chắc cho toàn bộ hệ thống.

## 📋 Hướng dẫn chi tiết

### 1. Authentication & Security (PHP)
- **Mật khẩu:** Sử dụng `password_hash($pass, PASSWORD_BCRYPT)` để mã hóa và `password_verify()` để kiểm tra. Tuyệt đối không lưu mật khẩu dạng text thô.
- **JWT (JSON Web Token):**
    - Trả về Token khi đăng nhập thành công.
    - Token chứa `user_id` và `role`.
    - Tạo một Middleware `AuthMiddleware.php` để kiểm tra Token trong Header `Authorization: Bearer <token>` của mọi Request cần bảo mật.

### 2. Quản lý Yêu thích (Favorites)
- **Database:** Bảng `favorites` cần có `user_id` và `product_id` (Unique pair).
- **API `POST /api/favorites`:** Logic:
  ```php
  if (sản phẩm đã có trong list) {
      xóa khỏi list;
      trả về {status: "removed"};
  } else {
      thêm vào list;
      trả về {status: "added"};
  }
  ```
- **API `GET /api/favorites`:** Phải dùng lệnh `JOIN` với bảng `products` để trả về đầy đủ thông tin xe (Ảnh, Tên, Giá) cho Frontend.

### 3. Sanitize & Validation
- **Input:** Dùng `filter_var()` hoặc các hàm của Framework để lọc dữ liệu đầu vào.
- **SQL:** Sử dụng **Prepared Statements** (PDO) 100% để chống SQL Injection.

---
*Ghi chú: Luôn bảo mật file .env và các khóa bí mật của JWT.*
