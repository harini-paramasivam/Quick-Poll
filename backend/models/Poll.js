const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const pollSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 5, maxlength: 200 },
    options: { type: [optionSchema], required: true, validate: [(arr) => arr.length >= 2 && arr.length <= 5, 'Options must contain between 2 and 5 items'] },
    expiresAt: { type: Date, default: null },
    adminToken: { type: String, required: true, unique: true },
    isClosed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Poll', pollSchema);
