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

export const createTenant = async ({ unit_id, name, phone, join_date, security_deposit, notice_period_days, rent_due_day, owner_id }) => {
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
      `INSERT INTO tenants (unit_id, name, phone, join_date, security_deposit, notice_period_days, rent_due_day)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [unit_id, name, phone, join_date, security_deposit || 0, notice_period_days || 0, rent_due_day || null]
    )
    const newTenant = tenantResult.rows[0]

    // Create Initial Payment (rent)
    await client.query(
      `INSERT INTO rent_payments (tenant_id, amount, status, due_date, payment_type)
       VALUES ($1, $2, 'pending', $3, 'rent')`,
      [newTenant.id, unit.rent, join_date]
    )

    // Create Security Deposit payment if applicable
    if (security_deposit && security_deposit > 0) {
      await client.query(
        `INSERT INTO rent_payments (tenant_id, amount, status, due_date, payment_type)
         VALUES ($1, $2, 'pending', $3, 'deposit')`,
        [newTenant.id, security_deposit, join_date]
      )
    }

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

export const removeTenant = async (id, owner_id, { deposit_refunded, deposit_note, leave_date } = {}) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // First validate refund doesn't exceed deposit
    const checkResult = await client.query('SELECT security_deposit FROM tenants WHERE id = $1', [id])
    if (checkResult.rows.length > 0) {
      if (Number(deposit_refunded || 0) > Number(checkResult.rows[0].security_deposit || 0)) {
        throw new Error('Refund cannot exceed the original security deposit')
      }
    }

    // Perform Soft Delete (set leave_date) + record deposit refund
    // Use provided leave_date or default to NOW()
    const leaveExpr = leave_date ? `$5::date` : `NOW()`
    const result = await client.query(
      `UPDATE tenants SET leave_date = ${leaveExpr},
        deposit_refunded = COALESCE($3, 0),
        deposit_note = COALESCE($4, '')
       WHERE id = $1
       AND unit_id IN (
         SELECT u.id FROM units u
         JOIN properties p ON u.property_id = p.id
         WHERE p.owner_id = $2
       )
       RETURNING *`,
      leave_date
        ? [id, owner_id, deposit_refunded || 0, deposit_note || '', leave_date]
        : [id, owner_id, deposit_refunded || 0, deposit_note || '']
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
export const updateTenant = async (id, { name, phone, rent_due_day, expected_move_out, notice_period_days }, owner_id) => {
  try {
    const fields = []
    const values = []
    let idx = 1

    if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name) }
    if (phone !== undefined) { fields.push(`phone = $${idx++}`); values.push(phone) }
    if (rent_due_day !== undefined) {
      fields.push(`rent_due_day = $${idx++}`)
      values.push(rent_due_day) // can be null to clear it
    }
    if (expected_move_out !== undefined) {
      fields.push(`expected_move_out = $${idx++}::date`)
      values.push(expected_move_out)
    }
    if (notice_period_days !== undefined) {
      fields.push(`notice_period_days = $${idx++}`)
      values.push(notice_period_days)
    }

    if (fields.length === 0) throw new Error('No fields to update')

    values.push(id)
    const idIdx = idx++
    values.push(owner_id)
    const ownerIdx = idx

    const result = await pool.query(
      `UPDATE tenants SET ${fields.join(', ')}
       WHERE id = $${idIdx}
       AND unit_id IN (
         SELECT u.id FROM units u
         JOIN properties p ON u.property_id = p.id
         WHERE p.owner_id = $${ownerIdx}
       )
       RETURNING *`,
      values
    )
    if (!result.rows.length) throw new Error('Tenant not found or unauthorized')
    return result.rows[0]
  } catch (err) {
    throw err
  }
}

export const giveNotice = async (id, owner_id, expectedMoveOut) => {
  try {
    // Verify tenant exists, is active, and hasn't already given notice
    const check = await pool.query(
      `SELECT t.id, t.notice_period_days, t.notice_date, t.leave_date
       FROM tenants t
       JOIN units u ON t.unit_id = u.id
       JOIN properties p ON u.property_id = p.id
       WHERE t.id = $1 AND p.owner_id = $2`,
      [id, owner_id]
    )
    if (!check.rows.length) throw new Error('Tenant not found or unauthorized')
    if (check.rows[0].leave_date) throw new Error('Tenant has already moved out')
    if (check.rows[0].notice_date) throw new Error('Notice has already been given')

    const noticeDays = check.rows[0].notice_period_days || 0
    const moveOutExpr = expectedMoveOut ? `$2::date` : `CURRENT_DATE + ($2 * interval '1 day')`

    const result = await pool.query(
      `UPDATE tenants
       SET notice_date = CURRENT_DATE,
           expected_move_out = ${moveOutExpr}
       WHERE id = $1
       RETURNING *`,
      expectedMoveOut ? [id, expectedMoveOut] : [id, noticeDays]
    )
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