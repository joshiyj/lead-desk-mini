// server/models/Lead.js — Mongoose model
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    budgetRange: {
      type: String,
      required: [true, 'Budget range is required'],
      enum: {
        values: ['<1k', '1k-5k', '5k-20k', '20k+'],
        message: '{VALUE} is not a valid budget range',
      },
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Closed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'New',
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  },
);

module.exports = mongoose.model('Lead', leadSchema);
