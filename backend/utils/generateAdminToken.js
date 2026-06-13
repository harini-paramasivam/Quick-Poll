const crypto = require('crypto');

const generateAdminToken = () => crypto.randomBytes(24).toString('hex');

module.exports = generateAdminToken;
