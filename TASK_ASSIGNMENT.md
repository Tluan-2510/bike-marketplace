# 📝 TASK ASSIGNMENT (CẬP NHẬT MỚI NHẤT)

---

## 🛑 QUY TẮC CHUNG (BẮT BUỘC)

### 🐙 Git Workflow & Phân Công
Mỗi người PHẢI làm trên 1 branch riêng và điền tên vào bảng dưới đây:

| Role | Branch | Thành viên phụ trách |
| --- | --- | --- |
| FE1 | FE1-Home-Profile | `Huỳnh Văn Khánh` |
| FE2 | FE2-Form-Detail | `Nguyễn Hoàng Phương` |
| BE1 | BE1-Auth-Fav | `Vạn Tường Ceasar` |
| BE2 | BE2-Product-API | `Nguyễn Duy Ngọc` |
| BE3 | BE3-BuyRequest | `Nguyễn Thành Luân` |
| BE4 | BE4-Database | `Phạm Văn Hưng` |

### 🔄 Quy trình làm việc
1. Pull code mới nhất từ nhánh `main`.
2. Checkout branch của mình.
3. Code tính năng được giao.
4. Commit (Ghi rõ message nội dung đã làm).
5. Push & Tạo Pull Request.

---

## 🎨 FE1: `Huỳnh Văn Khánh` - TRANG CHỦ, CÁ NHÂN & CẤU TRÚC PHP
**Trạng thái:** Giao diện UI đã được chuẩn hóa (Logo SVG mới, Favicon, đồng bộ Header/Footer, Hover effects). 

**Nhiệm vụ cụ thể:**
1. **Chuyển đổi PHP Includes (Ưu tiên làm đầu tiên):** 
   - Đổi đuôi toàn bộ các file `.html` sang `.php`.
   - Cắt riêng `Header` và `Footer` thành `includes/header.php` và `includes/footer.php`.
   - Sử dụng `<?php include 'includes/header.php'; ?>` để gọi lại trên các trang (`index.php`, `products.php`, v.v.).
   - Sửa toàn bộ đường dẫn thẻ `<a>` từ `.html` sang `.php`.
2. Mở khóa và tích hợp API `GET /api/products` vào hàm `loadHomeProducts()` trong `index-products.js` để tải danh sách xe thực tế.
3. Đảm bảo tính năng Lọc (Filter theo Category, Brand) hoạt động chuẩn với Backend.
4. Hoàn thiện trang `user.php`: Gọi API lấy danh sách "Xe đang bán" dựa trên `seller_id` của user hiện tại.

---

## 🎨 FE2: `Nguyễn Hoàng Phương` - FORM & CHI TIẾT SẢN PHẨM
**Trạng thái:** Đã xong giao diện thẻ sản phẩm, logic mock login, sửa lỗi nút yêu thích (tim).

**Nhiệm vụ cụ thể:**
1. Gỡ bỏ Mock Login (trong `auth.js`), kết nối chuẩn với `POST /api/auth/login` và `POST /api/auth/register`. Lưu JWT Token vào `localStorage`.
2. Hoàn thiện form `create_product.php`: Gọi `POST /api/products` với `FormData` (xử lý upload ảnh nhiều file nếu có).
3. Trang `product-detail.php`: Đọc tham số `id` từ URL (`?id=...`) và gọi `GET /api/products?id=...` để render toàn bộ thông số kỹ thuật xe.
4. Bắt sự kiện nút "Liên hệ mua" để gọi `POST /api/buy-requests`.

---

## ⚙️ BE1: `Vạn Tường Ceasar` - AUTH & FAVORITE
**Mục tiêu:** Xử lý xác thực, người dùng và chức năng Yêu thích.

**Nhiệm vụ cụ thể:**
1. Cập nhật `AuthController`: Hỗ trợ lưu và mã hóa password, trả về JWT Token và thông tin User (`id`, `name`, `email`, `phone`).
2. Hoàn thiện API `toggleFavorite` (`POST /api/favorites`): Thêm hoặc Xóa sản phẩm khỏi danh sách yêu thích của người dùng.
3. Cung cấp API `GET /api/favorites` để Frontend hiển thị trong tab "Xe đã lưu".

---

## ⚙️ BE2: `Nguyễn Duy Ngọc` - PRODUCT & CATEGORY
**Mục tiêu:** Quản lý xe đạp, danh mục, upload hình ảnh.

**Nhiệm vụ cụ thể:**
1. `ProductController`: Xử lý lưu file ảnh vào `backend/uploads/` và lưu đường dẫn vào DB một cách an toàn.
2. Bổ sung tham số lọc `seller_id` cho API `GET /api/products` để FE1 có thể hiển thị danh sách "Xe đang bán".
3. Đảm bảo trường `description` trả về chuẩn text để FE có thể hiển thị cắt gọn 2 dòng (`line-clamp`).
4. Truy vấn JOIN để kết hợp `category_name` và `brand_name` trả về cùng object Product.

---

## ⚙️ BE3: `Nguyễn Thành Luân` - BUY REQUESTS (Thương lượng mua)
**Mục tiêu:** Hệ thống gửi yêu cầu mua/liên hệ thay vì giỏ hàng.

**Nhiệm vụ cụ thể:**
1. `BuyRequestController`: API `POST /api/buy-requests` lưu trữ `buyer_id`, `product_id`, và `message`.
2. Cung cấp API `GET /api/buy-requests?user_id=...` để người bán xem các yêu cầu mua xe của mình.
3. Cập nhật trạng thái yêu cầu (Chờ xử lý, Đã chốt, Đã hủy).

---

## 🗄️ BE4: `Phạm Văn Hưng` - DATABASE & DEPLOYMENT
**Mục tiêu:** Nền tảng DB và Môi trường.

**Nhiệm vụ cụ thể:**
1. Chuẩn hóa Schema các bảng: `users`, `categories`, `brands`, `products`, `buy_requests`, `favorites`.
2. Tạo dữ liệu mẫu (Seeders) cho Categories (Road, MTB, Touring...) và Brands (Trek, Giant, Specialized...).
3. Hỗ trợ cấu hình Docker (nếu có) và biến môi trường `CORS` để Frontend gọi API không bị lỗi (Cross-Origin Resource Sharing).
