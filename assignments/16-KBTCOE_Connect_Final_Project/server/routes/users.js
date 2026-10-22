/**
 * User & Profile Routes
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/profile', requireAuth, userController.updateProfile);

module.exports = router;
