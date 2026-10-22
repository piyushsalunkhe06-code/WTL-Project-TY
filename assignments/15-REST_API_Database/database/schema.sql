-- ==============================================================================
-- KBTCOE Connect — Relational Database Schema (schema.sql)
-- Assignment 15: REST API and Database
-- Database: kbtcoe_connect_api
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `kbtcoe_connect_api`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `kbtcoe_connect_api`;

-- Drop existing tables in reverse dependency order for clean re-execution
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `opportunities`;

-- ------------------------------------------------------------------------------
-- 1. Table: opportunities
-- Stores campus academic and professional opportunities
-- ------------------------------------------------------------------------------
CREATE TABLE `opportunities` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `organization` VARCHAR(150) NOT NULL,
  `category` ENUM('internship', 'hackathon', 'competition', 'workshop') NOT NULL,
  `description` TEXT NOT NULL,
  `eligibility` VARCHAR(255) NOT NULL,
  `application_url` VARCHAR(255) DEFAULT NULL,
  `deadline` DATE DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_opp_category` (`category`),
  INDEX `idx_opp_deadline` (`deadline`),
  INDEX `idx_opp_organization` (`organization`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. Table: users
-- Stores registered collegiate student accounts with hashed passwords
-- ------------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `branch` VARCHAR(50) NOT NULL,
  `academic_year` VARCHAR(20) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  INDEX `idx_users_branch` (`branch`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. Table: posts
-- Stores student community discussion posts, linked via foreign key to users
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
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
