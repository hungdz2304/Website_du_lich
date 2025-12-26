-- ============================================
-- Online Tour Booking Website - Database Schema
-- Inspired by iVivu.com
-- Database: MySQL 8.0+
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS tour_booking_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE tour_booking_db;

-- ============================================
-- Table: users
-- Stores user account information
-- ============================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    avatar_url VARCHAR(500),
    role ENUM('customer', 'admin') DEFAULT 'customer',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: destinations
-- Stores tour destinations (e.g., Phu Quoc, Da Lat)
-- ============================================
CREATE TABLE destinations (
    destination_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    country VARCHAR(100) DEFAULT 'Vietnam',
    region VARCHAR(100),
    image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_featured (is_featured),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: tours
-- Main table storing tour information
-- ============================================
CREATE TABLE tours (
    tour_id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    itinerary TEXT,
    duration_days INT NOT NULL,
    duration_nights INT NOT NULL,
    
    -- Pricing
    price_adult DECIMAL(10, 2) NOT NULL,
    price_child DECIMAL(10, 2),
    price_infant DECIMAL(10, 2),
    original_price DECIMAL(10, 2),
    discount_percentage INT DEFAULT 0,
    
    -- Images
    cover_image_url VARCHAR(500),
    image_gallery JSON,
    
    -- Tour details
    departure_location VARCHAR(255),
    transportation VARCHAR(100),
    hotel_rating INT,
    max_participants INT,
    min_participants INT DEFAULT 1,
    
    -- Inclusions/Exclusions
    inclusions JSON,
    exclusions JSON,
    
    -- Status and features
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    status ENUM('active', 'inactive', 'soldout', 'upcoming') DEFAULT 'active',
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords VARCHAR(500),
    
    -- Statistics
    view_count INT DEFAULT 0,
    booking_count INT DEFAULT 0,
    rating_average DECIMAL(3, 2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE CASCADE,
    INDEX idx_destination (destination_id),
    INDEX idx_slug (slug),
    INDEX idx_featured (is_featured),
    INDEX idx_status (status),
    INDEX idx_price (price_adult),
    INDEX idx_rating (rating_average)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: tour_schedules
-- Stores available departure dates for tours
-- ============================================
CREATE TABLE tour_schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,
    departure_date DATE NOT NULL,
    return_date DATE NOT NULL,
    available_slots INT NOT NULL,
    booked_slots INT DEFAULT 0,
    price_adult DECIMAL(10, 2),
    price_child DECIMAL(10, 2),
    price_infant DECIMAL(10, 2),
    status ENUM('available', 'soldout', 'cancelled') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id) ON DELETE CASCADE,
    INDEX idx_tour (tour_id),
    INDEX idx_departure_date (departure_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: bookings
-- Stores tour booking information
-- ============================================
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tour_id INT NOT NULL,
    schedule_id INT,
    
    -- Booking reference
    booking_reference VARCHAR(50) NOT NULL UNIQUE,
    
    -- Participant details
    num_adults INT NOT NULL DEFAULT 1,
    num_children INT DEFAULT 0,
    num_infants INT DEFAULT 0,
    
    -- Contact information
    contact_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    
    -- Pricing
    total_price DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2),
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    final_price DECIMAL(10, 2) NOT NULL,
    
    -- Payment
    payment_method ENUM('bank_transfer', 'bank_card', 'momo', 'apple_pay', 'credit_card', 'cash', 'other') DEFAULT 'bank_transfer',
    payment_status ENUM('pending', 'paid', 'partial', 'refunded', 'cancelled') DEFAULT 'pending',
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,
    payment_date TIMESTAMP NULL,
    
    -- Booking status
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    
    -- Additional information
    special_requests TEXT,
    notes TEXT,
    
    -- Timestamps
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES tour_schedules(schedule_id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_tour (tour_id),
    INDEX idx_booking_reference (booking_reference),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_booking_date (booking_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: reviews
-- Stores user reviews and ratings for tours
-- ============================================
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,
    user_id INT NOT NULL,
    booking_id INT,
    
    -- Rating (1-5 stars)
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    
    -- Review content
    title VARCHAR(255),
    comment TEXT,
    
    -- Detailed ratings
    rating_service INT CHECK (rating_service >= 1 AND rating_service <= 5),
    rating_location INT CHECK (rating_location >= 1 AND rating_location <= 5),
    rating_price INT CHECK (rating_price >= 1 AND rating_price <= 5),
    rating_food INT CHECK (rating_food >= 1 AND rating_food <= 5),
    
    -- Images
    images JSON,
    
    -- Status
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    
    -- Helpful votes
    helpful_count INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_tour_booking (user_id, tour_id, booking_id),
    INDEX idx_tour (tour_id),
    INDEX idx_user (user_id),
    INDEX idx_rating (rating),
    INDEX idx_approved (is_approved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: categories
-- Tour categories (e.g., Beach, Mountain, Culture)
-- ============================================
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: tour_categories
-- Many-to-many relationship between tours and categories
-- ============================================
CREATE TABLE tour_categories (
    tour_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (tour_id, category_id),
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: favorites
-- User's favorite/wishlist tours
-- ============================================
CREATE TABLE favorites (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tour_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_tour (user_id, tour_id),
    INDEX idx_user (user_id),
    INDEX idx_tour (tour_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: custom_components
-- Building blocks for custom tours
-- ============================================
CREATE TABLE custom_components (
    component_id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NULL,
    type ENUM('hotel', 'transport', 'activity', 'meal') NOT NULL,
    name VARCHAR(255) NOT NULL,
    price_per_person DECIMAL(10, 2) DEFAULT NULL,
    price_per_day DECIMAL(10, 2) DEFAULT NULL,
    star_rating INT DEFAULT NULL,
    is_optional BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_destination (destination_id),
    INDEX idx_type (type),
    INDEX idx_star (star_rating),
    FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Triggers to update tour statistics
-- ============================================

-- Trigger to update tour rating when a review is added
DELIMITER $$
CREATE TRIGGER after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE tours
    SET 
        rating_average = (
            SELECT AVG(rating) 
            FROM reviews 
            WHERE tour_id = NEW.tour_id AND is_approved = TRUE
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE tour_id = NEW.tour_id AND is_approved = TRUE
        )
    WHERE tour_id = NEW.tour_id;
END$$
DELIMITER ;

-- Trigger to update tour rating when a review is updated
DELIMITER $$
CREATE TRIGGER after_review_update
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    UPDATE tours
    SET 
        rating_average = (
            SELECT AVG(rating) 
            FROM reviews 
            WHERE tour_id = NEW.tour_id AND is_approved = TRUE
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE tour_id = NEW.tour_id AND is_approved = TRUE
        )
    WHERE tour_id = NEW.tour_id;
END$$
DELIMITER ;

-- Trigger to update tour booking count
DELIMITER $$
CREATE TRIGGER after_booking_insert
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' THEN
        UPDATE tours
        SET booking_count = booking_count + 1
        WHERE tour_id = NEW.tour_id;
        
        -- Update schedule booked slots
        IF NEW.schedule_id IS NOT NULL THEN
            UPDATE tour_schedules
            SET booked_slots = booked_slots + (NEW.num_adults + NEW.num_children)
            WHERE schedule_id = NEW.schedule_id;
        END IF;
    END IF;
END$$
DELIMITER ;

-- ============================================
-- Create indexes for better performance
-- ============================================

-- Full-text search index for tours
ALTER TABLE tours ADD FULLTEXT INDEX ft_tour_search (title, description, itinerary);

-- Full-text search index for destinations
ALTER TABLE destinations ADD FULLTEXT INDEX ft_destination_search (name, description);

-- ============================================
-- End of Schema
-- ============================================
