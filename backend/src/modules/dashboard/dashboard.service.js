import pool from '../../config/db.js'

export const getDashboardStats = async (owner_id) => {
  try {
    const [properties, units, overdue] = await Promise.all([
      pool.query(
        'SELECT COUNT(*) FROM properties WHERE owner_id = $1',
        [owner_id]
      ),
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
      pool.query(
        `SELECT COUNT(*) FROM rent_payments rp
         JOIN tenants t ON rp.tenant_id = t.id
         JOIN units u ON t.unit_id = u.id
         JOIN properties p ON u.property_id = p.id
         WHERE p.owner_id = $1
         AND rp.status != 'paid'
         AND rp.due_date < CURRENT_DATE`,
        [owner_id]
      )
    ])

    const propertyList = await pool.query(
      `SELECT p.id, p.name,p.type,
        COUNT(u.id) as total_units,
        COUNT(u.id) FILTER (WHERE u.is_occupied = TRUE) as occupied_units
       FROM properties p
       LEFT JOIN units u ON u.property_id = p.id
       WHERE p.owner_id = $1
       GROUP BY p.id,p.type
       ORDER BY p.name ASC`,
      [owner_id]
    )

    return {
      total_properties: parseInt(properties.rows[0].count),
      total_units: parseInt(units.rows[0].total),
      occupied_units: parseInt(units.rows[0].occupied),
      vacant_units: parseInt(units.rows[0].vacant),
      overdue_count: parseInt(overdue.rows[0].count),
      properties: propertyList.rows
    }
  } catch (err) {
    throw err
  }
}