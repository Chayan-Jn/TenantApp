import pool from '../../config/db.js'

export const createProperty = async ({ owner_id, name, address, type }) => {
  try {
    const result = await pool.query(
      'INSERT INTO properties (owner_id, name, address, type) VALUES ($1, $2, $3, $4) RETURNING *',
      [owner_id, name, address, type]
    )
    return result.rows[0]
  } catch (err) {
    throw err
  }
}

export const getPropertiesByOwner = async (owner_id) => {
  try {
    const result = await pool.query(
      'SELECT * FROM properties WHERE owner_id = $1 ORDER BY name',
      [owner_id]
    )
    return result.rows
  } catch (err) {
    throw err
  }
}
export const deleteProperty = async (id, owner_id) => {
    try {
      const result = await pool.query(
        'DELETE FROM properties WHERE id = $1 AND owner_id = $2 RETURNING *',
        [id, owner_id]
      )
      if (!result.rows.length) throw new Error('Property not found or unauthorized')
      return result.rows[0]
    } catch (err) {
      throw err
    }
  }

export const updateProperty = async (id, { name, address, type }, owner_id) => {
  try {
    const result = await pool.query(
      `UPDATE properties SET name = $1, address = $2, type = $3
        WHERE id = $4 AND owner_id = $5
        RETURNING *`,
      [name, address, type, id, owner_id]
    )
    if (!result.rows.length) throw new Error('Property not found or unauthorized')
    return result.rows[0]
  } catch (err) {
    throw err
  }
}

export const getPropertyById = async (id, owner_id) => {
  try {
    const result = await pool.query(
      'SELECT * FROM properties WHERE id = $1 AND owner_id = $2',
      [id, owner_id]
    )
    if (!result.rows.length) throw new Error('Property not found or unauthorized')
    return result.rows[0]
  } catch (err) {
    throw err
  }
}