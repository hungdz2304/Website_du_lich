# Setup Guide - Online Tour Booking Website

## Part 1: Setup & Project Structure

### 1. Database Choice: MySQL ✅

**Recommended: MySQL**

**Reasons:**
1. **Ease of Use**: Simple installation and configuration, especially on Windows
2. **Performance**: Excellent for read-heavy operations (browsing tours, viewing details)
3. **Wide Adoption**: Better hosting support and larger community
4. **Sufficient Features**: All necessary features for this project (relationships, transactions, JSON support)
5. **Cost-Effective**: Free and open-source with good documentation

**When PostgreSQL would be better:**
- Advanced full-text search requirements
- Complex geospatial queries
- Heavy JSON operations
- Need for advanced data types

For this tour booking website, MySQL is the perfect choice.

---

### 2. Directory Structure ✅

The complete project structure has been created in your workspace:

```
Website_du_lich-main/
│
├── backend/                    # Node.js Backend
│   ├── config/                 
│   │   └── database.js         # MySQL connection pool
│   ├── controllers/            # Business logic
│   │   ├── authController.js
│   │   ├── tourController.js
│   │   ├── bookingController.js
│   │   └── destinationController.js
│   ├── middleware/             
│   │   └── authMiddleware.js   # JWT authentication
│   ├── models/                 # Database queries
│   │   ├── User.js
│   │   ├── Tour.js
│   │   ├── Booking.js
│   │   ├── Destination.js
│   │   └── Review.js
│   ├── routes/                 # API endpoints
│   │   ├── authRoutes.js
│   │   ├── tourRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── destinationRoutes.js
│   ├── utils/                  
│   │   └── validators.js
│   ├── .env                    # Environment variables
│   ├── server.js               # Main entry point
│   └── package.json
│
├── frontend/                   # Frontend (HTML/CSS/JS)
│   ├── assets/
│   │   ├── css/                # Stylesheets
│   │   ├── js/                 # JavaScript files
│   │   └── images/             # Images
│   ├── pages/                  # HTML pages
│   │   ├── index.html          # Homepage
│   │   ├── tour-detail.html
│   │   ├── tour-list.html
│   │   ├── login.html
│   │   └── register.html
│   └── components/             # Reusable components
│
├── database/                   
│   ├── schema.sql              # Database schema (created ✅)
│   └── seed.sql                # Sample data
│
└── README.md
```

---

### 3. Backend Setup Steps

#### Step 1: Install Node.js
1. Download Node.js from https://nodejs.org/ (LTS version recommended)
2. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

#### Step 2: Initialize Backend
Navigate to the backend folder and install dependencies:

```powershell
cd backend
npm install
```

**Packages installed:**
- `express` - Web framework
- `mysql2` - MySQL driver with Promise support
- `dotenv` - Environment variable management
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-Origin Resource Sharing
- `express-validator` - Input validation
- `nodemon` - Auto-restart server during development

#### Step 3: Configure Environment Variables
Edit the `.env` file in the `backend/` folder:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=tour_booking_db
DB_PORT=3306

# Server Configuration
PORT=3000

# JWT Secret
JWT_SECRET=change_this_to_random_string
```

#### Step 4: Run the Backend Server

**Development mode (with auto-reload):**
```powershell
npm run dev
```

**Production mode:**
```powershell
npm start
```

You should see:
```
🚀 Server is running on port 3000
✅ Database connected successfully!
```

---

## Part 2: Database Design (SQL Schema)

### Database Schema Overview ✅

The complete SQL schema has been created in `database/schema.sql`. Here's what it includes:

#### Core Tables:

1. **users** - User account information
   - Fields: email, password_hash, full_name, phone, role (customer/admin)
   - Supports user authentication and profile management

2. **destinations** - Tour destinations (Phú Quốc, Đà Lạt, etc.)
   - Fields: name, slug, description, image_url, is_featured
   - Used for filtering tours by location

3. **tours** - Main tour information (like iVivu)
   - Fields: title, description, itinerary, price, cover_image, rating
   - Includes pricing (adult/child/infant), images, inclusions/exclusions
   - JSON fields for image galleries and tour details
   - SEO fields (meta_title, meta_description)
   - Statistics (view_count, booking_count, rating_average)

4. **tour_schedules** - Available departure dates
   - Fields: departure_date, return_date, available_slots, booked_slots
   - Allows dynamic pricing per schedule

5. **bookings** - Tour reservations
   - Fields: booking_reference, contact info, pricing, payment details
   - Tracks booking status (pending, confirmed, cancelled)
   - Payment tracking (pending, paid, refunded)

6. **reviews** - User reviews and ratings
   - Fields: rating (1-5), comment, detailed ratings (service, location, price, food)
   - Verified reviews from actual bookings
   - Includes helpful_count for community voting

#### Additional Tables:

7. **categories** - Tour categories (Beach, Mountain, Culture, etc.)
8. **tour_categories** - Many-to-many relationship
9. **favorites** - User wishlist/favorites

#### Features:
- ✅ Auto-updating tour ratings via triggers
- ✅ Full-text search on tours and destinations
- ✅ Proper indexing for performance
- ✅ Foreign key constraints for data integrity
- ✅ JSON support for flexible data (images, inclusions)

---

### Installing the Database

#### Step 1: Install MySQL
1. Download MySQL from https://dev.mysql.com/downloads/mysql/
2. Install MySQL Workbench (GUI tool)
3. During installation, set root password

#### Step 2: Create Database
Open MySQL Workbench or command line and run:

```powershell
mysql -u root -p
```

Then execute the schema file:
```sql
source D:/Website_du_lich-main/database/schema.sql
```

Or copy-paste the contents of `database/schema.sql` into MySQL Workbench and execute.

#### Step 3: Verify Database
```sql
USE tour_booking_db;
SHOW TABLES;
```

You should see:
- users
- destinations
- tours
- tour_schedules
- bookings
- reviews
- categories
- tour_categories
- favorites

---

## Next Steps

✅ **Part 1 Complete**: Project structure created, backend initialized
✅ **Part 2 Complete**: Database schema designed and ready to use

**Ready for Part 3**: API Endpoints Design
**Ready for Part 4**: Frontend Development (HTML/CSS/JS inspired by iVivu)

---

## Quick Start Commands

```powershell
# Install backend dependencies
cd backend
npm install

# Configure .env file (edit with your MySQL password)
notepad .env

# Install database schema
mysql -u root -p < ../database/schema.sql

# Start backend server
npm run dev

# Backend will run at: http://localhost:3000
# Test health check: http://localhost:3000/api/health
```

---

## Troubleshooting

**Database connection failed?**
- Check MySQL service is running
- Verify credentials in `.env` file
- Ensure database `tour_booking_db` exists

**Port already in use?**
- Change PORT in `.env` file
- Kill process using port 3000

**Module not found?**
- Run `npm install` in backend folder
- Delete `node_modules` and run `npm install` again
