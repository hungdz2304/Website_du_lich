-- ============================================
-- Sample Data for Tour Booking Website
-- Run this after creating the schema
-- ============================================

USE tour_booking_db;

-- ============================================
-- Insert Sample Destinations (like iVivu)
-- ============================================
INSERT INTO destinations (name, slug, description, country, region, image_url, is_featured, display_order) VALUES
('Phú Quốc', 'phu-quoc', 'Đảo ngọc Phú Quốc - thiên đường nghỉ dưỡng với bãi biển tuyệt đẹp và nhiều hoạt động vui chơi giải trí.', 'Vietnam', 'Miền Nam', 'https://example.com/images/phu-quoc.jpg', TRUE, 1),
('Đà Lạt', 'da-lat', 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm, nổi tiếng với phong cảnh lãng mạn và nhiều điểm tham quan độc đáo.', 'Vietnam', 'Miền Nam', 'https://example.com/images/da-lat.jpg', TRUE, 2),
('Nha Trang', 'nha-trang', 'Thành phố biển xinh đẹp với bãi tắm dài, nước biển trong xanh và đa dạng hoạt động thể thao dưới nước.', 'Vietnam', 'Miền Trung', 'https://example.com/images/nha-trang.jpg', TRUE, 3),
('Hạ Long', 'ha-long', 'Vịnh Hạ Long - Di sản thiên nhiên thế giới với hàng nghìn hòn đảo đá vôi kỳ vĩ.', 'Vietnam', 'Miền Bắc', 'https://example.com/images/ha-long.jpg', TRUE, 4),
('Sapa', 'sapa', 'Thị trấn miền núi với ruộng bậc thang tuyệt đẹp, khí hậu trong lành và văn hóa dân tộc thiểu số đặc sắc.', 'Vietnam', 'Miền Bắc', 'https://example.com/images/sapa.jpg', TRUE, 5),
('Hội An', 'hoi-an', 'Phố cổ Hội An - Di sản văn hóa thế giới với kiến trúc cổ kính, đèn lồng rực rỡ và ẩm thực phong phú.', 'Vietnam', 'Miền Trung', 'https://example.com/images/hoi-an.jpg', FALSE, 6),
('Đà Nẵng', 'da-nang', 'Thành phố đáng sống với cầu Rồng, bãi biển Mỹ Khê, và Bà Nà Hills nổi tiếng.', 'Vietnam', 'Miền Trung', 'https://example.com/images/da-nang.jpg', FALSE, 7),
('Quy Nhơn', 'quy-nhon', 'Thiên đường biển hoang sơ với nhiều bãi tắm đẹp và yên tĩnh.', 'Vietnam', 'Miền Trung', 'https://example.com/images/quy-nhon.jpg', FALSE, 8);

-- ============================================
-- Insert Sample Categories
-- ============================================
INSERT INTO categories (name, slug, description, display_order) VALUES
('Biển đảo', 'bien-dao', 'Tour du lịch biển, đảo, nghỉ dưỡng', 1),
('Miền núi', 'mien-nui', 'Tour leo núi, trekking, khám phá thiên nhiên', 2),
('Văn hóa', 'van-hoa', 'Tour tham quan di tích, tìm hiểu văn hóa', 3),
('Ẩm thực', 'am-thuc', 'Tour khám phá ẩm thực địa phương', 4),
('Phiêu lưu', 'phieu-luu', 'Tour mạo hiểm, thể thao, hoạt động ngoài trời', 5),
('Nghỉ dưỡng', 'nghi-duong', 'Tour resort, spa, thư giãn', 6);

-- ============================================
-- Insert Sample Tours (inspired by iVivu)
-- ============================================
INSERT INTO tours (
    destination_id, title, slug, description, itinerary,
    duration_days, duration_nights,
    price_adult, price_child, price_infant, original_price, discount_percentage,
    cover_image_url, departure_location, transportation, hotel_rating,
    max_participants, inclusions, exclusions,
    is_featured, is_active, status
) VALUES
-- Tour 1: Phú Quốc
(1, 'Tour Phú Quốc 3N2Đ - VinWonders - Safari - Sunset Sanato', 'tour-phu-quoc-3n2d-vinwonders',
'Khám phá đảo ngọc Phú Quốc với VinWonders, Safari và nghỉ dưỡng tại resort 5 sao. Tận hưởng bãi biển tuyệt đẹp, ẩm thực hải sản tươi ngon.',
'NGÀY 1: TP.HCM - PHÚ QUỐC - VINWONDERS
- Xe đón tại sân bay, check-in khách sạn
- Tham quan VinWonders & Safari
- Tự do tắm biển, nghỉ ngơi

NGÀY 2: KHÁM PHÁ PHÚ QUỐC
- Tham quan Dinh Cậu, chùa Hộ Quốc
- Nhà thùng sản xuất nước mắm
- Sunset Sanato Beach Club
- Chợ đêm Phú Quốc

NGÀY 3: PHÚ QUỐC - TP.HCM
- Tự do nghỉ dưỡng, shopping
- Ra sân bay về TP.HCM',
3, 2,
4990000, 3990000, 0, 5990000, 17,
'https://example.com/tours/phu-quoc-1.jpg',
'TP. Hồ Chí Minh', 'Máy bay', 5, 30,
'["Vé máy bay khứ hồi", "Khách sạn 5 sao", "Bữa ăn theo chương trình", "Vé tham quan", "Hướng dẫn viên"]',
'["Đồ uống, chi phí cá nhân", "Bảo hiểm du lịch", "VAT"]',
TRUE, TRUE, 'active'),

-- Tour 2: Đà Lạt
(2, 'Tour Đà Lạt 3N2Đ - Thiền Viện Trúc Lâm - Thác Datanla - Buffet Lẩu Gà Lá É', 'tour-da-lat-3n2d-thien-vien',
'Trải nghiệm Đà Lạt lãng mạn với khí hậu mát mẻ quanh năm. Tham quan các điểm đẹp nổi tiếng, check-in sống ảo.',
'NGÀY 1: TP.HCM - ĐÀ LẠT
- Khởi hành sáng sớm, nghỉ trưa tại Bảo Lộc
- Check-in khách sạn
- Chợ đêm Đà Lạt

NGÀY 2: CITY TOUR ĐÀ LẠT
- Thiền Viện Trúc Lâm - Hồ Tuyền Lâm
- Thác Datanla
- Nhà thờ Domain, Ga Đà Lạt
- Chiều tự do

NGÀY 3: ĐÀ LẠT - TP.HCM  
- Tham quan làng hoa Vạn Thành
- Buffet lẩu gà lá é
- Về TP.HCM',
3, 2,
2990000, 2490000, 0, 3490000, 14,
'https://example.com/tours/da-lat-1.jpg',
'TP. Hồ Chí Minh', 'Xe du lịch', 4, 35,
'["Xe du lịch đời mới", "Khách sạn 4 sao", "Bữa ăn theo chương trình", "Vé tham quan", "HDV kinh nghiệm"]',
'["Bảo hiểm", "Chi phí cá nhân", "Đồ uống"]',
TRUE, TRUE, 'active'),

-- Tour 3: Nha Trang
(3, 'Tour Nha Trang 3N3Đ - 4 Đảo - Buffet Hải Sản - Vinpearland', 'tour-nha-trang-3n3d-4-dao',
'Khám phá Nha Trang xinh đẹp với tour 4 đảo, buffet hải sản và vui chơi tại Vinpearland. Trải nghiệm lặn ngắm san hô.',
'NGÀY 1: TP.HCM - NHA TRANG
- Khởi hành sáng
- Tắm biển tự do
- Nhà hàng hải sản

NGÀY 2: TOUR 4 ĐẢO
- Đảo Hòn Mun - lặn ngắm san hô
- Bãi Tranh - tắm biển
- Hòn Tằm
- Buffet hải sản trên đảo

NGÀY 3: VINPEARLAND
- Cáp treo vượt biển
- Vinpearland cả ngày
- Tự do khám phá

NGÀY 4: NHA TRANG - TP.HCM
- Tự do shopping
- Về TP.HCM',
4, 3,
5490000, 4490000, 0, 6490000, 15,
'https://example.com/tours/nha-trang-1.jpg',
'TP. Hồ Chí Minh', 'Máy bay', 4, 30,
'["Vé máy bay", "Khách sạn gần biển", "Ăn 3 bữa/ngày", "Tour 4 đảo", "Vé Vinpearland", "HDV"]',
'["Bảo hiểm", "Dịch vụ cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 4: Hạ Long
(4, 'Tour Hạ Long 2N1Đ - Du Thuyền 5 Sao - Hang Sửng Sốt - Đảo Titop', 'tour-ha-long-2n1d-du-thuyen',
'Trải nghiệm du thuyền sang trọng 5 sao trên Vịnh Hạ Long. Khám phá hang động, tắm biển tại đảo Titop.',
'NGÀY 1: HÀ NỘI - HẠ LONG
- Khởi hành từ Hà Nội
- Lên du thuyền 5 sao
- Buffet hải sản trưa
- Tham quan Hang Sửng Sốt
- Bơi thuyền kayak
- BBQ tối trên du thuyền

NGÀY 2: HẠ LONG - HÀ NỘI
- Ngắm bình minh trên vịnh
- Thăm làng chài
- Đảo Titop
- Về Hà Nội',
2, 1,
3990000, 2990000, 0, 4990000, 20,
'https://example.com/tours/ha-long-1.jpg',
'Hà Nội', 'Xe du lịch + Du thuyền', 5, 20,
'["Du thuyền 5 sao", "Ăn 3 bữa", "Vé tham quan", "HDV Tiếng Việt", "Kayak"]',
'["Đồ uống có cồn", "Bảo hiểm", "Chi phí cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 5: Sapa
(5, 'Tour Sapa 3N2Đ - Fansipan - Bản Cát Cát - Thác Bạc', 'tour-sapa-3n2d-fansipan',
'Chinh phục nóc nhà Đông Dương Fansipan. Khám phá văn hóa dân tộc thiểu số, ruộng bậc thang tuyệt đẹp.',
'NGÀY 1: HÀ NỘI - SAPA
- Khởi hành sáng
- Tham quan Bản Cát Cát
- Chợ tình Sapa buổi tối

NGÀY 2: CHINH PHỤC FANSIPAN
- Cáp treo lên Fansipan
- Check-in nóc nhà Đông Dương
- Chiều tự do

NGÀY 3: SAPA - HÀ NỘI
- Thác Bạc
- Cầu Mây
- Về Hà Nội',
3, 2,
4490000, 3490000, 0, 5490000, 18,
'https://example.com/tours/sapa-1.jpg',
'Hà Nội', 'Xe du lịch', 4, 25,
'["Xe đời mới", "Khách sạn 4 sao", "Ăn theo chương trình", "Vé cáp treo Fansipan", "HDV"]',
'["Bảo hiểm", "Đồ uống", "Chi phí cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 6: Hội An
(6, 'Tour Hội An - Đà Nẵng 4N3Đ - Bà Nà Hills - Cầu Vàng - Phố Cổ', 'tour-hoi-an-da-nang-4n3d',
'Khám phá Đà Nẵng - Hội An với Bà Nà Hills, Cầu Vàng nổi tiếng và phố cổ Hội An lung linh đèn lồng.',
'NGÀY 1: TP.HCM - ĐÀ NẴNG
- Bay đến Đà Nẵng
- Cầu Rồng, bãi biển Mỹ Khê
- Chợ Hàn

NGÀY 2: BÀ NÀ HILLS
- Cáp treo lên Bà Nà
- Cầu Vàng check-in
- Fantasy Park
- Làng Pháp

NGÀY 3: HỘI AN
- Phố cổ Hội An
- Chùa Cầu
- Nhà cổ Tấn Ký
- Thả đèn hoa đăng

NGÀY 4: ĐÀ NẴNG - TP.HCM
- Chùa Linh Ứng
- Về TP.HCM',
4, 3,
6990000, 5990000, 0, 7990000, 13,
'https://example.com/tours/hoi-an-1.jpg',
'TP. Hồ Chí Minh', 'Máy bay', 4, 30,
'["Vé máy bay", "KS 4 sao", "Ăn theo CT", "Vé Bà Nà", "Vé tham quan", "HDV"]',
'["Bảo hiểm", "Chi phí cá nhân"]',
FALSE, TRUE, 'active');

-- ============================================
-- Link Tours with Categories
-- ============================================
INSERT INTO tour_categories (tour_id, category_id) VALUES
(1, 1), (1, 6),  -- Phú Quốc: Biển đảo, Nghỉ dưỡng
(2, 2), (2, 4),  -- Đà Lạt: Miền núi, Ẩm thực
(3, 1), (3, 5),  -- Nha Trang: Biển đảo, Phiêu lưu
(4, 1), (4, 6),  -- Hạ Long: Biển đảo, Nghỉ dưỡng
(5, 2), (5, 3),  -- Sapa: Miền núi, Văn hóa
(6, 3), (6, 4);  -- Hội An: Văn hóa, Ẩm thực

-- ============================================
-- Insert Sample Tour Schedules
-- ============================================
INSERT INTO tour_schedules (tour_id, departure_date, return_date, available_slots, booked_slots, price_adult, price_child, status) VALUES
-- Phú Quốc schedules
(1, '2025-12-20', '2025-12-22', 30, 12, 4990000, 3990000, 'available'),
(1, '2025-12-25', '2025-12-27', 30, 8, 5490000, 4490000, 'available'),
(1, '2026-01-01', '2026-01-03', 30, 25, 5990000, 4990000, 'available'),

-- Đà Lạt schedules
(2, '2025-12-15', '2025-12-17', 35, 20, 2990000, 2490000, 'available'),
(2, '2025-12-22', '2025-12-24', 35, 5, 2990000, 2490000, 'available'),

-- Nha Trang schedules
(3, '2025-12-18', '2025-12-21', 30, 15, 5490000, 4490000, 'available'),
(3, '2026-01-05', '2026-01-08', 30, 0, 5490000, 4490000, 'available'),

-- Hạ Long schedules
(4, '2025-12-10', '2025-12-11', 20, 10, 3990000, 2990000, 'available'),
(4, '2026-01-15', '2026-01-16', 20, 4, 4190000, 3190000, 'available'),

-- Sapa schedules
(5, '2025-12-05', '2025-12-07', 25, 12, 4490000, 3490000, 'available'),
(5, '2026-02-02', '2026-02-04', 25, 6, 4690000, 3690000, 'available'),

-- Hội An - Đà Nẵng schedules
(6, '2025-12-20', '2025-12-23', 30, 18, 6990000, 5990000, 'available'),
(6, '2026-01-18', '2026-01-21', 30, 9, 7190000, 6190000, 'available');

-- ============================================
-- Insert Sample User (for testing)
-- Password for both: password123
-- ============================================
INSERT INTO users (email, password_hash, full_name, phone, role, is_verified) VALUES
('admin@toursite.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1J6u8C.Ql3FKmj7JnN2xQDZz5MxKLve', 'Admin User', '0901234567', 'admin', TRUE),
('customer@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1J6u8C.Ql3FKmj7JnN2xQDZz5MxKLve', 'Nguyễn Văn A', '0987654321', 'customer', TRUE);

-- ============================================
-- Insert Sample Reviews
-- ============================================
INSERT INTO reviews (tour_id, user_id, rating, title, comment, rating_service, rating_location, rating_price, rating_food, is_verified, is_approved) VALUES
(1, 2, 5, 'Tour tuyệt vời!', 'Chuyến đi rất đáng nhớ. Hướng dẫn viên nhiệt tình, khách sạn đẹp. Sẽ quay lại!', 5, 5, 4, 5, TRUE, TRUE),
(2, 2, 4, 'Đà Lạt đẹp như mơ', 'Thời tiết mát mẻ, phong cảnh đẹp. Lịch trình hợp lý. Giá hơi cao một chút.', 4, 5, 3, 4, TRUE, TRUE),
(3, 2, 5, 'Nha Trang tuyệt đẹp', 'Biển đẹp, tour 4 đảo rất vui. Buffet hải sản ngon. Recommend!', 5, 5, 5, 5, TRUE, TRUE);

-- ============================================
-- End of Sample Data
-- ============================================
