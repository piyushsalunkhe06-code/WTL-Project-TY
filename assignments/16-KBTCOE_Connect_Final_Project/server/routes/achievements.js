/**
 * Student Achievements Routes
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', achievementController.getAchievements);
router.get('/:id', achievementController.getAchievementById);
router.post('/', requireAuth, achievementController.createAchievement);
router.put('/:id', requireAuth, achievementController.updateAchievement);
router.delete('/:id', requireAuth, achievementController.deleteAchievement);

module.exports = router;
