<?php
/**
 * ==============================================================================
 * KBTCOE Connect — PDO Database Connection Factory (database.php)
 * Assignment 13: PHP and MySQL CRUD — Campus Opportunity Management Portal
 * ==============================================================================
 */

declare(strict_types=1);

/**
 * Returns a configured PDO database connection instance or null on failure.
 * Handles exceptions securely without exposing credentials in logs or output.
 *
 * @param bool $forceNew Force new connection instead of singleton instance
 * @return PDO|null
 */
function get_db_connection(bool $forceNew = false): ?PDO
{
    static $pdoInstance = null;

    if ($pdoInstance !== null && !$forceNew) {
        return $pdoInstance;
    }

    // Read connection parameters from environment variables or local defaults
    $host     = getenv('DB_HOST') ?: '127.0.0.1';
    $port     = (int)(getenv('DB_PORT') ?: 3306);
    $database = getenv('DB_NAME') ?: 'kbtcoe_connect_crud';
    $username = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASS') ?: '';
    $charset  = 'utf8mb4';

    // Construct Data Source Name (DSN)
    $dsn = "mysql:host={$host};port={$port};dbname={$database};charset={$charset}";

    $options = [
        // Throw exceptions on SQL errors for robust try-catch handling
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        // Fetch rows as associative arrays by default
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        // Disable emulated prepares to utilize native prepared statements
        PDO::ATTR_EMULATE_PREPARES   => false,
        // Set connection timeout
        PDO::ATTR_TIMEOUT            => 5
    ];

    try {
        $pdo = new PDO($dsn, $username, $password, $options);
        $pdoInstance = $pdo;
        return $pdo;
    } catch (PDOException $e) {
        // Log technical details safely to server error log (never display credentials to user)
        error_log("[KBTCOE Connect CRUD] Database connection error: " . $e->getMessage());
        return null;
    }
}
