# Online Tour Booking Website

A full-stack tour booking website inspired by iVivu.com

## Technology Stack
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js with Express.js
- **Database**: MySQL

## Project Structure
```
Website_du_lich-main/
│
├── backend/                    # Backend Node.js application
│   ├── config/                 # Configuration files
│   │   └── database.js         # MySQL connection configuration
│   ├── controllers/            # Route controllers
│   │   ├── authController.js
│   │   ├── tourController.js
│   │   ├── bookingController.js
│   │   └── destinationController.js
│   ├── middleware/             # Custom middleware
│   │   └── authMiddleware.js   # JWT authentication
│   ├── models/                 # Database models/queries
│   │   ├── User.js
│   │   ├── Tour.js
│   │   ├── Booking.js
│   │   ├── Destination.js
│   │   └── Review.js
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js
│   │   ├── tourRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── destinationRoutes.js
│   ├── utils/                  # Utility functions
│   │   └── validators.js
│   ├── .env                    # Environment variables
│   ├── server.js               # Main server file
│   └── package.json
│
├── frontend/                   # Frontend files
│   ├── assets/                 # Static assets
│   │   ├── css/
│   │   │   ├── style.css       # Main stylesheet
│   │   │   ├── home.css
│   │   │   ├── tour-detail.css
│   │   │   └── tour-list.css
│   │   ├── js/
│   │   │   ├── main.js         # Main JS file
│   │   │   ├── home.js
│   │   │   ├── tour-detail.js
│   │   │   ├── tour-list.js
│   │   │   └── auth.js
│   │   └── images/             # Image files
│   │       ├── tours/
│   │       ├── destinations/
│   │       └── icons/
│   ├── pages/
│   │   ├── index.html          # Homepage
│   │   ├── tour-detail.html    # Tour detail page
│   │   ├── tour-list.html      # Search results page
│   │   ├── login.html          # Login page
│   │   ├── register.html       # Register page
│   │   └── my-bookings.html    # User booking history
│   └── components/             # Reusable HTML components
│
├── database/                   # Database files
│   ├── schema.sql              # Database schema (DDL)
│   └── seed.sql                # Sample data
│
└── package.json                # Root package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation
See setup instructions in the documentation.
