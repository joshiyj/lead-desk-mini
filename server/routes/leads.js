// server/routes/leads.js — leads router
const express = require('express');
const router = express.Router();

const Lead = require('../models/Lead');
const { LeadSchema } = require('../lib/validation');

// POST /api/leads — public, no auth
router.post('/', async (req, res) => {
  // 1. Validate with Zod
  const result = LeadSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  // 2. Persist to MongoDB
  try {
    const lead = await Lead.create(result.data);
    return res.status(201).json({ message: 'Lead submitted successfully', lead });
  } catch (err) {
    console.error('POST /api/leads error:', err);
    return res.status(500).json({ message: 'Server error — please try again' });
  }
});

// GET + PATCH stubs — implemented in Phase 4
// router.get('/', ...)
// router.patch('/:id/status', ...)

module.exports = router;
