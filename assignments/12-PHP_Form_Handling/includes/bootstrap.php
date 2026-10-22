<?php
/**
 * ==============================================================================
 * KBTCOE Connect — Application Bootstrap (bootstrap.php)
 * Assignment 12: PHP Form Handling & Session Authentication
 * ==============================================================================
 */

declare(strict_types=1);

// Configure secure session cookie parameters prior to starting session
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,             // Session cookie expires on browser close
        'path' => '/',
        'domain' => '',
        'secure' => false,          // Set to true in HTTPS production
        'httponly' => true,         // Mitigate XSS attacks by blocking JavaScript access
        'samesite' => 'Lax'         // Mitigate CSRF attacks
    ]);
    session_start();
}

// Require reusable utility functions
require_once __DIR__ . '/functions.php';

// Initialize session-based registered users storage
if (!isset($_SESSION['registered_users']) || !is_array($_SESSION['registered_users'])) {
    $_SESSION['registered_users'] = [];

    // Pre-seed 1 demonstration student account for convenient evaluator testing
    register_user([
        'name' => 'Sanket Patil',
        'email' => 'sanket.patil@kbtcoe.org',
        'student_id' => 'KBT-2024-CS01',
        'branch' => 'Computer Engineering',
        'year' => 'Third Year (TE)',
        'password_hash' => hash_password('Password@123')
    ]);
}
