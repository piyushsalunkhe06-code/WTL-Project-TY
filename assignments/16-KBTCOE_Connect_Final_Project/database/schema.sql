-- ==============================================================================
-- KBTCOE Connect — Final Capstone Relational Database Schema
-- Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
-- Database: kbtcoe_connect_final
-- Department of Computer Engineering, MVP's KBTCOE Nashik
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `kbtcoe_connect_final`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `kbtcoe_connect_final`;

-- Drop tables in reverse dependency order for safe, idempotent re-execution
DROP TABLE IF EXISTS `likes`;
DROP TABLE IF EXISTS `comments`;
DROP TABLE IF EXISTS `achievements`;
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `opportunities`;
DROP TABLE IF EXISTS `users`;

-- ------------------------------------------------------------------------------
-- 1. Table: users
-- Stores registered collegiate student accounts, roles, and profiles
-- ------------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `branch` VARCHAR(60) NOT NULL,
  `academic_year` VARCHAR(20) NOT NULL,
  `role` ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  `bio` TEXT DEFAULT NULL,
  `skills` VARCHAR(255) DEFAULT NULL,
  `interests` VARCHAR(255) DEFAULT NULL,
  `github_url` VARCHAR(255) DEFAULT NULL,
  `portfolio_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  INDEX `idx_users_branch` (`branch`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. Table: opportunities
-- Stores campus internships, hackathons, competitions, and workshops
-- ------------------------------------------------------------------------------
CREATE TABLE `opportunities` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `organization` VARCHAR(150) NOT NULL,
  `category` ENUM('internship', 'hackathon', 'competition', 'workshop') NOT NULL,
  `description` TEXT NOT NULL,
  `eligibility` VARCHAR(255) NOT NULL,
  `application_url` VARCHAR(255) NOT NULL,
  `deadline` DATE DEFAULT NULL,
  `created_by` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_opp_category` (`category`),
  INDEX `idx_opp_deadline` (`deadline`),
  INDEX `idx_opp_created_by` (`created_by`),
  CONSTRAINT `fk_opp_created_by`
    FOREIGN KEY (`created_by`)
    REFERENCES `users` (`id`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. Table: posts
-- Stores community feed discussions, technical articles, and project updates
-- ------------------------------------------------------------------------------
CREATE TABLE `posts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `content` TEXT NOT NULL,
  `category` ENUM('technical', 'achievement', 'event', 'general') NOT NULL DEFAULT 'general',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_posts_user_id` (`user_id`),
  INDEX `idx_posts_category` (`category`),
  INDEX `idx_posts_created_at` (`created_at`),
  CONSTRAINT `fk_posts_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. Table: comments
-- Stores discussion responses linked to posts and authors
-- ------------------------------------------------------------------------------
CREATE TABLE `comments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_comments_post_id` (`post_id`),
  INDEX `idx_comments_user_id` (`user_id`),
  INDEX `idx_comments_created_at` (`created_at`),
  CONSTRAINT `fk_comments_post_id`
    FOREIGN KEY (`post_id`)
    REFERENCES `posts` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_comments_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. Table: likes
-- Stores unique reactions per user per post (prevents duplicate likes)
-- ------------------------------------------------------------------------------
CREATE TABLE `likes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_post_user_like` (`post_id`, `user_id`),
  INDEX `idx_likes_post_id` (`post_id`),
  INDEX `idx_likes_user_id` (`user_id`),
  CONSTRAINT `fk_likes_post_id`
    FOREIGN KEY (`post_id`)
    REFERENCES `posts` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_likes_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. Table: achievements
-- Stores student verified achievements, hackathon awards, and certifications
-- ------------------------------------------------------------------------------
CREATE TABLE `achievements` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `category` ENUM('hackathon', 'competition', 'certification', 'project', 'workshop', 'academic') NOT NULL,
  `description` TEXT NOT NULL,
  `date_achieved` DATE NOT NULL,
  `external_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_achievements_user_id` (`user_id`),
  INDEX `idx_achievements_category` (`category`),
  INDEX `idx_achievements_date` (`date_achieved`),
  CONSTRAINT `fk_achievements_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
