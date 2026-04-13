import pool from '../../config/db.js'

/**
 * Helper to ensure the unit belongs to the logged-in owner
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

/**
 * CREATE BILL: Uses Transactions to ensure bill and splits are created together
 */
export const createBill = async ({ unit_id, type, amount, split_type, month, year, note, splits, owner_id }) => {
  const client = await pool.connect()
  try {
    await verifyUnitOwner(unit_id, owner_id)
    await client.query('BEGIN')

    // 1. Safety Check: If splitting, ensure active tenants exist
    if (split_type !== 'unit') {
      const tenants = await client.query(
        'SELECT id FROM tenants WHERE unit_id = $1 AND leave_date IS NULL',
        [unit_id]
      )
      if (!tenants.rows.length) throw new Error('No active tenants in this unit to split with')

      if (split_type === 'custom') {
        if (!splits || !splits.length) throw new Error('Custom splits required')
        const total = splits.reduce((sum, s) => sum + Number(s.amount), 0)
        if (total !== Number(amount)) throw new Error(`Split total (₹${total}) must match bill amount (₹${amount})`)
      }
    }

    // 2. Insert Main Bill
    const billResult = await client.query(
      `INSERT INTO bills (unit_id, type, amount, split_type, month, year, note)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [unit_id, type, amount, split_type, month, year, note || null]
    )
    const bill = billResult.rows[0]

    // 3. Handle Splits
    if (split_type === 'equal') {
      const tenants = await client.query('SELECT id FROM tenants WHERE unit_id = $1 AND leave_date IS NULL', [unit_id])
      const share = Math.round(amount / tenants.rows.length)
      for (const tenant of tenants.rows) {
        await client.query(
          'INSERT INTO bill_splits (bill_id, tenant_id, amount) VALUES ($1, $2, $3)',
          [bill.id, tenant.id, share]
        )
      }
    } else if (split_type === 'custom') {
      for (const split of splits) {
        await client.query(
          'INSERT INTO bill_splits (bill_id, tenant_id, amount) VALUES ($1, $2, $3)',
          [bill.id, split.tenant_id, split.amount]
        )
      }
    }

    await client.query('COMMIT')
    return bill
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

/**
 * GET BILLS: Filtered by owner, unit, or month
 */
export const getBills = async ({ unit_id, property_id, month, year, owner_id }) => {
  let query = `
    SELECT b.*, u.label as unit_label, p.name as property_name
    FROM bills b
    JOIN units u ON b.unit_id = u.id
    JOIN properties p ON u.property_id = p.id
    WHERE p.owner_id = $1`
  
  const params = [owner_id]

  if (unit_id) {
    params.push(unit_id)
    query += ` AND b.unit_id = $${params.length}`
  } else if (property_id && property_id !== 'all') {
    params.push(property_id)
    query += ` AND p.id = $${params.length}`
  }

  if (month && year) {
    params.push(month, year)
    query += ` AND b.month = $${params.length - 1} AND b.year = $${params.length}`
  }

  query += ` ORDER BY b.year DESC, b.month DESC`
  
  const result = await pool.query(query, params)
  return result.rows
}

/**
 * GET SPLITS: Fetch tenant shares for a specific bill
 */
export const getBillSplits = async (bill_id, owner_id) => {
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
}

/**
 * DELETE BILL
 */
export const deleteBill = async (id, owner_id) => {
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
}

/**
 * UPDATE BILL: Clears and re-calculates splits on update
 */
export const updateBill = async (id, { type, amount, split_type, month, year, note, splits }, owner_id) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const result = await client.query(
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

    // Reset splits
    await client.query('DELETE FROM bill_splits WHERE bill_id = $1', [id])

    if (split_type === 'equal') {
      const tenants = await client.query(
        'SELECT id FROM tenants WHERE unit_id = $1 AND leave_date IS NULL',
        [result.rows[0].unit_id]
      )
      if (tenants.rows.length > 0) {
        const share = Math.round(amount / tenants.rows.length)
        for (const tenant of tenants.rows) {
          await client.query('INSERT INTO bill_splits (bill_id, tenant_id, amount) VALUES ($1, $2, $3)', [id, tenant.id, share])
        }
      }
    } else if (split_type === 'custom' && splits) {
      for (const split of splits) {
        await client.query('INSERT INTO bill_splits (bill_id, tenant_id, amount) VALUES ($1, $2, $3)', [id, split.tenant_id, split.amount])
      }
    }

    await client.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

/**
 * UPDATE BILL STATUS: Toggle paid/pending for the whole bill
 */
export const updateBillStatus = async (id, status, owner_id) => {
  const result = await pool.query(
    `UPDATE bills SET status = $1
     WHERE id = $2
     AND unit_id IN (SELECT u.id FROM units u JOIN properties p ON u.property_id = p.id WHERE p.owner_id = $3)
     RETURNING *`,
    [status, id, owner_id]
  )
  if (!result.rows.length) throw new Error('Bill not found or unauthorized')
  return result.rows[0]
}

/**
 * UPDATE SPLIT STATUS: Marks split paid AND checks if main bill should be marked paid
 */
export const updateSplitStatus = async (split_id, status, owner_id) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const result = await client.query(
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

    const billId = result.rows[0].bill_id

    // Auto-update main bill status: If 0 pending splits left, mark bill as 'paid'
    const pendingSplits = await client.query(
      `SELECT count(*) FROM bill_splits WHERE bill_id = $1 AND status = 'pending'`,
      [billId]
    )

    const newBillStatus = parseInt(pendingSplits.rows[0].count) === 0 ? 'paid' : 'pending'
    await client.query(`UPDATE bills SET status = $1 WHERE id = $2`, [newBillStatus, billId])

    await client.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}