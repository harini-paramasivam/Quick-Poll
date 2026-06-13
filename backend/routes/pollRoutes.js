const express = require('express');
const { createPoll, getPoll, submitVote, getResults } = require('../controllers/pollController');
const { validateNewPoll, validateVoteRequest } = require('../middleware/validateRequest');

const router = express.Router();

router.post('/', validateNewPoll, createPoll);
router.get('/:pollId', getPoll);
router.post('/:pollId/vote', validateVoteRequest, submitVote);
router.get('/:pollId/results', getResults);

module.exports = router;
