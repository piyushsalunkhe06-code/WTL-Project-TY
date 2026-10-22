<?php
/**
 * ==============================================================================
 * KBTCOE Connect — Student Registration Module (register.php)
 * Assignment 12: PHP Form Handling & Session Authentication
 * ==============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

// Access Control: Redirect authenticated students directly to their dashboard
require_guest();

$errors = [];
$old = [
    'name' => '',
    'email' => '',
    'student_id' => '',
    'branch' => '',
    'year' => ''
];

// Handle HTTP POST Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // 1. Sanitize and retrieve input values
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $student_id = trim($_POST['student_id'] ?? '');
    $branch = trim($_POST['branch'] ?? '');
    $year = trim($_POST['year'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Retain sanitized inputs for form redisplay (exclude passwords for security)
    $old = [
        'name' => $name,
        'email' => $email,
        'student_id' => $student_id,
        'branch' => $branch,
        'year' => $year
    ];

    // 2. Validate Full Name
    if ($name === '') {
        $errors['name'] = 'Full name is required.';
    } elseif (mb_strlen($name) < 2 || mb_strlen($name) > 60) {
        $errors['name'] = 'Full name must be between 2 and 60 characters.';
    }

    // 3. Validate Student Email
    if ($email === '') {
        $errors['email'] = 'Student email address is required.';
    } elseif (!validate_email($email)) {
        $errors['email'] = 'Please enter a valid email address (e.g., student@kbtcoe.org).';
    } elseif (find_user_by_email($email) !== null) {
        $errors['email'] = 'A student account with this email address already exists. Please sign in or use a different email.';
    }

    // 4. Validate Student ID / PRN (Configurable Demonstration Format)
    if ($student_id === '') {
        $errors['student_id'] = 'Student ID / PRN is required.';
    } elseif (!validate_student_id($student_id)) {
        $errors['student_id'] = 'Invalid Student ID format. Expected demonstration format: KBT-YYYY-DEPTXX (e.g. KBT-2026-CS42).';
    }

    // 5. Validate Engineering Branch
    if ($branch === '') {
        $errors['branch'] = 'Please select your engineering department.';
    } elseif (!in_array($branch, ALLOWED_BRANCHES, true)) {
        $errors['branch'] = 'Selected department is not recognized in the approved academic catalog.';
    }

    // 6. Validate Academic Year
    if ($year === '') {
        $errors['year'] = 'Please select your current academic year of study.';
    } elseif (!in_array($year, ALLOWED_YEARS, true)) {
        $errors['year'] = 'Selected academic year is invalid.';
    }

    // 7. Validate Password Complexity
    if ($password === '') {
        $errors['password'] = 'Password is required.';
    } elseif (strlen($password) < 8) {
        $errors['password'] = 'Password must be at least 8 characters in length.';
    }

    // 8. Validate Password Confirmation Match
    if ($confirm_password === '') {
        $errors['confirm_password'] = 'Please confirm your password.';
    } elseif ($password !== $confirm_password) {
        $errors['confirm_password'] = 'Passwords do not match. Please re-enter identical credentials.';
    }

    // 9. Process Registration if All Validations Pass
    if (empty($errors)) {
        $registered = register_user([
            'name' => $name,
            'email' => $email,
            'student_id' => $student_id,
            'branch' => $branch,
            'year' => $year,
            'password_hash' => hash_password($password)
        ]);

        if ($registered) {
            set_flash('success', 'Registration completed successfully! You can now sign in with your email and password.');
            // Follow POST/Redirect/GET pattern
            redirect('login.php');
        } else {
            $errors['email'] = 'An account with this email address was registered concurrently. Please try another email.';
        }
    }
}

$page_title = 'Student Registration — KBTCOE Connect | Assignment 12';
require_once __DIR__ . '/includes/header.php';
?>

<div class="auth-wrapper">
  <article class="auth-card">
    
    <header class="auth-header">
      <h1 class="auth-title">Create Student Account</h1>
      <p class="auth-desc">Register for KBTCOE Connect to join student discussion feeds, hackathon squads, and opportunity boards.</p>
    </header>

    <?php if (!empty($errors)): ?>
      <div class="flash-alert flash-danger" role="alert">
        <span class="flash-icon" aria-hidden="true">⚠️</span>
        <div class="flash-message">Please correct the highlighted validation errors below to complete registration.</div>
      </div>
    <?php endif; ?>

    <form action="register.php" method="POST" class="auth-form" novalidate aria-label="Student Registration Form">
      
      <!-- Full Name -->
      <div class="form-group">
        <label for="name" class="form-label">
          Full Name <span class="required-star">*</span>
        </label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          class="form-input <?= isset($errors['name']) ? 'has-error' : '' ?>" 
          value="<?= e($old['name']) ?>"
          placeholder="e.g. Tanmay Shinde" 
          required 
          autocomplete="name"
          aria-describedby="<?= isset($errors['name']) ? 'nameError' : '' ?>"
          <?= isset($errors['name']) ? 'aria-invalid="true"' : '' ?>
        >
        <?php if (isset($errors['name'])): ?>
          <span id="nameError" class="field-error" role="alert"><?= e($errors['name']) ?></span>
        <?php endif; ?>
      </div>

      <!-- Student Email -->
      <div class="form-group">
        <label for="email" class="form-label">
          Student Email Address <span class="required-star">*</span>
        </label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          class="form-input <?= isset($errors['email']) ? 'has-error' : '' ?>" 
          value="<?= e($old['email']) ?>"
          placeholder="e.g. tanmay.shinde@kbtcoe.org" 
          required 
          autocomplete="email"
          aria-describedby="emailHint <?= isset($errors['email']) ? 'emailError' : '' ?>"
          <?= isset($errors['email']) ? 'aria-invalid="true"' : '' ?>
        >
        <span id="emailHint" class="form-hint">Used as your unique student sign-in identifier.</span>
        <?php if (isset($errors['email'])): ?>
          <span id="emailError" class="field-error" role="alert"><?= e($errors['email']) ?></span>
        <?php endif; ?>
      </div>

      <!-- Student ID / PRN -->
      <div class="form-group">
        <label for="student_id" class="form-label">
          Student ID / PRN <span class="required-star">*</span>
        </label>
        <input 
          type="text" 
          id="student_id" 
          name="student_id" 
          class="form-input <?= isset($errors['student_id']) ? 'has-error' : '' ?>" 
          value="<?= e($old['student_id']) ?>"
          placeholder="e.g. KBT-2026-CS42" 
          required 
          autocomplete="off"
          aria-describedby="idHint <?= isset($errors['student_id']) ? 'idError' : '' ?>"
          <?= isset($errors['student_id']) ? 'aria-invalid="true"' : '' ?>
        >
        <span id="idHint" class="form-hint">Demonstration pattern: KBT-YYYY-DEPTXX (e.g. KBT-2026-CS42).</span>
        <?php if (isset($errors['student_id'])): ?>
          <span id="idError" class="field-error" role="alert"><?= e($errors['student_id']) ?></span>
        <?php endif; ?>
      </div>

      <!-- Department / Branch Dropdown -->
      <div class="form-group">
        <label for="branch" class="form-label">
          Engineering Department <span class="required-star">*</span>
        </label>
        <select 
          id="branch" 
          name="branch" 
          class="form-select <?= isset($errors['branch']) ? 'has-error' : '' ?>"
          required
          aria-describedby="<?= isset($errors['branch']) ? 'branchError' : '' ?>"
          <?= isset($errors['branch']) ? 'aria-invalid="true"' : '' ?>
        >
          <option value="">-- Select Your Department --</option>
          <?php foreach (ALLOWED_BRANCHES as $branch_opt): ?>
            <option value="<?= e($branch_opt) ?>" <?= $old['branch'] === $branch_opt ? 'selected' : '' ?>>
              <?= e($branch_opt) ?>
            </option>
          <?php endforeach; ?>
        </select>
        <?php if (isset($errors['branch'])): ?>
          <span id="branchError" class="field-error" role="alert"><?= e($errors['branch']) ?></span>
        <?php endif; ?>
      </div>

      <!-- Academic Year Dropdown -->
      <div class="form-group">
        <label for="year" class="form-label">
          Current Academic Year <span class="required-star">*</span>
        </label>
        <select 
          id="year" 
          name="year" 
          class="form-select <?= isset($errors['year']) ? 'has-error' : '' ?>"
          required
          aria-describedby="<?= isset($errors['year']) ? 'yearError' : '' ?>"
          <?= isset($errors['year']) ? 'aria-invalid="true"' : '' ?>
        >
          <option value="">-- Select Academic Year --</option>
          <?php foreach (ALLOWED_YEARS as $year_opt): ?>
            <option value="<?= e($year_opt) ?>" <?= $old['year'] === $year_opt ? 'selected' : '' ?>>
              <?= e($year_opt) ?>
            </option>
          <?php endforeach; ?>
        </select>
        <?php if (isset($errors['year'])): ?>
          <span id="yearError" class="field-error" role="alert"><?= e($errors['year']) ?></span>
        <?php endif; ?>
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
          class="form-input <?= isset($errors['password']) ? 'has-error' : '' ?>" 
          placeholder="At least 8 characters" 
          required 
          autocomplete="new-password"
          aria-describedby="passHint <?= isset($errors['password']) ? 'passError' : '' ?>"
          <?= isset($errors['password']) ? 'aria-invalid="true"' : '' ?>
        >
        <span id="passHint" class="form-hint">Must be at least 8 characters in length.</span>
        <?php if (isset($errors['password'])): ?>
          <span id="passError" class="field-error" role="alert"><?= e($errors['password']) ?></span>
        <?php endif; ?>
      </div>

      <!-- Confirm Password -->
      <div class="form-group">
        <label for="confirm_password" class="form-label">
          Confirm Password <span class="required-star">*</span>
        </label>
        <input 
          type="password" 
          id="confirm_password" 
          name="confirm_password" 
          class="form-input <?= isset($errors['confirm_password']) ? 'has-error' : '' ?>" 
          placeholder="Re-enter your password" 
          required 
          autocomplete="new-password"
          aria-describedby="<?= isset($errors['confirm_password']) ? 'confirmError' : '' ?>"
          <?= isset($errors['confirm_password']) ? 'aria-invalid="true"' : '' ?>
        >
        <?php if (isset($errors['confirm_password'])): ?>
          <span id="confirmError" class="field-error" role="alert"><?= e($errors['confirm_password']) ?></span>
        <?php endif; ?>
      </div>

      <!-- Submit Action -->
      <div class="form-actions">
        <button type="submit" class="btn-primary">
          <span>Create Account</span> &rarr;
        </button>
      </div>

    </form>

    <footer class="auth-footer-links">
      <p>Already have a registered account? <a href="login.php">Sign in here</a></p>
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
      <span class="tech-badge">Server-Side Validation Engine</span>
    </div>
  </div>
</footer>

</body>
</html>
