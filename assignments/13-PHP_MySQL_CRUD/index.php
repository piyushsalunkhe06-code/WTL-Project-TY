<?php
/**
 * ==============================================================================
 * KBTCOE Connect — Campus Opportunity Management Portal (index.php)
 * Assignment 13: PHP and MySQL CRUD
 * ==============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$page_title = 'Campus Opportunity Portal | KBTCOE Connect';
$current_page = 'index';

// Read query parameters for search and filtering
$search_query = trim((string)($_GET['q'] ?? ''));
$selected_category = trim((string)($_GET['category'] ?? ''));

// Validate selected category against whitelist if present
if ($selected_category !== '' && !is_valid_category($selected_category)) {
    $selected_category = '';
}

// Fetch opportunities via prepared statement if database is connected
$opportunities = [];
$total_count = 0;

if ($is_db_connected && $pdo !== null) {
    try {
        $opportunities = get_all_opportunities($pdo, $search_query, $selected_category);
        $total_count = count($opportunities);
    } catch (PDOException $ex) {
        set_flash('danger', 'Unable to retrieve opportunities: ' . e($ex->getMessage()));
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="page-hero">
    <span class="lab-pill">Assignment 13 &bull; PHP &amp; MySQL CRUD</span>
    <div class="hero-header-row">
        <div>
            <h1 class="page-title">Campus Opportunity Portal</h1>
            <p class="page-subtitle">
                Explore, track, and manage internships, hackathons, and collegiate technical initiatives.
            </p>
        </div>
        <div>
            <a href="create.php" class="btn-create-action" aria-label="Post a new campus opportunity">
                <span>+</span> Post New Opportunity
            </a>
        </div>
    </div>
</div>

<!-- Search & Filtering Controls Card -->
<section class="controls-card" aria-label="Opportunity filters and search">
    <form method="GET" action="index.php" class="controls-form" role="search">
        <div class="filter-group-search">
            <label for="q" class="filter-label">Search Opportunities</label>
            <input 
                type="text" 
                id="q" 
                name="q" 
                class="filter-input" 
                placeholder="Search by title, technology, or company..." 
                value="<?= e($search_query) ?>"
                autocomplete="off"
            >
        </div>

        <div class="filter-group-category">
            <label for="category" class="filter-label">Category</label>
            <select id="category" name="category" class="filter-select">
                <option value="">All Categories</option>
                <?php foreach (ALLOWED_CATEGORIES as $slug => $label): ?>
                    <option value="<?= e($slug) ?>" <?= $selected_category === $slug ? 'selected' : '' ?>>
                        <?= e($label) ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="filter-group-actions">
            <button type="submit" class="btn-filter-apply">Apply Filters</button>
            <?php if ($search_query !== '' || $selected_category !== ''): ?>
                <a href="index.php" class="btn-filter-reset">Reset</a>
            <?php endif; ?>
        </div>
    </form>
</section>

<!-- Active Query Summary / Results Counter -->
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
    <p style="font-size: 0.9rem; color: #475569; font-weight: 600;">
        <?php if ($is_db_connected): ?>
            Found <strong style="color: #1E3A8A;"><?= $total_count ?></strong> 
            <?= $total_count === 1 ? 'opportunity' : 'opportunities' ?>
            <?php if ($search_query !== ''): ?>
                matching &ldquo;<em><?= e($search_query) ?></em>&rdquo;
            <?php endif; ?>
            <?php if ($selected_category !== ''): ?>
                in <strong style="color: #2563EB;"><?= e(get_category_label($selected_category)) ?></strong>
            <?php endif; ?>
        <?php else: ?>
            <span style="color: #991B1B;">Database disconnected &bull; Live queries unavailable</span>
        <?php endif; ?>
    </p>

    <?php if ($search_query !== '' || $selected_category !== ''): ?>
        <a href="index.php" style="font-size: 0.825rem; color: #2563EB; text-decoration: none; font-weight: 600;">
            Clear All Filters &times;
        </a>
    <?php endif; ?>
</div>

<!-- Opportunities Grid -->
<div class="opportunities-grid" role="region" aria-label="Opportunities listings">
    <?php if (!empty($opportunities)): ?>
        <?php foreach ($opportunities as $opp): ?>
            <?php 
                $category_slug = strtolower((string)$opp['category']);
                $badge_class = 'badge-' . $category_slug;
            ?>
            <article class="opp-card">
                <div class="opp-header">
                    <span class="category-badge <?= e($badge_class) ?>">
                        <?= e(get_category_label($category_slug)) ?>
                    </span>
                    <span class="opp-deadline-badge" title="Application deadline">
                        &#128197; <?= e(format_deadline($opp['deadline'])) ?>
                    </span>
                </div>

                <h2 class="opp-title">
                    <a href="view.php?id=<?= (int)$opp['id'] ?>">
                        <?= e($opp['title']) ?>
                    </a>
                </h2>

                <p class="opp-org">
                    &#127970; <?= e($opp['organization']) ?>
                </p>

                <p class="opp-desc">
                    <?= e($opp['description']) ?>
                </p>

                <div class="opp-eligibility">
                    <strong>Eligibility:</strong> <?= e($opp['eligibility']) ?>
                </div>

                <div class="opp-actions-row">
                    <a href="view.php?id=<?= (int)$opp['id'] ?>" class="btn-action-view">
                        View Details &rarr;
                    </a>

                    <div class="card-crud-buttons">
                        <a href="edit.php?id=<?= (int)$opp['id'] ?>" class="btn-action-edit" title="Edit this record">
                            Edit
                        </a>
                        <a href="delete.php?id=<?= (int)$opp['id'] ?>" class="btn-action-delete" title="Delete this record">
                            Delete
                        </a>
                    </div>
                </div>
            </article>
        <?php endforeach; ?>
    <?php else: ?>
        <div class="empty-state-card">
            <div class="empty-icon">&#128269;</div>
            <?php if (!$is_db_connected): ?>
                <h3 class="empty-title">Database Service Not Connected</h3>
                <p class="empty-desc">
                    MySQL or MariaDB is currently unreachable. Please ensure the database service is running and configured properly.
                </p>
            <?php elseif ($search_query !== '' || $selected_category !== ''): ?>
                <h3 class="empty-title">No Matching Opportunities Found</h3>
                <p class="empty-desc">
                    We could not find any opportunities matching your active search or category filters.
                </p>
                <a href="index.php" class="btn-filter-apply" style="display: inline-block; text-decoration: none;">
                    Reset Filters
                </a>
            <?php else: ?>
                <h3 class="empty-title">No Opportunities Posted Yet</h3>
                <p class="empty-desc">
                    Be the first campus coordinator or student lead to publish an opportunity for the KBTCOE student body!
                </p>
                <a href="create.php" class="btn-filter-apply" style="display: inline-block; text-decoration: none;">
                    + Post First Opportunity
                </a>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</div>

<?php
require_once __DIR__ . '/includes/footer.php';
