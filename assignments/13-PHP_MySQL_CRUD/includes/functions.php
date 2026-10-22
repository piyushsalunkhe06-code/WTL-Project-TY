<?php
/**
 * ==============================================================================
 * KBTCOE Connect — CRUD Helper Functions (functions.php)
 * Assignment 13: PHP and MySQL CRUD — Campus Opportunity Management Portal
 * ==============================================================================
 */

declare(strict_types=1);

// Allowed Opportunity Categories
const ALLOWED_CATEGORIES = [
    'internship'  => 'Internship',
    'hackathon'   => 'Hackathon',
    'competition' => 'Competition',
    'workshop'    => 'Workshop'
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
 * Performs a safe HTTP header redirect and terminates script execution.
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
 * Retrieves and consumes the session flash message.
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

// ==============================================================================
// CSRF (Cross-Site Request Forgery) Protection
// ==============================================================================

/**
 * Generates and stores a cryptographically secure CSRF token in the session.
 *
 * @return string
 */
function generate_csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Validates a submitted CSRF token against the stored session token using constant-time comparison.
 *
 * @param string|null $token
 * @return bool
 */
function validate_csrf_token(?string $token): bool
{
    if (!isset($_SESSION['csrf_token']) || !is_string($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Renders an accessible hidden CSRF token input field for HTML forms.
 *
 * @return string
 */
function csrf_input(): string
{
    $token = e(generate_csrf_token());
    return '<input type="hidden" name="csrf_token" value="' . $token . '">';
}

// ==============================================================================
// Input Validation Helpers
// ==============================================================================

/**
 * Validates whether an opportunity category is in the allowed list.
 *
 * @param string $category
 * @return bool
 */
function is_valid_category(string $category): bool
{
    return array_key_exists(strtolower(trim($category)), ALLOWED_CATEGORIES);
}

/**
 * Validates application URLs (optional; if provided, must be valid http/https).
 *
 * @param string|null $url
 * @return bool
 */
function validate_url(?string $url): bool
{
    $trimmed = trim((string)$url);
    if ($trimmed === '') {
        return true; // Optional field
    }

    if (!filter_var($trimmed, FILTER_VALIDATE_URL)) {
        return false;
    }

    $scheme = parse_url($trimmed, PHP_URL_SCHEME);
    return in_array($scheme, ['http', 'https'], true);
}

/**
 * Validates deadline dates (optional; if provided, must be YYYY-MM-DD format).
 *
 * @param string|null $date
 * @return bool
 */
function validate_date(?string $date): bool
{
    $trimmed = trim((string)$date);
    if ($trimmed === '') {
        return true; // Optional field
    }

    $d = DateTime::createFromFormat('Y-m-d', $trimmed);
    return $d && $d->format('Y-m-d') === $trimmed;
}

// ==============================================================================
// Database CRUD Operations (PDO with Prepared Statements)
// ==============================================================================

/**
 * Retrieves opportunities matching optional search keywords and category filter.
 * Uses prepared statement parameters for all dynamic filter variables.
 *
 * @param PDO $pdo
 * @param string $search
 * @param string $category
 * @return array<int, array<string, mixed>>
 */
function get_all_opportunities(PDO $pdo, string $search = '', string $category = ''): array
{
    $sql = "SELECT * FROM `opportunities` WHERE 1=1";
    $params = [];

    $searchTrimmed = trim($search);
    if ($searchTrimmed !== '') {
        $sql .= " AND (`title` LIKE :search OR `organization` LIKE :searchOrg)";
        $params[':search'] = '%' . $searchTrimmed . '%';
        $params[':searchOrg'] = '%' . $searchTrimmed . '%';
    }

    $categoryTrimmed = strtolower(trim($category));
    if ($categoryTrimmed !== '' && is_valid_category($categoryTrimmed)) {
        $sql .= " AND `category` = :category";
        $params[':category'] = $categoryTrimmed;
    }

    // Order by earliest upcoming deadline, then creation date
    $sql .= " ORDER BY CASE WHEN `deadline` IS NULL THEN 1 ELSE 0 END, `deadline` ASC, `created_at` DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

/**
 * Retrieves a single opportunity by its unique numeric ID using a prepared statement.
 *
 * @param PDO $pdo
 * @param int $id
 * @return array<string, mixed>|null
 */
function get_opportunity_by_id(PDO $pdo, int $id): ?array
{
    $stmt = $pdo->prepare("SELECT * FROM `opportunities` WHERE `id` = :id LIMIT 1");
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $record = $stmt->fetch();
    return $record !== false ? $record : null;
}

/**
 * Creates a new opportunity record using a prepared INSERT statement.
 *
 * @param PDO $pdo
 * @param array<string, mixed> $data
 * @return int ID of the newly created record
 */
function create_opportunity(PDO $pdo, array $data): int
{
    $sql = "INSERT INTO `opportunities` 
            (`title`, `organization`, `category`, `description`, `eligibility`, `application_url`, `deadline`)
            VALUES 
            (:title, :organization, :category, :description, :eligibility, :application_url, :deadline)";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':title', trim($data['title']), PDO::PARAM_STR);
    $stmt->bindValue(':organization', trim($data['organization']), PDO::PARAM_STR);
    $stmt->bindValue(':category', strtolower(trim($data['category'])), PDO::PARAM_STR);
    $stmt->bindValue(':description', trim($data['description']), PDO::PARAM_STR);
    $stmt->bindValue(':eligibility', trim($data['eligibility']), PDO::PARAM_STR);
    
    $url = trim((string)($data['application_url'] ?? ''));
    $stmt->bindValue(':application_url', $url !== '' ? $url : null, $url !== '' ? PDO::PARAM_STR : PDO::PARAM_NULL);
    
    $deadline = trim((string)($data['deadline'] ?? ''));
    $stmt->bindValue(':deadline', $deadline !== '' ? $deadline : null, $deadline !== '' ? PDO::PARAM_STR : PDO::PARAM_NULL);

    $stmt->execute();
    return (int)$pdo->lastInsertId();
}

/**
 * Updates an existing opportunity record using a prepared UPDATE statement.
 *
 * @param PDO $pdo
 * @param int $id
 * @param array<string, mixed> $data
 * @return bool
 */
function update_opportunity(PDO $pdo, int $id, array $data): bool
{
    $sql = "UPDATE `opportunities` SET
            `title` = :title,
            `organization` = :organization,
            `category` = :category,
            `description` = :description,
            `eligibility` = :eligibility,
            `application_url` = :application_url,
            `deadline` = :deadline
            WHERE `id` = :id";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->bindValue(':title', trim($data['title']), PDO::PARAM_STR);
    $stmt->bindValue(':organization', trim($data['organization']), PDO::PARAM_STR);
    $stmt->bindValue(':category', strtolower(trim($data['category'])), PDO::PARAM_STR);
    $stmt->bindValue(':description', trim($data['description']), PDO::PARAM_STR);
    $stmt->bindValue(':eligibility', trim($data['eligibility']), PDO::PARAM_STR);

    $url = trim((string)($data['application_url'] ?? ''));
    $stmt->bindValue(':application_url', $url !== '' ? $url : null, $url !== '' ? PDO::PARAM_STR : PDO::PARAM_NULL);

    $deadline = trim((string)($data['deadline'] ?? ''));
    $stmt->bindValue(':deadline', $deadline !== '' ? $deadline : null, $deadline !== '' ? PDO::PARAM_STR : PDO::PARAM_NULL);

    return $stmt->execute();
}

/**
 * Deletes an opportunity record using a prepared DELETE statement.
 *
 * @param PDO $pdo
 * @param int $id
 * @return bool
 */
function delete_opportunity(PDO $pdo, int $id): bool
{
    $stmt = $pdo->prepare("DELETE FROM `opportunities` WHERE `id` = :id LIMIT 1");
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    return $stmt->execute() && $stmt->rowCount() > 0;
}

/**
 * Returns user-friendly category label.
 *
 * @param string $category
 * @return string
 */
function get_category_label(string $category): string
{
    $key = strtolower(trim($category));
    return ALLOWED_CATEGORIES[$key] ?? ucfirst($category);
}

/**
 * Formats a deadline date string nicely.
 *
 * @param string|null $date
 * @return string
 */
function format_deadline(?string $date): string
{
    if (empty($date)) {
        return 'Open / Ongoing';
    }
    $timestamp = strtotime($date);
    if ($timestamp === false) {
        return (string)$date;
    }
    return date('M j, Y', $timestamp);
}

