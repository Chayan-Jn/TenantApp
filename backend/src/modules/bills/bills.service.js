import pool from '../../config/db.js'

const verifyUnitOwner = async (unit_id, owner_id) => {
  const result = await pool.query(
    `SELECT u.id FROM units u
     JOIN properties p ON u.property_id = p.id
     WHERE u.id = $1 AND p.owner_id = $2`,
    [unit_id, owner_id]
  )
  if (!result.rows.length) throw new Error('Unit not found or unauthorized')
}

export const createBill = async ({ unit_id, type, amount, split_type, month, year, note, splits, owner_id }) => {
  try {
    await verifyUnitOwner(unit_id, owner_id)

    const billResult = await pool.query(
      `INSERT INTO bills (unit_id, type, amount, split_type, month, year, note)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [unit_id, type, amount, split_type, month, year, note || null]
    )
    const bill = billResult.rows[0]

    if (split_type === 'equal') {
      const tenants = await pool.query(
        'SELECT id FROM tenants WHERE unit_id = $1 AND leave_date IS NULL',
        [unit_id]
      )
      if (!tenants.rows.length) throw new Error('No active tenants in this unit to split with')
      const share = Math.round(amount / tenants.rows.length)
      for (const tenant of tenants.rows) {
        await pool.query(
          'INSERT INTO bill_splits (bill_id, tenant_id, amount) VALUES ($1, $2, $3)',
          [bill.id, tenant.id, share]
        )
      }
    } else if (split_type === 'custom') {
      if (!splits || !splits.length) throw new Error('Custom splits required')
      const total = splits.reduce((sum, s) => sum + s.amount, 0)
      if (total !== amount) throw new Error(`Split amounts must add up to ${amount}`)
      for (const split of splits) {
        await pool.query(
          'INSERT INTO bill_splits (bill_id, tenant_id, amount) VALUES ($1, $2, $3)',
          [bill.id, split.tenant_id, split.amount]
        )
      }
    }

    return bill
  } catch (err) {
    throw err
  }
}

export const getBills = async ({ unit_id, property_id, month, year, owner_id }) => {
  try {
    let query, params

    if (unit_id) {
      query = `
        SELECT b.*, u.label as unit_label, p.name as property_name
        FROM bills b
        JOIN units u ON b.unit_id = u.id
        JOIN properties p ON u.property_id = p.id
        WHERE b.unit_id = $1 AND p.owner_id = $2
        ${month ? 'AND b.month = $3 AND b.year = $4' : ''}
        ORDER BY b.year DESC, b.month DESC`
      params = month ? [unit_id, owner_id, month, year] : [unit_id, owner_id]
    } else if (!property_id || property_id === 'all') {
      query = `
        SELECT b.*, u.label as unit_label, p.name as property_name
        FROM bills b
        JOIN units u ON b.unit_id = u.id
        JOIN properties p ON u.property_id = p.id
        WHERE p.owner_id = $1
        ${month ? 'AND b.month = $2 AND b.year = $3' : ''}
        ORDER BY b.year DESC, b.month DESC`
      params = month ? [owner_id, month, year] : [owner_id]
    } else {
      query = `
        SELECT b.*, u.label as unit_label, p.name as property_name
        FROM bills b
        JOIN units u ON b.unit_id = u.id
        JOIN properties p ON u.property_id = p.id
        WHERE p.id = $1 AND p.owner_id = $2
        ${month ? 'AND b.month = $3 AND b.year = $4' : ''}
        ORDER BY b.year DESC, b.month DESC`
      params = month ? [property_id, owner_id, month, year] : [property_id, owner_id]
    }

    const result = await pool.query(query, params)
    return result.rows
  } catch (err) {
    throw err
  }
}

export const getBillSplits = async (bill_id, owner_id) => {
  try {
    const result = await pool.query(
      `SELECT bs.*, t.name as tenant_name
       FROM bill_splits bs
       JOIN tenants t ON bs.tenant_id = t.id
       JOIN bills b ON bs.bill_id = b.id
       JOIN units u ON b.unit_id = u.id
       JOIN properties p ON u.property_id = p.id
       WHERE bs.bill_id = $1 AND p.owner_id = $2`,
      [bill_id, owner_id]
    )
    return result.rows
  } catch (err) {
    throw err
  }
}

export const deleteBill = async (id, owner_id) => {
  try {
    const result = await pool.query(
      `DELETE FROM bills WHERE id = $1
       AND unit_id IN (
         SELECT u.id FROM units u
         JOIN properties p ON u.property_id = p.id
         WHERE p.owner_id = $2
       )
       RETURNING *`,
      [id, owner_id]
    )
    if (!result.rows.length) throw new Error('Bill not found or unauthorized')
    return result.rows[0]
  } catch (err) {
    throw err
  }
}

export const updateBill = async (id, { type, amount, split_type, month, year, note, splits }, owner_id) => {
  try {
    const result = await pool.query(
      `UPDATE bills SET type = $1, amount = $2, split_type = $3, month = $4, year = $5, note = $6
       WHERE id = $7
       AND unit_id IN (
         SELECT u.id FROM units u
         JOIN properties p ON u.property_id = p.id
         WHERE p.owner_id = $8
       )
       RETURNING *`,
      [type, amount, split_type, month, year, note || null, id, owner_id]
    )
    if (!result.rows.length) throw new Error('Bill not found or unauthorized')

    await pool.query('DELETE FROM bill_splits WHERE bill_id = $1', [id])

    if (split_type === 'equal') {
      const tenants = await pool.query(
        'SELECT id FROM tenants WHERE unit_id = $1 AND leave_date IS NULL',
        [result.rows[0].unit_id]
      )
      if (!tenants.rows.length) throw new Error('No active tenants for equal split')
      const share = Math.round(amount / tenants.rows.length)
      for (const tenant of tenants.rows) {
        await pool.query(
          'INSERT INTO bill_splits (bill_id, tenant_id, amount) VALUES ($1, $2, $3)',
          [id, tenant.id, share]
        )
      }
    } else if (split_type === 'custom') {
      if (!splits || !splits.length) throw new Error('Custom splits required')
      const total = splits.reduce((sum, s) => sum + s.amount, 0)
      if (total !== amount) throw new Error(`Split amounts must add up to ${amount}`)
      for (const split of splits) {
        await pool.query(
          'INSERT INTO bill_splits (bill_id, tenant_id, amount) VALUES ($1, $2, $3)',
          [id, split.tenant_id, split.amount]
        )
      }
    }

    return result.rows[0]
  } catch (err) {
    throw err
  }
}

export const updateBillStatus = async (id, status, owner_id) => {
  try {
    const result = await pool.query(
      `UPDATE bills SET status = $1
       WHERE id = $2
       AND unit_id IN (
         SELECT u.id FROM units u
         JOIN properties p ON u.property_id = p.id
         WHERE p.owner_id = $3
       )
       RETURNING *`,
      [status, id, owner_id]
    )
    if (!result.rows.length) throw new Error('Bill not found or unauthorized')
    return result.rows[0]
  } catch (err) {
    throw err
  }
}

export const updateSplitStatus = async (split_id, status, owner_id) => {
  try {
    const result = await pool.query(
      `UPDATE bill_splits SET status = $1
       WHERE id = $2
       AND bill_id IN (
         SELECT b.id FROM bills b
         JOIN units u ON b.unit_id = u.id
         JOIN properties p ON u.property_id = p.id
         WHERE p.owner_id = $3
       )
       RETURNING *`,
      [status, split_id, owner_id]
    )
    if (!result.rows.length) throw new Error('Split not found or unauthorized')
    return result.rows[0]
  } catch (err) {
    throw err
  }
}