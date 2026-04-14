import rateLimit from 'express-rate-limit'

export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' }
})
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later' }
})