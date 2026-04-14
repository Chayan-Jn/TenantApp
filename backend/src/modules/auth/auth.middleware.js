import jwt from 'jsonwebtoken'
import { env } from '../../config/env.js'
import pool from '../../config/db.js'

export const protect = async (req, res, next) => {
  const token = req.cookies?.token
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated' })
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)
    
    // Check token version against DB
    const result = await pool.query('SELECT token_version FROM owners WHERE id = $1', [decoded.id]);
    if (!result.rows.length || result.rows[0].token_version !== decoded.token_version) {
      return res.status(401).json({ success: false, message: 'Session expired or revoked' });
    }

    req.owner = decoded
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
}