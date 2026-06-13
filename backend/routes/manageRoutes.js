const express = require('express');
const { getDashboard, closePoll } = require('../controllers/manageController');

const router = express.Router();

router.get('/:adminToken', getDashboard);
router.patch('/:adminToken/close', closePoll);

module.exports = router;
