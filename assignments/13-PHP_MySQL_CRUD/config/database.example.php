<?php
/**
 * ==============================================================================
 * KBTCOE Connect — Database Configuration Template (database.example.php)
 * Assignment 13: PHP and MySQL CRUD — Campus Opportunity Management Portal
 * ==============================================================================
 * 
 * INSTRUCTIONS:
 * 1. Copy this file to 'config/database.php' in your local environment.
 * 2. Update the credentials below to match your local MySQL or MariaDB instance.
 * 3. Never commit 'database.php' containing sensitive production passwords to Git.
 * ==============================================================================
 */

return [
    'host'     => getenv('DB_HOST') ?: '127.0.0.1',
    'port'     => (int)(getenv('DB_PORT') ?: 3306),
    'database' => getenv('DB_NAME') ?: 'kbtcoe_connect_crud',
    'username' => getenv('DB_USER') ?: 'root',
    'password' => getenv('DB_PASS') ?: '',
    'charset'  => 'utf8mb4',
    'options'  => [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]
];
