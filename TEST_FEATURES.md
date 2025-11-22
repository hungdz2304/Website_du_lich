# ✅ HƯỚNG DẪN TEST CÁC TÍNH NĂNG MỚI

## 🚀 Bước 1: Kiểm tra Backend đang chạy

Backend đã được khởi động trên **port 3000**

Kiểm tra:
```
http://localhost:3000/api/health
```

Nếu thấy response JSON → Backend OK ✅

---

## 🔐 Bước 2: Login vào Website

### Mở trình duyệt:
```
http://localhost:5500/login.html
```

### Tài khoản test (có sẵn trong database):

**Customer (Khách hàng):**
- Email: `customer@example.com`
- Password: `password123`

**Admin (Quản trị viên):**
- Email: `admin@toursite.com`
- Password: `password123`

---

## ⭐ Bước 3: Test REVIEW SYSTEM

### 3.1. Vào trang chi tiết tour:
```
http://localhost:5500/tour-detail.html?id=1
```

### 3.2. Nhấn nút "Viết đánh giá"
- Modal sẽ hiện ra
- Click vào sao để chọn rating (1-5 sao)
- Nhập tiêu đề (optional)
- Nhập nội dung đánh giá
- Đánh giá chi tiết (Dịch vụ, Địa điểm, Giá cả, Ẩm thực) - optional
- Click "Gửi đánh giá"

### 3.3. Kết quả mong đợi:
✅ Toast thông báo "Đánh giá thành công!"
✅ Modal đóng lại
✅ Review xuất hiện trong danh sách review
✅ Rating tổng của tour được cập nhật

### Nếu có lỗi:
- Mở Console (F12) → Tab Console
- Mở Network tab xem API response
- Copy error message

---

## 📸 Bước 4: Test FILE UPLOAD (Avatar)

### 4.1. Vào trang Profile:
```
http://localhost:5500/profile.html
```

### 4.2. Upload ảnh đại diện:
- Click "Đổi ảnh đại diện"
- Chọn 1 file ảnh (JPG, PNG, GIF)
- File phải < 5MB

### 4.3. Kết quả:
✅ Toast "Cập nhật ảnh đại diện thành công!"
✅ Ảnh hiển thị ngay lập tức
✅ File lưu trong `backend/uploads/`

### Kiểm tra file đã upload:
```powershell
ls d:\Website_du_lich-main\Website_du_lich-main\backend\uploads
```

Hoặc truy cập trực tiếp:
```
http://localhost:3000/uploads/avatar-1234567890.jpg
```
(Thay tên file thật)

---

## 👨‍💼 Bước 5: Test ADMIN PANEL

### 5.1. Logout và login lại bằng admin:
- Email: `admin@toursite.com`
- Password: `password123`

### 5.2. Xem link "Quản trị" trong User Menu:
- Click vào avatar góc phải
- Sẽ thấy link "🛡️ Quản trị" (chỉ admin mới thấy)

### 5.3. Vào Admin Dashboard:
```
http://localhost:5500/admin/index.html
```

### 5.4. Kết quả:
✅ Dashboard hiển thị 4 stats cards:
  - Total Bookings
  - Total Users
  - Total Tours
  - Total Revenue

✅ Bảng "Recent Bookings"
✅ Sidebar navigation

### Nếu login bằng customer vào /admin/:
❌ Sẽ redirect về homepage với alert "Không có quyền truy cập"

---

## 📧 Bước 6: Test EMAIL NOTIFICATIONS

### ⚠️ LƯU Ý: Email chỉ hoạt động khi đã cấu hình SMTP

Nếu chưa setup email (bỏ qua bước này):
- Email sẽ không gửi NHƯNG booking vẫn tạo thành công
- Check console backend sẽ thấy: "Email service not configured"

### Setup Email (Optional):

1. **Tạo Gmail App Password:**
   - Vào https://myaccount.google.com/security
   - Bật 2-Step Verification
   - Tìm "App passwords"
   - Tạo password cho "Mail"
   - Copy 16 ký tự

2. **Cập nhật `.env`:**
```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-digit-app-password
```

3. **Restart backend:**
```powershell
# Stop Node process
Stop-Process -Name node -Force

# Start lại
cd d:\Website_du_lich-main\Website_du_lich-main\backend
npm run dev
```

### Test gửi email:

1. **Đặt tour mới:**
   - Vào tour detail → Đặt tour
   - Nhập email của bạn
   - Submit

2. **Kiểm tra inbox:**
   - Email "Xác nhận đặt tour" sẽ được gửi
   - Email có booking reference, tour info, giá

---

## 🎯 CHECKLIST HOÀN THÀNH

Sau khi test, đánh dấu ✅:

- [ ] Backend chạy thành công (http://localhost:3000)
- [ ] Login thành công với customer account
- [ ] Nút "Viết đánh giá" hiện ra trên tour detail
- [ ] Modal review mở được khi click nút
- [ ] Click sao để chọn rating hoạt động
- [ ] Submit review thành công
- [ ] Review hiển thị trong danh sách
- [ ] Upload avatar thành công
- [ ] Ảnh hiển thị ngay sau upload
- [ ] File lưu trong backend/uploads/
- [ ] Login admin → thấy link "Quản trị" trong menu
- [ ] Admin dashboard hiển thị đúng stats
- [ ] Customer không vào được /admin/
- [ ] (Optional) Email gửi thành công sau booking

---

## 🐛 TROUBLESHOOTING

### Lỗi: "Cannot POST /api/reviews"
→ Backend chưa chạy hoặc route chưa được import
→ Restart backend

### Lỗi: "Unauthorized" khi submit review
→ Token hết hạn
→ Logout và login lại

### Review không hiển thị
→ Mở Console (F12), xem API response
→ Check database: `SELECT * FROM reviews WHERE tour_id = 1;`

### Upload ảnh báo lỗi
→ Check file size < 5MB
→ Check file type là image
→ Check folder `backend/uploads` có tồn tại không

### Admin panel blank
→ Check console có lỗi JavaScript không
→ Verify đã login bằng admin account
→ Check `localStorage.getItem('userData')` có role = 'admin'

### Email không gửi
→ Email service cần SMTP config (optional)
→ Booking vẫn hoạt động bình thường nếu không có SMTP
→ Xem backend console log

---

## 📱 TEST TRÊN MOBILE

1. Tìm IP máy tính:
```powershell
ipconfig
```

2. Trên điện thoại (cùng WiFi):
```
http://YOUR_IP:5500/tour-detail.html?id=1
```

3. Test responsive design của modal review

---

## 🎉 TẤT CẢ TÍNH NĂNG HOẠT ĐỘNG!

Nếu tất cả test pass, bạn có:
- ✅ Review system hoàn chỉnh
- ✅ File upload cho avatar
- ✅ Email notifications (nếu có SMTP)
- ✅ Admin panel với stats
- ✅ Admin navigation links

**Website đã hoàn thiện 95%!** 🚀
