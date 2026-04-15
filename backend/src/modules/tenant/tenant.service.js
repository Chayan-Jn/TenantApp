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
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verify ownership inside the transaction and grab the rent
    const unitCheck = await client.query(
      `SELECT u.id, u.rent FROM units u
       JOIN properties p ON u.property_id = p.id
       WHERE u.id = $1 AND p.owner_id = $2`,
      [unit_id, owner_id]
    )
    if (!unitCheck.rows.length) throw new Error('Unit not found or unauthorized')
    const unit = unitCheck.rows[0]

    const tenantResult = await client.query(
      'INSERT INTO tenants (unit_id, name, phone, join_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [unit_id, name, phone, join_date]
    )
    const newTenant = tenantResult.rows[0]

    // Create Initial Payment
    await client.query(
      `INSERT INTO rent_payments (tenant_id, amount, status, due_date)
       VALUES ($1, $2, 'pending', $3)`,
      [newTenant.id, unit.rent, join_date]
    )

    // Mark unit as occupied now that someone is there
    await client.query('UPDATE units SET is_occupied = TRUE WHERE id = $1', [unit_id])

    await client.query('COMMIT');
    return newTenant
  } catch (err) {
    await client.query('ROLLBACK');
    throw err
  } finally {
    client.release();
  }
}

export const removeTenant = async (id, owner_id) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Perform Soft Delete (set leave_date)
    const result = await client.query(
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
    const remaining = await client.query(
      'SELECT id FROM tenants WHERE unit_id = $1 AND leave_date IS NULL',
      [result.rows[0].unit_id]
    )

    // If no active tenants left, mark the unit as unoccupied
    if (remaining.rows.length === 0) {
      await client.query('UPDATE units SET is_occupied = FALSE WHERE id = $1', [result.rows[0].unit_id])
    }

    await client.query('COMMIT');
    return result.rows[0]
  } catch (err) {
    await client.query('ROLLBACK');
    throw err
  } finally {
    client.release();
  }
}

export const getTenantById = async (id, owner_id) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.label, u.rent, u.id as unit_id, p.name as property_name, p.id as property_id
       FROM tenants t
       JOIN units u ON t.unit_id = u.id
       JOIN properties p ON u.property_id = p.id
       WHERE t.id = $1 AND p.owner_id = $2`,
      [id, owner_id]
    )
    if (!result.rows.length) throw new Error('Tenant not found or unauthorized')
    return result.rows[0]
  } catch (err) {
    throw err
  }
}
export const updateTenant = async (id, { name, phone }, owner_id) => {
  try {
    const result = await pool.query(
      `UPDATE tenants SET name = $1, phone = $2
       WHERE id = $3
       AND unit_id IN (
         SELECT u.id FROM units u
         JOIN properties p ON u.property_id = p.id
         WHERE p.owner_id = $4
       )
       RETURNING *`,
      [name, phone, id, owner_id]
    )
    if (!result.rows.length) throw new Error('Tenant not found or unauthorized')
    return result.rows[0]
  } catch (err) {
    throw err
  }
}

export const getTenantsByUnitWithStatus = async (unit_id, owner_id, status) => {
  try {
    const statusFilter = status === 'active'
      ? 'AND t.leave_date IS NULL'
      : status === 'left'
        ? 'AND t.leave_date IS NOT NULL'
        : ''

    const result = await pool.query(
      `SELECT t.* FROM tenants t
       JOIN units u ON t.unit_id = u.id
       JOIN properties p ON u.property_id = p.id
       WHERE u.id = $1 AND p.owner_id = $2
       ${statusFilter}
       ORDER BY t.name ASC`,
      [unit_id, owner_id]
    )
    return result.rows
  } catch (err) {
    throw err
  }
}

export const getTenantsByProperty = async (property_id, owner_id, status = 'active') => {
  try {
    const statusFilter = status === 'active'
      ? 'AND t.leave_date IS NULL'
      : status === 'left'
        ? 'AND t.leave_date IS NOT NULL'
        : ''

    const result = await pool.query(
      `SELECT t.*, u.label, u.rent FROM tenants t
       JOIN units u ON t.unit_id = u.id
       JOIN properties p ON u.property_id = p.id
       WHERE p.id = $1 AND p.owner_id = $2
       ${statusFilter}
       ORDER BY t.name ASC`,
      [property_id, owner_id]
    )
    return result.rows
  } catch (err) {
    throw err
  }
}