# 🔧 FIX ADMIN PANEL

## ✅ Các bước để vào Admin Panel:

### Bước 1: Login với Admin Account
```
URL: http://127.0.0.1:5500/login.html
```

Credentials:
- Email: `admin@toursite.com`
- Password: `password123`

### Bước 2: Truy cập Admin Panel

**Đường dẫn đúng:**
```
http://127.0.0.1:5500/admin/index.html
```

**KHÔNG DÙNG:**
- ❌ http://127.0.0.1:5500/admin (thiếu /index.html)
- ❌ http://localhost:5500/admin/index.html (nếu đang dùng 127.0.0.1)

### Bước 3: Kiểm tra Authentication

Nếu trang redirect về login hoặc homepage:
1. Mở Console (F12)
2. Chạy lệnh:
```javascript
console.log(localStorage.getItem('userData'));
```

Phải thấy:
```json
{
  "user_id": 1,
  "email": "admin@toursite.com",
  "full_name": "Admin User",
  "role": "admin"
}
```

Nếu `role` KHÔNG phải `"admin"`:
- Logout
- Login lại bằng `admin@toursite.com`

---

## 🐛 Troubleshooting

### Lỗi 404 Not Found

**Nguyên nhân:** Đường dẫn file sai

**Giải pháp:**
1. Kiểm tra file tồn tại:
```powershell
ls d:\Website_du_lich-main\frontend\pages\admin\index.html
```

2. Dùng đúng URL:
```
http://127.0.0.1:5500/admin/index.html
```

### Redirect về Homepage

**Nguyên nhân:** Không phải admin role

**Giải pháp:**
1. Check localStorage:
```javascript
JSON.parse(localStorage.getItem('userData')).role
```

2. Nếu không phải "admin":
   - Logout
   - Login: `admin@toursite.com` / `password123`

### Trang trắng / Không load

**Nguyên nhân:** JavaScript error hoặc API fail

**Giải pháp:**
1. Mở Console (F12) xem lỗi
2. Check backend đang chạy:
```powershell
Get-Process -Name node
```

3. Nếu backend không chạy:
```powershell
cd d:\Website_du_lich-main\backend
npm run dev
```

---

## ✅ Test Admin Panel

Sau khi vào được admin panel, check:

1. **Stats Cards hiển thị:**
   - [ ] Total Bookings
   - [ ] Total Users (có thể là "---")
   - [ ] Total Tours
   - [ ] Total Revenue

2. **Recent Bookings Table:**
   - [ ] Hiển thị danh sách bookings
   - [ ] Hoặc "Chưa có booking nào"

3. **Sidebar Navigation:**
   - [ ] Dashboard (active)
   - [ ] Quản lý Tours
   - [ ] Quản lý Bookings
   - [ ] Quản lý Users
   - [ ] Quản lý Reviews
   - [ ] Về Website

4. **Logout Button:**
   - [ ] Click logout → Confirm → Redirect về homepage

---

## 🎯 Quick Access Links

Sau khi login admin:

```
Dashboard: http://127.0.0.1:5500/admin/index.html
```

Hoặc click vào user menu → "🛡️ Quản trị"

---

## 📝 Note

Các trang CRUD khác (tours.html, bookings.html, users.html, reviews.html) chưa được tạo.

Hiện tại chỉ có Dashboard hoạt động.
