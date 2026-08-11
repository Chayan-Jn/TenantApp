import jwt from 'jsonwebtoken'
import { env } from '../../config/env.js'
import pool from '../../config/db.js'

export const protect = async (req, res, next) => {
  const token = req.cookies?.token
  if (!token) {
    // ---- DEMO MODE FOR ADSENSE REVIEW ----
    // If no token is provided, drop them into the Demo Account.
    // We block destructive actions (POST, PUT, PATCH, DELETE) for the demo user
    // to prevent randos from trashing the dummy data.
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return res.status(403).json({ success: false, message: 'Read-only Demo Mode active' })
    }
    
    req.owner = { id: 99999, name: 'Google Reviewer', isDemo: true }
    return next()
    // ----------------------------------------
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