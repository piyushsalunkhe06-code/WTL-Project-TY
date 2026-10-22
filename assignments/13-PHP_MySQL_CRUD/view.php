<?php
/**
 * ==============================================================================
 * KBTCOE Connect — Opportunity Details (view.php)
 * Assignment 13: PHP and MySQL CRUD
 * ==============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$current_page = 'view';

// Validate ID parameter
$id_param = $_GET['id'] ?? null;
$opportunity_id = filter_var($id_param, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);

if ($opportunity_id === false || $opportunity_id === null) {
    set_flash('danger', 'Invalid opportunity identifier requested.');
    redirect('index.php');
}

if (!$is_db_connected || $pdo === null) {
    set_flash('danger', 'Database service is unavailable. Cannot load opportunity details.');
    redirect('index.php');
}

$opp = get_opportunity_by_id($pdo, (int)$opportunity_id);

if (!$opp) {
    set_flash('warning', 'The requested opportunity (ID #' . e((string)$opportunity_id) . ') was not found or has been removed.');
    redirect('index.php');
}

$page_title = e($opp['title']) . ' | KBTCOE Connect';
$category_slug = strtolower((string)$opp['category']);
$badge_class = 'badge-' . $category_slug;

require_once __DIR__ . '/includes/header.php';
?>

<div style="margin-bottom: 1.5rem;">
    <a href="index.php" style="color: #2563EB; text-decoration: none; font-weight: 600; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.35rem;">
        &larr; Back to Opportunities
    </a>
</div>

<article class="detail-card" aria-label="Opportunity Details">
    <div class="detail-header-row">
        <span class="category-badge <?= e($badge_class) ?>">
            <?= e(get_category_label($category_slug)) ?>
        </span>
        <span class="opp-deadline-badge" style="font-size: 0.85rem;">
            &#128197; Deadline: <strong><?= e(format_deadline($opp['deadline'])) ?></strong>
        </span>
    </div>

    <h1 class="detail-title">
        <?= e($opp['title']) ?>
    </h1>

    <p class="detail-org">
        &#127970; <?= e($opp['organization']) ?>
    </p>

    <!-- Metadata Grid -->
    <div class="detail-meta-grid">
        <div>
            <span class="meta-item-label">Category</span>
            <span class="meta-item-val"><?= e(get_category_label($category_slug)) ?></span>
        </div>
        <div>
            <span class="meta-item-label">Application Deadline</span>
            <span class="meta-item-val"><?= e(format_deadline($opp['deadline'])) ?></span>
        </div>
        <div>
            <span class="meta-item-label">Posted On</span>
            <span class="meta-item-val"><?= e(date('M j, Y', strtotime($opp['created_at']))) ?></span>
        </div>
        <div>
            <span class="meta-item-label">Last Modified</span>
            <span class="meta-item-val"><?= e(date('M j, Y', strtotime($opp['updated_at']))) ?></span>
        </div>
    </div>

    <!-- Opportunity Description -->
    <section class="detail-body-section">
        <h2 class="detail-body-heading">Opportunity Overview</h2>
        <div class="detail-body-text">
            <?= nl2br(e($opp['description'])) ?>
        </div>
    </section>

    <!-- Eligibility Criteria -->
    <section class="detail-body-section">
        <h2 class="detail-body-heading">Eligibility Criteria</h2>
        <div class="detail-body-text">
            <?= nl2br(e($opp['eligibility'])) ?>
        </div>
    </section>

    <!-- Application Link -->
    <?php if (!empty($opp['application_url'])): ?>
        <section class="detail-body-section" style="background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 0.5rem; padding: 1rem 1.25rem;">
            <h3 style="font-size: 0.95rem; font-weight: 700; color: #1E3A8A; margin-bottom: 0.25rem;">Official Application Portal</h3>
            <p style="font-size: 0.875rem; color: #334155; margin-bottom: 0.5rem;">
                Students may apply directly through the host organization&rsquo;s portal below:
            </p>
            <a href="<?= e($opp['application_url']) ?>" target="_blank" rel="noopener noreferrer" style="color: #2563EB; font-weight: 700; word-break: break-all; text-decoration: underline;">
                <?= e($opp['application_url']) ?> &UpperRightArrow;
            </a>
        </section>
    <?php endif; ?>

    <!-- Action Bar -->
    <div class="detail-actions-bar">
        <div>
            <?php if (!empty($opp['application_url'])): ?>
                <a href="<?= e($opp['application_url']) ?>" target="_blank" rel="noopener noreferrer" class="btn-primary-submit" style="display: inline-block; text-decoration: none;">
                    Apply on Host Portal &UpperRightArrow;
                </a>
            <?php endif; ?>
        </div>

        <div style="display: flex; gap: 0.5rem;">
            <a href="edit.php?id=<?= (int)$opp['id'] ?>" class="btn-cancel" style="background-color: #EFF6FF; color: #1E3A8A; border-color: #BFDBFE;">
                Edit Opportunity
            </a>
            <a href="delete.php?id=<?= (int)$opp['id'] ?>" class="btn-cancel" style="background-color: #FEF2F2; color: #991B1B; border-color: #FECACA;">
                Delete Opportunity
            </a>
        </div>
    </div>
</article>

<?php
require_once __DIR__ . '/includes/footer.php';
