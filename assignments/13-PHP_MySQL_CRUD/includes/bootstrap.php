<?php
/**
 * ==============================================================================
 * KBTCOE Connect — Application Bootstrap (bootstrap.php)
 * Assignment 13: PHP and MySQL CRUD — Campus Opportunity Management Portal
 * ==============================================================================
 */

declare(strict_types=1);

// Configure session parameters and start session
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'domain'   => '',
        'secure'   => false,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}

// Require database configuration & utility functions
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/functions.php';

// Initialize PDO connection
$pdo = get_db_connection();
$is_db_connected = ($pdo !== null);

// Generate CSRF token for the session if not present
generate_csrf_token();
