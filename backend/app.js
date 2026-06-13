const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const pollRoutes = require('./routes/pollRoutes');
const manageRoutes = require('./routes/manageRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const sanitizeRequest = require('./middleware/sanitizeRequest');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(sanitizeRequest);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use('/api/polls', pollRoutes);
app.use('/api/manage', manageRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
