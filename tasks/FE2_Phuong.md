# Task: FE2 - Nguyễn Hoàng Phương
**Branch:** `FE2-Form-Detail`

## 🎯 Mục tiêu chính
Nâng cấp tính chuyên nghiệp của các form và tối ưu hóa trải nghiệm xem chi tiết sản phẩm.

## 📋 Hướng dẫn chi tiết

### 1. Nâng cấp Form Đăng Tin & Validation
- **Validation Rules:**
    - Tiêu đề: Tối thiểu 10 ký tự, tối đa 100.
    - Giá: Phải là số dương, tối thiểu 100,000đ.
    - Hình ảnh: Bắt buộc ít nhất 1 ảnh, tối đa 5 ảnh. Mỗi ảnh không quá 5MB.
- **Xử lý Error:** Không dùng `alert`. Hãy thêm một thẻ `<span class="text-danger small">` dưới mỗi ô input để hiển thị lỗi ngay khi người dùng bỏ trống hoặc nhập sai.
- **Preview:** Đảm bảo khi người dùng chọn ảnh, ảnh đó phải hiện ngay lên màn hình (Thumbnail preview) để họ kiểm tra trước khi bấm Đăng.

### 2. Tích hợp Toast Notifications
- **Thư viện:** Khuyến khích dùng `Toastify.js` hoặc tự viết một module `toast.js` đơn giản.
- **Trường hợp áp dụng:**
    - Thành công: "Đăng tin thành công!", "Đã lưu vào yêu thích".
    - Thất bại: "Vui lòng nhập đúng giá tiền", "Phiên đăng nhập hết hạn".
- **Style:** Màu xanh cho thành công, màu đỏ cho lỗi, thời gian hiển thị 3 giây.

### 3. Tối ưu Trang Chi tiết Sản phẩm
- **Gallery:** Khi click vào ảnh nhỏ ở dưới, ảnh lớn ở trên phải thay đổi mượt mà (dùng hiệu ứng Fade-in).
- **Thông số:** Hiển thị các thông số (Khung, Group, Phanh...) dưới dạng bảng hoặc Grid 2 cột có icon minh họa.
- **Tương tác:** 
    - Nút "Chat qua Zalo": Phải tự động lấy SĐT người bán từ API và mở link `https://zalo.me/sdt`.
    - Nút "Yêu thích": Phải đổi màu icon (Tim đỏ/trắng) ngay lập tức sau khi bấm mà không cần load lại trang.

---
*Ghi chú: Luôn ưu tiên trải nghiệm mượt mà trên di động.*
