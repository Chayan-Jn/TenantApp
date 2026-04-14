export const validate = (schema, source = 'body') => (req, res, next) => {
    const data = source === 'query' ? req.query : req.body;
    const result = schema.safeParse(data);
  
    if (!result.success) {
      const messages = result.error.issues.map(e => e.message);
  
      return res.status(400).json({
        success: false,
        messages
      });
    }
  
    if (source === 'query') {
      req.query = result.data;
    } else {
      req.body = result.data;
    }
    next();
  };