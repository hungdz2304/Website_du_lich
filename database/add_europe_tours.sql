-- ============================================
-- Thêm 5 Tour Châu Âu (Final Fixed Version)
-- Chạy file này trong MySQL Workbench
-- ============================================

USE tour_booking_db;

-- ============================================
-- 1. Thêm Destinations Châu Âu (IGNORE nếu đã tồn tại)
-- ============================================
INSERT IGNORE INTO destinations (name, slug, description, country, region, image_url, is_featured, display_order) VALUES
('Paris', 'paris', 'Thủ đô nước Pháp - thành phố tình yêu với tháp Eiffel, bảo tàng Louvre và ẩm thực tinh tế.', 'France', 'Châu Âu', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=60', TRUE, 14),
('Rome', 'rome', 'Thành phố vĩnh cửu với đấu trường Colosseum, Vatican và di sản La Mã cổ đại.', 'Italy', 'Châu Âu', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=60', TRUE, 15),
('Barcelona', 'barcelona', 'Thành phố nghệ thuật Tây Ban Nha với kiến trúc Gaudi, La Rambla và bãi biển Địa Trung Hải.', 'Spain', 'Châu Âu', 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=900&q=60', TRUE, 16),
('Amsterdam', 'amsterdam', 'Thủ đô Hà Lan với kênh đào thơ mộng, bảo tàng Van Gogh và cối xay gió.', 'Netherlands', 'Châu Âu', 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=900&q=60', TRUE, 17),
('Prague', 'prague', 'Thành phố trăm tháp với cầu Charles, lâu đài Prague và kiến trúc Gothic tuyệt đẹp.', 'Czech Republic', 'Châu Âu', 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=900&q=60', TRUE, 18);

-- ============================================
-- 2. Lấy destination IDs
-- ============================================
SET @paris_id = (SELECT destination_id FROM destinations WHERE slug = 'paris');
SET @rome_id = (SELECT destination_id FROM destinations WHERE slug = 'rome');
SET @barcelona_id = (SELECT destination_id FROM destinations WHERE slug = 'barcelona');
SET @amsterdam_id = (SELECT destination_id FROM destinations WHERE slug = 'amsterdam');
SET @prague_id = (SELECT destination_id FROM destinations WHERE slug = 'prague');

-- ============================================
-- 3. Thêm Tours (IGNORE nếu đã tồn tại)
-- ============================================
INSERT IGNORE INTO tours (
    destination_id, title, slug, description, itinerary,
    duration_days, duration_nights,
    price_adult, price_child, price_infant, original_price, discount_percentage,
    cover_image_url, departure_location, transportation, hotel_rating,
    max_participants, inclusions, exclusions,
    is_featured, is_active, status
) VALUES
-- Tour 1: Paris
(@paris_id, 
'Tour Pháp 6N5Đ - Paris - Tháp Eiffel - Lâu Đài Versailles - Disneyland', 
'tour-paris-6n5d',
'Khám phá Paris hoa lệ với tháp Eiffel, bảo tàng Louvre, lâu đài Versailles và công viên Disneyland Paris.',
'NGÀY 1: HN/SGN - PARIS - Bay đến Paris, check-in khách sạn, dạo phố Champs-Élysées, Khải Hoàn Môn. NGÀY 2: THÁP EIFFEL - SÔNG SEINE - Tháp Eiffel, du thuyền sông Seine, Nhà thờ Đức Bà Paris. NGÀY 3: BẢO TÀNG LOUVRE - MONTMARTRE - Bảo tàng Louvre, đồi Montmartre. NGÀY 4: VERSAILLES - Lâu đài Versailles, shopping La Vallée Village. NGÀY 5: DISNEYLAND PARIS - Trọn ngày tại Disneyland Paris. NGÀY 6: PARIS - VỀ VN - Tự do mua sắm, ra sân bay.',
6, 5, 45990000, 39990000, 9990000, 52990000, 13,
'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
'Hà Nội / TP.HCM', 'Máy bay', 4, 25,
'["Vé máy bay khứ hồi", "KS 4 sao trung tâm Paris", "Ăn sáng buffet", "Vé Louvre", "Vé Versailles", "Vé Disneyland 1 ngày", "Du thuyền Seine", "HDV tiếng Việt", "Bảo hiểm Schengen"]',
'["Visa Pháp/Schengen", "Vé lên tháp Eiffel", "Ăn trưa/tối", "Tip", "Chi phí cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 2: Italy
(@rome_id, 
'Tour Ý 7N6Đ - Rome - Vatican - Florence - Venice - Milan', 
'tour-italy-7n6d',
'Hành trình khám phá nước Ý: Rome cổ đại, Vatican linh thiêng, Florence nghệ thuật, Venice lãng mạn và Milan thời trang.',
'NGÀY 1: HN/SGN - ROME - Bay đến Rome, check-in khách sạn. NGÀY 2: ROME CỔ ĐẠI - Đấu trường Colosseum, Đồi Palatine, Roman Forum, Đài phun nước Trevi. NGÀY 3: VATICAN - Thành Vatican, Quảng trường St. Peter, Bảo tàng Vatican, nhà nguyện Sistine. NGÀY 4: FLORENCE - Tàu cao tốc đến Florence, Duomo, Ponte Vecchio. NGÀY 5: VENICE - Tàu đến Venice, Quảng trường St. Mark, Cầu Than Thở. NGÀY 6: MILAN - Tàu đến Milan, nhà thờ Duomo, Galleria Vittorio Emanuele II. NGÀY 7: MILAN - VỀ VN - Mua sắm outlet, ra sân bay.',
7, 6, 55990000, 48990000, 12990000, 64990000, 14,
'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
'Hà Nội / TP.HCM', 'Máy bay', 4, 25,
'["Vé máy bay khứ hồi", "KS 4 sao", "Ăn sáng", "Tàu cao tốc nội địa Ý", "Vé Colosseum", "Vé Vatican", "HDV", "Bảo hiểm"]',
'["Visa Schengen", "Gondola Venice", "Ăn trưa/tối", "Tip", "Chi phí cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 3: Spain
(@barcelona_id, 
'Tour Tây Ban Nha 6N5Đ - Barcelona - Madrid - Gaudi - Flamenco', 
'tour-spain-6n5d',
'Khám phá Tây Ban Nha sôi động: Barcelona nghệ thuật Gaudi, Madrid hoàng gia, flamenco đam mê.',
'NGÀY 1: HN/SGN - BARCELONA - Bay đến Barcelona, dạo La Rambla, chợ La Boqueria. NGÀY 2: GAUDI TOUR - Sagrada Familia, Công viên Güell, Casa Batlló. NGÀY 3: BARCELONA - Khu Gothic Quarter, Bãi biển Barceloneta. NGÀY 4: MADRID - Tàu AVE đến Madrid, Cung điện Hoàng gia, Plaza Mayor. NGÀY 5: TOLEDO - Day trip Toledo, Tối: Show Flamenco. NGÀY 6: MADRID - VỀ VN - Shopping, ra sân bay.',
6, 5, 42990000, 36990000, 8990000, 49990000, 14,
'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
'Hà Nội / TP.HCM', 'Máy bay', 4, 25,
'["Vé máy bay khứ hồi", "KS 4 sao", "Ăn sáng", "Tàu AVE", "Vé Sagrada Familia", "Vé Park Güell", "Show Flamenco", "HDV", "Bảo hiểm"]',
'["Visa Schengen", "Ăn trưa/tối", "Tip", "Chi phí cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 4: Netherlands & Belgium
(@amsterdam_id, 
'Tour Hà Lan - Bỉ 5N4Đ - Amsterdam - Bruges - Brussels', 
'tour-netherlands-belgium-5n4d',
'Khám phá Hà Lan và Bỉ: Amsterdam kênh đào, cối xay gió Zaanse Schans, Bruges cổ tích, Brussels chocolate.',
'NGÀY 1: HN/SGN - AMSTERDAM - Bay đến Amsterdam, dạo kênh đào, quảng trường Dam. NGÀY 2: AMSTERDAM - Bảo tàng Van Gogh, Du thuyền kênh đào. NGÀY 3: ZAANSE SCHANS - Làng cối xay gió, Làng chài Volendam. NGÀY 4: BRUGES - BRUSSELS - Bruges cổ tích, Brussels: Grand Place, Manneken Pis. NGÀY 5: BRUSSELS - VỀ VN - Mua sắm chocolate, Ra sân bay.',
5, 4, 38990000, 33990000, 7990000, 44990000, 13,
'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200&q=80',
'Hà Nội / TP.HCM', 'Máy bay', 4, 25,
'["Vé máy bay khứ hồi", "KS 4 sao", "Ăn sáng", "Vé Van Gogh Museum", "Du thuyền kênh đào", "HDV", "Bảo hiểm"]',
'["Visa Schengen", "Ăn trưa/tối", "Tip", "Chi phí cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 5: Eastern Europe
(@prague_id, 
'Tour Đông Âu 7N6Đ - Prague - Vienna - Budapest - Hallstatt', 
'tour-eastern-europe-7n6d',
'Hành trình Đông Âu tuyệt đẹp: Prague cổ kính, Vienna âm nhạc, Budapest tráng lệ, Hallstatt thiên đường.',
'NGÀY 1: HN/SGN - PRAGUE - Bay đến Prague, dạo Old Town Square. NGÀY 2: PRAGUE - Lâu đài Prague, cầu Charles, Đồng hồ thiên văn Orloj. NGÀY 3: HALLSTATT - Cesky Krumlov, Làng cổ Hallstatt. NGÀY 4: SALZBURG - VIENNA - Salzburg quê hương Mozart, chiều đến Vienna. NGÀY 5: VIENNA - Cung điện Schönbrunn, Nhà hát Opera Vienna. NGÀY 6: BUDAPEST - Pháo đài Ngư dân, Quốc hội Hungary, cầu Xích. NGÀY 7: BUDAPEST - VỀ VN - Mua sắm, ra sân bay.',
7, 6, 52990000, 45990000, 11990000, 61990000, 15,
'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80',
'Hà Nội / TP.HCM', 'Máy bay', 4, 25,
'["Vé máy bay khứ hồi", "KS 4 sao", "Ăn sáng", "Vé lâu đài Prague", "Vé Schönbrunn", "Tàu cao tốc", "HDV", "Bảo hiểm"]',
'["Visa Schengen", "Ăn trưa/tối", "Tip", "Chi phí cá nhân"]',
TRUE, TRUE, 'active');

-- ============================================
-- 4. Lấy tour IDs
-- ============================================
SET @tour_paris = (SELECT tour_id FROM tours WHERE slug = 'tour-paris-6n5d');
SET @tour_italy = (SELECT tour_id FROM tours WHERE slug = 'tour-italy-7n6d');
SET @tour_spain = (SELECT tour_id FROM tours WHERE slug = 'tour-spain-6n5d');
SET @tour_nl_be = (SELECT tour_id FROM tours WHERE slug = 'tour-netherlands-belgium-5n4d');
SET @tour_east = (SELECT tour_id FROM tours WHERE slug = 'tour-eastern-europe-7n6d');

-- ============================================
-- 5. Thêm Categories (IGNORE nếu đã tồn tại)
-- ============================================
INSERT IGNORE INTO tour_categories (tour_id, category_id) VALUES
(@tour_paris, 3), (@tour_paris, 4), (@tour_paris, 6),
(@tour_italy, 3), (@tour_italy, 4),
(@tour_spain, 3), (@tour_spain, 4), (@tour_spain, 5),
(@tour_nl_be, 3), (@tour_nl_be, 4),
(@tour_east, 3), (@tour_east, 2);

-- ============================================
-- 6. Thêm Tour Schedules (IGNORE nếu đã tồn tại)
-- ============================================
INSERT IGNORE INTO tour_schedules (tour_id, departure_date, return_date, available_slots, booked_slots, price_adult, price_child, status) VALUES
(@tour_paris, '2026-01-10', '2026-01-15', 25, 8, 45990000, 39990000, 'available'),
(@tour_paris, '2026-03-15', '2026-03-20', 25, 12, 47990000, 41990000, 'available'),
(@tour_paris, '2026-05-01', '2026-05-06', 25, 5, 49990000, 43990000, 'available'),
(@tour_italy, '2026-02-01', '2026-02-07', 25, 10, 55990000, 48990000, 'available'),
(@tour_italy, '2026-04-10', '2026-04-16', 25, 8, 57990000, 50990000, 'available'),
(@tour_italy, '2026-06-15', '2026-06-21', 25, 3, 59990000, 52990000, 'available'),
(@tour_spain, '2026-01-20', '2026-01-25', 25, 6, 42990000, 36990000, 'available'),
(@tour_spain, '2026-03-25', '2026-03-30', 25, 10, 44990000, 38990000, 'available'),
(@tour_spain, '2026-05-15', '2026-05-20', 25, 4, 46990000, 40990000, 'available'),
(@tour_nl_be, '2026-03-01', '2026-03-05', 25, 12, 38990000, 33990000, 'available'),
(@tour_nl_be, '2026-04-15', '2026-04-19', 25, 18, 42990000, 37990000, 'available'),
(@tour_nl_be, '2026-05-20', '2026-05-24', 25, 8, 40990000, 35990000, 'available'),
(@tour_east, '2026-02-15', '2026-02-21', 25, 7, 52990000, 45990000, 'available'),
(@tour_east, '2026-04-20', '2026-04-26', 25, 11, 54990000, 47990000, 'available'),
(@tour_east, '2026-06-01', '2026-06-07', 25, 5, 56990000, 49990000, 'available');

-- ============================================
-- 7. Thêm Reviews - TẮT TRIGGER TẠM THỜI
-- ============================================

-- Kiểm tra xem review đã tồn tại chưa, nếu chưa thì thêm
INSERT INTO reviews (tour_id, user_id, rating, title, comment, rating_service, rating_location, rating_price, rating_food, is_verified, is_approved)
SELECT @tour_paris, 2, 5, 'Paris lãng mạn tuyệt đẹp', 'Tháp Eiffel lung linh, Louvre quá đẹp, Versailles hoành tráng!', 5, 5, 4, 5, TRUE, TRUE
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE tour_id = @tour_paris AND user_id = 2);

INSERT INTO reviews (tour_id, user_id, rating, title, comment, rating_service, rating_location, rating_price, rating_food, is_verified, is_approved)
SELECT @tour_italy, 2, 5, 'Nước Ý tuyệt vời', 'Colosseum hùng vĩ, Vatican linh thiêng, Venice lãng mạn!', 5, 5, 4, 5, TRUE, TRUE
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE tour_id = @tour_italy AND user_id = 2);

INSERT INTO reviews (tour_id, user_id, rating, title, comment, rating_service, rating_location, rating_price, rating_food, is_verified, is_approved)
SELECT @tour_spain, 2, 5, 'Tây Ban Nha sôi động', 'Sagrada Familia tuyệt tác, flamenco đam mê!', 5, 5, 5, 5, TRUE, TRUE
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE tour_id = @tour_spain AND user_id = 2);

INSERT INTO reviews (tour_id, user_id, rating, title, comment, rating_service, rating_location, rating_price, rating_food, is_verified, is_approved)
SELECT @tour_nl_be, 2, 4, 'Hà Lan - Bỉ cổ kính', 'Cối xay gió đẹp, chocolate Bỉ ngon!', 5, 5, 4, 5, TRUE, TRUE
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE tour_id = @tour_nl_be AND user_id = 2);

INSERT INTO reviews (tour_id, user_id, rating, title, comment, rating_service, rating_location, rating_price, rating_food, is_verified, is_approved)
SELECT @tour_east, 2, 5, 'Đông Âu mê hoặc', 'Prague đẹp ngỡ ngàng, Hallstatt như tranh vẽ!', 5, 5, 5, 4, TRUE, TRUE
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE tour_id = @tour_east AND user_id = 2);

-- ============================================
-- 8. Cập nhật rating cho tours thủ công (tránh trigger)
-- ============================================
UPDATE tours SET rating_average = 5.0, review_count = 1 WHERE tour_id = @tour_paris;
UPDATE tours SET rating_average = 5.0, review_count = 1 WHERE tour_id = @tour_italy;
UPDATE tours SET rating_average = 5.0, review_count = 1 WHERE tour_id = @tour_spain;
UPDATE tours SET rating_average = 4.0, review_count = 1 WHERE tour_id = @tour_nl_be;
UPDATE tours SET rating_average = 5.0, review_count = 1 WHERE tour_id = @tour_east;

-- ============================================
-- Kiểm tra kết quả
-- ============================================
SELECT '=== DESTINATIONS CHÂU ÂU ===' AS '';
SELECT destination_id, name, country FROM destinations WHERE region = 'Châu Âu';

SELECT '=== TOURS CHÂU ÂU ===' AS '';
SELECT tour_id, title, FORMAT(price_adult, 0) AS price, CONCAT(duration_days, 'N', duration_nights, 'Đ') AS duration 
FROM tours 
WHERE slug IN ('tour-paris-6n5d', 'tour-italy-7n6d', 'tour-spain-6n5d', 'tour-netherlands-belgium-5n4d', 'tour-eastern-europe-7n6d');

SELECT '=== HOÀN TẤT - ĐÃ THÊM 5 TOUR CHÂU ÂU! ===' AS '';
