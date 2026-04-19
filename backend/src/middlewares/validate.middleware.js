export const validate = (schema, source = 'body') => (req, res, next) => {
    const data = source === 'query' ? req.query : req.body;
    const result = schema.safeParse(data);
  
    if (!result.success) {
      const messages = result.error.issues.map(e => e.message);
      const fieldErrors = {};
      
      result.error.issues.forEach(e => {
        if (e.path && e.path.length > 0) {
          const field = e.path.join('.');
          // Keep the first error encountered for each field
          if (!fieldErrors[field]) {
            fieldErrors[field] = e.message;
          }
        }
      });
  
      return res.status(400).json({
        success: false,
        messages,
        fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
      });
    }
  
    if (source === 'query') {
      Object.defineProperty(req, 'query', { value: result.data, configurable: true, enumerable: true });
    } else {
      req.body = result.data;
    }
    next();
  };