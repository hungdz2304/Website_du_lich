# 🔧 KHẮC PHỤC LỖI "Access denied for user 'root'@'localhost'"

## ❌ Lỗi đang gặp:
```
[schema] Unable to verify/alter payment_method enum: Access denied for user 'root'@'localhost' (using password: YES)
```

## ✅ GIẢI PHÁP - THỰC HIỆN TỪNG BƯỚC

### CÁCH 1: Import Database trong MySQL Workbench (KHUYẾN NGHỊ)

#### Bước 1: Mở MySQL Workbench
1. Mở **MySQL Workbench**
2. Click vào connection (thường là `localhost`)
3. Nhập password: `123456` (theo file .env của bạn)

#### Bước 2: Tạo Database thủ công
Trong SQL Editor, chạy lần lượt:

```sql
-- Tạo database
CREATE DATABASE IF NOT EXISTS tour_booking_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Sử dụng database
USE tour_booking_db;
```

Click Execute (⚡ icon) hoặc nhấn `Ctrl+Shift+Enter`

#### Bước 3: Import Schema
1. **File** → **Open SQL Script**
2. Chọn file: `d:\Website_du_lich-main\Website_du_lich-main\database\schema.sql`
3. Click **Execute** (⚡)
4. Đợi chạy xong (khoảng 10-20 giây)

#### Bước 4: Import Dữ Liệu Mẫu
1. **File** → **Open SQL Script**
2. Chọn file: `d:\Website_du_lich-main\Website_du_lich-main\database\seed.sql`
3. Click **Execute** (⚡)

#### Bước 5: Kiểm Tra
```sql
USE tour_booking_db;
SHOW TABLES;
SELECT COUNT(*) FROM tours;
SELECT COUNT(*) FROM destinations;
```

Bạn sẽ thấy:
- 9 tables
- 6 tours
- 8 destinations

---

### CÁCH 2: Fix Permission Error (Nếu vẫn lỗi)

#### Kiểm tra quyền của user root:
```sql
-- Kiểm tra quyền hiện tại
SHOW GRANTS FOR 'root'@'localhost';

-- Cấp đủ quyền (chạy với user có quyền GRANT)
GRANT ALL PRIVILEGES ON tour_booking_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

---

### CÁCH 3: Tắt Schema Sync trong Server (Tạm thời)

Nếu vẫn gặp lỗi permission, tạm thời tắt auto schema sync:

**Trong file `backend/server.js`:**

Tìm dòng:
```javascript
async function startServer() {
    if (process.env.SKIP_SCHEMA_SYNC !== 'true') {
        await ensureBookingPaymentColumn();
    }
```

Thêm vào `.env`:
```env
SKIP_SCHEMA_SYNC=true
```

Hoặc comment lại:
```javascript
async function startServer() {
    // Tạm thời tắt schema sync
    // await ensureBookingPaymentColumn();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
```

---

## 🚀 KHỞI ĐỘNG LẠI

### Bước 1: Stop Backend server hiện tại
Trong terminal đang chạy backend, nhấn `Ctrl+C`

### Bước 2: Restart Backend
```powershell
cd d:\Website_du_lich-main\Website_du_lich-main\backend
npm run dev
```

### Bước 3: Kiểm Tra Kết Nối
Bạn sẽ thấy:
```
🚀 Server is running on port 3000
📍 Environment: development
🌐 API available at: http://localhost:3000/api
✅ Database connected successfully!
```

**Không còn lỗi schema!**

---

## 📊 TEST DATABASE

### Trong MySQL Workbench:
```sql
USE tour_booking_db;

-- Xem tất cả tours
SELECT tour_id, title, price_adult FROM tours;

-- Xem destinations
SELECT destination_id, name, slug FROM destinations;

-- Xem users test
SELECT user_id, email, role FROM users;

-- Xem bookings
SELECT booking_id, booking_reference, status FROM bookings;
```

### Test API qua Browser:
```
http://localhost:3000/api/health
http://localhost:3000/api/tours/featured
http://localhost:3000/api/destinations
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] MySQL Workbench kết nối được với password `123456`
- [ ] Database `tour_booking_db` đã tồn tại
- [ ] Có đủ 9 tables
- [ ] Có dữ liệu tours, destinations, users
- [ ] Backend server chạy không lỗi
- [ ] API health endpoint trả về `status: OK`
- [ ] Frontend load được tours trên homepage

---

## 🆘 VẪN GẶP LỖI?

### Lỗi: Cannot connect to MySQL
**Giải pháp:**
```powershell
# Kiểm tra MySQL service
Get-Service MySQL*

# Start service nếu chưa chạy
Start-Service MySQL80
```

### Lỗi: Password incorrect
**Giải pháp:**
1. Reset password trong MySQL Workbench
2. Hoặc đổi password trong `.env` cho khớp

### Lỗi: Database not found
**Giải pháp:**
```sql
-- Trong MySQL Workbench
CREATE DATABASE tour_booking_db;
```

---

## 📞 SUPPORT

Nếu vẫn gặp vấn đề:
1. Chụp màn hình lỗi trong terminal
2. Chụp màn hình lỗi trong MySQL Workbench
3. Kiểm tra file `.env` có đúng password không
4. Kiểm tra MySQL service đang chạy

**Lưu ý quan trọng:**
- Password trong `.env` hiện tại là: `123456`
- Đảm bảo MySQL Workbench cũng dùng password này
- Nếu không khớp, đổi 1 trong 2 cho giống nhau
