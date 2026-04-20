# 📝 TASK ASSIGNMENT

---

## 🛑 QUY TẮC CHUNG (BẮT BUỘC)

### 🐙 Git Workflow
Mỗi người PHẢI làm trên 1 branch riêng:
| Role | Branch |
| --- | --- |
| FE1 | FE1-Home |
| FE2 | FE2-Form-detail |
| BE1 | BE1-Auth |
| BE2 | BE2-Product |
| BE3 | BE3-BuyRequest |
| BE4 | BE4-Database |

### 🔄 Quy trình làm việc
1. Pull code mới nhất
2. Checkout branch của mình
3. Code
4. Commit
5. Push
6. Tạo Pull Request

---

## 🎨 FE1 - TRANG CHỦ (Homepage + Product List)
**Mục tiêu:** Hiển thị danh sách sản phẩm xe đạp từ API.

**Task phải làm:**
1. Khởi tạo giao diện hiện đại (Modern UI) cho danh sách xe.
2. Gọi API `GET /api/products`
3. Gọi API `GET /api/categories` và `GET /api/brands` để làm bộ lọc.
4. Render dữ liệu chi tiết xe (Tên, Giá, Ảnh chính, Tình trạng, Size bánh, Chất liệu).
5. Search & Filter: Lọc theo Category, Brand, khoảng giá.

**Yêu cầu:** Không hardcode data, UI responsive, thiết kế Premium.

---

## 🎨 FE2 - FORM & DETAIL
**Mục tiêu:** Xây dựng form đăng xe + chi tiết sản phẩm + yêu thích.

**Task phải làm:**
1. Login/Register Page (Gọi `POST /api/auth/...`)
2. Create Product Page (Gọi `POST /api/products` với FormData để upload file).
   - Form cần có: Tên, Giá, Danh mục, Thương hiệu, Khung, Kích cỡ bánh, Bộ đề, Phanh, Upload ảnh.
3. Product Detail (Gọi `GET /api/products?id=...`). Hiển thị toàn bộ ảnh và thông số kỹ thuật.
4. Favorite (Nút thả tim, gọi `POST /api/favorites`).
5. Nút "Liên hệ mua" (Gọi `POST /api/buy-requests`).

---

## ⚙️ BE1 - AUTH & FAVORITE
**Mục tiêu:** Xử lý đăng ký, đăng nhập và yêu thích.

**Task phải làm:**
1. Cập nhật `AuthController` (mã hóa mật khẩu, lưu số điện thoại).
2. Xử lý `FavoriteController` (Thêm/xóa yêu thích).

---

## ⚙️ BE2 - PRODUCT & CATEGORY
**Mục tiêu:** CRUD xe đạp với các thông số chuyên sâu + Upload ảnh.

**Task phải làm:**
1. `ProductController.php`: Xử lý `$_FILES` để lưu ảnh vào `backend/uploads/`.
2. Truy vấn JOIN để lấy thông tin Danh mục & Thương hiệu.
3. Hỗ trợ tìm kiếm theo `category_id`, `brand_id`.

---

## ⚙️ BE3 - BUY REQUESTS (Thay thế Order)
**Mục tiêu:** Tạo yêu cầu mua/thương lượng (không phải mua đứt).

**Task phải làm:**
1. `BuyRequestController.php`: Lưu `buyer_id`, `product_id`, `message`.
2. Trả về danh sách yêu cầu mua của một user (`GET /api/buy-requests?user_id=...`).

---

## 🗄️ BE4 - DATABASE
**Mục tiêu:** Setup nền tảng hệ thống cơ sở dữ liệu chuyên biệt.

**Task phải làm:**
1. Bảng `users`, `categories`, `brands`, `products`, `product_images`, `buy_requests`, `favorites`.
2. Viết file `database/schema.sql` và `DATABASE.md`.
