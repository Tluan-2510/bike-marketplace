

Task: BE1 - Vạn Tường Ceasar
Branch:BE1-Auth-Fav
￿ Mục tiêu chính
Xây dựng nền tảng bảo mật vững chắc cho toàn bộ hệ thống.
￿ Hướng dẫn chi tiết
- Authentication & Security (PHP)
•Mật khẩu:Sử dụngpassword_hash($pass, PASSWORD_BCRYPT)để mã
hóa vàpassword_verify()để kiểm tra. Tuyệt đối không lưu mật khẩu
dạng text thô.
•JWT (JSON Web Token):
–Trả về Token khi đăng nhập thành công.
–Token chứauser_idvàrole.
–Tạo một MiddlewareAuthMiddleware.phpđể kiểm tra Token trong
HeaderAuthorization: Bearer <token>của mọi Request cần bảo
mật.
- Quản lý Yêu thích (Favorites)
•Database:Bảngfavoritescần cóuser_idvàproduct_id(Unique
pair).
•APIPOST /api/favorites:Logic:
if(sản phẩm đã có tronglist) {
xóa khỏilist;
trả về {status:"removed"};
## }else{
thêm vào
list;
trả về {status:"added"};
## }
•APIGET /api/favorites:Phải dùng lệnhJOINvới bảngproductsđể
trả về đầy đủ thông tin xe (Ảnh, Tên, Giá) cho Frontend.
## 3. Sanitize & Validation
•Input:Dùngfilter_var()hoặc các hàm của Framework để lọc dữ liệu
đầu vào.
•SQL:Sử dụngPrepared Statements(PDO) 100% để chống SQL In-
jection.
Ghi chú: Luôn bảo mật file .env và các khóa bí mật của JWT.
## 1