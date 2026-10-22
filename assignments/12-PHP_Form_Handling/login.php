<?php
/**
 * ==============================================================================
 * KBTCOE Connect — Student Login Module (login.php)
 * Assignment 12: PHP Form Handling & Session Authentication
 * ==============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

// Access Control: Redirect authenticated students directly to their dashboard
require_guest();

$error = '';
$email_input = '';

// Handle HTTP POST Authentication
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    $email_input = $email;

    // 1. Basic Presence Validation
    if ($email === '' || $password === '') {
        $error = 'Please enter both your student email and password.';
    } else {
        // 2. Lookup user by email in session store
        $user = find_user_by_email($email);

        // 3. Verify BCrypt password hash
        if ($user !== null && verify_password($password, $user['password_hash'])) {
            
            // SECURITY REQUIREMENT:
            // Regenerate session ID to prevent Session Fixation attacks
            session_regenerate_id(true);

            // Establish authenticated session payload (exclude password hashes)
            $_SESSION['user'] = [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'student_id' => $user['student_id'],
                'branch' => $user['branch'],
                'year' => $user['year'],
                'logged_in_at' => date('Y-m-d H:i:s')
            ];

            set_flash('success', 'Welcome back, ' . $user['name'] . '! You have successfully signed in.');
            redirect('dashboard.php');

        } else {
            // SECURITY REQUIREMENT:
            // Display a generic invalid credentials message to prevent username/email enumeration.
            $error = 'Invalid email address or password. Please verify your credentials and try again.';
        }
    }
}

$page_title = 'Student Sign In — KBTCOE Connect | Assignment 12';
require_once __DIR__ . '/includes/header.php';
?>

<div class="auth-wrapper">
  <article class="auth-card">
    
    <header class="auth-header">
      <h1 class="auth-title">Student Sign In</h1>
      <p class="auth-desc">Sign in with your registered college email and password to access your dashboard.</p>
    </header>

    <!-- Generic Error Banner (Prevents Account Enumeration) -->
    <?php if ($error !== ''): ?>
      <div class="flash-alert flash-danger" role="alert" aria-live="assertive">
        <span class="flash-icon" aria-hidden="true">⚠️</span>
        <div class="flash-message"><?= e($error) ?></div>
      </div>
    <?php endif; ?>

    <form action="login.php" method="POST" class="auth-form" novalidate aria-label="Student Sign In Form">
      
      <!-- Student Email -->
      <div class="form-group">
        <label for="email" class="form-label">
          Student Email Address <span class="required-star">*</span>
        </label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          class="form-input <?= $error !== '' ? 'has-error' : '' ?>" 
          value="<?= e($email_input) ?>"
          placeholder="e.g. sanket.patil@kbtcoe.org" 
          required 
          autocomplete="email"
          aria-required="true"
        >
      </div>

      <!-- Password -->
      <div class="form-group">
        <label for="password" class="form-label">
          Password <span class="required-star">*</span>
        </label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          class="form-input <?= $error !== '' ? 'has-error' : '' ?>" 
          placeholder="Enter your password" 
          required 
          autocomplete="current-password"
          aria-required="true"
        >
      </div>

      <!-- Submit Action -->
      <div class="form-actions">
        <button type="submit" class="btn-primary">
          <span>Sign In to Account</span> &rarr;
        </button>
      </div>

    </form>

    <!-- Seed Demonstration Credentials Callout -->
    <div class="seed-box" style="margin-top: 1.5rem; padding: 0.85rem 1rem;">
      <div class="seed-title" style="font-size: 0.825rem;">
        <span aria-hidden="true">💡</span> Pre-Seeded Demonstration Account:
      </div>
      <div class="seed-info" style="font-size: 0.775rem;">
        Email: <code class="seed-code">sanket.patil@kbtcoe.org</code> &nbsp;|&nbsp;
        Pass: <code class="seed-code">Password@123</code>
      </div>
    </div>

    <footer class="auth-footer-links">
      <p>Do not have an account yet? <a href="register.php">Create a new student account</a></p>
    </footer>

  </article>
</div>

</main>

<footer class="site-footer">
  <div class="container footer-flex">
    <div class="footer-left">
      <p>&copy; 2026 KBTCOE Connect — MVPS's KBT College of Engineering, Nashik. Practical Assignment 12.</p>
    </div>
    <div class="footer-right">
      <span class="tech-badge">BCrypt Authentication &amp; Sessions</span>
    </div>
  </div>
</footer>

</body>
</html>
