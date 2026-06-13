const Vote = require('../models/Vote');

const hasVoted = async (pollId, voterFingerprint) => {
  if (!voterFingerprint) {
    return false;
  }
  return Vote.exists({ pollId, voterFingerprint });
};

const castVote = async ({ pollId, selectedOption, voterFingerprint }) => {
  return Vote.create({ pollId, selectedOption, voterFingerprint });
};

const getResults = async (pollId) => {
  const votes = await Vote.find({ pollId }).lean();
  return votes;
};

module.exports = {
  hasVoted,
  castVote,
  getResults,
};
