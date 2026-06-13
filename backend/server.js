const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./config/db');

dotenv.config();

// Ensure NODE_ENV has a safe default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const CLIENT_URL = process.env.CLIENT_URL;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment');
  process.exit(1);
}

// In production ensure CLIENT_URL is provided and valid
if (process.env.NODE_ENV === 'production') {
  if (!CLIENT_URL) {
    console.error('Missing CLIENT_URL in production environment');
    process.exit(1);
  }
  try {
    const parsed = new URL(CLIENT_URL);
    if (!/^https:?$/.test(parsed.protocol)) {
      throw new Error('CLIENT_URL must be an https URL');
    }
  } catch (err) {
    console.error('Invalid CLIENT_URL:', err.message || err);
    process.exit(1);
  }
}

// Global handlers to surface unexpected errors and avoid silent failures
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

connectDB(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`QuickPoll backend listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to MongoDB:', error.message);
    process.exit(1);
  });
