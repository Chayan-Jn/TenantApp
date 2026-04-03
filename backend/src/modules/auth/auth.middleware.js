import jwt from 'jsonwebtoken'
import { env } from '../../config/env.js'

export const protect = (req, res, next) => {
  const token = req.cookies?.token
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated' })
  }

  try {
    req.owner = jwt.verify(token, env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
}