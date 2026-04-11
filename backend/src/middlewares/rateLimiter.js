import rateLimit from 'express-rate-limit'

export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 150,
  
  keyGenerator: (req) => {
    // If the user is logged in, limit them by their unique account ID
    if (req.owner && req.owner.id) {
      return `user_${req.owner.id}` 
    }
    // If they are a guest (e.g., on the login page), fall back to their IP
    return req.ip 
  },
  message: { success: false, message: 'Too many requests, please try again later' }
})
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later' }
})