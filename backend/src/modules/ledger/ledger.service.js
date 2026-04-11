import pool from '../../config/db.js'

export const generateLedger = async (property_id, month, year, owner_id) => {
  const isAllProps = property_id === 'all'
  const isAllMonths = month === 'all'
  
  // 1. Fetch Tenants
  const tenantsQuery = `
    SELECT t.id, t.name, u.id as unit_id, u.label as unit_label, p.name as property_name
    FROM tenants t
    JOIN units u ON t.unit_id = u.id
    JOIN properties p ON u.property_id = p.id
    WHERE p.owner_id = $1 AND t.leave_date IS NULL
    ${isAllProps ? '' : 'AND p.id = $2'}
  `
  const tenantsParams = isAllProps ? [owner_id] : [owner_id, property_id]
  const tenants = (await pool.query(tenantsQuery, tenantsParams)).rows

  // 2. Fetch Rent 
  const rentParams = [year]
  let rentQuery = `
    SELECT id, tenant_id, amount, status, due_date, 
           EXTRACT(MONTH FROM due_date) as month, EXTRACT(YEAR FROM due_date) as year 
    FROM rent_payments 
    WHERE EXTRACT(YEAR FROM due_date) = $1
  `
  if (!isAllMonths) {
    rentParams.push(month)
    rentQuery += ` AND EXTRACT(MONTH FROM due_date) = $2`
  }
  const rentRecords = (await pool.query(rentQuery, rentParams)).rows

  // 3. Fetch Bill Splits
  const splitParams = [year]
  let splitQuery = `
    SELECT s.id, s.tenant_id, s.amount, s.status, b.type, b.month, b.year 
    FROM bill_splits s 
    JOIN bills b ON s.bill_id = b.id 
    WHERE b.year = $1
  `
  if (!isAllMonths) {
    splitParams.push(month)
    splitQuery += ` AND b.month = $2`
  }
  const splitRecords = (await pool.query(splitQuery, splitParams)).rows

  // 4. Fetch Unit Bills
  const unitBillsParams = isAllProps ? [year, owner_id] : [year, owner_id, property_id]
  let unitBillsQuery = `
    SELECT b.id, b.unit_id, b.amount, b.status, b.type, b.month, b.year 
    FROM bills b
    JOIN units u ON b.unit_id = u.id
    JOIN properties p ON u.property_id = p.id
    WHERE b.year = $1 AND p.owner_id = $2
    ${isAllProps ? '' : 'AND p.id = $3'}
    AND NOT EXISTS (SELECT 1 FROM bill_splits bs WHERE bs.bill_id = b.id)
  `
  if (!isAllMonths) {
    unitBillsParams.push(month)
    unitBillsQuery += ` AND b.month = $${unitBillsParams.length}`
  }
  const unitBillsRecords = (await pool.query(unitBillsQuery, unitBillsParams)).rows

  // 5. Map them together
  const ledger = tenants.map(tenant => {
    const dues = [
      ...rentRecords.filter(r => r.tenant_id === tenant.id).map(r => ({
        id: r.id, item_type: 'rent', title: 'Monthly Rent', amount: Number(r.amount), status: r.status, due_date: r.due_date, month: Number(r.month), year: Number(r.year)
      })),
      ...splitRecords.filter(s => s.tenant_id === tenant.id).map(s => ({
        id: s.id, item_type: 'split', title: `${s.type} Bill Split`, amount: Number(s.amount), status: s.status, due_date: null, month: Number(s.month), year: Number(s.year)
      })),
      ...unitBillsRecords.filter(b => b.unit_id === tenant.unit_id).map(b => ({
        id: b.id, item_type: 'unit_bill', title: `${b.type} Bill`, amount: Number(b.amount), status: b.status, due_date: null, month: Number(b.month), year: Number(b.year)
      }))
    ]
    
    return {
      tenant_id: tenant.id,
      tenant_name: tenant.name,
      unit_label: tenant.unit_label,
      property_name: tenant.property_name,
      dues,
      total_collected: dues.filter(d => d.status === 'paid').reduce((s, d) => s + d.amount, 0),
      total_pending: dues.filter(d => d.status !== 'paid').reduce((s, d) => s + d.amount, 0)
    }
  })

  return {
    tenants: ledger,
    collected: ledger.reduce((s, t) => s + t.total_collected, 0),
    pending: ledger.reduce((s, t) => s + t.total_pending, 0)
  }
}