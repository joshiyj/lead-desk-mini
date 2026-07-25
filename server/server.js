// server/server.js — entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const leadsRouter = require('./routes/leads');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/leads', leadsRouter);
// app.use('/api/auth', authRouter);   ← Phase 5

// ── Health check ───────────────────────────────────────────────────────────
app.get('/', (_req, res) => res.json({ status: 'LeadDesk Mini API is running' }));

// ── 404 catch-all ──────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// ── DB → Server ────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
