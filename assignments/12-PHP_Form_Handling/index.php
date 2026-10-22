<?php
/**
 * ==============================================================================
 * KBTCOE Connect — Session Authentication Portal Landing (index.php)
 * Assignment 12: PHP Form Handling & Session Authentication
 * ==============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$page_title = 'Welcome — KBTCOE Connect Session Portal | Assignment 12';
require_once __DIR__ . '/includes/header.php';
?>

<!-- Page Hero -->
<section class="page-hero" aria-labelledby="landingHeading">
  <span class="lab-pill">Assignment 12 • Server-Side PHP</span>
  <h1 class="page-title" id="landingHeading">PHP Form Handling &amp; Session Authentication</h1>
  <p class="page-subtitle">
    Demonstrating server-side input sanitization, <code>filter_var()</code> validation, BCrypt password hashing, session state lifecycle, and protected routing in native PHP.
  </p>
</section>

<!-- Action Cards Grid -->
<section class="landing-grid" aria-label="Portal Navigation Modules">
  
  <!-- Registration Card -->
  <article class="card">
    <div class="card-icon" aria-hidden="true">📝</div>
    <h2 class="card-title">Student Registration</h2>
    <p class="card-desc">
      Submit new student profile records via HTTP POST. Validates PRN format, email syntax, password complexity, department dropdowns, and duplicate email prevention.
    </p>
    <a href="register.php" class="btn-card-action">Open Registration Form &rarr;</a>
  </article>

  <!-- Login Card -->
  <article class="card">
    <div class="card-icon" aria-hidden="true">🔐</div>
    <h2 class="card-title">Session Sign In</h2>
    <p class="card-desc">
      Authenticate credentials against BCrypt password hashes using <code>password_verify()</code>. Regenerates session ID via <code>session_regenerate_id()</code> to prevent session fixation.
    </p>
    <a href="login.php" class="btn-card-action">Sign In to Account &rarr;</a>
  </article>

  <!-- Protected Dashboard Card -->
  <article class="card">
    <div class="card-icon" aria-hidden="true">📊</div>
    <h2 class="card-title">Student Dashboard</h2>
    <p class="card-desc">
      Protected student console guarded by server-side session authentication. Unauthenticated requests are intercepted and redirected to the login view with a flash alert.
    </p>
    <a href="dashboard.php" class="btn-card-action">View Protected Dashboard &rarr;</a>
  </article>

</section>

<!-- Pre-Seeded Demonstration Account Callout -->
<section class="seed-box" aria-label="Demonstration Account Info">
  <h3 class="seed-title">
    <span aria-hidden="true">💡</span> Quick Evaluation Demonstration Account
  </h3>
  <p class="seed-info">
    To simplify practical verification without manual registration, a demonstration student account is pre-seeded in the active session:
  </p>
  <p class="seed-info" style="margin-top: 0.4rem;">
    <strong>Email:</strong> <code class="seed-code">sanket.patil@kbtcoe.org</code> &nbsp;|&nbsp; 
    <strong>Password:</strong> <code class="seed-code">Password@123</code> &nbsp;|&nbsp;
    <strong>PRN:</strong> <code class="seed-code">KBT-2024-CS01</code>
  </p>
</section>

<!-- Educational Architecture Notice -->
<section class="notice-box" role="note" style="margin-top: 1.5rem;">
  <span style="font-size: 1.25rem;" aria-hidden="true">📌</span>
  <div>
    <strong>Educational Laboratory Notice:</strong> In this practical, demonstration user accounts are stored in PHP session memory (<code>$_SESSION['registered_users']</code>). Account data remains active for the duration of the server session. In Assignment 13, persistent storage will be integrated using MySQL and PHP PDO.
  </div>
</section>

</main>

<!-- Global Footer -->
<footer class="site-footer">
  <div class="container footer-flex">
    <div class="footer-left">
      <p>&copy; 2026 KBTCOE Connect — MVPS's KBT College of Engineering, Nashik. Practical Assignment 12.</p>
      <p class="footer-subtext">Demonstrating Server-Side PHP Validation, password_hash, password_verify, and session_regenerate_id.</p>
    </div>
    <div class="footer-right">
      <span class="tech-badge">Native PHP 8.x Engine</span>
    </div>
  </div>
</footer>

</body>
</html>
