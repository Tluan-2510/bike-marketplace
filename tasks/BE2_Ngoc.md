

Task: BE2 - Nguyễn Duy Ngọc
Branch:BE2-Product-API
￿ Mục tiêu chính
Tối ưu hóa quản lý sản phẩm và xử lý dữ liệu hình ảnh hiệu quả.
￿ Hướng dẫn chi tiết
- Xử lý Hình ảnh (Image Upload)
•Kỹ thuật:Khi nhận ảnh từ Frontend, không lưu trực tiếp ảnh gốc.
•Quy trình:
–Kiểm tra định dạng (chỉ cho phép jpg, png, webp).
–Dùng thư viện (nhưIntervention Imagenếu có dùng Composer
hoặcGD librarycó sẵn) để:
∗Resize về chiều ngang tối đa 1200px.
∗Nén chất lượng xuống 70-80% để giảm dung lượng (mục tiêu mỗi
ảnh < 300KB).
–Đổi tên file thành dạng ngẫu nhiên (VD:prod_65a123.jpg) để tránh
trùng lặp.
- Phân trang & Lọc nâng cao (Advanced Filtering)
•Pagination:
–Nhận tham sốpage(mặc định 1) vàlimit(mặc định 12).
–Query dùngLIMITvàOFFSET.
–Trả  về  JSON  có  dạng:{ data: [...], total_items: 100,
current_page: 1, total_pages: 9 }.
•Filter:
–Hỗ trợ lọc theomin_pricevàmax_price.
–Lọc theocategory_id.
–Tìm kiếmkeywordtrong cộtnamecủa bảngproducts(dùngLIKE
## %keyword%).
- Tối ưu Query
•Phải dùngLEFT JOINvới bảngcategoriesvàbrandsđể lấy tên danh
mục/hãng trong cùng 1 câu lệnh SQL. Tránh tình trạng Select trong vòng
lặp (N+1 query).
Ghi chú: Đảm bảo thư mục backend/uploads có quyền ghi (permission 775).
## 1