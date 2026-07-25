// client/src/lib/validation.js — client-side Zod schema (mirrors server)
import { z } from 'zod';

export const LeadSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(1, 'Name cannot be empty'),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Must be a valid email address'),

  budgetRange: z.enum(['<1k', '1k-5k', '5k-20k', '20k+'], {
    required_error: 'Please select a budget range',
    message: 'Please select a valid budget range',
  }),

  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(1, 'Message cannot be empty'),
});
