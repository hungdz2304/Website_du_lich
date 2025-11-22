# 🚀 Quick Reference Guide

## 📁 Project Files Created

### Backend Files ✅
- `backend/package.json` - Node.js dependencies
- `backend/.env` - Environment configuration
- `backend/server.js` - Express server
- `backend/config/database.js` - MySQL connection

### Database Files ✅
- `database/schema.sql` - Complete database schema (9 tables)
- `database/seed.sql` - Sample data (8 destinations, 6 tours)

### Documentation Files ✅
- `README.md` - Project overview
- `SETUP_GUIDE.md` - Detailed setup instructions
- `PARTS_1_2_SUMMARY.md` - Complete summary of Parts 1 & 2

---

## ⚡ Quick Start Commands

### 1. Install Backend Dependencies
```powershell
cd backend
npm install
```

### 2. Configure Database Connection
```powershell
notepad .env
```
Edit these lines:
```env
DB_PASSWORD=your_mysql_password_here
DB_NAME=tour_booking_db
```

### 3. Create Database
```powershell
mysql -u root -p < ../database/schema.sql
```
Or use MySQL Workbench to execute `schema.sql`

### 4. (Optional) Add Sample Data
```powershell
mysql -u root -p < ../database/seed.sql
```

### 5. Start Backend Server
```powershell
npm run dev
```
Server runs at: http://localhost:3000

### 6. Test API
Open browser: http://localhost:3000/api/health

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts (customers & admins) |
| `destinations` | Tour destinations (Phú Quốc, Đà Lạt, etc.) |
| `tours` | Main tour information |
| `tour_schedules` | Departure dates & availability |
| `bookings` | Tour reservations |
| `reviews` | User ratings & reviews |
| `categories` | Tour categories (Beach, Mountain, etc.) |
| `tour_categories` | Tour-Category relationships |
| `favorites` | User wishlists |

---

## 🔧 Technology Stack

### Backend
- **Framework:** Node.js + Express.js
- **Database:** MySQL 8.0+
- **Authentication:** JWT (JSON Web Tokens)
- **Password:** bcryptjs hashing
- **Validation:** express-validator

### Frontend (To be built in Part 4)
- **HTML5** - Structure
- **CSS3** - Styling (inspired by iVivu.com)
- **JavaScript** - Interactivity (Vanilla JS, no frameworks)

---

## 📊 Database Schema Highlights

### Tours Table Features
```sql
✓ Multiple pricing (adult/child/infant)
✓ Discount percentage
✓ Image galleries (JSON)
✓ Tour inclusions/exclusions (JSON)
✓ SEO fields (meta tags)
✓ Auto-updating ratings
✓ View counts & booking stats
✓ Featured flag for homepage
```

### Bookings Table Features
```sql
✓ Unique booking reference
✓ Multiple payment methods
✓ Payment status tracking
✓ Deposit support
✓ Special requests
✓ Status workflow (pending → confirmed → completed)
```

### Reviews Table Features
```sql
✓ Overall rating (1-5)
✓ Detailed ratings (service, location, price, food)
✓ Review images (JSON)
✓ Verified reviews
✓ Helpful voting system
```

---

## 🎯 API Endpoints (To be built in Part 3)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Tours
- `GET /api/tours` - Get all tours (with filters)
- `GET /api/tours/featured` - Featured tours
- `GET /api/tours/:id` - Tour details

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-history` - User's bookings

### Destinations
- `GET /api/destinations` - All destinations

---

## 🎨 Frontend Pages (To be built in Part 4)

### 1. Homepage (index.html)
- Search bar (like iVivu)
- Featured tours grid
- Top destinations grid
- Promotional banners

### 2. Tour Detail Page (tour-detail.html)
- Image slider
- Tour information
- Booking box (price, dates, book button)
- Reviews section

### 3. Tour List Page (tour-list.html)
- Filter sidebar (price, destination, date)
- Search results grid
- Sorting options

### 4. Additional Pages
- Login/Register
- My Bookings
- User Profile

---

## 📝 Environment Variables (.env)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tour_booking_db
DB_PORT=3306

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:5500
```

---

## 🐛 Troubleshooting

### Database connection failed?
```powershell
# Check MySQL service is running
Get-Service MySQL*

# Test connection
mysql -u root -p
```

### Port 3000 already in use?
Change PORT in `.env` file to 3001 or higher

### npm install fails?
```powershell
# Clear cache
npm cache clean --force

# Delete node_modules
Remove-Item -Recurse -Force node_modules

# Reinstall
npm install
```

---

## 📚 Useful MySQL Commands

```sql
-- Show all databases
SHOW DATABASES;

-- Use tour database
USE tour_booking_db;

-- Show all tables
SHOW TABLES;

-- View table structure
DESCRIBE tours;

-- Count records
SELECT COUNT(*) FROM tours;

-- View sample tours
SELECT tour_id, title, price_adult FROM tours LIMIT 5;

-- View destinations
SELECT * FROM destinations;

-- Check triggers
SHOW TRIGGERS;
```

---

## 🔐 Security Notes

### Production Checklist (Before deployment):
- [ ] Change JWT_SECRET to strong random string
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Enable SQL injection protection (parameterized queries)
- [ ] Add CORS whitelist
- [ ] Use helmet.js for security headers
- [ ] Implement password strength requirements
- [ ] Add email verification
- [ ] Enable 2FA (optional)

---

## 📖 Documentation Links

- **MySQL Docs:** https://dev.mysql.com/doc/
- **Express.js:** https://expressjs.com/
- **Node.js:** https://nodejs.org/en/docs/
- **JWT:** https://jwt.io/introduction
- **iVivu.com:** https://www.ivivu.com/du-lich/ (UI inspiration)

---

## ✅ Completed Checklist

### Part 1: Setup & Structure
- [x] MySQL recommendation
- [x] Directory structure
- [x] Backend initialization
- [x] package.json configuration
- [x] Environment variables
- [x] Database connection

### Part 2: Database Schema
- [x] Users table
- [x] Destinations table
- [x] Tours table
- [x] Tour schedules table
- [x] Bookings table
- [x] Reviews table
- [x] Categories tables
- [x] Favorites table
- [x] Triggers for auto-updates
- [x] Indexes for performance
- [x] Sample data

### Part 3: API Endpoints (Next)
- [ ] Auth routes
- [ ] Tour routes
- [ ] Booking routes
- [ ] Destination routes
- [ ] Review routes

### Part 4: Frontend (Next)
- [ ] Homepage design
- [ ] Tour detail page
- [ ] Tour list page
- [ ] Authentication pages
- [ ] CSS styling (iVivu-inspired)

---

## 🎉 You're Ready!

Everything is set up for Parts 1 & 2. When ready, ask for:
- **Part 3:** API Endpoints implementation
- **Part 4:** Frontend HTML/CSS/JS code

---

**Need Help?** Check:
1. `SETUP_GUIDE.md` - Detailed setup
2. `PARTS_1_2_SUMMARY.md` - Complete summary
3. `database/schema.sql` - Database structure
4. `database/seed.sql` - Sample data
