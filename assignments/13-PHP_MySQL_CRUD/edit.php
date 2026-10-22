<?php
/**
 * ==============================================================================
 * KBTCOE Connect — Edit Opportunity (edit.php)
 * Assignment 13: PHP and MySQL CRUD
 * ==============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$page_title = 'Edit Opportunity | KBTCOE Connect';
$current_page = 'edit';

// 1. Identify opportunity ID from GET or POST
$id_param = $_SERVER['REQUEST_METHOD'] === 'POST' ? ($_POST['id'] ?? null) : ($_GET['id'] ?? null);
$opportunity_id = filter_var($id_param, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);

if ($opportunity_id === false || $opportunity_id === null) {
    set_flash('danger', 'Invalid opportunity identifier requested.');
    redirect('index.php');
}

if (!$is_db_connected || $pdo === null) {
    set_flash('danger', 'Database service is disconnected. Unable to edit opportunity.');
    redirect('index.php');
}

// 2. Fetch existing record
$existing_opp = get_opportunity_by_id($pdo, (int)$opportunity_id);
if (!$existing_opp) {
    set_flash('warning', 'The opportunity you attempted to edit could not be found.');
    redirect('index.php');
}

$errors = [];
$form_data = [
    'title'           => (string)$existing_opp['title'],
    'organization'    => (string)$existing_opp['organization'],
    'category'        => (string)$existing_opp['category'],
    'description'     => (string)$existing_opp['description'],
    'eligibility'     => (string)$existing_opp['eligibility'],
    'application_url' => (string)($existing_opp['application_url'] ?? ''),
    'deadline'        => (string)($existing_opp['deadline'] ?? '')
];

// 3. Handle update on POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate CSRF
    $submitted_token = $_POST['csrf_token'] ?? null;
    if (!validate_csrf_token($submitted_token)) {
        $errors['csrf'] = 'Invalid or expired session security token. Please refresh and try again.';
    }

    // Collect updated inputs
    $form_data['title']           = trim((string)($_POST['title'] ?? ''));
    $form_data['organization']    = trim((string)($_POST['organization'] ?? ''));
    $form_data['category']        = strtolower(trim((string)($_POST['category'] ?? '')));
    $form_data['description']     = trim((string)($_POST['description'] ?? ''));
    $form_data['eligibility']     = trim((string)($_POST['eligibility'] ?? ''));
    $form_data['application_url'] = trim((string)($_POST['application_url'] ?? ''));
    $form_data['deadline']        = trim((string)($_POST['deadline'] ?? ''));

    // Validation
    if ($form_data['title'] === '') {
        $errors['title'] = 'Opportunity title is required.';
    } elseif (mb_strlen($form_data['title']) < 3) {
        $errors['title'] = 'Title must contain at least 3 characters.';
    } elseif (mb_strlen($form_data['title']) > 200) {
        $errors['title'] = 'Title must not exceed 200 characters.';
    }

    if ($form_data['organization'] === '') {
        $errors['organization'] = 'Host organization or department is required.';
    } elseif (mb_strlen($form_data['organization']) < 2) {
        $errors['organization'] = 'Organization name must contain at least 2 characters.';
    } elseif (mb_strlen($form_data['organization']) > 150) {
        $errors['organization'] = 'Organization name must not exceed 150 characters.';
    }

    if ($form_data['category'] === '') {
        $errors['category'] = 'Please select a valid opportunity category.';
    } elseif (!is_valid_category($form_data['category'])) {
        $errors['category'] = 'Invalid category selected. Choose from the provided list.';
    }

    if ($form_data['description'] === '') {
        $errors['description'] = 'Opportunity description is required.';
    } elseif (mb_strlen($form_data['description']) < 10) {
        $errors['description'] = 'Description must contain at least 10 characters.';
    }

    if ($form_data['eligibility'] === '') {
        $errors['eligibility'] = 'Eligibility criteria is required.';
    } elseif (mb_strlen($form_data['eligibility']) < 5) {
        $errors['eligibility'] = 'Eligibility must contain at least 5 characters.';
    }

    if ($form_data['application_url'] !== '' && !validate_url($form_data['application_url'])) {
        $errors['application_url'] = 'Application URL must be a valid web address starting with http:// or https://.';
    }

    if ($form_data['deadline'] !== '' && !validate_date($form_data['deadline'])) {
        $errors['deadline'] = 'Deadline must be a valid date formatted as YYYY-MM-DD.';
    }

    // Persist changes
    if (empty($errors)) {
        try {
            update_opportunity($pdo, (int)$opportunity_id, $form_data);
            set_flash('success', 'Opportunity "' . e($form_data['title']) . '" was successfully updated!');
            redirect('view.php?id=' . (int)$opportunity_id);
        } catch (PDOException $ex) {
            $errors['database'] = 'Database update transaction failed: ' . $ex->getMessage();
        }
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="form-wrapper">
    <div style="margin-bottom: 1.25rem;">
        <a href="view.php?id=<?= (int)$opportunity_id ?>" style="color: #2563EB; text-decoration: none; font-weight: 600; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.35rem;">
            &larr; Back to Details
        </a>
    </div>

    <div class="form-card">
        <header class="form-header">
            <h1 class="form-title">Edit Opportunity</h1>
            <p class="form-desc">
                Updating record #<?= (int)$opportunity_id ?> &bull; <?= e($existing_opp['title']) ?>
            </p>
        </header>

        <?php if (!empty($errors['csrf'])): ?>
            <div class="flash-alert flash-danger" role="alert" style="margin-bottom: 1.25rem;">
                <span class="flash-icon">&#9888;</span>
                <span><?= e($errors['csrf']) ?></span>
            </div>
        <?php endif; ?>

        <?php if (!empty($errors['database'])): ?>
            <div class="flash-alert flash-danger" role="alert" style="margin-bottom: 1.25rem;">
                <span class="flash-icon">&#9888;</span>
                <span><?= e($errors['database']) ?></span>
            </div>
        <?php endif; ?>

        <form method="POST" action="edit.php?id=<?= (int)$opportunity_id ?>" novalidate>
            <?= csrf_input() ?>
            <input type="hidden" name="id" value="<?= (int)$opportunity_id ?>">

            <!-- Title -->
            <div class="form-group">
                <label for="title" class="form-label">
                    Opportunity Title <span class="required-star">*</span>
                </label>
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    class="form-input <?= isset($errors['title']) ? 'has-error' : '' ?>"
                    value="<?= e($form_data['title']) ?>"
                    maxlength="200"
                    required
                    aria-describedby="<?= isset($errors['title']) ? 'title-error' : '' ?>"
                >
                <?php if (isset($errors['title'])): ?>
                    <span id="title-error" class="field-error"><?= e($errors['title']) ?></span>
                <?php endif; ?>
            </div>

            <!-- Organization -->
            <div class="form-group">
                <label for="organization" class="form-label">
                    Host Organization / Department <span class="required-star">*</span>
                </label>
                <input 
                    type="text" 
                    id="organization" 
                    name="organization" 
                    class="form-input <?= isset($errors['organization']) ? 'has-error' : '' ?>"
                    value="<?= e($form_data['organization']) ?>"
                    maxlength="150"
                    required
                    aria-describedby="<?= isset($errors['organization']) ? 'organization-error' : '' ?>"
                >
                <?php if (isset($errors['organization'])): ?>
                    <span id="organization-error" class="field-error"><?= e($errors['organization']) ?></span>
                <?php endif; ?>
            </div>

            <!-- Category -->
            <div class="form-group">
                <label for="category" class="form-label">
                    Category <span class="required-star">*</span>
                </label>
                <select 
                    id="category" 
                    name="category" 
                    class="form-select <?= isset($errors['category']) ? 'has-error' : '' ?>"
                    required
                    aria-describedby="<?= isset($errors['category']) ? 'category-error' : '' ?>"
                >
                    <option value="">-- Select Opportunity Category --</option>
                    <?php foreach (ALLOWED_CATEGORIES as $slug => $label): ?>
                        <option value="<?= e($slug) ?>" <?= $form_data['category'] === $slug ? 'selected' : '' ?>>
                            <?= e($label) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <?php if (isset($errors['category'])): ?>
                    <span id="category-error" class="field-error"><?= e($errors['category']) ?></span>
                <?php endif; ?>
            </div>

            <!-- Description -->
            <div class="form-group">
                <label for="description" class="form-label">
                    Description &amp; Deliverables <span class="required-star">*</span>
                </label>
                <textarea 
                    id="description" 
                    name="description" 
                    class="form-textarea <?= isset($errors['description']) ? 'has-error' : '' ?>"
                    rows="4"
                    required
                    aria-describedby="<?= isset($errors['description']) ? 'description-error' : '' ?>"
                ><?= e($form_data['description']) ?></textarea>
                <?php if (isset($errors['description'])): ?>
                    <span id="description-error" class="field-error"><?= e($errors['description']) ?></span>
                <?php endif; ?>
            </div>

            <!-- Eligibility -->
            <div class="form-group">
                <label for="eligibility" class="form-label">
                    Eligibility Criteria <span class="required-star">*</span>
                </label>
                <input 
                    type="text" 
                    id="eligibility" 
                    name="eligibility" 
                    class="form-input <?= isset($errors['eligibility']) ? 'has-error' : '' ?>"
                    value="<?= e($form_data['eligibility']) ?>"
                    required
                    aria-describedby="<?= isset($errors['eligibility']) ? 'eligibility-error' : '' ?>"
                >
                <?php if (isset($errors['eligibility'])): ?>
                    <span id="eligibility-error" class="field-error"><?= e($errors['eligibility']) ?></span>
                <?php endif; ?>
            </div>

            <!-- Application URL -->
            <div class="form-group">
                <label for="application_url" class="form-label">
                    Official Application URL <small style="color: #64748B; font-weight: normal;">(Optional)</small>
                </label>
                <input 
                    type="url" 
                    id="application_url" 
                    name="application_url" 
                    class="form-input <?= isset($errors['application_url']) ? 'has-error' : '' ?>"
                    value="<?= e($form_data['application_url']) ?>"
                    aria-describedby="<?= isset($errors['application_url']) ? 'url-error' : '' ?>"
                >
                <?php if (isset($errors['application_url'])): ?>
                    <span id="url-error" class="field-error"><?= e($errors['application_url']) ?></span>
                <?php endif; ?>
            </div>

            <!-- Deadline -->
            <div class="form-group">
                <label for="deadline" class="form-label">
                    Application Deadline <small style="color: #64748B; font-weight: normal;">(Optional)</small>
                </label>
                <input 
                    type="date" 
                    id="deadline" 
                    name="deadline" 
                    class="form-input <?= isset($errors['deadline']) ? 'has-error' : '' ?>"
                    value="<?= e($form_data['deadline']) ?>"
                    aria-describedby="<?= isset($errors['deadline']) ? 'deadline-error' : '' ?>"
                >
                <?php if (isset($errors['deadline'])): ?>
                    <span id="deadline-error" class="field-error"><?= e($errors['deadline']) ?></span>
                <?php endif; ?>
            </div>

            <div class="form-actions-row">
                <a href="view.php?id=<?= (int)$opportunity_id ?>" class="btn-cancel">Cancel</a>
                <button type="submit" class="btn-primary-submit">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<?php
require_once __DIR__ . '/includes/footer.php';
