/**
 * ==============================================================================
 * KBTCOE Connect — Opportunities Router (routes/opportunities.js)
 * Assignment 14: Node.js and Express Server
 * ==============================================================================
 */

'use strict';

const express = require('express');
const router = express.Router();
const store = require('../data/opportunities');

/**
 * Validates date formatted as YYYY-MM-DD.
 *
 * @param {string} dateString
 * @returns {boolean}
 */
function isValidDate(dateString) {
  if (typeof dateString !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const d = new Date(dateString);
  return d instanceof Date && !isNaN(d.getTime()) && d.toISOString().startsWith(dateString);
}

/**
 * Validates web URL format (http / https).
 *
 * @param {string} urlString
 * @returns {boolean}
 */
function isValidUrl(urlString) {
  if (typeof urlString !== 'string') return false;
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates opportunity creation and update payloads.
 *
 * @param {Object} body
 * @param {boolean} isCreate - True for POST (all required), false for PUT (partial updates)
 * @returns {{ isValid: boolean, errors: Array<{ field: string, message: string }> }}
 */
function validateOpportunityInput(body, isCreate = true) {
  const errors = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      isValid: false,
      errors: [{ field: 'body', message: 'Request body must be a valid JSON object' }]
    };
  }

  // Title validation
  if (isCreate || body.title !== undefined) {
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      errors.push({ field: 'title', message: 'Title is required and must be non-empty' });
    } else {
      const trimmed = body.title.trim();
      if (trimmed.length < 3 || trimmed.length > 200) {
        errors.push({ field: 'title', message: 'Title must be between 3 and 200 characters' });
      }
    }
  }

  // Organization validation
  if (isCreate || body.organization !== undefined) {
    if (!body.organization || typeof body.organization !== 'string' || body.organization.trim() === '') {
      errors.push({ field: 'organization', message: 'Organization name is required and must be non-empty' });
    } else {
      const trimmed = body.organization.trim();
      if (trimmed.length < 2 || trimmed.length > 150) {
        errors.push({ field: 'organization', message: 'Organization must be between 2 and 150 characters' });
      }
    }
  }

  // Category validation
  if (isCreate || body.category !== undefined) {
    if (!body.category || typeof body.category !== 'string') {
      errors.push({
        field: 'category',
        message: `Category is required. Allowed values: ${store.ALLOWED_CATEGORIES.join(', ')}`
      });
    } else {
      const normalized = body.category.toLowerCase().trim();
      if (!store.ALLOWED_CATEGORIES.includes(normalized)) {
        errors.push({
          field: 'category',
          message: `Invalid category '${body.category}'. Allowed values: ${store.ALLOWED_CATEGORIES.join(', ')}`
        });
      }
    }
  }

  // Description validation
  if (isCreate || body.description !== undefined) {
    if (!body.description || typeof body.description !== 'string' || body.description.trim() === '') {
      errors.push({ field: 'description', message: 'Description is required and must be non-empty' });
    } else {
      const trimmed = body.description.trim();
      if (trimmed.length < 10 || trimmed.length > 2000) {
        errors.push({ field: 'description', message: 'Description must be between 10 and 2000 characters' });
      }
    }
  }

  // Optional: Eligibility validation
  if (body.eligibility !== undefined && typeof body.eligibility === 'string') {
    if (body.eligibility.trim().length > 255) {
      errors.push({ field: 'eligibility', message: 'Eligibility criteria must not exceed 255 characters' });
    }
  }

  // Optional: Application URL validation
  if (body.applicationUrl !== undefined && body.applicationUrl !== null && body.applicationUrl !== '') {
    if (!isValidUrl(body.applicationUrl)) {
      errors.push({ field: 'applicationUrl', message: 'Application URL must be a valid http or https address' });
    }
  }

  // Optional: Deadline validation
  if (body.deadline !== undefined && body.deadline !== null && body.deadline !== '') {
    if (!isValidDate(body.deadline)) {
      errors.push({ field: 'deadline', message: 'Deadline must be a valid calendar date formatted as YYYY-MM-DD' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Route-level middleware to parse and validate :id parameter as a positive integer.
 */
function validateIdParam(req, res, next) {
  const { id } = req.params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return res.status(400).json({
      success: false,
      message: `Invalid opportunity ID '${id}'. ID must be a positive integer.`
    });
  }

  req.numericId = numericId;
  next();
}

// ==============================================================================
// Opportunity Endpoints
// ==============================================================================

/**
 * GET /api/opportunities
 * Retrieves all opportunities with optional keyword search and category filtering.
 */
router.get('/', (req, res) => {
  const { q, category } = req.query;

  // Validate category if provided as query param
  if (category && !store.ALLOWED_CATEGORIES.includes(category.toLowerCase().trim())) {
    return res.status(400).json({
      success: false,
      message: `Invalid category filter '${category}'. Allowed values: ${store.ALLOWED_CATEGORIES.join(', ')}`
    });
  }

  const items = store.getAll({ q, category });

  res.status(200).json({
    success: true,
    message: 'Opportunities retrieved successfully',
    count: items.length,
    data: items
  });
});

/**
 * GET /api/opportunities/:id
 * Retrieves a single opportunity by its numeric identifier.
 */
router.get('/:id', validateIdParam, (req, res) => {
  const item = store.getById(req.numericId);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: `Opportunity with ID ${req.numericId} not found`
    });
  }

  res.status(200).json({
    success: true,
    message: 'Opportunity retrieved successfully',
    data: item
  });
});

/**
 * POST /api/opportunities
 * Creates a new campus opportunity in the in-memory store.
 */
router.post('/', (req, res) => {
  const validation = validateOpportunityInput(req.body, true);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the highlighted errors.',
      errors: validation.errors
    });
  }

  // Create record (ignoring any client-supplied ID or timestamps)
  const created = store.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Opportunity created successfully',
    data: created
  });
});

/**
 * PUT /api/opportunities/:id
 * Updates an existing opportunity in the in-memory store.
 */
router.put('/:id', validateIdParam, (req, res) => {
  const existing = store.getById(req.numericId);

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: `Cannot update: Opportunity with ID ${req.numericId} not found`
    });
  }

  const validation = validateOpportunityInput(req.body, false);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the highlighted errors.',
      errors: validation.errors
    });
  }

  const updated = store.update(req.numericId, req.body);

  res.status(200).json({
    success: true,
    message: `Opportunity with ID ${req.numericId} updated successfully`,
    data: updated
  });
});

/**
 * DELETE /api/opportunities/:id
 * Deletes an opportunity from the in-memory store.
 */
router.delete('/:id', validateIdParam, (req, res) => {
  const existing = store.getById(req.numericId);

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: `Cannot delete: Opportunity with ID ${req.numericId} not found`
    });
  }

  store.remove(req.numericId);

  res.status(200).json({
    success: true,
    message: `Opportunity with ID ${req.numericId} ('${existing.title}') was successfully deleted`,
    data: {
      id: req.numericId,
      deletedAt: new Date().toISOString()
    }
  });
});

module.exports = router;
