/**
 * Community Posts & Interactivity Routes
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const likeController = require('../controllers/likeController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');

// Post endpoints
router.get('/', optionalAuth, postController.getPosts);
router.get('/:id', optionalAuth, postController.getPostById);
router.post('/', requireAuth, postController.createPost);
router.put('/:id', requireAuth, postController.updatePost);
router.delete('/:id', requireAuth, postController.deletePost);

// Nested Comment endpoints on post
router.get('/:postId/comments', commentController.getComments);
router.post('/:postId/comments', requireAuth, commentController.createComment);

// Nested Like toggle endpoint on post
router.post('/:postId/like', requireAuth, likeController.toggleLike);

module.exports = router;
