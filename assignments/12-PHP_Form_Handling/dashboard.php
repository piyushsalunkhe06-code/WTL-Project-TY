<?php
/**
 * ==============================================================================
 * KBTCOE Connect — Protected Student Dashboard (dashboard.php)
 * Assignment 12: PHP Form Handling & Session Authentication
 * ==============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

// Access Control: Intercept unauthenticated visitors and redirect to login
require_auth();

// Retrieve authenticated student session payload
$user = get_authenticated_user();

$page_title = 'Student Dashboard — KBTCOE Connect | Assignment 12';
require_once __DIR__ . '/includes/header.php';
?>

<!-- Protected Profile Hero Banner -->
<section class="dashboard-profile-card" aria-label="Student Profile Banner">
  <div class="profile-main-flex">
    <div class="dashboard-avatar" aria-hidden="true">
      <?= e(strtoupper(substr($user['name'] ?? 'ST', 0, 2))) ?>
    </div>
    <div class="profile-text-group">
      <span class="profile-greeting">Student Console • Authenticated Session</span>
      <h1 class="profile-name"><?= e($user['name'] ?? 'Student') ?></h1>
      <div class="profile-badges-row">
        <span class="badge-tag">🏛️ <?= e($user['branch'] ?? 'Engineering') ?></span>
        <span class="badge-tag">🎓 <?= e($user['year'] ?? 'Undergraduate') ?></span>
        <span class="badge-tag">🆔 <?= e($user['student_id'] ?? 'KBT-PRN') ?></span>
      </div>
    </div>
  </div>

  <div class="profile-actions">
    <a href="logout.php" class="btn-dashboard-logout" role="button">
      🚪 Sign Out
    </a>
  </div>
</section>

<!-- Dashboard Grid Sections -->
<section class="dashboard-grid" aria-label="Student Modules Overview">
  
  <!-- Account & Session Details Card -->
  <article class="dash-card">
    <header class="dash-card-header">
      <span class="dash-card-icon" aria-hidden="true">🔒</span>
      <h2 class="dash-card-title">Session Security Telemetry</h2>
    </header>
    <ul class="dash-detail-list">
      <li class="dash-detail-item">
        <span class="dash-detail-label">Student Email:</span>
        <span class="dash-detail-val"><?= e($user['email'] ?? 'N/A') ?></span>
      </li>
      <li class="dash-detail-item">
        <span class="dash-detail-label">Student ID:</span>
        <span class="dash-detail-val"><?= e($user['student_id'] ?? 'N/A') ?></span>
      </li>
      <li class="dash-detail-item">
        <span class="dash-detail-label">Session ID:</span>
        <span class="dash-detail-val"><code><?= e(substr(session_id(), 0, 12)) ?>...</code></span>
      </li>
      <li class="dash-detail-item">
        <span class="dash-detail-label">Sign-in Timestamp:</span>
        <span class="dash-detail-val"><time><?= e($user['logged_in_at'] ?? date('Y-m-d H:i:s')) ?></time></span>
      </li>
      <li class="dash-detail-item">
        <span class="dash-detail-label">Storage Backend:</span>
        <span class="dash-detail-val">PHP Native <code>$_SESSION</code></span>
      </li>
    </ul>
  </article>

  <!-- Enrolled Academic Modules (Demonstration) -->
  <article class="dash-card">
    <header class="dash-card-header">
      <span class="dash-card-icon" aria-hidden="true">📚</span>
      <h2 class="dash-card-title">Academic Courses (Semester V)</h2>
    </header>
    <ul class="dash-detail-list">
      <li class="dash-detail-item">
        <span class="dash-detail-label">Web Technology:</span>
        <span class="dash-detail-val" style="color: #059669;">Practical 12 Active</span>
      </li>
      <li class="dash-detail-item">
        <span class="dash-detail-label">Database Management:</span>
        <span class="dash-detail-val">SQL &amp; Relational Schema</span>
      </li>
      <li class="dash-detail-item">
        <span class="dash-detail-label">Computer Networks:</span>
        <span class="dash-detail-val">TCP/IP &amp; HTTP Protocols</span>
      </li>
      <li class="dash-detail-item">
        <span class="dash-detail-label">Software Engineering:</span>
        <span class="dash-detail-val">Agile Scrum Framework</span>
      </li>
    </ul>
  </article>

  <!-- Innovation Cell & Hackathon Squad (Demonstration) -->
  <article class="dash-card">
    <header class="dash-card-header">
      <span class="dash-card-icon" aria-hidden="true">🏆</span>
      <h2 class="dash-card-title">Hackathon &amp; Activity Squad</h2>
    </header>
    <ul class="dash-detail-list">
      <li class="dash-detail-item">
        <span class="dash-detail-label">Active Project:</span>
        <span class="dash-detail-val">Smart India Hackathon 2026</span>
      </li>
      <li class="dash-detail-item">
        <span class="dash-detail-label">Team Role:</span>
        <span class="dash-detail-val">Full-Stack Web Architect</span>
      </li>
      <li class="dash-detail-item">
        <span class="dash-detail-label">Status:</span>
        <span class="dash-detail-val" style="color: #2563EB;">Regional Round 1st Prize</span>
      </li>
      <li class="dash-detail-item">
        <span class="dash-detail-label">Mentor:</span>
        <span class="dash-detail-val">KBTCOE IIC Cell Faculty</span>
      </li>
    </ul>
  </article>

</section>

<!-- Educational Persistence Notice -->
<section class="notice-box" role="note">
  <span style="font-size: 1.25rem;" aria-hidden="true">💡</span>
  <div>
    <strong>Educational Laboratory Architecture:</strong> This dashboard demonstrates session verification and data rendering using <code>htmlspecialchars()</code>. User data is read from <code>$_SESSION['user']</code>. In Assignment 13, persistent SQL queries with PHP PDO will be connected.
  </div>
</section>

</main>

<footer class="site-footer">
  <div class="container footer-flex">
    <div class="footer-left">
      <p>&copy; 2026 KBTCOE Connect — MVPS's KBT College of Engineering, Nashik. Practical Assignment 12.</p>
    </div>
    <div class="footer-right">
      <span class="tech-badge">Protected Session Console</span>
    </div>
  </div>
</footer>

</body>
</html>
