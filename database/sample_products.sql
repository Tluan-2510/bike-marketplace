-- Sample products only for Bike Marketplace
-- Import after schema.sql and after users/categories/brands already exist.

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

SET @seller_id := (SELECT id FROM users ORDER BY id LIMIT 1);

INSERT INTO products
(seller_id, category_id, brand_id, title, description, price, condition_state, frame_material, wheel_size, groupset, brake_type, location, delivery_type, status)
SELECT @seller_id, 2, 3, 'Specialized Tarmac SL7 Pro 2023', 'Xe road hiệu năng cao, khung carbon nhẹ, bộ truyền động Shimano Ultegra Di2, phù hợp tập luyện tốc độ và đua phong trào.', 145000000, 'Sử dụng tốt', 'Carbon', '700c', 'Shimano Ultegra Di2', 'Disc', 'TP. Hồ Chí Minh', 'Gặp trực tiếp', 'available'
WHERE @seller_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM categories WHERE id = 2)
  AND EXISTS (SELECT 1 FROM brands WHERE id = 3)
  AND NOT EXISTS (SELECT 1 FROM products WHERE title = 'Specialized Tarmac SL7 Pro 2023');

INSERT INTO products
(seller_id, category_id, brand_id, title, description, price, condition_state, frame_material, wheel_size, groupset, brake_type, location, delivery_type, status)
SELECT @seller_id, 1, 1, 'Giant XTC Advanced 29', 'Xe địa hình hardtail khung carbon, bánh 29 inch, phù hợp đường rừng nhẹ và luyện XC.', 52000000, 'Như mới', 'Carbon', '29 inch', 'Shimano Deore XT', 'Disc', 'Hà Nội', 'Gặp trực tiếp hoặc giao hàng', 'available'
WHERE @seller_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM categories WHERE id = 1)
  AND EXISTS (SELECT 1 FROM brands WHERE id = 1)
  AND NOT EXISTS (SELECT 1 FROM products WHERE title = 'Giant XTC Advanced 29');

INSERT INTO products
(seller_id, category_id, brand_id, title, description, price, condition_state, frame_material, wheel_size, groupset, brake_type, location, delivery_type, status)
SELECT @seller_id, 2, 2, 'Trek Emonda ALR 5', 'Xe đạp đua khung nhôm cao cấp, phuộc carbon, cấu hình Shimano 105 cân bằng cho người mới nâng cấp.', 38500000, 'Sử dụng tốt', 'Aluminum', '700c', 'Shimano 105', 'Disc', 'Đà Nẵng', 'Giao hàng toàn quốc', 'available'
WHERE @seller_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM categories WHERE id = 2)
  AND EXISTS (SELECT 1 FROM brands WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM products WHERE title = 'Trek Emonda ALR 5');

INSERT INTO products
(seller_id, category_id, brand_id, title, description, price, condition_state, frame_material, wheel_size, groupset, brake_type, location, delivery_type, status)
SELECT @seller_id, 3, 7, 'Maruishi Touring Master', 'Xe touring bền bỉ, tư thế ngồi thoải mái, có sẵn baga sau, phù hợp đi phượt và di chuyển hằng ngày.', 18000000, 'Có hao mòn', 'Steel', '700c', 'Shimano Claris', 'Rim', 'Cần Thơ', 'Gặp trực tiếp', 'available'
WHERE @seller_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM categories WHERE id = 3)
  AND EXISTS (SELECT 1 FROM brands WHERE id = 7)
  AND NOT EXISTS (SELECT 1 FROM products WHERE title = 'Maruishi Touring Master');

INSERT INTO products
(seller_id, category_id, brand_id, title, description, price, condition_state, frame_material, wheel_size, groupset, brake_type, location, delivery_type, status)
SELECT @seller_id, 4, 8, 'Fixed Gear Chrome Track', 'Xe fixed gear phong cách tối giản, khung thép, vành cao, phù hợp đi phố và luyện kỹ thuật cơ bản.', 7900000, 'Sử dụng tốt', 'Steel', '700c', 'Single Speed', 'Rim', 'TP. Hồ Chí Minh', 'Gặp trực tiếp', 'available'
WHERE @seller_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM categories WHERE id = 4)
  AND EXISTS (SELECT 1 FROM brands WHERE id = 8)
  AND NOT EXISTS (SELECT 1 FROM products WHERE title = 'Fixed Gear Chrome Track');

INSERT INTO products
(seller_id, category_id, brand_id, title, description, price, condition_state, frame_material, wheel_size, groupset, brake_type, location, delivery_type, status)
SELECT @seller_id, 5, 6, 'Galaxy BMX Street 20', 'BMX bánh 20 inch, khung thép chắc chắn, phù hợp tập trick cơ bản và chạy phố.', 5600000, 'Sử dụng tốt', 'Steel', '20 inch', 'Single Speed', 'Rim', 'Biên Hòa', 'Giao hàng toàn quốc', 'available'
WHERE @seller_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM categories WHERE id = 5)
  AND EXISTS (SELECT 1 FROM brands WHERE id = 6)
  AND NOT EXISTS (SELECT 1 FROM products WHERE title = 'Galaxy BMX Street 20');

INSERT INTO products
(seller_id, category_id, brand_id, title, description, price, condition_state, frame_material, wheel_size, groupset, brake_type, location, delivery_type, status)
SELECT @seller_id, 1, 4, 'Trinx M136 Pro', 'Xe MTB phổ thông, phuộc trước giảm chấn, cấu hình dễ bảo trì, phù hợp học sinh sinh viên và đi làm.', 4200000, 'Có hao mòn', 'Aluminum', '26 inch', 'Shimano Tourney', 'Disc', 'Bình Dương', 'Gặp trực tiếp', 'available'
WHERE @seller_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM categories WHERE id = 1)
  AND EXISTS (SELECT 1 FROM brands WHERE id = 4)
  AND NOT EXISTS (SELECT 1 FROM products WHERE title = 'Trinx M136 Pro');

INSERT INTO products
(seller_id, category_id, brand_id, title, description, price, condition_state, frame_material, wheel_size, groupset, brake_type, location, delivery_type, status)
SELECT @seller_id, 6, 5, 'Asama City Bike Comfort', 'Xe đạp thành phố dáng thoải mái, giỏ trước tiện dụng, phù hợp đi chợ, đi học và di chuyển ngắn.', 3500000, 'Như mới', 'Aluminum', '26 inch', 'Shimano 6 speed', 'Rim', 'Huế', 'Gặp trực tiếp', 'available'
WHERE @seller_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM categories WHERE id = 6)
  AND EXISTS (SELECT 1 FROM brands WHERE id = 5)
  AND NOT EXISTS (SELECT 1 FROM products WHERE title = 'Asama City Bike Comfort');

INSERT INTO product_images (product_id, image_url, is_primary)
SELECT id, '/bike-marketplace/frontend/assets/images/demo-bike.png', 1
FROM products
WHERE title = 'Specialized Tarmac SL7 Pro 2023'
  AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = products.id AND is_primary = 1);

INSERT INTO product_images (product_id, image_url, is_primary)
SELECT id, CONCAT('/bike-marketplace/frontend/assets/images/f', ((id - 1) % 6) + 1, '.png'), 1
FROM products
WHERE title <> 'Specialized Tarmac SL7 Pro 2023'
  AND title IN (
    'Giant XTC Advanced 29',
    'Trek Emonda ALR 5',
    'Maruishi Touring Master',
    'Fixed Gear Chrome Track',
    'Galaxy BMX Street 20',
    'Trinx M136 Pro',
    'Asama City Bike Comfort'
  )
  AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = products.id AND is_primary = 1);
