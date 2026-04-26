# Task: BE2 - Nguyễn Duy Ngọc
**Branch:** `BE2-Product-API`

## 🎯 Mục tiêu chính
Tối ưu hóa quản lý sản phẩm và xử lý dữ liệu hình ảnh hiệu quả.

## 📋 Hướng dẫn chi tiết

### 1. Xử lý Hình ảnh (Image Upload)
- **Kỹ thuật:** Khi nhận ảnh từ Frontend, không lưu trực tiếp ảnh gốc.
- **Quy trình:**
    - Kiểm tra định dạng (chỉ cho phép jpg, png, webp).
    - Dùng thư viện (như `Intervention Image` nếu có dùng Composer hoặc `GD library` có sẵn) để:
        - Resize về chiều ngang tối đa 1200px.
        - Nén chất lượng xuống 70-80% để giảm dung lượng (mục tiêu mỗi ảnh < 300KB).
    - Đổi tên file thành dạng ngẫu nhiên (VD: `prod_65a123.jpg`) để tránh trùng lặp.

### 2. Phân trang & Lọc nâng cao (Advanced Filtering)
- **Pagination:**
    - Nhận tham số `page` (mặc định 1) và `limit` (mặc định 12).
    - Query dùng `LIMIT` và `OFFSET`.
    - Trả về JSON có dạng: `{ data: [...], total_items: 100, current_page: 1, total_pages: 9 }`.
- **Filter:**
    - Hỗ trợ lọc theo `min_price` và `max_price`.
    - Lọc theo `category_id`.
    - Tìm kiếm `keyword` trong cột `name` của bảng `products` (dùng `LIKE %keyword%`).

### 3. Tối ưu Query
- Phải dùng `LEFT JOIN` với bảng `categories` và `brands` để lấy tên danh mục/hãng trong cùng 1 câu lệnh SQL. Tránh tình trạng Select trong vòng lặp (N+1 query).

---
*Ghi chú: Đảm bảo thư mục backend/uploads có quyền ghi (permission 775).*
