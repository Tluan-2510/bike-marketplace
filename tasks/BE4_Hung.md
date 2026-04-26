# Task: BE4 - Phạm Văn Hưng
**Branch:** `BE4-Database`

## 🎯 Mục tiêu chính
Tối ưu hóa cơ sở dữ liệu và xây dựng hệ thống quản trị tin đăng (Admin).

## 📋 Hướng dẫn chi tiết

### 1. Database Optimization (Indexing)
- **Yêu cầu:** Đảm bảo các câu lệnh truy vấn lọc xe luôn < 50ms.
- **Index cần thêm:**
    - `idx_product_category`: Trên cột `category_id`.
    - `idx_product_price`: Trên cột `price`.
    - `idx_product_status`: Trên cột `status` và `is_approved`.
- **Relationship:** Kiểm tra lại các ràng buộc `FOREIGN KEY` để khi xóa 1 danh mục, hệ thống phải xử lý đúng với các sản phẩm thuộc danh mục đó (dùng `SET NULL` hoặc `RESTRICT`).

### 2. Dữ liệu mẫu (Seed Data)
- **Yêu cầu:** Tạo file `backend/database/seed.php` hoặc `seed.sql`.
- **Số lượng:** Ít nhất 50 xe đạp thuộc nhiều category khác nhau. Ảnh có thể dùng URL placeholder hoặc copy sẵn vài ảnh vào thư mục uploads.
- **Mục tiêu:** Giúp team FE test được tính năng phân trang và lọc giá.

### 3. Module Admin (Duyệt tin)
- **API `GET /api/admin/pending-products`:** Lấy danh sách các tin đăng mới chưa được duyệt (`is_approved = 0`).
- **API `POST /api/admin/approve`:** Nhận `product_id`, cập nhật `is_approved = 1` để tin hiện lên trang chủ.
- **Thống kê:** Viết 1 API trả về: Tổng số User, Tổng số Xe đã bán, Tổng số Xe đang treo bán.

---
*Ghi chú: Luôn cập nhật sơ đồ database vào file DATABASE.md.*
