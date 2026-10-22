/**
 * ==============================================================================
 * KBTCOE Connect — Authentication Router (routes/auth.js)
 * Assignment 15: REST API and Database
 * ==============================================================================
 */

'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public Authentication Endpoints
router.post('/register', controller.register);
router.post('/login', controller.login);

// Protected Identity Endpoint
router.get('/me', authMiddleware, controller.getMe);

module.exports = router;
