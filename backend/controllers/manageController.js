const asyncHandler = require('../middleware/asyncHandler');
const pollService = require('../services/pollService');
const voteService = require('../services/voteService');

const getDashboard = asyncHandler(async (req, res) => {
  const { adminToken } = req.params;
  const poll = await pollService.getPollByAdminToken(adminToken);

  if (!poll) {
    return res.status(404).json({ message: 'Dashboard not found' });
  }

  await pollService.markExpiredClosed(poll);

  const votes = await voteService.getResults(poll._id);
  const totalVotes = votes.length;
  const optionCounts = poll.options.map((option) => ({
    id: option.id,
    label: option.label,
    votes: votes.filter((vote) => vote.selectedOption === option.id).length,
  }));

  const options = optionCounts.map((option) => ({
    ...option,
    percentage: totalVotes ? Math.round((option.votes / totalVotes) * 100) : 0,
  }));

  res.json({
    pollId: poll._id,
    title: poll.title,
    options,
    totalVotes,
    expiresAt: poll.expiresAt,
    isClosed: poll.isClosed,
    createdAt: poll.createdAt,
    updatedAt: poll.updatedAt,
  });
});

const closePoll = asyncHandler(async (req, res) => {
  const { adminToken } = req.params;
  const poll = await pollService.getPollByAdminToken(adminToken);

  if (!poll) {
    return res.status(404).json({ message: 'Dashboard not found' });
  }

  await pollService.markExpiredClosed(poll);

  if (poll.isClosed) {
    return res.status(400).json({ message: 'Poll is already closed or expired' });
  }

  await pollService.closePollById(poll._id);

  res.json({ message: 'Poll closed successfully' });
});

module.exports = { getDashboard, closePoll };
