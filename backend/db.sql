
CREATE DATABASE IF NOT EXISTS `tour`;
USE `tour`;

-- Users: holds admin, poster and finder users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin','poster','finder') NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tours: posted by a user (owner_id -> users.id)
CREATE TABLE IF NOT EXISTS `tours` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `owner_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) DEFAULT 0,
  `image_url` VARCHAR(500) DEFAULT '',
  `departure` VARCHAR(255) DEFAULT '',
  `spots` INT DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_tours_owner` (`owner_id`),
  INDEX `idx_tours_name` (`name`),
  CONSTRAINT `fk_tours_owner` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tags: simple tag list
CREATE TABLE IF NOT EXISTS `tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Many-to-many relationship between tours and tags
CREATE TABLE IF NOT EXISTS `tour_tags` (
  `tour_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`tour_id`,`tag_id`),
  INDEX `idx_tour_tags_tour` (`tour_id`),
  INDEX `idx_tour_tags_tag` (`tag_id`),
  CONSTRAINT `fk_tourtags_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tourtags_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Example seed data (replace password hashes with real bcrypt hashes or create users via the API)
-- Default image used for sample tours
SET @default_image = 'https://th.bing.com/th/id/R.6927eb085ee217c7f5ef74c70ec9357f?rik=qIHGDzAYsTjkrw&pid=ImgRaw&r=0';

-- Sample users: passwords are placeholders; prefer using /auth/register to create users
INSERT INTO `users` (`username`, `password`, `role`, `created_at`)
VALUES
  ('admin', '<bcrypt_hash_of_password>', 'admin', NOW()),
  ('poster1', '<bcrypt_hash_of_password>', 'poster', NOW()),
  ('finder1', '<bcrypt_hash_of_password>', 'finder', NOW());

-- Sample tags
INSERT INTO `tags` (`name`) VALUES ('beach'), ('adventure'), ('family');

-- Sample tours (owner_id = 2 -> poster1)
INSERT INTO `tours` (owner_id, name, description, price, image_url, departure, spots, created_at)
VALUES
  (2, 'Sunny Beach Escape', 'Relax on sandy beaches and enjoy local cuisine.', 199.99, @default_image, 'Hanoi', 20, NOW()),
  (2, 'Mountain Adventure', 'Multi-day hike with camping and guided climbs.', 299.99, @default_image, 'Sapa', 15, NOW());

-- Link tags to tours (assumes tags inserted above get ids 1..3)
INSERT INTO `tour_tags` (`tour_id`, `tag_id`) VALUES (1, 1), (1, 3), (2, 2);

-- Sample bill: finder1 (user_id = 3) books tour 1 for quantity 2
INSERT INTO `bills` (`user_id`, `tour_id`, `quantity`, `total_price`, `created_at`)
VALUES (3, 1, 2, 399.98, NOW());

-- Notes:
-- 1) The `password` values above are placeholders. To make these seed users usable for login,
--    either register them via the `/auth/register` endpoint or replace the `password` fields
--    with valid bcrypt hashes for your chosen passwords.
-- 2) IDs used in `tour_tags` and `bills` assume the inserts run in the order above and no pre-existing rows.
--    If your DB already contains data, check the inserted ids or use explicit ids accordingly.

-- Bills (bookings): reference a tour and a user who booked it
CREATE TABLE IF NOT EXISTS `bills` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `tour_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `total_price` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_bills_user` (`user_id`),
  INDEX `idx_bills_tour` (`tour_id`),
  CONSTRAINT `fk_bills_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bills_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

