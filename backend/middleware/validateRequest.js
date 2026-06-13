const validator = require('validator');
const mongoose = require('mongoose');

const requireFields = (fields, body) => {
  const missing = fields.filter((field) => !Object.prototype.hasOwnProperty.call(body, field));
  return missing;
};

const validateNewPoll = (req, res, next) => {
  const { title, options, expiresAt } = req.body;
  const missing = requireFields(['title', 'options'], req.body);

  if (missing.length) {
    return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });
  }

  if (!validator.isLength(title, { min: 5, max: 200 })) {
    return res.status(400).json({ message: 'Poll title must be between 5 and 200 characters' });
  }

  if (!Array.isArray(options) || options.length < 2 || options.length > 5) {
    return res.status(400).json({ message: 'Poll options must include between 2 and 5 items' });
  }

  const trimmedOptions = options.map((option) => String(option || '').trim()).filter(Boolean);
  if (trimmedOptions.length !== options.length) {
    return res.status(400).json({ message: 'Option values cannot be empty' });
  }

  if (new Set(trimmedOptions).size !== trimmedOptions.length) {
    return res.status(400).json({ message: 'Poll options must be unique' });
  }

  if (expiresAt) {
    if (!validator.isISO8601(expiresAt)) {
      return res.status(400).json({ message: 'Expiry must be a valid ISO date string' });
    }
    if (!validator.isAfter(expiresAt)) {
      return res.status(400).json({ message: 'Expiry date must be in the future' });
    }
  }

  req.body.title = title.trim();
  req.body.options = trimmedOptions;
  req.body.expiresAt = expiresAt || null;
  next();
};

const validateVoteRequest = (req, res, next) => {
  const { selectedOption } = req.body;
  const { pollId } = req.params;

  if (!mongoose.isValidObjectId(pollId)) {
    return res.status(400).json({ message: 'Invalid poll ID' });
  }

  if (!selectedOption || typeof selectedOption !== 'string') {
    return res.status(400).json({ message: 'Please choose one option to vote' });
  }

  req.body.selectedOption = selectedOption.trim();
  next();
};

module.exports = { validateNewPoll, validateVoteRequest };
