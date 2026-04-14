export const validateId = (paramName = 'id') => (req, res, next) => {
  const value = req.params[paramName];
  if (!value) {
    return next();
  }
  
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed <= 0 || String(parsed) !== value) {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format for ${paramName}. Must be a positive integer.`
    });
  }
  
  next();
};
