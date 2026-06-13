const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const pollRoutes = require('./routes/pollRoutes');
const manageRoutes = require('./routes/manageRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const sanitizeRequest = require('./middleware/sanitizeRequest');
const ensureCookie = require('./middleware/ensureCookie');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(sanitizeRequest);
// ensure voter cookie is present for routes that depend on it
app.use('/api', ensureCookie);

const clientUrl = process.env.CLIENT_URL;
const isProd = process.env.NODE_ENV === 'production';

// trust proxy so secure cookies work behind Render's proxy
if (isProd) {
  app.set('trust proxy', 1);
}

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    // Allow non-browser requests with no origin (curl, server-to-server)
    if (!origin) return callback(null, true);
    // In production only allow exact CLIENT_URL
    if (isProd) {
      if (!clientUrl) return callback(new Error('CLIENT_URL not configured'));
      return origin === clientUrl ? callback(null, true) : callback(new Error('CORS origin denied'));
    }

    // In development allow clientUrl if set, otherwise allow localhost:5173
    const allowed = [clientUrl, 'http://localhost:5173'].filter(Boolean);
    return allowed.includes(origin) ? callback(null, true) : callback(new Error('CORS origin denied'));
  },
};

app.use(cors(corsOptions));
// Ensure preflight requests are handled with same options
app.options('*', cors(corsOptions));

// Ensure we fail fast if in production and CLIENT_URL missing
if (isProd && !clientUrl) {
  throw new Error('CLIENT_URL must be set in production');
}

app.use('/api/polls', pollRoutes);
app.use('/api/manage', manageRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
