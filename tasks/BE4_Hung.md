

Task: BE4 - Phạm Văn Hưng
Branch:BE4-Database
￿ Mục tiêu chính
Tối ưu hóa cơ sở dữ liệu và xây dựng hệ thống quản trị tin đăng (Admin).
￿ Hướng dẫn chi tiết
- Database Optimization (Indexing)
•Yêu cầu:Đảm bảo các câu lệnh truy vấn lọc xe luôn < 50ms.
•Index cần thêm:
–idx_product_category: Trên cộtcategory_id.
–idx_product_price: Trên cộtprice.
–idx_product_status: Trên cộtstatusvàis_approved.
•Relationship:Kiểm tra lại các ràng buộcFOREIGN KEYđể khi xóa 1
danh mục, hệ thống phải xử lý đúng với các sản phẩm thuộc danh mục
đó (dùngSET NULLhoặcRESTRICT).
- Dữ liệu mẫu (Seed Data)
•Yêu cầu:Tạo filebackend/database/seed.phphoặcseed.sql.
•Số lượng:Ít nhất 50 xe đạp thuộc nhiều category khác nhau. Ảnh có
thể dùng URL placeholder hoặc copy sẵn vài ảnh vào thư mục uploads.
•Mục tiêu:Giúp team FE test được tính năng phân trang và lọc giá.
- Module Admin (Duyệt tin)
•APIGET /api/admin/pending-products:Lấy danh sách các tin đăng
mới chưa được duyệt (is_approved = 0).
•APIPOST /api/admin/approve:Nhậnproduct_id,  cập nhật
is_approved = 1để tin hiện lên trang chủ.
•Thống kê:Viết 1 API trả về: Tổng số User, Tổng số Xe đã bán, Tổng
số Xe đang treo bán.

## 1