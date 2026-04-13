import pool from '../../config/db.js'

export const getPayments = async ({ owner_id, month, year, property_id }) => {
  try {
    const isAll = !property_id || property_id === 'all'
    const params = isAll ? [owner_id, month, year] : [owner_id, month, year, property_id]
    const propFilter = isAll ? '' : 'AND p.id = $4'

    const result = await pool.query(
      `WITH AllPayments AS (
        -- 1. Rent Payments
        SELECT 
          rp.id, 'rent' as payment_type, 'Rent' as description, 
          rp.amount, rp.status::text as status, rp.due_date,
          t.name as tenant_name, u.label as unit_label, 
          p.name as property_name, p.id as property_id
        FROM rent_payments rp
        JOIN tenants t ON rp.tenant_id = t.id
        JOIN units u ON t.unit_id = u.id
        JOIN properties p ON u.property_id = p.id
        WHERE p.owner_id = $1
          AND EXTRACT(MONTH FROM rp.due_date) = $2
          AND EXTRACT(YEAR FROM rp.due_date) = $3
          ${propFilter}
          
        UNION ALL
        
        -- 2. Unit-level Bills (Mapped to the 1st of the month for sorting)
        SELECT 
          b.id, 'unit_bill' as payment_type, b.type::text as description, 
          b.amount, b.status::text as status, 
          MAKE_DATE(b.year, b.month, 1)::date as due_date,
          COALESCE(t.name, 'Vacant') as tenant_name, u.label as unit_label, 
          p.name as property_name, p.id as property_id
        FROM bills b
        JOIN units u ON b.unit_id = u.id
        JOIN properties p ON u.property_id = p.id
        LEFT JOIN tenants t ON t.unit_id = u.id AND t.leave_date IS NULL
        WHERE p.owner_id = $1 
          AND b.month = $2 
          AND b.year = $3 
          AND b.split_type = 'unit'
          ${propFilter}
          
        UNION ALL
        
        -- 3. Split Bills (Mapped to the 1st of the month for sorting)
        SELECT 
          bs.id, 'split_bill' as payment_type, b.type::text || ' (Split)' as description, 
          bs.amount, bs.status::text as status, 
          MAKE_DATE(b.year, b.month, 1)::date as due_date,
          t.name as tenant_name, u.label as unit_label, 
          p.name as property_name, p.id as property_id
        FROM bill_splits bs
        JOIN bills b ON bs.bill_id = b.id
        JOIN tenants t ON bs.tenant_id = t.id
        JOIN units u ON t.unit_id = u.id
        JOIN properties p ON u.property_id = p.id
        WHERE p.owner_id = $1 
          AND b.month = $2 
          AND b.year = $3
          ${propFilter}
      )
      SELECT * FROM AllPayments 
      ORDER BY due_date ASC, unit_label ASC`,
      params
    )

    const rows = result.rows
    const collected = rows.filter(r => r.status === 'paid').reduce((sum, r) => sum + parseInt(r.amount), 0)
    const pending = rows.filter(r => r.status !== 'paid').reduce((sum, r) => sum + parseInt(r.amount), 0)

    return { payments: rows, collected, pending }
  } catch (err) {
    throw err
  }
}