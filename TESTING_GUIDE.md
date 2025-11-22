# 🧪 HƯỚNG DẪN TEST CÁC TÍNH NĂNG MỚI

## 1️⃣ TEST REVIEW SYSTEM

### Bước 1: Đăng nhập
1. Mở `http://localhost:5500/login.html`
2. Login với: `customer@example.com` / `password123`

### Bước 2: Vào chi tiết tour
1. Click vào bất kỳ tour nào trên homepage
2. Hoặc truy cập: `http://localhost:5500/tour-detail.html?id=1`

### Bước 3: Viết review
1. Click nút **"Viết đánh giá"** (góc phải reviews section)
2. Chọn số sao (1-5)
3. Nhập tiêu đề và nội dung
4. (Optional) Đánh giá chi tiết: Dịch vụ, Địa điểm, Giá cả, Ẩm thực
5. Click **"Gửi đánh giá"**

### Kết quả mong đợi:
- ✅ Toast thông báo "Đánh giá thành công"
- ✅ Review xuất hiện trong danh sách
- ✅ Rating tổng của tour được cập nhật tự động

### Test API trực tiếp (Postman/curl):
```powershell
# Get token sau khi login
$token = "YOUR_JWT_TOKEN"

# Create review
curl -X POST http://localhost:3000/api/reviews `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d '{
    "tour_id": 1,
    "rating": 5,
    "title": "Tour tuyệt vời!",
    "comment": "Rất hài lòng với dịch vụ",
    "rating_service": 5,
    "rating_location": 5,
    "rating_price": 4,
    "rating_food": 5
  }'
```

---

## 2️⃣ TEST FILE UPLOAD

### Test Upload Avatar

#### Trong Browser (Cần tạo form upload):
```html
<!-- Test upload.html -->
<form id="uploadForm">
    <input type="file" id="avatar" accept="image/*">
    <button type="submit">Upload Avatar</button>
</form>

<script>
document.getElementById('uploadForm').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('avatar', document.getElementById('avatar').files[0]);
    
    const res = await fetch('http://localhost:3000/api/upload/avatar', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
    });
    
    const data = await res.json();
    console.log(data);
    alert('Avatar uploaded: ' + data.data.full_url);
};
</script>
```

#### Test với Postman:
1. POST `http://localhost:3000/api/upload/avatar`
2. Headers: `Authorization: Bearer YOUR_TOKEN`
3. Body → form-data:
   - Key: `avatar` (type: File)
   - Value: Chọn ảnh từ máy
4. Send

### Test Upload Review Images:
```powershell
# Multiple files
POST http://localhost:3000/api/upload/review-images
Body: form-data
  - images: file1.jpg
  - images: file2.jpg
  - images: file3.jpg (max 5 files)
```

### Kết quả:
- ✅ File được lưu trong `backend/uploads/`
- ✅ API trả về URL: `/uploads/avatar-1234567890.jpg`
- ✅ Truy cập được: `http://localhost:3000/uploads/avatar-1234567890.jpg`

---

## 3️⃣ TEST EMAIL NOTIFICATIONS

### Setup Gmail SMTP (BẮT BUỘC):

#### Bước 1: Tạo App Password
1. Vào https://myaccount.google.com/security
2. Bật "2-Step Verification"
3. Search "App passwords"
4. Create app password cho "Mail"
5. Copy password (16 ký tự)

#### Bước 2: Cập nhật .env
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-digit-app-password
```

#### Bước 3: Restart Backend
```powershell
# Stop server (Ctrl+C)
npm run dev
```

### Test Email:

#### Test 1: Booking Confirmation
1. Login vào website
2. Chọn tour → Đặt tour
3. Nhập email của bạn
4. Submit

**Kết quả:** Email "Xác nhận đặt tour" sẽ gửi đến inbox

#### Test 2: Payment Confirmation
1. Vào "Đặt chỗ của tôi"
2. Click "Thanh toán" (nếu có booking pending)
3. Chọn phương thức online (MoMo/Bank Card)

**Kết quả:** Email "Thanh toán thành công"

#### Test 3: Cancellation Email
1. Vào "Đặt chỗ của tôi"
2. Click "Hủy booking"
3. Xác nhận

**Kết quả:** Email "Thông báo hủy đặt tour"

### Test thủ công (trong code):
```javascript
// Trong backend/server.js
const emailService = require('./utils/emailService');

// Test connection
emailService.testConnection().then(result => {
    console.log('Email test:', result);
});

// Test send email
emailService.sendBookingConfirmation({
    contact_email: 'test@example.com',
    contact_name: 'Test User',
    booking_reference: 'BK123456',
    tour_title: 'Tour Phú Quốc',
    final_price: 5000000,
    departure_date: '2025-12-20'
});
```

---

## 4️⃣ TEST ADMIN PANEL

### Bước 1: Login Admin
1. Logout nếu đang login customer
2. Login với: `admin@toursite.com` / `password123`

### Bước 2: Truy cập Admin Dashboard
```
http://localhost:5500/admin/index.html
```

### Kết quả mong đợi:
- ✅ Sidebar admin panel
- ✅ 4 stat cards (Bookings, Users, Tours, Revenue)
- ✅ Recent bookings table
- ✅ Không hiển thị nếu login bằng customer

### Test Permission:
1. Login bằng `customer@example.com`
2. Thử vào `http://localhost:5500/admin/index.html`
3. **Kết quả:** Redirect về homepage với alert "Không có quyền"

---

## 5️⃣ TEST PAYMENT FLOW (Chưa có gateway thật)

### Current Behavior:
1. Chọn tour → Đặt tour
2. Chọn payment method: **Bank Card / MoMo / Apple Pay**
3. Submit booking
4. **Kết quả:**
   - Status: `confirmed` (thay vì `pending`)
   - Payment status: `paid`
   - Email confirmation gửi ngay

### Test với Bank Transfer:
1. Chọn payment method: **Chuyển khoản ngân hàng**
2. Submit
3. **Kết quả:**
   - Status: `pending`
   - Payment status: `pending`
   - Cần admin confirm hoặc user thanh toán sau

### Tích hợp Payment Gateway (TODO):
Xem file `NEW_FEATURES_COMPLETED.md` phần "Payment Integration"

---

## 6️⃣ TEST IMAGE UPLOAD & UPDATE

### Test Upload Tour Image (Admin only):

#### Postman:
```
POST http://localhost:3000/api/upload/tour-image
Headers:
  - Authorization: Bearer ADMIN_TOKEN
Body: form-data
  - image: phu-quoc.jpg
```

#### Kết quả:
```json
{
  "success": true,
  "message": "Upload ảnh tour thành công",
  "data": {
    "image_url": "/uploads/image-1234567890.jpg",
    "full_url": "http://localhost:3000/uploads/image-1234567890.jpg"
  }
}
```

### Update Database:
```sql
-- Update tour cover image
UPDATE tours 
SET cover_image_url = '/uploads/image-1234567890.jpg'
WHERE tour_id = 1;

-- Update image gallery (JSON)
UPDATE tours
SET image_gallery = JSON_ARRAY(
    '/uploads/tour-1-img1.jpg',
    '/uploads/tour-1-img2.jpg',
    '/uploads/tour-1-img3.jpg'
)
WHERE tour_id = 1;
```

### Verify:
```
http://localhost:3000/uploads/image-1234567890.jpg
```

---

## 🎯 FULL INTEGRATION TEST

### Scenario: Toàn bộ flow User

1. **Register** → `customer2@example.com` / `password123`
2. **Login** → Nhận JWT token
3. **Browse tours** → Homepage
4. **View tour detail** → Click tour
5. **Book tour** → Điền form, chọn online payment
6. **Receive email** → Check inbox
7. **View bookings** → My bookings page
8. **Write review** → Viết đánh giá tour
9. **Upload avatar** → Đổi ảnh đại diện
10. **Logout**

### Scenario: Admin Flow

1. **Login admin** → `admin@toursite.com`
2. **View dashboard** → Stats & recent bookings
3. **Upload tour image** → Add new tour image
4. **Update database** → Set new image URL
5. **Manage reviews** → (TODO: Admin review page)
6. **Logout**

---

## 🐛 TROUBLESHOOTING

### Review không hiển thị?
```sql
-- Check reviews in database
SELECT * FROM reviews WHERE tour_id = 1;

-- Check trigger đã chạy chưa
SELECT rating_average, review_count FROM tours WHERE tour_id = 1;
```

### Email không gửi?
```javascript
// Check email service
const emailService = require('./utils/emailService');
emailService.testConnection();
```

### Upload lỗi?
```powershell
# Check uploads folder tồn tại
ls d:\Website_du_lich-main\backend\uploads

# Nếu không có, tạo thủ công
mkdir d:\Website_du_lich-main\backend\uploads
```

### Admin panel không load?
- Kiểm tra đã login với admin account chưa
- Check console (F12) xem có lỗi JS không
- Verify role trong localStorage: `JSON.parse(localStorage.getItem('userData')).role`

---

## ✅ TEST COMPLETION CHECKLIST

- [ ] Review system hoạt động (create, view, update, delete)
- [ ] File upload thành công (avatar, review images)
- [ ] Email gửi đúng khi booking/payment/cancel
- [ ] Admin panel hiển thị stats đúng
- [ ] Payment flow tự động confirm với online methods
- [ ] Images serve được qua /uploads/* endpoint
- [ ] Tất cả API endpoints trả về đúng response
- [ ] Frontend không có lỗi trong console
- [ ] Database triggers hoạt động (rating auto-update)

**Nếu tất cả pass → Website hoàn chỉnh 95%!** 🎉
