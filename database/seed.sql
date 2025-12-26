-- ============================================
-- Sample Data for Tour Booking Website
-- Run this after creating the schema
-- ============================================

USE tour_booking_db;

INSERT INTO destinations (name, slug, description, country, region, image_url, is_featured, display_order) VALUES
('Phú Quốc', 'phu-quoc', 'Đảo ngọc Phú Quốc - thiên đường nghỉ dưỡng với bãi biển tuyệt đẹp và nhiều hoạt động vui chơi giải trí.', 'Vietnam', 'Miền Nam', 'https://example.com/images/phu-quoc.jpg', TRUE, 1),
('Đà Lạt', 'da-lat', 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm, nổi tiếng với phong cảnh lãng mạn và nhiều điểm tham quan độc đáo.', 'Vietnam', 'Miền Nam', 'https://example.com/images/da-lat.jpg', TRUE, 2),
('Nha Trang', 'nha-trang', 'Thành phố biển xinh đẹp với bãi tắm dài, nước biển trong xanh và đa dạng hoạt động thể thao dưới nước.', 'Vietnam', 'Miền Trung', 'https://example.com/images/nha-trang.jpg', TRUE, 3),
('Hạ Long', 'ha-long', 'Vịnh Hạ Long - Di sản thiên nhiên thế giới với hàng nghìn hòn đảo đá vôi kỳ vĩ.', 'Vietnam', 'Miền Bắc', 'https://example.com/images/ha-long.jpg', TRUE, 4),
('Sapa', 'sapa', 'Thị trấn miền núi với ruộng bậc thang tuyệt đẹp, khí hậu trong lành và văn hóa dân tộc thiểu số đặc sắc.', 'Vietnam', 'Miền Bắc', 'https://example.com/images/sapa.jpg', TRUE, 5),
('Hội An', 'hoi-an', 'Phố cổ Hội An - Di sản văn hóa thế giới với kiến trúc cổ kính, đèn lồng rực rỡ và ẩm thực phong phú.', 'Vietnam', 'Miền Trung', 'https://example.com/images/hoi-an.jpg', FALSE, 6),
('Đà Nẵng', 'da-nang', 'Thành phố đáng sống với cầu Rồng, bãi biển Mỹ Khê, và Bà Nà Hills nổi tiếng.', 'Vietnam', 'Miền Trung', 'https://example.com/images/da-nang.jpg', FALSE, 7),
('Quy Nhơn', 'quy-nhon', 'Thiên đường biển hoang sơ với nhiều bãi tắm đẹp và yên tĩnh.', 'Vietnam', 'Miền Trung', 'https://example.com/images/quy-nhon.jpg', FALSE, 8),
('Bangkok', 'bangkok', 'Thủ đô sôi động của Thái Lan với chùa vàng, chợ nổi và ẩm thực đường phố hấp dẫn.', 'Thailand', 'Đông Nam Á', 'https://example.com/images/bangkok.jpg', TRUE, 9),
('Singapore', 'singapore', 'Đảo quốc sư tử hiện đại với Marina Bay Sands, Gardens by the Bay và Universal Studios.', 'Singapore', 'Đông Nam Á', 'https://example.com/images/singapore.jpg', TRUE, 10),
('Bali', 'bali', 'Thiên đường nghỉ dưỡng Indonesia với biển đẹp, ruộng bậc thang và văn hóa Hindu độc đáo.', 'Indonesia', 'Đông Nam Á', 'https://example.com/images/bali.jpg', TRUE, 11),
('Kuala Lumpur', 'kuala-lumpur', 'Thủ đô Malaysia với tháp đôi Petronas, ẩm thực đa sắc màu và cao nguyên Genting.', 'Malaysia', 'Đông Nam Á', 'https://example.com/images/kuala-lumpur.jpg', TRUE, 12),
('Boracay', 'boracay', 'Đảo Boracay Philippines nổi tiếng với cát trắng, nước xanh ngọc và hoạt động thể thao biển.', 'Philippines', 'Đông Nam Á', 'https://example.com/images/boracay.jpg', TRUE, 13),
-- Châu Âu
('Paris', 'paris', 'Thủ đô nước Pháp - thành phố tình yêu với tháp Eiffel, bảo tàng Louvre và ẩm thực tinh tế.', 'France', 'Châu Âu', 'https://example.com/images/paris.jpg', TRUE, 14),
('Rome', 'rome', 'Thành phố vĩnh cửu với đấu trường Colosseum, Vatican và di sản La Mã cổ đại.', 'Italy', 'Châu Âu', 'https://example.com/images/rome.jpg', TRUE, 15),
('Barcelona', 'barcelona', 'Thành phố nghệ thuật Tây Ban Nha với kiến trúc Gaudi, La Rambla và bãi biển Địa Trung Hải.', 'Spain', 'Châu Âu', 'https://example.com/images/barcelona.jpg', TRUE, 16),
('Amsterdam', 'amsterdam', 'Thủ đô Hà Lan với kênh đào thơ mộng, bảo tàng Van Gogh và cối xay gió.', 'Netherlands', 'Châu Âu', 'https://example.com/images/amsterdam.jpg', TRUE, 17),
('Prague', 'prague', 'Thành phố trăm tháp với cầu Charles, lâu đài Prague và kiến trúc Gothic tuyệt đẹp.', 'Czech Republic', 'Châu Âu', 'https://example.com/images/prague.jpg', TRUE, 18);

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
'NGÀY 1: TP.HCM - PHÚ QUỐC - VINWONDERS\n- Xe đón tại sân bay, check-in khách sạn\n- Tham quan VinWonders & Safari\n- Tự do tắm biển, nghỉ ngơi\n\nNGÀY 2: KHÁM PHÁ PHÚ QUỐC\n- Tham quan Dinh Cậu, chùa Hộ Quốc\n- Nhà thùng sản xuất nước mắm\n- Sunset Sanato Beach Club\n- Chợ đêm Phú Quốc\n\nNGÀY 3: PHÚ QUỐC - TP.HCM\n- Tự do nghỉ dưỡng, shopping\n- Ra sân bay về TP.HCM',
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
'NGÀY 1: TP.HCM - ĐÀ LẠT\n- Khởi hành sáng, nghỉ trưa tại Bảo Lộc\n- Check-in khách sạn\n- Chợ đêm Đà Lạt\n\nNGÀY 2: CITY TOUR ĐÀ LẠT\n- Thiền Viện Trúc Lâm - Hồ Tuyền Lâm\n- Thác Datanla\n- Nhà thờ Domain, Ga Đà Lạt\n- Trải nghiệm buffet lẩu gà lá é\n\nNGÀY 3: ĐÀ LẠT - TP.HCM\n- Tham quan nông trại hoa\n- Mua đặc sản, về TP.HCM',
3, 2,
3990000, 2990000, 0, 4990000, 20,
'https://example.com/tours/da-lat-1.jpg',
'TP. Hồ Chí Minh', 'Xe du lịch', 4, 35,
'["Xe du lịch", "Khách sạn 4 sao", "Ăn theo chương trình", "Vé tham quan", "Hướng dẫn viên"]',
'["Chi phí cá nhân", "Bảo hiểm", "VAT"]',
FALSE, TRUE, 'active'),

-- Tour 3: Nha Trang
(3, 'Tour Nha Trang 4N3Đ - VinWonders - Tour 4 Đảo - Tắm Bùn', 'tour-nha-trang-4n3d',
'Thành phố biển Nha Trang với VinWonders, tour 4 đảo, tắm bùn khoáng và ẩm thực hải sản.',
'NGÀY 1: TP.HCM - NHA TRANG\n- Bay đến Nha Trang, check-in khách sạn\n- Tự do tắm biển Trần Phú\n\nNGÀY 2: VINWONDERS\n- Cáp treo vượt biển\n- Công viên nước, thủy cung\n- Quảng trường nhạc nước\n\nNGÀY 3: TOUR 4 ĐẢO\n- Hòn Mun, Hòn Tằm, Làng chài\n- Snorkeling, lặn ngắm san hô\n- Tắm bùn khoáng\n\nNGÀY 4: CITY TOUR\n- Tháp Bà Ponagar, Chợ Đầm\n- Về TP.HCM',
4, 3,
5490000, 4490000, 0, 6490000, 15,
'https://example.com/tours/nha-trang-1.jpg',
'TP. Hồ Chí Minh', 'Máy bay', 4, 30,
'["Vé máy bay", "Khách sạn 4 sao", "Ăn theo chương trình", "Vé VinWonders", "Tour 4 đảo", "HDV"]',
'["Đồ uống", "Chi phí cá nhân", "VAT"]',
TRUE, TRUE, 'active'),

-- Tour 4: Hạ Long
(4, 'Tour Hạ Long 2N1Đ - Du Thuyền 5 Sao - Hang Sửng Sốt - Titop', 'tour-ha-long-2n1d',
'Du thuyền 5 sao trên vịnh Hạ Long, tham quan Hang Sửng Sốt, đảo Titop và chèo kayak.',
'NGÀY 1: HÀ NỘI - HẠ LONG\n- Đón khách, lên du thuyền\n- Hang Sửng Sốt, chèo kayak\n- Tắm biển Titop, tiệc sunset\n- Buffet hải sản tối\n\nNGÀY 2: HẠ LONG - HÀ NỘI\n- Tập thái cực quyền buổi sáng\n- Thăm làng chài\n- Trả khách Hà Nội',
2, 1,
3990000, 2990000, 0, 4990000, 20,
'https://example.com/tours/ha-long-1.jpg',
'Hà Nội', 'Xe du lịch + Du thuyền', 5, 20,
'["Du thuyền 5 sao", "Ăn 3 bữa", "Vé tham quan", "Kayak", "HDV Tiếng Việt"]',
'["Đồ uống có cồn", "Bảo hiểm", "Chi phí cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 5: Sapa
(5, 'Tour Sapa 3N2Đ - Fansipan - Bản Cát Cát - Thác Bạc', 'tour-sapa-3n2d-fansipan',
'Chinh phục Fansipan, khám phá bản Cát Cát, trải nghiệm văn hóa và ẩm thực vùng cao.',
'NGÀY 1: HÀ NỘI - SAPA\n- Khởi hành sáng\n- Tham quan Bản Cát Cát\n- Chợ tình Sapa buổi tối\n\nNGÀY 2: FANSIPAN\n- Cáp treo Fansipan\n- Check-in nóc nhà Đông Dương\n- Chiều tự do\n\nNGÀY 3: SAPA - HÀ NỘI\n- Thác Bạc, Cầu Mây\n- Mua sắm đặc sản\n- Về Hà Nội',
3, 2,
4490000, 3490000, 0, 5490000, 18,
'https://example.com/tours/sapa-1.jpg',
'Hà Nội', 'Xe du lịch', 4, 25,
'["Xe đời mới", "Khách sạn 4 sao", "Ăn theo chương trình", "Vé cáp treo Fansipan", "HDV"]',
'["Bảo hiểm", "Đồ uống", "Chi phí cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 6: Hội An - Đà Nẵng
(6, 'Tour Hội An - Đà Nẵng 4N3Đ - Bà Nà Hills - Cầu Vàng - Phố Cổ', 'tour-hoi-an-da-nang-4n3d',
'Khám phá Đà Nẵng - Hội An với Bà Nà Hills, Cầu Vàng và phố cổ lung linh đèn lồng.',
'NGÀY 1: TP.HCM - ĐÀ NẴNG\n- Bay đến Đà Nẵng\n- Cầu Rồng, biển Mỹ Khê, chợ Hàn\n\nNGÀY 2: BÀ NÀ HILLS\n- Cáp treo, Cầu Vàng, Fantasy Park\n\nNGÀY 3: HỘI AN\n- Phố cổ, Chùa Cầu, đèn lồng\n- Thả đèn hoa đăng\n\nNGÀY 4: ĐÀ NẴNG - TP.HCM\n- Linh Ứng, mua sắm\n- Về TP.HCM',
4, 3,
6990000, 5990000, 0, 7990000, 13,
'https://example.com/tours/hoi-an-1.jpg',
'TP. Hồ Chí Minh', 'Máy bay', 4, 30,
'["Vé máy bay", "KS 4 sao", "Ăn theo CT", "Vé Bà Nà", "Vé tham quan", "HDV"]',
'["Bảo hiểm", "Chi phí cá nhân"]',
FALSE, TRUE, 'active');

-- Insert SEA Tours
INSERT INTO tours (
    destination_id, title, slug, description, itinerary,
    duration_days, duration_nights,
    price_adult, price_child, price_infant, original_price, discount_percentage,
    cover_image_url, departure_location, transportation, hotel_rating,
    max_participants, inclusions, exclusions,
    is_featured, is_active, status
) VALUES
-- Tour 7: Bangkok - Pattaya
(9, 'Tour Bangkok - Pattaya 5N4Đ - Grand Palace - Buffet 86 Tầng - Alcazar Show', 'tour-bangkok-pattaya-5n4d',
'Khám phá Bangkok - Pattaya với Hoàng Cung, chùa vàng, buffet tầng 86 Baiyoke Sky, Alcazar show và đảo Coral.',
'NGÀY 1: HN/SGN - BANGKOK\n- Bay đến Bangkok, thăm chùa Phật Vàng\n- Asiatique night market\n\nNGÀY 2: GRAND PALACE\n- Hoàng Cung, Chùa Phật Ngọc\n- Chùa Phật Nằm Wat Pho\n- Buffet Baiyoke Sky 86 tầng\n\nNGÀY 3: BANGKOK - PATTAYA\n- Coral Island: lặn ngắm san hô, sea sports\n- Alcazar Show/Tiffany\n- Walking Street\n\nNGÀY 4: NONG NOOCH\n- Vườn nhiệt đới Nong Nooch, show voi\n- Shopping Terminal 21/Platinum\n\nNGÀY 5: PATTAYA - BANGKOK\n- Tự do mua sắm, ra sân bay về VN',
5, 4,
8990000, 7990000, 2990000, 10990000, 18,
'https://example.com/tours/bangkok-pattaya.jpg',
'Hà Nội / TP.HCM', 'Máy bay', 4, 30,
'["Vé máy bay khứ hồi", "KS 4 sao", "Ăn 3 bữa", "Vé tham quan", "HDV tiếng Việt", "Bảo hiểm"]',
'["Visa Thái", "Tip", "Chi phí cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 8: Singapore
(10, 'Tour Singapore 4N3Đ - Gardens by the Bay - Universal Studios - Marina Bay', 'tour-singapore-4n3d',
'Khám phá Singapore hiện đại với Gardens by the Bay, Universal Studios Sentosa, Marina Bay Sands và Night Safari.',
'NGÀY 1: HN/SGN - SINGAPORE\n- Merlion, Marina Bay Sands, Gardens by the Bay light show\n\nNGÀY 2: SENTOSA\n- Cáp treo Sentosa, Universal Studios\n- Wings of Time show\n\nNGÀY 3: CITY TOUR\n- Chinatown, Little India, Arab Street\n- Singapore Flyer, Clarke Quay\n- Night Safari\n\nNGÀY 4: SHOPPING\n- Orchard, Bugis, ra sân bay về VN',
4, 3,
14990000, 12990000, 4990000, 17990000, 17,
'https://example.com/tours/singapore.jpg',
'Hà Nội / TP.HCM', 'Máy bay', 4, 25,
'["Vé máy bay", "KS 4 sao trung tâm", "Vé Universal", "Cáp treo", "Vé tham quan", "HDV", "Bảo hiểm"]',
'["Visa", "Ăn trưa/tối", "Chi phí cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 9: Bali
(11, 'Tour Bali 5N4Đ - Ubud - Tanah Lot - Water Sport - Spa Bali', 'tour-bali-5n4d',
'Trải nghiệm Bali với Ubud, Tegallalang, đền Tanah Lot, thể thao biển Tanjung Benoa và spa Bali truyền thống.',
'NGÀY 1: HN/SGN - BALI\n- Đến Denpasar, check-in resort Nusa Dua\n\nNGÀY 2: UBUD\n- Tegallalang Rice Terrace, Ubud Palace\n- Ubud Monkey Forest, thác Tegenungan\n- Coffee Luwak, Spa Bali\n\nNGÀY 3: TANAH LOT - SEMINYAK\n- Đền Tanah Lot ngắm hoàng hôn\n- Seminyak Beach, beach club\n\nNGÀY 4: WATER SPORT - ULUWATU\n- Parasailing, Jet Ski, Sea Walker (tùy chọn)\n- Đền Uluwatu, Kecak Dance\n\nNGÀY 5: SHOPPING - VỀ VN\n- Beachwalk, Discovery Mall, ra sân bay',
5, 4,
12990000, 10990000, 3990000, 15990000, 19,
'https://example.com/tours/bali.jpg',
'Hà Nội / TP.HCM', 'Máy bay', 5, 25,
'["Vé máy bay", "Resort 5 sao", "Ăn sáng", "Vé tham quan", "Spa 60p", "HDV", "Bảo hiểm"]',
'["Visa on arrival", "Water sport", "Tip", "Chi phí cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 10: Kuala Lumpur - Genting
(12, 'Tour Malaysia 4N3Đ - Petronas - Genting Highlands - Batu Caves', 'tour-kuala-lumpur-4n3d',
'Khám phá Kuala Lumpur với tháp đôi Petronas, cao nguyên Genting, thủy cung Aquaria và động Batu Caves.',
'NGÀY 1: HN/SGN - KL\n- Petronas Twin Towers, Suria KLCC, Aquaria\n- Bukit Bintang, Alor night food\n\nNGÀY 2: GENTING HIGHLANDS\n- Cáp treo Awana, Genting SkyWorlds\n- Casino (người lớn)\n\nNGÀY 3: KL CITY TOUR\n- Batu Caves 272 bậc thang\n- Istana Negara, Merdeka Square, KL Tower\n- Central Market, Chinatown\n\nNGÀY 4: PUTRAJAYA - SHOPPING\n- Putra Mosque, Putra Square\n- Pavilion/Mid Valley, ra sân bay về VN',
4, 3,
9990000, 8490000, 2990000, 11990000, 17,
'https://example.com/tours/kuala-lumpur.jpg',
'Hà Nội / TP.HCM', 'Máy bay', 4, 30,
'["Vé máy bay", "KS 4 sao", "Ăn sáng", "Vé SkyWorlds", "Cáp treo", "Vé tham quan", "HDV", "Bảo hiểm"]',
'["Visa eNTRI", "Ăn trưa/tối", "Chi phí cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 11: Boracay - Manila
(13, 'Tour Philippines 5N4Đ - Boracay White Beach - Island Hopping - Manila', 'tour-boracay-manila-5n4d',
'Khám phá Boracay với bãi White Beach, island hopping, lặn ngắm san hô và city tour Manila.',
'NGÀY 1: HN/SGN - MANILA - BORACAY\n- Bay đến Manila, nối chuyến ra Boracay\n- Check-in resort gần White Beach\n\nNGÀY 2: ISLAND HOPPING\n- Crystal Cove, Crocodile Island, Puka Beach\n- Snorkeling, buffet BBQ trên đảo\n\nNGÀY 3: WATER SPORT\n- Parasailing, Jet Ski, Banana Boat (tùy chọn)\n- ATV tour, sunset sailing\n\nNGÀY 4: BORACAY - MANILA\n- Bay về Manila, Intramuros, Fort Santiago\n- Manila Cathedral, Mall of Asia\n\nNGÀY 5: MANILA - VỀ VN\n- Rizal Park, shopping, ra sân bay',
5, 4,
13990000, 11990000, 4990000, 16990000, 18,
'https://example.com/tours/boracay.jpg',
'Hà Nội / TP.HCM', 'Máy bay', 4, 25,
'["Vé máy bay quốc tế + nội địa", "Resort 4 sao", "Ăn sáng", "Island hopping", "Tàu cao tốc", "HDV", "Bảo hiểm"]',
'["Visa Philippines", "Water sport", "Ăn trưa/tối", "Tip", "Chi phí cá nhân"]',
TRUE, TRUE, 'active');

-- Insert European Tours
INSERT INTO tours (
    destination_id, title, slug, description, itinerary,
    duration_days, duration_nights,
    price_adult, price_child, price_infant, original_price, discount_percentage,
    cover_image_url, departure_location, transportation, hotel_rating,
    max_participants, inclusions, exclusions,
    is_featured, is_active, status
) VALUES
-- Tour 12: Paris - Pháp
(14, 'Tour Pháp 6N5Đ - Paris - Tháp Eiffel - Lâu Đài Versailles - Disneyland', 'tour-paris-6n5d',
'Khám phá Paris hoa lệ với tháp Eiffel, bảo tàng Louvre, lâu đài Versailles và công viên Disneyland Paris.',
'NGÀY 1: HN/SGN - PARIS\n- Bay đến Paris, check-in khách sạn\n- Dạo phố Champs-Élysées, Khải Hoàn Môn\n\nNGÀY 2: THÁP EIFFEL - SÔNG SEINE\n- Tháp Eiffel, chụp hình quảng trường Trocadéro\n- Du thuyền sông Seine ngắm Paris\n- Nhà thờ Đức Bà Paris\n\nNGÀY 3: BẢO TÀNG LOUVRE - MONTMARTRE\n- Bảo tàng Louvre (Mona Lisa, Venus)\n- Đồi Montmartre, Vương cung thánh đường Sacré-Cœur\n- Quảng trường Place du Tertre\n\nNGÀY 4: VERSAILLES\n- Lâu đài Versailles, vườn hoàng gia\n- Khu Marie Antoinette\n- Chiều shopping La Vallée Village\n\nNGÀY 5: DISNEYLAND PARIS\n- Trọn ngày tại Disneyland Paris\n- Các show và parade\n\nNGÀY 6: PARIS - VỀ VN\n- Tự do mua sắm, ra sân bay',
6, 5,
45990000, 39990000, 9990000, 52990000, 13,
'https://example.com/tours/paris.jpg',
'Hà Nội / TP.HCM', 'Máy bay', 4, 25,
'["Vé máy bay khứ hồi", "KS 4 sao trung tâm Paris", "Ăn sáng buffet", "Vé Louvre", "Vé Versailles", "Vé Disneyland 1 ngày", "Du thuyền Seine", "HDV tiếng Việt", "Bảo hiểm Schengen"]',
'["Visa Pháp/Schengen", "Vé lên tháp Eiffel", "Ăn trưa/tối", "Tip", "Chi phí cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 13: Rome - Ý
(15, 'Tour Ý 7N6Đ - Rome - Vatican - Florence - Venice - Milan', 'tour-italy-7n6d',
'Hành trình khám phá nước Ý: Rome cổ đại, Vatican linh thiêng, Florence nghệ thuật, Venice lãng mạn và Milan thời trang.',
'NGÀY 1: HN/SGN - ROME\n- Bay đến Rome, check-in khách sạn\n- Dạo khu trung tâm lịch sử\n\nNGÀY 2: ROME CỔ ĐẠI\n- Đấu trường Colosseum\n- Đồi Palatine, Roman Forum\n- Đài phun nước Trevi, quảng trường Tây Ban Nha\n\nNGÀY 3: VATICAN\n- Thành Vatican, Quảng trường St. Peter\n- Vương cung thánh đường St. Peter\n- Bảo tàng Vatican, nhà nguyện Sistine\n\nNGÀY 4: FLORENCE\n- Tàu cao tốc đến Florence\n- Duomo, Ponte Vecchio, Piazza della Signoria\n- Thưởng thức gelato Ý\n\nNGÀY 5: VENICE\n- Tàu đến Venice, đi thuyền Vaporetto\n- Quảng trường St. Mark, Cầu Than Thở\n- Đi gondola (tùy chọn)\n\nNGÀY 6: MILAN\n- Tàu đến Milan, nhà thờ Duomo\n- Galleria Vittorio Emanuele II\n- Khu thời trang Quadrilatero\n\nNGÀY 7: MILAN - VỀ VN\n- Mua sắm outlet, ra sân bay',
7, 6,
55990000, 48990000, 12990000, 64990000, 14,
'https://example.com/tours/rome.jpg',
'Hà Nội / TP.HCM', 'Máy bay', 4, 25,
'["Vé máy bay khứ hồi", "KS 4 sao", "Ăn sáng", "Tàu cao tốc nội địa Ý", "Vé Colosseum", "Vé Vatican", "Vé Duomo Florence", "HDV", "Bảo hiểm"]',
'["Visa Schengen", "Gondola Venice", "Ăn trưa/tối", "Tip", "Chi phí cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 14: Barcelona - Tây Ban Nha
(16, 'Tour Tây Ban Nha 6N5Đ - Barcelona - Madrid - Gaudi - Flamenco', 'tour-spain-6n5d',
'Khám phá Tây Ban Nha sôi động: Barcelona nghệ thuật Gaudi, Madrid hoàng gia, flamenco đam mê.',
'NGÀY 1: HN/SGN - BARCELONA\n- Bay đến Barcelona\n- Dạo La Rambla, chợ La Boqueria\n\nNGÀY 2: GAUDI TOUR\n- Vương cung thánh đường Sagrada Familia\n- Công viên Güell\n- Casa Batlló, Casa Milà\n\nNGÀY 3: BARCELONA BEACH & GOTHIC\n- Khu Gothic Quarter\n- Bãi biển Barceloneta\n- Camp Nou (tùy chọn)\n\nNGÀY 4: MADRID\n- Tàu cao tốc AVE đến Madrid\n- Cung điện Hoàng gia, Plaza Mayor\n- Puerta del Sol, Gran Vía\n\nNGÀY 5: MADRID - TOLEDO\n- Day trip Toledo - thành phố di sản\n- Alcázar, nhà thờ Toledo\n- Tối: Show Flamenco\n\nNGÀY 6: MADRID - VỀ VN\n- Bảo tàng Prado (tùy chọn)\n- Shopping, ra sân bay',
6, 5,
42990000, 36990000, 8990000, 49990000, 14,
'https://example.com/tours/barcelona.jpg',
'Hà Nội / TP.HCM', 'Máy bay', 4, 25,
'["Vé máy bay khứ hồi", "KS 4 sao", "Ăn sáng", "Tàu AVE Barcelona-Madrid", "Vé Sagrada Familia", "Vé Park Güell", "Show Flamenco", "HDV", "Bảo hiểm"]',
'["Visa Schengen", "Vé Camp Nou", "Bảo tàng Prado", "Ăn trưa/tối", "Tip", "Chi phí cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 15: Amsterdam - Hà Lan
(17, 'Tour Hà Lan - Bỉ 5N4Đ - Amsterdam - Bruges - Brussels - Keukenhof', 'tour-netherlands-belgium-5n4d',
'Khám phá Hà Lan và Bỉ: Amsterdam kênh đào, cối xay gió Zaanse Schans, Bruges cổ tích, Brussels chocolate.',
'NGÀY 1: HN/SGN - AMSTERDAM\n- Bay đến Amsterdam\n- Dạo kênh đào, quảng trường Dam\n\nNGÀY 2: AMSTERDAM CITY TOUR\n- Bảo tàng Van Gogh\n- Nhà Anne Frank (bên ngoài)\n- Khu đèn đỏ, Jordaan\n- Du thuyền kênh đào\n\nNGÀY 3: ZAANSE SCHANS - VOLENDAM\n- Làng cối xay gió Zaanse Schans\n- Làng chài Volendam, Marken\n- Xưởng phô mai, giày gỗ\n\nNGÀY 4: BRUGES - BRUSSELS\n- Bruges - Venice phương Bắc\n- Quảng trường Markt, Belfry\n- Brussels: Grand Place, Manneken Pis\n- Chocolate Bỉ nổi tiếng\n\nNGÀY 5: BRUSSELS - VỀ VN\n- Atomium (tùy chọn)\n- Mua sắm chocolate, waffle\n- Ra sân bay về VN',
5, 4,
38990000, 33990000, 7990000, 44990000, 13,
'https://example.com/tours/amsterdam.jpg',
'Hà Nội / TP.HCM', 'Máy bay', 4, 25,
'["Vé máy bay khứ hồi", "KS 4 sao", "Ăn sáng", "Vé Van Gogh Museum", "Du thuyền kênh đào", "Xe đưa đón", "HDV", "Bảo hiểm"]',
'["Visa Schengen", "Atomium", "Ăn trưa/tối", "Tip", "Chi phí cá nhân"]',
TRUE, TRUE, 'active'),

-- Tour 16: Prague - Séc
(18, 'Tour Đông Âu 7N6Đ - Prague - Vienna - Budapest - Hallstatt', 'tour-eastern-europe-7n6d',
'Hành trình Đông Âu tuyệt đẹp: Prague cổ kính, Vienna âm nhạc, Budapest nhiệt đới, Hallstatt thiên đường.',
'NGÀY 1: HN/SGN - PRAGUE\n- Bay đến Prague, check-in\n- Dạo Old Town Square\n\nNGÀY 2: PRAGUE\n- Lâu đài Prague, nhà thờ St. Vitus\n- Cầu Charles, phố Vàng\n- Đồng hồ thiên văn Orloj\n- Bia Séc nổi tiếng\n\nNGÀY 3: CESKY KRUMLOV - HALLSTATT\n- Cesky Krumlov - thị trấn cổ tích\n- Di chuyển đến Hallstatt\n- Làng cổ bên hồ Hallstatt\n\nNGÀY 4: SALZBURG - VIENNA\n- Salzburg - quê hương Mozart\n- Cung điện Mirabell, pháo đài Hohensalzburg\n- Chiều đến Vienna\n\nNGÀY 5: VIENNA\n- Cung điện Schönbrunn\n- Nhà hát Opera Vienna\n- Ringstrasse, nhà thờ St. Stephen\n\nNGÀY 6: BUDAPEST\n- Tàu đến Budapest\n- Pháo đài Ngư dân, nhà thờ Matthias\n- Quốc hội Hungary, cầu Xích\n- Tắm suối khoáng nóng (tùy chọn)\n\nNGÀY 7: BUDAPEST - VỀ VN\n- Tự do mua sắm\n- Ra sân bay về VN',
7, 6,
52990000, 45990000, 11990000, 61990000, 15,
'https://example.com/tours/prague.jpg',
'Hà Nội / TP.HCM', 'Máy bay', 4, 25,
'["Vé máy bay khứ hồi", "KS 4 sao", "Ăn sáng", "Vé lâu đài Prague", "Vé Schönbrunn", "Tàu cao tốc", "HDV", "Bảo hiểm"]',
'["Visa Schengen", "Suối khoáng Budapest", "Ăn trưa/tối", "Tip", "Chi phí cá nhân"]',
TRUE, TRUE, 'active');

-- ============================================
-- Link Tours with Categories
-- ============================================
INSERT INTO tour_categories (tour_id, category_id) VALUES
(1, 1), (1, 6),  -- Phú Quốc: Biển đảo, Nghỉ dưỡng
(2, 2), (2, 4),  -- Đà Lạt: Miền núi, Ẩm thực
(3, 1), (3, 5),  -- Nha Trang: Biển đảo, Phiêu lưu
(4, 1), (4, 6),  -- Hạ Long: Biển đảo, Nghỉ dưỡng
(5, 2), (5, 3),  -- Sapa: Miền núi, Văn hóa
(6, 3), (6, 4),  -- Hội An: Văn hóa, Ẩm thực
(7, 3), (7, 4), (7, 6),  -- Bangkok: Văn hóa, Ẩm thực, Nghỉ dưỡng
(8, 5), (8, 6),  -- Singapore: Phiêu lưu, Nghỉ dưỡng
(9, 1), (9, 3), (9, 6),  -- Bali: Biển đảo, Văn hóa, Nghỉ dưỡng
(10, 3), (10, 4), (10, 5),  -- Kuala Lumpur: Văn hóa, Ẩm thực, Phiêu lưu
(11, 1), (11, 5), (11, 6),  -- Boracay: Biển đảo, Phiêu lưu, Nghỉ dưỡng
-- European Tours Categories
(12, 3), (12, 4), (12, 6),  -- Paris: Văn hóa, Ẩm thực, Nghỉ dưỡng
(13, 3), (13, 4),           -- Rome/Italy: Văn hóa, Ẩm thực
(14, 3), (14, 4), (14, 5),  -- Barcelona: Văn hóa, Ẩm thực, Phiêu lưu
(15, 3), (15, 4),           -- Amsterdam: Văn hóa, Ẩm thực
(16, 3), (16, 2);           -- Prague/Eastern Europe: Văn hóa, Miền núi

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
(6, '2026-01-18', '2026-01-21', 30, 9, 7190000, 6190000, 'available'),

-- Bangkok - Pattaya schedules
(7, '2025-12-22', '2025-12-26', 30, 10, 8990000, 7990000, 'available'),
(7, '2025-12-29', '2026-01-02', 30, 22, 10990000, 9990000, 'available'),
(7, '2026-01-10', '2026-01-14', 30, 5, 8990000, 7990000, 'available'),

-- Singapore schedules
(8, '2025-12-18', '2025-12-21', 25, 15, 14990000, 12990000, 'available'),
(8, '2025-12-25', '2025-12-28', 25, 20, 16990000, 14990000, 'available'),
(8, '2026-01-08', '2026-01-11', 25, 8, 14990000, 12990000, 'available'),

-- Bali schedules
(9, '2025-12-20', '2025-12-24', 25, 12, 12990000, 10990000, 'available'),
(9, '2026-01-05', '2026-01-09', 25, 18, 13990000, 11990000, 'available'),
(9, '2026-02-14', '2026-02-18', 25, 10, 14990000, 12990000, 'available'),

-- Kuala Lumpur schedules
(10, '2025-12-16', '2025-12-19', 30, 20, 9990000, 8490000, 'available'),
(10, '2026-01-12', '2026-01-15', 30, 12, 9990000, 8490000, 'available'),
(10, '2026-02-08', '2026-02-11', 30, 8, 10490000, 8990000, 'available'),

-- Boracay schedules
(11, '2025-12-24', '2025-12-28', 25, 16, 13990000, 11990000, 'available'),
(11, '2026-01-15', '2026-01-19', 25, 10, 13990000, 11990000, 'available'),
(11, '2026-02-20', '2026-02-24', 25, 5, 14990000, 12990000, 'available'),

-- Paris schedules
(12, '2026-01-10', '2026-01-15', 25, 8, 45990000, 39990000, 'available'),
(12, '2026-03-15', '2026-03-20', 25, 12, 47990000, 41990000, 'available'),
(12, '2026-05-01', '2026-05-06', 25, 5, 49990000, 43990000, 'available'),

-- Italy schedules
(13, '2026-02-01', '2026-02-07', 25, 10, 55990000, 48990000, 'available'),
(13, '2026-04-10', '2026-04-16', 25, 8, 57990000, 50990000, 'available'),
(13, '2026-06-15', '2026-06-21', 25, 3, 59990000, 52990000, 'available'),

-- Spain schedules
(14, '2026-01-20', '2026-01-25', 25, 6, 42990000, 36990000, 'available'),
(14, '2026-03-25', '2026-03-30', 25, 10, 44990000, 38990000, 'available'),
(14, '2026-05-15', '2026-05-20', 25, 4, 46990000, 40990000, 'available'),

-- Netherlands-Belgium schedules
(15, '2026-03-01', '2026-03-05', 25, 12, 38990000, 33990000, 'available'),
(15, '2026-04-15', '2026-04-19', 25, 18, 42990000, 37990000, 'available'),
(15, '2026-05-20', '2026-05-24', 25, 8, 40990000, 35990000, 'available'),

-- Eastern Europe schedules
(16, '2026-02-15', '2026-02-21', 25, 7, 52990000, 45990000, 'available'),
(16, '2026-04-20', '2026-04-26', 25, 11, 54990000, 47990000, 'available'),
(16, '2026-06-01', '2026-06-07', 25, 5, 56990000, 49990000, 'available');

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
(3, 2, 5, 'Nha Trang tuyệt đẹp', 'Biển đẹp, tour 4 đảo rất vui. Buffet hải sản ngon. Recommend!', 5, 5, 5, 5, TRUE, TRUE),
(7, 2, 5, 'Bangkok - Pattaya quá vui', 'Grand Palace đẹp, Alcazar show hoành tráng, Coral Island nước trong vắt. Shopping rẻ!', 5, 5, 5, 4, TRUE, TRUE),
(8, 2, 5, 'Singapore hiện đại', 'Universal Studios rất đáng tiền, Gardens by the Bay lung linh buổi tối. Đi lại tiện.', 5, 5, 4, 4, TRUE, TRUE),
(9, 2, 5, 'Bali thiên đường nghỉ dưỡng', 'Resort xịn, spa thư giãn, Tanah Lot hoàng hôn quá đẹp. Water sport vui.', 5, 5, 5, 5, TRUE, TRUE),
(10, 2, 4, 'Malaysia đa văn hóa', 'Genting vui, Batu Caves ấn tượng, ăn uống phong phú. Giá ok.', 4, 4, 5, 5, TRUE, TRUE),
(11, 2, 5, 'Boracay bãi biển đỉnh', 'White Beach cát trắng, island hopping thú vị, water sport nhiều lựa chọn.', 5, 5, 4, 4, TRUE, TRUE),
-- European tour reviews
(12, 2, 5, 'Paris lãng mạn tuyệt đẹp', 'Tháp Eiffel lung linh, Louvre quá đẹp, Versailles hoành tráng. Disneyland vui hết sảy!', 5, 5, 4, 5, TRUE, TRUE),
(13, 2, 5, 'Nước Ý tuyệt vời', 'Colosseum hùng vĩ, Vatican linh thiêng, Venice lãng mạn. Pasta, pizza ngon không tưởng!', 5, 5, 4, 5, TRUE, TRUE),
(14, 2, 5, 'Tây Ban Nha sôi động', 'Sagrada Familia tuyệt tác, flamenco đam mê, tapas ngon. Barcelona beach đẹp!', 5, 5, 5, 5, TRUE, TRUE),
(15, 2, 4, 'Hà Lan - Bỉ cổ kính', 'Cối xay gió đẹp, kênh đào thơ mộng, chocolate Bỉ ngon. Bruges như cổ tích!', 5, 5, 4, 5, TRUE, TRUE),
(16, 2, 5, 'Đông Âu mê hoặc', 'Prague đẹp ngỡ ngàng, Hallstatt như tranh vẽ, Budapest tráng lệ. Tour quá đáng tiền!', 5, 5, 5, 4, TRUE, TRUE);

-- ============================================
-- End of Sample Data
-- ============================================

-- ============================================
-- Custom tour components (for budget builder)
-- ============================================
INSERT INTO custom_components (destination_id, type, name, price_per_person, price_per_day, star_rating, is_optional) VALUES
-- Phú Quốc (1)
(1, 'hotel', 'Khách sạn 3 sao Phú Quốc', NULL, 700000, 3, FALSE),
(1, 'hotel', 'Resort 5 sao Phú Quốc', NULL, 1800000, 5, FALSE),
(1, 'transport', 'Vé máy bay khứ hồi', 1500000, NULL, NULL, FALSE),
(1, 'activity', 'VinWonders + Safari', 900000, NULL, NULL, TRUE),
(1, 'meal', 'Set ăn hải sản', 250000, NULL, NULL, TRUE),

-- Đà Lạt (2)
(2, 'hotel', 'Khách sạn 3 sao Đà Lạt', NULL, 500000, 3, FALSE),
(2, 'hotel', 'Khách sạn 4 sao Đà Lạt', NULL, 900000, 4, FALSE),
(2, 'transport', 'Xe du lịch từ TP.HCM', 600000, NULL, NULL, FALSE),
(2, 'activity', 'Vé tham quan Datanla', 200000, NULL, NULL, TRUE),
(2, 'meal', 'Buffet lẩu gà lá é', 180000, NULL, NULL, TRUE),

-- Nha Trang (3)
(3, 'hotel', 'Khách sạn 3 sao Nha Trang', NULL, 650000, 3, FALSE),
(3, 'hotel', 'Khách sạn 5 sao Nha Trang', NULL, 1600000, 5, FALSE),
(3, 'transport', 'Vé máy bay khứ hồi', 1400000, NULL, NULL, FALSE),
(3, 'activity', 'Tour 4 đảo', 600000, NULL, NULL, TRUE),
(3, 'meal', 'Buffet hải sản', 300000, NULL, NULL, TRUE),

-- Hạ Long (4)
(4, 'hotel', 'Khách sạn 4 sao Hạ Long', NULL, 1100000, 4, FALSE),
(4, 'hotel', 'Du thuyền 5 sao Hạ Long', NULL, 2500000, 5, FALSE),
(4, 'transport', 'Xe limousine từ Hà Nội', 500000, NULL, NULL, FALSE),
(4, 'activity', 'Vé tham quan vịnh', 350000, NULL, NULL, TRUE),
(4, 'meal', 'Set hải sản trên tàu', 320000, NULL, NULL, TRUE),

-- Sapa (5)
(5, 'hotel', 'Khách sạn 3 sao Sapa', NULL, 600000, 3, FALSE),
(5, 'hotel', 'Khách sạn 4 sao Sapa', NULL, 950000, 4, FALSE),
(5, 'transport', 'Xe giường nằm từ Hà Nội', 450000, NULL, NULL, FALSE),
(5, 'activity', 'Vé cáp treo Fansipan', 700000, NULL, NULL, TRUE),
(5, 'meal', 'Set đặc sản Sapa', 220000, NULL, NULL, TRUE),

-- Hội An (6)
(6, 'hotel', 'Khách sạn 3 sao Hội An', NULL, 750000, 3, FALSE),
(6, 'hotel', 'Khách sạn 5 sao Hội An', NULL, 1700000, 5, FALSE),
(6, 'transport', 'Vé máy bay khứ hồi', 1500000, NULL, NULL, FALSE),
(6, 'activity', 'Vé tham quan phố cổ', 150000, NULL, NULL, TRUE),
(6, 'meal', 'Combo ẩm thực Hội An', 200000, NULL, NULL, TRUE),

-- Global components (destination_id NULL)
(NULL, 'transport', 'Bảo hiểm du lịch cơ bản', 80000, NULL, NULL, TRUE),
(NULL, 'meal', 'Nước uống & snack', 50000, NULL, NULL, TRUE);
