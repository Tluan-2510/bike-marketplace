-- Script to seed test products
-- Run this in your MySQL database to populate the UI for testing.

INSERT INTO users (id, full_name, username, email, password_hash, role) 
VALUES (999, 'Admin Tester', 'admin_test', 'tester@bikemarket.vn', '123456', 'admin');

-- Insert Products
INSERT INTO products (id, seller_id, title, description, price, category_id, brand_id, frame_material, wheel_size, groupset, brake_type, condition_state, status)
VALUES 
(101, 999, 'Trek Emonda ALR 5', 'Dòng xe road khung nhôm siêu nhẹ, màu tím cực đẹp. Bộ truyền động Shimano 105 mượt mà, xe mới đi được 200km.', 35000000, 2, 1, 'Aluminum', '700c', 'Shimano 105', 'Phanh đĩa', 'Như mới', 'available'),
(102, 999, 'Giant Anthem Advanced Pro', 'Siêu phẩm MTB full suspension khung carbon. Phù hợp cho các giải đua XC chuyên nghiệp.', 85000000, 1, 2, 'Carbon', '29 inch', 'SRAM GX Eagle', 'Phanh đĩa', 'Mới', 'available'),
(103, 999, 'Specialized Sirrus 2.0', 'Xe hybrid đa năng cho cả đi làm và tập luyện cuối tuần. Thiết kế thanh lịch, cảm giác lái thoải mái.', 12500000, 3, 3, 'Aluminum', '700c', 'Shimano Acera', 'Phanh vành', 'Sử dụng tốt', 'available');

-- Insert Images
INSERT INTO product_images (product_id, image_url, is_primary)
VALUES 
(101, 'test-trek.png', 1),
(102, 'test-giant.png', 1),
(103, 'test-specialized.png', 1);
