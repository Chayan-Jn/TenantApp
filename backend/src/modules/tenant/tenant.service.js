import pool from '../../config/db.js'

/**
 * Helper to ensure the owner actually owns the unit they are messing with
 */
const verifyUnitOwner = async (unit_id, owner_id) => {
  const result = await pool.query(
    `SELECT u.id FROM units u
     JOIN properties p ON u.property_id = p.id
     WHERE u.id = $1 AND p.owner_id = $2`,
    [unit_id, owner_id]
  )
  if (!result.rows.length) throw new Error('Unit not found or unauthorized')
}

export const createTenant = async ({ unit_id, name, phone, join_date, owner_id }) => {
  try {
    await verifyUnitOwner(unit_id, owner_id)

    const result = await pool.query(
      'INSERT INTO tenants (unit_id, name, phone, join_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [unit_id, name, phone, join_date]
    )

    // Mark unit as occupied now that someone is there
    await pool.query('UPDATE units SET is_occupied = TRUE WHERE id = $1', [unit_id])

    return result.rows[0]
  } catch (err) {
    throw err
  }
}

export const getTenantsByProperty = async (property_id, owner_id) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.label, u.rent FROM tenants t
       JOIN units u ON t.unit_id = u.id
       JOIN properties p ON u.property_id = p.id
       WHERE p.id = $1 AND p.owner_id = $2
       AND t.leave_date IS NULL  -- Filter out removed tenants
       ORDER BY t.name ASC`,
      [property_id, owner_id]
    )
    return result.rows
  } catch (err) {
    throw err
  }
}

export const getTenantsByUnit = async (unit_id, owner_id) => {
  try {
    const result = await pool.query(
      `SELECT t.* FROM tenants t
       JOIN units u ON t.unit_id = u.id
       JOIN properties p ON u.property_id = p.id
       WHERE u.id = $1 AND p.owner_id = $2
       AND t.leave_date IS NULL  -- Filter out removed tenants
       ORDER BY t.name ASC`,
      [unit_id, owner_id]
    )
    return result.rows
  } catch (err) {
    throw err
  }
}

export const removeTenant = async (id, owner_id) => {
  try {
    // Perform Soft Delete (set leave_date)
    const result = await pool.query(
      `UPDATE tenants SET leave_date = NOW()
       WHERE id = $1
       AND unit_id IN (
         SELECT u.id FROM units u
         JOIN properties p ON u.property_id = p.id
         WHERE p.owner_id = $2
       )
       RETURNING *`,
      [id, owner_id]
    )
    
    if (!result.rows.length) throw new Error('Tenant not found or unauthorized')

    // Check if the unit is now completely empty
    const remaining = await pool.query(
      'SELECT id FROM tenants WHERE unit_id = $1 AND leave_date IS NULL',
      [result.rows[0].unit_id]
    )

    // If no active tenants left, mark the unit as unoccupied
    if (remaining.rows.length === 0) {
      await pool.query('UPDATE units SET is_occupied = FALSE WHERE id = $1', [result.rows[0].unit_id])
    }

    return result.rows[0]
  } catch (err) {
    throw err
  }
}