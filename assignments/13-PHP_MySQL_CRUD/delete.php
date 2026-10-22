<?php
/**
 * ==============================================================================
 * KBTCOE Connect — Delete Opportunity (delete.php)
 * Assignment 13: PHP and MySQL CRUD
 *
 * Enforces strictly POST-only deletion for state changes.
 * GET requests provide a secure confirmation view before deletion.
 * ==============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$page_title = 'Delete Opportunity | KBTCOE Connect';
$current_page = 'delete';

// 1. Process POST Deletion Request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate CSRF token
    $submitted_token = $_POST['csrf_token'] ?? null;
    if (!validate_csrf_token($submitted_token)) {
        set_flash('danger', 'Security validation failed (CSRF token invalid). Deletion cancelled.');
        redirect('index.php');
    }

    // Validate ID
    $id_param = $_POST['id'] ?? null;
    $opportunity_id = filter_var($id_param, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);

    if ($opportunity_id === false || $opportunity_id === null) {
        set_flash('danger', 'Invalid opportunity identifier provided for deletion.');
        redirect('index.php');
    }

    if (!$is_db_connected || $pdo === null) {
        set_flash('danger', 'Database service is disconnected. Unable to delete record.');
        redirect('index.php');
    }

    try {
        $deleted = delete_opportunity($pdo, (int)$opportunity_id);
        if ($deleted) {
            set_flash('success', 'Opportunity record #' . (int)$opportunity_id . ' was permanently deleted.');
        } else {
            set_flash('warning', 'Opportunity record #' . (int)$opportunity_id . ' could not be deleted or does not exist.');
        }
    } catch (PDOException $ex) {
        set_flash('danger', 'Database deletion error: ' . e($ex->getMessage()));
    }

    redirect('index.php');
}

// 2. GET Request: Render Confirmation View (Safe idempotent view)
$id_param = $_GET['id'] ?? null;
$opportunity_id = filter_var($id_param, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);

if ($opportunity_id === false || $opportunity_id === null) {
    set_flash('danger', 'No valid opportunity specified for deletion.');
    redirect('index.php');
}

if (!$is_db_connected || $pdo === null) {
    set_flash('danger', 'Database service is disconnected.');
    redirect('index.php');
}

$opp = get_opportunity_by_id($pdo, (int)$opportunity_id);

if (!$opp) {
    set_flash('warning', 'The opportunity you intended to delete could not be found.');
    redirect('index.php');
}

require_once __DIR__ . '/includes/header.php';
?>

<div style="margin-bottom: 1.5rem;">
    <a href="view.php?id=<?= (int)$opportunity_id ?>" style="color: #2563EB; text-decoration: none; font-weight: 600; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.35rem;">
        &larr; Cancel and Return to Opportunity
    </a>
</div>

<div class="delete-confirm-card" role="region" aria-label="Confirm Deletion">
    <div class="delete-header">
        <span class="delete-icon" aria-hidden="true">&#9888;&#65039;</span>
        <h1 class="delete-title">Confirm Record Deletion</h1>
    </div>

    <p class="delete-desc">
        Are you sure you want to permanently delete this campus opportunity from the database? This action is irreversible and cannot be undone.
    </p>

    <div class="delete-opp-preview">
        <div class="delete-preview-title"><?= e($opp['title']) ?></div>
        <div class="delete-preview-org">&#127970; <?= e($opp['organization']) ?> &bull; <?= e(get_category_label($opp['category'])) ?></div>
    </div>

    <!-- Strictly POST form for state modification -->
    <form method="POST" action="delete.php" style="display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem;">
        <?= csrf_input() ?>
        <input type="hidden" name="id" value="<?= (int)$opportunity_id ?>">

        <a href="view.php?id=<?= (int)$opportunity_id ?>" class="btn-cancel">
            Cancel
        </a>
        <button type="submit" class="btn-danger-submit">
            Yes, Permanently Delete
        </button>
    </form>
</div>

<?php
require_once __DIR__ . '/includes/footer.php';
