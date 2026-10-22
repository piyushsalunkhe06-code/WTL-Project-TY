<?php
/**
 * ==============================================================================
 * KBTCOE Connect — Core Helper Functions (functions.php)
 * Assignment 12: PHP Form Handling & Session Authentication
 * ==============================================================================
 */

declare(strict_types=1);

// Allowed Engineering Departments
const ALLOWED_BRANCHES = [
    'Computer Engineering',
    'Information Technology',
    'AI & Data Science',
    'Electronics & Telecommunication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Instrumentation & Control'
];

// Allowed Academic Years
const ALLOWED_YEARS = [
    'First Year (FE)',
    'Second Year (SE)',
    'Third Year (TE)',
    'Final Year (BE)'
];

/**
 * Escapes strings for safe HTML rendering to prevent XSS.
 *
 * @param string|null $value
 * @return string
 */
function e(?string $value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Performs a safe HTTP header redirect and terminates execution.
 *
 * @param string $path
 * @return void
 */
function redirect(string $path): void
{
    header("Location: {$path}");
    exit();
}

/**
 * Sets a session flash message.
 *
 * @param string $type 'success' | 'danger' | 'info' | 'warning'
 * @param string $message
 * @return void
 */
function set_flash(string $type, string $message): void
{
    $_SESSION['flash'] = [
        'type' => $type,
        'message' => $message
    ];
}

/**
 * Retrieves and consumes the session flash message (flash messages are removed once read).
 *
 * @return array{type: string, message: string}|null
 */
function get_flash(): ?array
{
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
    }
    return null;
}

/**
 * Checks whether an authenticated user session is active.
 *
 * @return bool
 */
function is_authenticated(): bool
{
    return isset($_SESSION['user']) && is_array($_SESSION['user']);
}

/**
 * Returns the currently authenticated user's session data.
 *
 * @return array<string, mixed>|null
 */
function get_authenticated_user(): ?array
{
    return $_SESSION['user'] ?? null;
}

/**
 * Access control guard: Requires authentication to view protected pages.
 * Redirects unauthenticated visitors to login.php.
 *
 * @return void
 */
function require_auth(): void
{
    if (!is_authenticated()) {
        set_flash('danger', 'Access restricted. Please sign in with your student credentials to view your dashboard.');
        redirect('login.php');
    }
}

/**
 * Access control guard: Restricts guests only.
 * Redirects already logged-in users away from login/registration to dashboard.php.
 *
 * @return void
 */
function require_guest(): void
{
    if (is_authenticated()) {
        redirect('dashboard.php');
    }
}

/**
 * Validates student ID according to documented demonstration format.
 * Format: KBT-YYYY-DEPTXX (e.g. KBT-2026-CS42)
 *
 * @param string $id
 * @return bool
 */
function validate_student_id(string $id): bool
{
    // Demonstration pattern: KBT-[4 digits]-[2 to 6 alphanumeric characters] (e.g. KBT-2024-CS01, KBT-2025-AIDS99)
    return (bool)preg_match('/^KBT-\d{4}-[A-Z0-9]{2,6}$/i', trim($id));
}

/**
 * Validates email address format using PHP filter_var.
 *
 * @param string $email
 * @return bool
 */
function validate_email(string $email): bool
{
    return filter_var(trim($email), FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Hashes a plaintext password securely using PHP's native password_hash (BCrypt).
 *
 * @param string $password
 * @return string
 */
function hash_password(string $password): string
{
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
}

/**
 * Verifies a plaintext password against a stored BCrypt hash.
 *
 * @param string $password
 * @param string $hash
 * @return bool
 */
function verify_password(string $password, string $hash): bool
{
    return password_verify($password, $hash);
}

/**
 * Finds a registered user by email address in the session store.
 *
 * @param string $email
 * @return array<string, mixed>|null
 */
function find_user_by_email(string $email): ?array
{
    $normalized = strtolower(trim($email));
    $users = $_SESSION['registered_users'] ?? [];
    return $users[$normalized] ?? null;
}

/**
 * Registers a new demonstration student user in the session store.
 *
 * @param array{
 *   name: string,
 *   email: string,
 *   student_id: string,
 *   branch: string,
 *   year: string,
 *   password_hash: string
 * } $userData
 * @return bool True if registered, false if email already exists
 */
function register_user(array $userData): bool
{
    $normalized = strtolower(trim($userData['email']));
    if (isset($_SESSION['registered_users'][$normalized])) {
        return false;
    }

    $_SESSION['registered_users'][$normalized] = [
        'id' => 'kbt-user-' . (count($_SESSION['registered_users']) + 101),
        'name' => trim($userData['name']),
        'email' => $normalized,
        'student_id' => strtoupper(trim($userData['student_id'])),
        'branch' => trim($userData['branch']),
        'year' => trim($userData['year']),
        'password_hash' => $userData['password_hash'],
        'registered_at' => date('Y-m-d H:i:s')
    ];

    return true;
}
