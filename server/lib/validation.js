// server/lib/validation.js — Zod schema (server-side, mirrors client shape)
const { z } = require('zod');

const LeadSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(1, 'Name cannot be empty'),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Must be a valid email address'),

  budgetRange: z.enum(['<1k', '1k-5k', '5k-20k', '20k+'], {
    required_error: 'Budget range is required',
    message: "Budget must be one of '<1k', '1k-5k', '5k-20k', '20k+'",
  }),

  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(1, 'Message cannot be empty'),
});

module.exports = { LeadSchema };
