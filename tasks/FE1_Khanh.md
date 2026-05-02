

Task: FE1 - Huỳnh Văn Khánh
Branch:FE1-Home-Profile
￿ Mục tiêu chính
Chuyển đổi toàn bộ giao diện sang PHP và tối ưu hóa trải nghiệm tải trang tại
Trang chủ và Profile.
￿ Hướng dẫn chi tiết
- Chuyển đổi PHP Includes (Ưu tiên số 1)
•Bước 1:Đổi tên tất cả các file từ.htmlsang.php(ví dụ:index.html
## ->index.php).
•Bước 2:Tạo thư mụcfrontend/includes/.
•Bước 3:Tách mã nguồn thành các module:
–head.php:  Chứa từ<!DOCTYPE html>đến hết thẻ</head>.  Đảm
bảo các link CSS dùng đường dẫn tuyệt đối hoặc tương đối chuẩn.
–navbar.php:  Chứa  toàn  bộ  thẻ<header>.   Cập  nhật  các  link
href="index.html"thànhhref="index.php".
–footer.php: Chứa toàn bộ thẻ<footer>.
–scripts.php: Chứa các thẻ<script>ở cuối file.
•Bước 4:Tại các trang chính, dùng cú pháp:
## <?phpinclude'includes/head.php';?>
## <?phpinclude'includes/navbar.php';?>
<!--Nội dung trang-->
## <?phpinclude'includes/footer.php';?>
## <?phpinclude'includes/scripts.php';?>
- Triển khai Skeleton Loading
•Yêu cầu:Khi mảngproductsđang được fetch, hiển thị 6-8 card trống
có hiệu ứng nhấp nháy.
•Cách làm:
–Tạo một functionrenderSkeletons(containerId, count).
–Dùng CSS@keyframes shimmerđể tạo hiệu ứng chuyển động màu
xám.
–Khi API trả về dữ liệu, xóa toàn bộ skeleton rồi mới render card
thật.
- Hoàn thiện Trang Cá Nhân (User Profile)
•Danh sách xe:Gọi APIGET /api/products?seller_id=current_user_id.
## 1

•Chỉnh sửa thông tin:Xây dựng form cho phép đổi Avatar (dùnginput
type="file") và cập nhật Tên/SĐT thông quaPOST /api/user/update.
•Quản lý tin:Mỗi card xe của chính mình phải có thêm 2 nút:
–Sửa:Chuyển hướng sangcreate_product.php?edit_id=...
–Xóa:Hiển thị Popup xác nhận trước khi gọiDELETE /api/products/:id.
Ghi chú:  Đảm bảo kiểm tra link điều hướng trên toàn bộ các trang sau khi đổi
đuôi file.
## 2