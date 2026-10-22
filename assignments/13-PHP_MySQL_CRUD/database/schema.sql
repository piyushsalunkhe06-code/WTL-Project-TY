-- ==============================================================================
-- KBTCOE Connect — Database Schema Definition (schema.sql)
-- Assignment 13: PHP and MySQL CRUD — Campus Opportunity Management Portal
-- ==============================================================================

-- 1. Create database if it does not already exist
CREATE DATABASE IF NOT EXISTS `kbtcoe_connect_crud`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `kbtcoe_connect_crud`;

-- 2. Create the core opportunities table
CREATE TABLE IF NOT EXISTS `opportunities` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `organization` VARCHAR(255) NOT NULL,
  `category` ENUM('internship', 'hackathon', 'competition', 'workshop') NOT NULL,
  `description` TEXT NOT NULL,
  `eligibility` VARCHAR(255) NOT NULL,
  `application_url` VARCHAR(500) NULL DEFAULT NULL,
  `deadline` DATE NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Performance Indexes for search queries and category filtering
  INDEX `idx_opp_category` (`category`),
  INDEX `idx_opp_deadline` (`deadline`),
  INDEX `idx_opp_organization` (`organization`),
  INDEX `idx_opp_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
