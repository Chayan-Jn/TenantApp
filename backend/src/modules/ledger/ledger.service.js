import pool from '../../config/db.js'

export const generateLedger = async (property_id, month, year, owner_id) => {
  const isAllProps = property_id === 'all'
  const isAllMonths = month === 'all'
  
  // 1. Build Dynamic Parameters Safely
  const baseParams = [owner_id, year]
  let paramIndex = 3
  let propQuery = ""
  
  if (!isAllProps) {
    baseParams.push(property_id)
    propQuery = `AND p.id = $${paramIndex}`
    paramIndex++
  }
  
  let monthQueryRent = ""
  let monthQueryBill = ""
  
  if (!isAllMonths) {
    baseParams.push(month)
    monthQueryRent = `AND EXTRACT(MONTH FROM rp.due_date) = $${paramIndex}`
    monthQueryBill = `AND b.month = $${paramIndex}`
  }

  // 2. Fetch Base Units & Active Tenants
  const unitParams = [owner_id]
  let unitPropCond = ""
  if (!isAllProps) {
    unitParams.push(property_id)
    unitPropCond = "AND p.id = $2"
  }
  
  const unitsData = (await pool.query(`
    SELECT u.id as unit_id, u.label as unit_label, p.name as property_name,
           t.id as tenant_id, t.name as tenant_name, t.phone as tenant_phone
    FROM units u
    JOIN properties p ON u.property_id = p.id
    LEFT JOIN tenants t ON t.unit_id = u.id AND t.leave_date IS NULL
    WHERE p.owner_id = $1 ${unitPropCond}
  `, unitParams)).rows

  // 3. Rent Records
  const rentRecords = (await pool.query(`
    SELECT rp.id, rp.tenant_id, u.id as unit_id, rp.amount, rp.status, rp.due_date, rp.payment_type,
           EXTRACT(MONTH FROM rp.due_date) as month, EXTRACT(YEAR FROM rp.due_date) as year,
           t.name as tenant_name, t.phone as tenant_phone, t.join_date, u.label as unit_label, p.name as property_name 
    FROM rent_payments rp
    JOIN tenants t ON rp.tenant_id = t.id
    JOIN units u ON t.unit_id = u.id
    JOIN properties p ON u.property_id = p.id
    WHERE p.owner_id = $1 AND EXTRACT(YEAR FROM rp.due_date) = $2
    ${propQuery} ${monthQueryRent}
  `, baseParams)).rows

  // 4. Bill Splits
  const splitRecords = (await pool.query(`
    SELECT s.id, s.tenant_id, u.id as unit_id, s.amount, s.status, b.type, b.month, b.year,
           t.name as tenant_name, t.phone as tenant_phone, u.label as unit_label, p.name as property_name 
    FROM bill_splits s 
    JOIN bills b ON s.bill_id = b.id 
    JOIN tenants t ON s.tenant_id = t.id
    JOIN units u ON b.unit_id = u.id
    JOIN properties p ON u.property_id = p.id
    WHERE p.owner_id = $1 AND b.year = $2
    ${propQuery} ${monthQueryBill}
  `, baseParams)).rows

  // 5. Unit Bills
  const unitBillsRecords = (await pool.query(`
    SELECT b.id, b.unit_id, b.amount, b.status, b.type, b.month, b.year,
           u.label as unit_label, p.name as property_name 
    FROM bills b
    JOIN units u ON b.unit_id = u.id
    JOIN properties p ON u.property_id = p.id
    WHERE p.owner_id = $1 AND b.year = $2 AND b.split_type = 'unit'
    ${propQuery} ${monthQueryBill}
  `, baseParams)).rows

  // 6. Build Ledger Map
  const ledgerMap = new Map()

  const getBlock = (unit_id, tenant_id, defaultData) => {
    const key = `${unit_id}_${tenant_id || 'vacant'}`
    if (!ledgerMap.has(key)) {
      ledgerMap.set(key, {
        unit_id,
        tenant_id: tenant_id || 'vacant',
        tenant_name: defaultData.tenant_name || 'Vacant Unit',
        phone: defaultData.tenant_phone || '-',
        unit_label: defaultData.unit_label,
        property_name: defaultData.property_name,
        dues: []
      })
    }
    return ledgerMap.get(key)
  }

  unitsData.forEach(u => getBlock(u.unit_id, u.tenant_id, u))

  rentRecords.forEach(r => {
    const block = getBlock(r.unit_id, r.tenant_id, r)

    let title = 'Monthly Rent'
    if (r.payment_type === 'deposit') {
      title = 'Security Deposit'
    } else if (r.join_date && r.due_date) {
      const jd = new Date(r.join_date)
      const dd = new Date(r.due_date)
      if (jd.getMonth() === dd.getMonth() && jd.getFullYear() === dd.getFullYear()) {
        title = 'Initial Payment'
      }
    }

    block.dues.push({
      id: r.id, item_type: 'rent', title, amount: Number(r.amount), status: r.status, due_date: r.due_date, month: Number(r.month), year: Number(r.year),
      paid_date: r.paid_date, payment_type: r.payment_type || 'rent',
      is_shared_reference: false
    })
  })

  splitRecords.forEach(s => {
    const block = getBlock(s.unit_id, s.tenant_id, s)
    block.dues.push({
      id: s.id, item_type: 'split', title: `${s.type} Bill Split`, amount: Number(s.amount), status: s.status, due_date: null, month: Number(s.month), year: Number(s.year),
      is_shared_reference: false
    })
  })

  // SMART UNIT BILL ASSIGNMENT (Primary + Shared References)
  unitBillsRecords.forEach(b => {
    // Find all active tenants living in this unit
    const unitBlocks = Array.from(ledgerMap.values()).filter(block => block.unit_id === b.unit_id && block.tenant_id !== 'vacant')
    
    if (unitBlocks.length === 0) {
      // If vacant, just assign to the vacant block
      const block = getBlock(b.unit_id, 'vacant', b)
      block.dues.push({
        id: b.id, item_type: 'unit_bill', title: `${b.type} Bill`, amount: Number(b.amount), status: b.status, due_date: null, month: Number(b.month), year: Number(b.year),
        is_shared_reference: false
      })
    } else {
      // Assign the real actionable bill to the first tenant (Primary)
      const primaryBlock = unitBlocks[0]
      primaryBlock.dues.push({
        id: b.id, item_type: 'unit_bill', title: `${b.type} Bill`, amount: Number(b.amount), status: b.status, due_date: null, month: Number(b.month), year: Number(b.year),
        is_shared_reference: false
      })

      // Assign reference bills to any roommates
      for (let i = 1; i < unitBlocks.length; i++) {
        unitBlocks[i].dues.push({
          id: b.id, item_type: 'unit_bill', title: `${b.type} Bill`, amount: Number(b.amount), status: b.status, due_date: null, month: Number(b.month), year: Number(b.year),
          is_shared_reference: true, // Flags this as a duplicate for UI only
          shared_with: primaryBlock.tenant_name // Tells the UI who actually pays it
        })
      }
    }
  })

  // 7. Calculate Totals (Strictly ignoring shared_reference dues) & Filter
  const ledger = Array.from(ledgerMap.values()).map(block => ({
    ...block,
    // Note the `&& !d.is_shared_reference` to prevent duplicate math
    total_collected: block.dues.filter(d => d.status === 'paid' && !d.is_shared_reference).reduce((s, d) => s + d.amount, 0),
    total_pending: block.dues.filter(d => d.status !== 'paid' && !d.is_shared_reference).reduce((s, d) => s + d.amount, 0)
  })).filter(item => item.tenant_id !== 'vacant' || item.dues.length > 0)

  return {
    tenants: ledger,
    collected: ledger.reduce((s, t) => s + t.total_collected, 0),
    pending: ledger.reduce((s, t) => s + t.total_pending, 0)
  }
}