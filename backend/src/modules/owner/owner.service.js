import pool from '../../config/db.js'
import bcrypt from 'bcrypt'

export const getOwnerById = async (id) => {
  try {
    const result = await pool.query(
      'SELECT id, name, username, email, created_at FROM owners WHERE id = $1',
      [id]
    )
    if (!result.rows.length) throw new Error('Owner not found')
    return result.rows[0]
  } catch (err) {
    throw err
  }
}

export const updateOwner = async (id, { name }) => {
    try {
      const result = await pool.query(
        'UPDATE owners SET name = $1 WHERE id = $2 RETURNING id, name, username, email',
        [name, id]
      )
      if (!result.rows.length) throw new Error('Owner not found')
      return result.rows[0]
    } catch (err) {
      throw err
    }
  }
export const updatePassword = async (id, { current_password, new_password }) => {
  try {
    const result = await pool.query(
      'SELECT password_hash FROM owners WHERE id = $1',
      [id]
    )
    if (!result.rows.length) throw new Error('Owner not found')

    const valid = await bcrypt.compare(current_password, result.rows[0].password_hash)
    if (!valid) throw new Error('Current password is incorrect')

    const hash = await bcrypt.hash(new_password, 10)
    await pool.query('UPDATE owners SET password_hash = $1 WHERE id = $2', [hash, id])
  } catch (err) {
    throw err
  }
}