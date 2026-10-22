/**
 * Campus Opportunities Routes
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', opportunityController.getOpportunities);
router.get('/:id', opportunityController.getOpportunityById);
router.post('/', requireAuth, opportunityController.createOpportunity);
router.put('/:id', requireAuth, opportunityController.updateOpportunity);
router.delete('/:id', requireAuth, opportunityController.deleteOpportunity);

module.exports = router;
