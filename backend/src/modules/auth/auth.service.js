import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../../config/db.js'
import { env } from '../../config/env.js'

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

    const valid = await bcrypt.compare(password, owner.password_hash)
    if (!valid) throw new Error('Invalid credentials')

    const token = jwt.sign({ id: owner.id, username: owner.username }, env.JWT_SECRET, { expiresIn: '7d' })
    return { token, owner: { id: owner.id, name: owner.name, username: owner.username } }
  } catch (err) {
    throw err
  }
}