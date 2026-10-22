<?php
/**
 * ==============================================================================
 * KBTCOE Connect — Shared Header Template (header.php)
 * Assignment 12: PHP Form Handling & Session Authentication
 * ==============================================================================
 */

declare(strict_types=1);

$page_title = $page_title ?? 'KBTCOE Connect — Student Portal';
$flash = get_flash();
$current_user = get_authenticated_user();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="KBTCOE Connect — Assignment 12: PHP Form Handling, Server-side Validation, Password Hashing, and Session Authentication.">
  <title><?= e($page_title) ?></title>
  
  <!-- External CSS Stylesheet -->
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>

  <!-- Accessible Skip Link -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Top Global Header -->
  <header class="site-header">
    <div class="container header-flex">
      
      <!-- Brand & Logo -->
      <div class="brand-container">
        <a href="index.php" class="brand-link" aria-label="KBTCOE Connect Home">
          <img src="assets/kbtcoe-logo.svg" alt="KBTCOE Connect Logo" class="brand-logo" width="220" height="38">
        </a>
      </div>

      <!-- Navigation Links -->
      <nav class="site-nav" aria-label="Portal Navigation">
        <ul class="nav-list">
          <li><a href="index.php" class="nav-link <?= basename($_SERVER['PHP_SELF']) === 'index.php' ? 'active' : '' ?>">Home</a></li>
          
          <?php if ($current_user): ?>
            <li><a href="dashboard.php" class="nav-link <?= basename($_SERVER['PHP_SELF']) === 'dashboard.php' ? 'active' : '' ?>">Dashboard</a></li>
          <?php else: ?>
            <li><a href="login.php" class="nav-link <?= basename($_SERVER['PHP_SELF']) === 'login.php' ? 'active' : '' ?>">Login</a></li>
            <li><a href="register.php" class="nav-link <?= basename($_SERVER['PHP_SELF']) === 'register.php' ? 'active' : '' ?>">Register</a></li>
          <?php endif; ?>
        </ul>
      </nav>

      <!-- User Auth Status / Action Pill -->
      <div class="header-auth-actions">
        <?php if ($current_user): ?>
          <div class="user-pill">
            <span class="user-avatar" aria-hidden="true"><?= e(strtoupper(substr($current_user['name'], 0, 2))) ?></span>
            <div class="user-info">
              <span class="user-name"><?= e($current_user['name']) ?></span>
              <span class="user-branch"><?= e($current_user['branch']) ?></span>
            </div>
          </div>
          <a href="logout.php" class="btn-logout-link" title="End active student session">Logout</a>
        <?php else: ?>
          <a href="login.php" class="btn-header-login">Sign In</a>
        <?php endif; ?>
      </div>

    </div>
  </header>

  <!-- Flash Message Region -->
  <?php if ($flash): ?>
    <div class="container flash-container" role="alert" aria-live="polite">
      <div class="flash-alert flash-<?= e($flash['type']) ?>">
        <span class="flash-icon" aria-hidden="true">
          <?= $flash['type'] === 'success' ? '✅' : ($flash['type'] === 'danger' ? '⚠️' : 'ℹ️') ?>
        </span>
        <div class="flash-message"><?= e($flash['message']) ?></div>
      </div>
    </div>
  <?php endif; ?>

  <!-- Main Content Wrapper Starts -->
  <main id="main-content" class="container main-layout">
