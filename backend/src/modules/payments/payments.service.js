import pool from '../../config/db.js'

export const getPayments = async ({ owner_id, month, year, property_id }) => {
  try {
    const isAll = !property_id || property_id === 'all'

    const result = await pool.query(
      `SELECT rp.*, t.name as tenant_name, u.label as unit_label, p.name as property_name, p.id as property_id
       FROM rent_payments rp
       JOIN tenants t ON rp.tenant_id = t.id
       JOIN units u ON t.unit_id = u.id
       JOIN properties p ON u.property_id = p.id
       WHERE p.owner_id = $1
       AND EXTRACT(MONTH FROM rp.due_date) = $2
       AND EXTRACT(YEAR FROM rp.due_date) = $3
       ${!isAll ? 'AND p.id = $4' : ''}
       ORDER BY rp.due_date ASC`,
      isAll ? [owner_id, month, year] : [owner_id, month, year, property_id]
    )

    const rows = result.rows
    const collected = rows.filter(r => r.status === 'paid').reduce((sum, r) => sum + parseInt(r.amount), 0)
    const pending = rows.filter(r => r.status !== 'paid').reduce((sum, r) => sum + parseInt(r.amount), 0)

    return { payments: rows, collected, pending }
  } catch (err) {
    throw err
  }
}