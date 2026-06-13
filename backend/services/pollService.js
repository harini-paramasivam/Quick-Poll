const crypto = require('crypto');
const Poll = require('../models/Poll');

const buildOptionList = (options) =>
  options.map((label) => ({ id: crypto.randomUUID(), label: label.trim() }));

const createPoll = async ({ title, options, expiresAt }) => {
  const adminToken = crypto.randomBytes(24).toString('hex');
  const poll = await Poll.create({
    title: title.trim(),
    options: buildOptionList(options),
    expiresAt: expiresAt || null,
    adminToken,
  });
  return poll;
};

const getPollById = async (pollId) => Poll.findById(pollId).lean();

const getPollByAdminToken = async (adminToken) => Poll.findOne({ adminToken }).lean();

const markExpiredClosed = async (poll) => {
  if (!poll || !poll.expiresAt) {
    return poll;
  }

  const expired = new Date(poll.expiresAt) <= new Date();
  if (expired && !poll.isClosed) {
    await Poll.findByIdAndUpdate(poll._id, { isClosed: true });
    poll.isClosed = true;
  }

  return poll;
};

const closePollById = async (pollId) => {
  await Poll.findByIdAndUpdate(pollId, { isClosed: true });
};

const isPollActive = (poll) => poll && !poll.isClosed;

module.exports = {
  createPoll,
  getPollById,
  getPollByAdminToken,
  markExpiredClosed,
  closePollById,
  isPollActive,
};
