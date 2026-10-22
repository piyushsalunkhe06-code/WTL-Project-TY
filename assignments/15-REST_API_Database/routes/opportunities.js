/**
 * ==============================================================================
 * KBTCOE Connect — Opportunities Router (routes/opportunities.js)
 * Assignment 15: REST API and Database
 * ==============================================================================
 */

'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/opportunityController');

// Opportunities Endpoints
router.get('/', controller.getAllOpportunities);
router.get('/:id', controller.getOpportunityById);
router.post('/', controller.createOpportunity);
router.put('/:id', controller.updateOpportunity);
router.delete('/:id', controller.deleteOpportunity);

module.exports = router;
