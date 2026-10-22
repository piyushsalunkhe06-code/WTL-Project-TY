/**
 * ==============================================================================
 * KBTCOE Connect — Community Posts Router (routes/posts.js)
 * Assignment 15: REST API and Database
 * ==============================================================================
 */

'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

// Public Read Endpoints
router.get('/', controller.getAllPosts);
router.get('/:id', controller.getPostById);

// Protected Modification Endpoints (require authentication & author ownership)
router.post('/', authMiddleware, controller.createPost);
router.put('/:id', authMiddleware, controller.updatePost);
router.delete('/:id', authMiddleware, controller.deletePost);

module.exports = router;
