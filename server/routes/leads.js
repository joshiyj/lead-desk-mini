// server/routes/leads.js — leads router
const express = require('express');
const router = express.Router();

const Lead = require('../models/Lead');
const { LeadSchema } = require('../lib/validation');
const requireAuth = require('../middleware/auth');

// ── POST /api/leads — public ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  const result = LeadSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  try {
    const lead = await Lead.create(result.data);
    return res.status(201).json({ message: 'Lead submitted successfully', lead });
  } catch (err) {
    console.error('POST /api/leads:', err);
    return res.status(500).json({ message: 'Server error — please try again' });
  }
});

// ── GET /api/leads — JWT protected ─────────────────────────────────────
// Query params:
//   ?search=<text>   → matches name, email, OR message (case-insensitive)
//   ?status=New|Contacted|Closed  → filter by status
router.get('/', requireAuth, async (req, res) => {
  try {
    const { search = '', status } = req.query;

    const filter = {};

    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { email: regex },
        { message: regex },
      ];
    }

    if (status && ['New', 'Contacted', 'Closed'].includes(status)) {
      filter.status = status;
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 }); // newest first
    return res.json({ leads });
  } catch (err) {
    console.error('GET /api/leads:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ── PATCH /api/leads/:id/status — JWT protected ───────────────────────
router.patch('/:id/status', requireAuth, async (req, res) => {
  const { status } = req.body;

  if (!status || !['New', 'Contacted', 'Closed'].includes(status)) {
    return res.status(400).json({
      message: "status must be one of 'New', 'Contacted', 'Closed'",
    });
  }

  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    return res.json({ message: 'Status updated', lead });
  } catch (err) {
    console.error('PATCH /api/leads/:id/status:', err);
    // Invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid lead ID' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
