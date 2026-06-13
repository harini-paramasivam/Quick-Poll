const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
};

const notFound = (req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
};

module.exports = { errorHandler, notFound };
