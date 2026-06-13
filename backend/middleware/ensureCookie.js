const crypto = require('crypto');

module.exports = (req, res, next) => {
  try {
    const cookieName = 'quickpoll_voter';
    const existing = req.cookies && req.cookies[cookieName];
    if (!existing) {
      const fingerprint = crypto.randomBytes(24).toString('hex');
      const isProd = process.env.NODE_ENV === 'production';
      res.cookie(cookieName, fingerprint, {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });
      // attach to req so later handlers can read without requiring next request
      req.cookies = req.cookies || {};
      req.cookies[cookieName] = fingerprint;
    }
  } catch (err) {
    // don't block request on cookie set failure; log and continue
    console.error('ensureCookie middleware error:', err && err.message ? err.message : err);
  }
  return next();
};
