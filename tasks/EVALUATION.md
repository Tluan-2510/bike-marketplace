# Đánh Giá Tiến Độ Dự Án - Bike Marketplace

**Ngày đánh giá:** 01/05/2026
**Tổng quan Tiến độ:** Đạt khoảng ~75%

Hiện tại phần khung giao diện Frontend (FE1) đã được tái cấu trúc thành công sang PHP. Các vấn đề cốt lõi về bảo mật và xử lý dữ liệu (BE1, BE2) đã hoàn thiện. Nút thắt lớn nhất còn lại là cơ sở dữ liệu và API quản lý duyệt tin (BE4).

---

## 📊 Bảng Đánh Giá Chi Tiết

| Thành viên | Task / Branch | Trạng thái | Hạng mục đã hoàn thành | Hạng mục còn thiếu |
| :--- | :--- | :---: | :--- | :--- |
| **Vạn Tường Ceasar** <br>*(BE1)* | Auth & Favorites | 🟢 **100%** | - `AuthController.php` (mã hóa BCRYPT)<br>- Module JWT (`JwtHelper`, `AuthMiddleware`)<br>- Favorite API & Database UNIQUE constrain | *(Không có)* |
| **Nguyễn Duy Ngọc** <br>*(BE2)* | Product API & Image | 🟢 **100%** | - Upload & nén ảnh (thư viện GD, < 1200px)<br>- API danh sách xe (Pagination, Advanced Filters) | *(Không có)* |
| **Phạm Văn Hưng** <br>*(BE4)* | Database & Admin | 🟢 **90%** | - Cấu trúc `schema.sql`<br>- Đã đánh các Index quan trọng (price, category)<br>- **Đã thêm cột `is_approved`**<br>- **Đã có `AdminController.php`** và API duyệt tin | - Seed data cần phong phú hơn |
| **Huỳnh Văn Khánh** <br>*(FE1)* | Includes & Profile | 🟡 **85%** | - Tách layout (`head`, `navbar`, `footer`, `scripts`)<br>- Đã chuyển đổi 100% file `.html` sang `.php`<br>- **Đã gắn API lấy list xe và Xóa tin** tại Profile | - Chưa có form sửa thông tin User<br>- Chưa làm Skeleton Loading |
| **Nguyễn Hoàng Phương** <br>*(FE2)* | Form, Validate, UI | 🟢 **90%** | - Xóa bỏ alert, tích hợp thẻ `<small>` báo lỗi realtime<br>- Tự xây dựng module thông báo `toast.js` | - Đồng bộ bắt lỗi upload file quá lớn với Backend |

---

## 🚀 Các Việc Cần Ưu Tiên Tiếp Theo (Action Items)

| **Ưu tiên** | **Phụ trách** | **Hành động cụ thể** | **Trạng thái** |
| :---: | :--- | :--- | :---: |
| **#1** | **BE4 (Hưng)** | **1.** Chạy `ALTER TABLE` thêm cột `is_approved`.<br>**2.** Viết `AdminController.php` (`GET /pending`, `POST /approve`). | 🟢 **Xong** |
| **#2** | **FE1 (Khánh)** | **1.** Gắn API vào `user.php` để lấy danh sách xe của tài khoản đang đăng nhập.<br>**2.** Tích hợp chức năng Xóa bài đăng từ giao diện. | 🟢 **Xong** |
| **#3** | **BE2 (Ngọc)** | Cập nhật hàm `getAdvanced` trong model để **chỉ hiển thị xe có `is_approved = 1`**. | 🟢 **Xong** |
