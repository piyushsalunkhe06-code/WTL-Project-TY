<?php
/**
 * ==============================================================================
 * KBTCOE Connect — Shared Header Template (header.php)
 * Assignment 13: PHP and MySQL CRUD — Campus Opportunity Management Portal
 * ==============================================================================
 */

declare(strict_types=1);

$page_title = $page_title ?? 'Campus Opportunity Management Portal — KBTCOE Connect';
$flash = get_flash();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="KBTCOE Connect — Assignment 13: PHP and MySQL CRUD portal using PDO prepared statements and responsive UI.">
  <title><?= e($page_title) ?></title>
  
  <!-- External CSS Stylesheet -->
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>

  <!-- Accessible Skip Navigation Link -->
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
          <li><a href="index.php" class="nav-link <?= basename($_SERVER['PHP_SELF']) === 'index.php' ? 'active' : '' ?>">Opportunities</a></li>
          <li><a href="create.php" class="nav-link <?= basename($_SERVER['PHP_SELF']) === 'create.php' ? 'active' : '' ?>">+ Post Opportunity</a></li>
        </ul>
      </nav>

      <!-- Database Connectivity Indicator -->
      <div class="header-db-status">
        <?php if ($is_db_connected): ?>
          <span class="db-badge db-connected" title="Active connection to MySQL database via PDO">
            <span class="status-dot green-dot" aria-hidden="true"></span>
            MySQL Connected
          </span>
        <?php else: ?>
          <span class="db-badge db-disconnected" title="Awaiting MySQL service startup">
            <span class="status-dot red-dot" aria-hidden="true"></span>
            MySQL Disconnected
          </span>
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

  <!-- Database Disconnect Advisory Notice (Shown only if PDO connection fails) -->
  <?php if (!$is_db_connected): ?>
    <div class="container flash-container">
      <aside class="notice-box notice-warning" role="alert">
        <span class="notice-icon" aria-hidden="true">⚠️</span>
        <div class="notice-text">
          <strong>Database Connection Notice:</strong> Could not connect to the MySQL database (<code>kbtcoe_connect_crud</code>) on <code>127.0.0.1:3306</code>.
          <br>
          Please ensure your local MySQL / MariaDB service is running and has imported <code>database/schema.sql</code> and <code>database/seed.sql</code>.
          <br>
          <em>Credentials can be configured via environment variables <code>DB_HOST</code>, <code>DB_USER</code>, <code>DB_PASS</code> or <code>config/database.php</code>.</em>
        </div>
      </aside>
    </div>
  <?php endif; ?>

  <!-- Main Content Wrapper Starts -->
  <main id="main-content" class="container main-layout">
