import pool from '../../config/db.js'

const verifyPropertyOwner = async (property_id, owner_id) => {
  const result = await pool.query(
    'SELECT id FROM properties WHERE id = $1 AND owner_id = $2',
    [property_id, owner_id]
  )
  if (!result.rows.length) throw new Error('Property not found or unauthorized')
}

export const createUnit = async ({ property_id, label, rent, owner_id }) => {
  try {
    await verifyPropertyOwner(property_id, owner_id)
    const result = await pool.query(
      'INSERT INTO units (property_id, label, rent) VALUES ($1, $2, $3) RETURNING *',
      [property_id, label, rent]
    )
    return result.rows[0]
  } catch (err) {
    throw err
  }
}

export const getUnitsByProperty = async (property_id, owner_id) => {
  try {
    await verifyPropertyOwner(property_id, owner_id)
    const result = await pool.query(
      'SELECT * FROM units WHERE property_id = $1 ORDER BY label ASC',
      [property_id]
    )
    return result.rows
  } catch (err) {
    throw err
  }
}

export const deleteUnit = async (id, owner_id) => {
  try {
    const result = await pool.query(
      `DELETE FROM units WHERE id = $1
       AND property_id IN (SELECT id FROM properties WHERE owner_id = $2)
       RETURNING *`,
      [id, owner_id]
    )
    if (!result.rows.length) throw new Error('Unit not found or unauthorized')
    return result.rows[0]
  } catch (err) {
    throw err
  }
}