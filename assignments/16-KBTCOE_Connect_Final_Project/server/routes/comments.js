/**
 * Standalone Comments Routes
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { requireAuth } = require('../middleware/authMiddleware');

router.delete('/:id', requireAuth, commentController.deleteComment);

module.exports = router;
