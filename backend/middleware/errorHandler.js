const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errorCode = err.code || err.errorCode;
  // Log full error server-side for diagnostics
  console.error('Unhandled error:', { message, status, errorCode, stack: err.stack });
  const payload = { message };
  if (errorCode) payload.errorCode = errorCode;
  res.status(status).json(payload);
};

const notFound = (req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
};

module.exports = { errorHandler, notFound };
