<?php
/**
 * ==============================================================================
 * KBTCOE Connect — Session Termination Controller (logout.php)
 * Assignment 12: PHP Form Handling & Session Authentication
 * ==============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

// Backup registered demonstration users so the student can test logging back in
$registered_users = $_SESSION['registered_users'] ?? [];

// 1. Clear all session variables
$_SESSION = [];

// 2. Invalidate the session cookie on the client browser
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// 3. Destroy the authenticated session on the server
session_destroy();

// 4. Start a fresh, unauthenticated session to transport the flash feedback
session_start();
$_SESSION['registered_users'] = $registered_users;

set_flash('info', 'You have been logged out successfully. Have a productive day!');
redirect('login.php');
