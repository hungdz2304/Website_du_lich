# 🚀 QUICK START COMMANDS

## 📋 Complete Setup (First Time)

### 1. Install Backend Dependencies
```powershell
cd d:\Website_du_lich-main\backend
npm install
```

### 2. Configure Environment Variables
```powershell
# Edit the .env file
notepad .env

# Set your MySQL password:
# DB_PASSWORD=your_mysql_password_here
```

### 3. Create Database
```powershell
# Navigate to database folder
cd d:\Website_du_lich-main\database

# Create database and tables
mysql -u root -p < schema.sql

# Add sample data (optional but recommended)
mysql -u root -p < seed.sql
```

### 4. Start Backend Server
```powershell
cd d:\Website_du_lich-main\backend
npm run dev
```

**Expected Output:**
```
🚀 Server is running on port 3000
✅ Database connected successfully!
```

### 5. Start Frontend
```powershell
# Option 1: Use Live Server in VS Code
# Right-click on index.html -> "Open with Live Server"

# Option 2: Python HTTP Server
cd d:\Website_du_lich-main\frontend\pages
python -m http.server 5500

# Option 3: Node.js http-server
npx http-server d:\Website_du_lich-main\frontend\pages -p 5500
```

### 6. Test the Application
Open your browser:
- **Frontend:** http://localhost:5500
- **Backend API Health:** http://localhost:3000/api/health

---

## 🔄 Daily Development Commands

### Start Backend (every time)
```powershell
cd d:\Website_du_lich-main\backend
npm run dev
```

### Start Frontend (every time)
```powershell
# If using Live Server: Just open index.html and click "Go Live"

# If using Python:
cd d:\Website_du_lich-main\frontend\pages
python -m http.server 5500
```

---

## 🗄️ Database Commands

### Connect to MySQL
```powershell
mysql -u root -p
```

### Useful MySQL Commands
```sql
-- Show all databases
SHOW DATABASES;

-- Use your database
USE tour_booking_db;

-- Show all tables
SHOW TABLES;

-- View table structure
DESCRIBE tours;

-- Count tours
SELECT COUNT(*) FROM tours;

-- View sample tours
SELECT tour_id, title, price_adult FROM tours LIMIT 5;

-- View all destinations
SELECT * FROM destinations;

-- View bookings
SELECT * FROM bookings;

-- View users
SELECT user_id, email, full_name, role FROM users;
```

### Reset Database (if needed)
```powershell
# Drop and recreate
mysql -u root -p
```
```sql
DROP DATABASE IF EXISTS tour_booking_db;
exit
```
```powershell
# Recreate from schema
mysql -u root -p < d:\Website_du_lich-main\database\schema.sql
mysql -u root -p < d:\Website_du_lich-main\database\seed.sql
```

---

## 🧪 Testing Commands

### Test API with curl (PowerShell)

#### Health Check
```powershell
curl http://localhost:3000/api/health
```

#### Get Featured Tours
```powershell
curl http://localhost:3000/api/tours/featured
```

#### Get All Destinations
```powershell
curl http://localhost:3000/api/destinations
```

#### Register User (POST)
```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"password123\",\"full_name\":\"Test User\",\"phone\":\"0901234567\"}'
```

#### Login User
```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'
```

---

## 🛠️ Troubleshooting Commands

### Check if Backend is Running
```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000
```

### Kill Process on Port 3000
```powershell
# Find PID
netstat -ano | findstr :3000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Check MySQL Service
```powershell
# Check MySQL status
Get-Service MySQL*

# Start MySQL service
Start-Service MySQL80

# Stop MySQL service
Stop-Service MySQL80
```

### Clear npm Cache
```powershell
cd d:\Website_du_lich-main\backend
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 📦 NPM Commands

### Install Dependencies
```powershell
npm install
```

### Install Specific Package
```powershell
npm install package-name
```

### Update Dependencies
```powershell
npm update
```

### Check for Outdated Packages
```powershell
npm outdated
```

### Run in Development Mode
```powershell
npm run dev
```

### Run in Production Mode
```powershell
npm start
```

---

## 📁 File Navigation Commands

### Navigate to Backend
```powershell
cd d:\Website_du_lich-main\backend
```

### Navigate to Frontend
```powershell
cd d:\Website_du_lich-main\frontend
```

### Navigate to Database
```powershell
cd d:\Website_du_lich-main\database
```

### List Files
```powershell
# List all files
dir

# List with details
dir /s
```

### Open in VS Code
```powershell
# Open project in VS Code
code d:\Website_du_lich-main
```

---

## 🔍 View Logs

### Backend Logs
Backend logs appear in the terminal where you ran `npm run dev`

### Frontend Logs
Open browser DevTools (F12) and check:
- **Console** - JavaScript errors
- **Network** - API requests
- **Application** - LocalStorage (auth token)

---

## 🎯 Quick Test Sequence

```powershell
# Terminal 1: Start Backend
cd d:\Website_du_lich-main\backend
npm run dev

# Terminal 2: Test API
curl http://localhost:3000/api/health
curl http://localhost:3000/api/tours/featured
curl http://localhost:3000/api/destinations

# Terminal 3: Start Frontend (if using Python)
cd d:\Website_du_lich-main\frontend\pages
python -m http.server 5500

# Then open browser: http://localhost:5500
```

---

## 📊 Check Database Data

```sql
-- Connect to MySQL
USE tour_booking_db;

-- Count records
SELECT 
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM tours) as tours,
    (SELECT COUNT(*) FROM destinations) as destinations,
    (SELECT COUNT(*) FROM bookings) as bookings,
    (SELECT COUNT(*) FROM reviews) as reviews;

-- View featured tours
SELECT tour_id, title, price_adult, is_featured 
FROM tours 
WHERE is_featured = TRUE;

-- View recent bookings
SELECT b.booking_reference, u.email, t.title, b.status, b.booking_date
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN tours t ON b.tour_id = t.tour_id
ORDER BY b.booking_date DESC
LIMIT 10;
```

---

## 🚀 Production Deployment (Future)

### Build for Production
```powershell
# Set environment to production
# Edit .env:
# NODE_ENV=production

# Start with PM2 (install first: npm install -g pm2)
pm2 start server.js --name tour-booking-api
pm2 list
pm2 logs tour-booking-api
```

### Backup Database
```powershell
# Backup
mysqldump -u root -p tour_booking_db > backup.sql

# Restore
mysql -u root -p tour_booking_db < backup.sql
```

---

## 📝 Git Commands (if using version control)

```powershell
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Tour booking website complete"

# Add remote
git remote add origin https://github.com/yourusername/tour-booking.git

# Push to GitHub
git push -u origin main
```

---

## ✅ Daily Checklist

**Every time you work on the project:**

1. [ ] Start MySQL service (if not auto-start)
2. [ ] Start backend: `cd backend && npm run dev`
3. [ ] Start frontend: Open with Live Server or `python -m http.server 5500`
4. [ ] Test health: `http://localhost:3000/api/health`
5. [ ] Open browser: `http://localhost:5500`
6. [ ] Check console for errors (F12)

**Before committing changes:**

1. [ ] Test all modified features
2. [ ] Check for console errors
3. [ ] Verify API responses
4. [ ] Test on different screen sizes

---

## 🆘 Emergency Commands

### If Everything Breaks:

```powershell
# 1. Stop all servers (Ctrl+C in terminals)

# 2. Reset database
mysql -u root -p
DROP DATABASE tour_booking_db;
exit

# 3. Recreate database
mysql -u root -p < d:\Website_du_lich-main\database\schema.sql
mysql -u root -p < d:\Website_du_lich-main\database\seed.sql

# 4. Reinstall node modules
cd d:\Website_du_lich-main\backend
Remove-Item -Recurse -Force node_modules
npm install

# 5. Restart everything
npm run dev
```

---

## 📞 Support Resources

- **Project Documentation:** Check the `.md` files in the project root
- **Backend Logs:** Terminal where `npm run dev` is running
- **Frontend Logs:** Browser Console (F12)
- **Database:** MySQL Workbench for GUI interface

---

**Happy Coding! 🎉**
