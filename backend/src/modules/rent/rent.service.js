import pool from '../../config/db.js'

const verifyTenantOwner = async (tenant_id, owner_id) => {
  const result = await pool.query(
    `SELECT t.id FROM tenants t
     JOIN units u ON t.unit_id = u.id
     JOIN properties p ON u.property_id = p.id
     WHERE t.id = $1 AND p.owner_id = $2`,
    [tenant_id, owner_id]
  )
  if (!result.rows.length) throw new Error('Tenant not found or unauthorized')
}

export const createRentRecord = async ({ tenant_id, amount, due_date, owner_id }) => {
  try {
    await verifyTenantOwner(tenant_id, owner_id)
    const result = await pool.query(
      'INSERT INTO rent_payments (tenant_id, amount, due_date) VALUES ($1, $2, $3) RETURNING *',
      [tenant_id, amount, due_date]
    )
    return result.rows[0]
  } catch (err) {
    throw err
  }
}

export const getRentByTenant = async (tenant_id, owner_id) => {
  try {
    await verifyTenantOwner(tenant_id, owner_id)
    const result = await pool.query(
      `SELECT *,
        CASE
          WHEN status = 'paid' THEN 'paid'
          WHEN due_date < CURRENT_DATE THEN 'overdue'
          ELSE 'pending'
        END AS computed_status
       FROM rent_payments
       WHERE tenant_id = $1
       ORDER BY due_date DESC`,
      [tenant_id]
    )
    return result.rows
  } catch (err) {
    throw err
  }
}

export const markRentPaid = async (id, owner_id) => {
  try {
    const result = await pool.query(
      `UPDATE rent_payments SET status = 'paid', paid_date = CURRENT_DATE
       WHERE id = $1
       AND tenant_id IN (
         SELECT t.id FROM tenants t
         JOIN units u ON t.unit_id = u.id
         JOIN properties p ON u.property_id = p.id
         WHERE p.owner_id = $2
       )
       RETURNING *`,
      [id, owner_id]
    )
    if (!result.rows.length) throw new Error('Rent record not found or unauthorized')
    return result.rows[0]
  } catch (err) {
    throw err
  }
}

export const getOverdueRents = async (property_id, owner_id) => {
  try {
    const result = await pool.query(
      `SELECT rp.*, t.name as tenant_name, u.label as unit_label
       FROM rent_payments rp
       JOIN tenants t ON rp.tenant_id = t.id
       JOIN units u ON t.unit_id = u.id
       JOIN properties p ON u.property_id = p.id
       WHERE p.id = $1 AND p.owner_id = $2
       AND rp.status != 'paid'
       AND rp.due_date < CURRENT_DATE
       ORDER BY rp.due_date ASC`,
      [property_id, owner_id]
    )
    return result.rows
  } catch (err) {
    throw err
  }
}