import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../../config/db.js'
import {env} from '../../config/env.js'

export const registerOwner = async ({ name, email, password }) => {
    try {
      const existing = await pool.query('SELECT id FROM owners WHERE email = $1', [email])
      if (existing.rows.length) throw new Error('Email already registered')
  
      const hash = await bcrypt.hash(password, 10)
      const result = await pool.query(
        'INSERT INTO owners (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, hash]
      )
      return result.rows[0]
    } catch (err) {
      throw err
    }
}

export const loginOwner = async ({ email, password }) => {
    try {
      const result = await pool.query('SELECT * FROM owners WHERE email = $1', [email])
      const owner = result.rows[0]
      if (!owner) throw new Error('Invalid credentials')
  
      const valid = await bcrypt.compare(password, owner.password_hash)
      if (!valid) throw new Error('Invalid credentials')
  
      const token = jwt.sign(
        { id: owner.id, email: owner.email },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      )
      return { token, owner: { id: owner.id, name: owner.name, email: owner.email } }
    } catch (err) {
      throw err
    }
  }