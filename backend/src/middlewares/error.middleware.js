export const errorHandler = (err, req, res, next) => {
  console.error('[Error]:', err.stack || err.message);
  
  const status = err.status || 500;
  // Don't leak internals in production
  const message = process.env.NODE_ENV === 'production' && status === 500 
    ? 'Internal Server Error' 
    : err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message
  });
};