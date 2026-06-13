const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./config/db');

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment');
  process.exit(1);
}

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
