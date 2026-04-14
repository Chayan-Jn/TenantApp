import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import pool from '../../config/db.js'
import { env } from '../../config/env.js'

// Initialize Google Client
const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID)

export const registerOwner = async ({ name, username, password }) => {
  try {
    const existing = await pool.query('SELECT id FROM owners WHERE username = $1', [username])
    if (existing.rows.length) throw new Error('Username already taken')

    const hash = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO owners (name, username, password_hash) VALUES ($1, $2, $3) RETURNING id, name, username',
      [name, username, hash]
    )
    return result.rows[0]
  } catch (err) {
    throw err
  }
}

export const loginOwner = async ({ username, password }) => {
  try {
    const result = await pool.query('SELECT * FROM owners WHERE username = $1', [username])
    const owner = result.rows[0]
    if (!owner) throw new Error('Invalid credentials')

    // Standard Login checks the password hash
    const valid = await bcrypt.compare(password, owner.password_hash)
    if (!valid) throw new Error('Invalid credentials')

    const token = jwt.sign({ id: owner.id, username: owner.username, token_version: owner.token_version }, env.JWT_SECRET, { expiresIn: '7d' })
    return { token, owner: { id: owner.id, name: owner.name, username: owner.username } }
  } catch (err) {
    throw err
  }
}

export const loginWithGoogle = async (googleToken) => {
  try {
    // 1. We let Google do the password checking. We just verify the token is authentic.
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: env.GOOGLE_CLIENT_ID,
    })
    
    const { email, name, sub: googleId } = ticket.getPayload()

    // 2. Find the user by their Google email
    const existing = await pool.query('SELECT * FROM owners WHERE email = $1', [email])
    let owner = existing.rows[0]

    // 3. If it's their first time clicking the Google button, register them silently
    if (!owner) {
      // Create a URL-safe username out of their email prefix + short unique suffix
      const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '')
      const uniqueSuffix = crypto.randomUUID().slice(0, 8)
      const uniqueUsername = `${baseUsername}_${uniqueSuffix}`

      // Generate a dummy password purely to satisfy the DB constraint. 
      // It is never used in bcrypt.compare because Google users always route through this function instead.
      const dummyPassword = `GOOG_${googleId}_${crypto.randomUUID()}`
      const hash = await bcrypt.hash(dummyPassword, 10)

      const result = await pool.query(
        'INSERT INTO owners (name, username, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, username, email, token_version',
        [name, uniqueUsername, email, hash]
      )
      owner = result.rows[0]
    }

    const token = jwt.sign(
      { id: owner.id, username: owner.username, token_version: owner.token_version }, 
      env.JWT_SECRET, 
      { expiresIn: '7d' }
    )

    return { 
      token, 
      owner: { id: owner.id, name: owner.name, username: owner.username } 
    }
  } catch (err) {
    throw new Error('Invalid Google token or verification failed')
  }
}

export const revokeTokens = async (ownerId) => {
  await pool.query('UPDATE owners SET token_version = token_version + 1 WHERE id = $1', [ownerId]);
}