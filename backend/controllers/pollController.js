const asyncHandler = require('../middleware/asyncHandler');
const pollService = require('../services/pollService');
const voteService = require('../services/voteService');

const getFingerprint = (req, res) => {
  let fingerprint = req.cookies.quickpoll_voter;
  if (!fingerprint) {
    fingerprint = require('crypto').randomBytes(24).toString('hex');
    res.cookie('quickpoll_voter', fingerprint, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
  }

  return fingerprint;
};

const createPoll = asyncHandler(async (req, res) => {
  const { title, options, expiresAt } = req.body;
  const poll = await pollService.createPoll({ title, options, expiresAt });

  res.status(201).json({
    message: 'Poll created successfully',
    pollId: poll._id,
    adminToken: poll.adminToken,
  });
});

const getPoll = asyncHandler(async (req, res) => {
  const { pollId } = req.params;
  const poll = await pollService.getPollById(pollId);

  if (!poll) {
    return res.status(404).json({ message: 'Poll not found' });
  }

  await pollService.markExpiredClosed(poll);

  res.json({
    pollId: poll._id,
    title: poll.title,
    options: poll.options,
    expiresAt: poll.expiresAt,
    isClosed: poll.isClosed,
    createdAt: poll.createdAt,
    updatedAt: poll.updatedAt,
  });
});

const submitVote = asyncHandler(async (req, res) => {
  const { pollId } = req.params;
  const { selectedOption } = req.body;
  const poll = await pollService.getPollById(pollId);

  if (!poll) {
    return res.status(404).json({ message: 'Poll not found' });
  }

  await pollService.markExpiredClosed(poll);

  if (poll.isClosed) {
    return res.status(403).json({ message: 'This poll is closed or expired and cannot accept votes' });
  }

  const optionExists = poll.options.some((option) => option.id === selectedOption);
  if (!optionExists) {
    return res.status(400).json({ message: 'Selected option is invalid' });
  }

  const voterFingerprint = getFingerprint(req, res);
  const alreadyVoted = await voteService.hasVoted(pollId, voterFingerprint);

  if (alreadyVoted) {
    return res.status(409).json({ message: 'You have already voted on this poll' });
  }

  try {
    await voteService.castVote({ pollId, selectedOption, voterFingerprint });
    res.status(201).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You have already voted on this poll' });
    }
    throw error;
  }
});

const getResults = asyncHandler(async (req, res) => {
  const { pollId } = req.params;
  const poll = await pollService.getPollById(pollId);

  if (!poll) {
    return res.status(404).json({ message: 'Poll not found' });
  }

  await pollService.markExpiredClosed(poll);

  const votes = await voteService.getResults(pollId);
  const totalVotes = votes.length;
  const counts = poll.options.map((option) => ({
    id: option.id,
    label: option.label,
    votes: votes.filter((vote) => vote.selectedOption === option.id).length,
  }));

  const results = counts.map((option) => ({
    ...option,
    percentage: totalVotes ? Math.round((option.votes / totalVotes) * 100) : 0,
  }));

  res.json({
    pollId: poll._id,
    title: poll.title,
    options: results,
    totalVotes,
    expiresAt: poll.expiresAt,
    isClosed: poll.isClosed,
  });
});

module.exports = { createPoll, getPoll, submitVote, getResults };
