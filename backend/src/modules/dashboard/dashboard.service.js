import pool from '../../config/db.js'

export const getDashboardStats = async (owner_id) => {
  try {
    const [properties, units, overdue, financials] = await Promise.all([
      // 1. Total Properties
      pool.query('SELECT COUNT(*) FROM properties WHERE owner_id = $1', [owner_id]),
      
      // 2. Unit Stats
      pool.query(
        `SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE is_occupied = TRUE) as occupied,
          COUNT(*) FILTER (WHERE is_occupied = FALSE) as vacant
         FROM units u
         JOIN properties p ON u.property_id = p.id
         WHERE p.owner_id = $1`,
        [owner_id]
      ),
      
      // 3. Overdue Rent Count
      pool.query(
        `WITH UniqueOverdue AS (
           SELECT DISTINCT ON (rp.tenant_id, rp.amount, rp.due_date) rp.id
           FROM rent_payments rp
           JOIN tenants t ON rp.tenant_id = t.id
           JOIN units u ON t.unit_id = u.id
           JOIN properties p ON u.property_id = p.id
           WHERE p.owner_id = $1 AND rp.status != 'paid' AND rp.due_date < CURRENT_DATE
         )
         SELECT COUNT(*) FROM UniqueOverdue`,
        [owner_id]
      ),
      
      // 4. Financials (Rent + Unit Bills + Split Bills)
      // We cast status::text to solve the ENUM vs TEXT conflict
      pool.query(
        `WITH AllDues AS (
          -- Rent Payments
          SELECT rp.amount, rp.status::text as status, p.owner_id
          FROM rent_payments rp
          JOIN tenants t ON rp.tenant_id = t.id
          JOIN units u ON t.unit_id = u.id
          JOIN properties p ON u.property_id = p.id
          WHERE EXTRACT(MONTH FROM rp.due_date) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM rp.due_date) = EXTRACT(YEAR FROM CURRENT_DATE)
          
          UNION ALL
          
          -- Unit-level Bills (Only where split_type is 'unit')
          SELECT b.amount, b.status::text as status, p.owner_id
          FROM bills b
          JOIN units u ON b.unit_id = u.id
          JOIN properties p ON u.property_id = p.id
          WHERE b.month = EXTRACT(MONTH FROM CURRENT_DATE)
            AND b.year = EXTRACT(YEAR FROM CURRENT_DATE)
            AND b.split_type = 'unit'
          
          UNION ALL
          
          -- Split Bills (Individual tenant shares)
          SELECT bs.amount, bs.status::text as status, p.owner_id
          FROM bill_splits bs
          JOIN bills b ON bs.bill_id = b.id
          JOIN units u ON b.unit_id = u.id
          JOIN properties p ON u.property_id = p.id
          WHERE b.month = EXTRACT(MONTH FROM CURRENT_DATE)
            AND b.year = EXTRACT(YEAR FROM CURRENT_DATE)
        )
        SELECT 
          COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) as collected,
          COALESCE(SUM(amount) FILTER (WHERE status != 'paid'), 0) as pending
        FROM AllDues
        WHERE owner_id = $1`,
        [owner_id]
      )
    ])

    // 5. Property Overview List
    const propertyList = await pool.query(
      `SELECT p.id, p.name, p.type,
        COUNT(u.id) as total_units,
        COUNT(u.id) FILTER (WHERE u.is_occupied = TRUE) as occupied_units
       FROM properties p
       LEFT JOIN units u ON u.property_id = p.id
       WHERE p.owner_id = $1
       GROUP BY p.id, p.type
       ORDER BY p.name ASC`,
      [owner_id]
    )

    const collected = Number(financials.rows[0].collected) || 0
    const pending = Number(financials.rows[0].pending) || 0

    return {
      total_properties: parseInt(properties.rows[0].count),
      total_units: parseInt(units.rows[0].total),
      occupied_units: parseInt(units.rows[0].occupied),
      vacant_units: parseInt(units.rows[0].vacant),
      overdue_count: parseInt(overdue.rows[0].count),
      financials: { collected, pending, total: collected + pending },
      properties: propertyList.rows
    }
  } catch (err) {
    throw err
  }
}