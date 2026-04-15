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
      `SELECT rp.*,
        CASE
          WHEN rp.status = 'paid' THEN 'paid'
          WHEN rp.due_date < CURRENT_DATE THEN 'overdue'
          ELSE 'pending'
        END AS computed_status,
        CASE 
          WHEN EXTRACT(MONTH FROM rp.due_date) = EXTRACT(MONTH FROM t.join_date) AND EXTRACT(YEAR FROM rp.due_date) = EXTRACT(YEAR FROM t.join_date) THEN 'Initial Payment'
          ELSE 'Monthly Rent'
        END AS title
       FROM rent_payments rp
       JOIN tenants t ON rp.tenant_id = t.id
       WHERE rp.tenant_id = $1
       ORDER BY rp.due_date DESC`,
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
    const isAll = property_id === 'all'
    const query = isAll
      ? `SELECT DISTINCT ON (rp.tenant_id, rp.amount, rp.due_date) 
            rp.*, t.name as tenant_name, u.label as unit_label, p.name as property_name,
            CASE 
              WHEN EXTRACT(MONTH FROM rp.due_date) = EXTRACT(MONTH FROM t.join_date) AND EXTRACT(YEAR FROM rp.due_date) = EXTRACT(YEAR FROM t.join_date) THEN 'Initial Payment'
              ELSE 'Monthly Rent'
            END AS title
         FROM rent_payments rp
         JOIN tenants t ON rp.tenant_id = t.id
         JOIN units u ON t.unit_id = u.id
         JOIN properties p ON u.property_id = p.id
         WHERE p.owner_id = $1
         AND rp.status != 'paid'
         AND rp.due_date < CURRENT_DATE
         ORDER BY rp.tenant_id, rp.amount, rp.due_date, rp.id DESC`
      : `SELECT DISTINCT ON (rp.tenant_id, rp.amount, rp.due_date)
            rp.*, t.name as tenant_name, u.label as unit_label, p.name as property_name,
            CASE 
              WHEN EXTRACT(MONTH FROM rp.due_date) = EXTRACT(MONTH FROM t.join_date) AND EXTRACT(YEAR FROM rp.due_date) = EXTRACT(YEAR FROM t.join_date) THEN 'Initial Payment'
              ELSE 'Monthly Rent'
            END AS title
         FROM rent_payments rp
         JOIN tenants t ON rp.tenant_id = t.id
         JOIN units u ON t.unit_id = u.id
         JOIN properties p ON u.property_id = p.id
         WHERE p.id = $2 AND p.owner_id = $1
         AND rp.status != 'paid'
         AND rp.due_date < CURRENT_DATE
         ORDER BY rp.tenant_id, rp.amount, rp.due_date, rp.id DESC`

    const params = isAll ? [owner_id] : [owner_id, property_id]
    const result = await pool.query(query, params)
    return result.rows
  } catch (err) {
    throw err
  }
}

export const markRentUnpaid = async (id, owner_id) => {
  try {
    const result = await pool.query(
      `UPDATE rent_payments SET status = 'pending', paid_date = NULL
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

export const generateMonthlyRent = async ({ property_id, month, year, owner_id }) => {
  try {
    const isAll = property_id === 'all'
    
    // 1. Calculate the cutoff date (1st day of the NEXT month)
    // If generating for Dec (12), wrap around to Jan (1) of the next year.
    const nextMonth = month === 12 ? 1 : month + 1
    const nextMonthYear = month === 12 ? year + 1 : year
    const cutoffDate = `${nextMonthYear}-${String(nextMonth).padStart(2, '0')}-01`

    // 2. Fetch tenants who are active AND joined before the cutoff date
    const query = `
      SELECT t.id, t.join_date, u.rent
      FROM tenants t
      JOIN units u ON t.unit_id = u.id
      JOIN properties p ON u.property_id = p.id
      WHERE p.owner_id = $1 
        AND t.leave_date IS NULL
        AND t.join_date < $${isAll ? 2 : 3}
      ${isAll ? '' : 'AND p.id = $2'}
    `
    // Safely assign params based on whether 'all' properties are selected
    const params = isAll 
      ? [owner_id, cutoffDate] 
      : [owner_id, property_id, cutoffDate]
      
    const tenants = await pool.query(query, params)

    if (!tenants.rows.length) throw new Error('No active tenants found for this billing period')

    // 3. Prevent N+1 by bulk fetching existing rents
    const tenantIds = tenants.rows.map(t => t.id)
    const existing = await pool.query(
      `SELECT tenant_id FROM rent_payments 
       WHERE EXTRACT(MONTH FROM due_date) = $1 
       AND EXTRACT(YEAR FROM due_date) = $2 
       AND tenant_id = ANY($3::int[])`,
      [month, year, tenantIds]
    )
    const existingIds = new Set(existing.rows.map(r => r.tenant_id))

    // 4. Batch Prepare & clamp short month dates
    const insertValues = []
    const insertParams = []
    const daysInMonth = new Date(year, month, 0).getDate()
    
    for (const tenant of tenants.rows) {
      if (existingIds.has(tenant.id)) continue
      
      let joinDay = new Date(tenant.join_date).getDate()
      joinDay = Math.min(joinDay, daysInMonth)
      const due_date = `${year}-${String(month).padStart(2, '0')}-${String(joinDay).padStart(2, '0')}`

      const offset = insertParams.length
      insertValues.push(`($${offset + 1}, $${offset + 2}, $${offset + 3})`)
      insertParams.push(tenant.id, tenant.rent, due_date)
    }

    if (insertValues.length > 0) {
      await pool.query(
        `INSERT INTO rent_payments (tenant_id, amount, due_date) VALUES ${insertValues.join(', ')}`,
        insertParams
      )
    }

    return { generated: insertValues.length, skipped: tenants.rows.length - insertValues.length }
  } catch (err) {
    throw err
  }
}