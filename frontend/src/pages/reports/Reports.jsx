import { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import AlertModal from '../../components/ui/AlertModal.jsx'
import { api } from '../../api/client.js'
import { getLedger } from '../../api/ledger.api.js'
import { getSavedSignature } from '../../components/ui/SignatureModal.jsx'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`

// ============ PRINT WINDOW ============

const PRINT_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a1a; padding: 48px; background: #fff; font-size: 13px; line-height: 1.6; }
  
  .doc { max-width: 680px; margin: 0 auto; }
  
  /* Header bar */
  .doc-header { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 16px; border-bottom: 1px solid #d4d4d4; margin-bottom: 28px; }
  .doc-header .title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #737373; }
  .doc-header .brand { font-size: 14px; font-weight: 700; color: #1a1a1a; }
  .doc-header .date { font-size: 11px; color: #a3a3a3; margin-top: 2px; }

  /* Two-column info */
  .info-row { display: flex; gap: 32px; margin-bottom: 24px; }
  .info-col { flex: 1; }
  .info-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #a3a3a3; margin-bottom: 6px; }
  .info-val { font-size: 13px; color: #262626; line-height: 1.7; }
  .info-val strong { font-weight: 600; }

  /* Amount highlight */
  .amount-block { border: 1px solid #d4d4d4; border-radius: 4px; padding: 24px; text-align: center; margin: 28px 0; }
  .amount-block .label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #737373; margin-bottom: 6px; }
  .amount-block .value { font-size: 32px; font-weight: 700; color: #1a1a1a; }
  .amount-block .note { font-size: 11px; color: #a3a3a3; margin-top: 4px; }

  /* Summary boxes */
  .summary-row { display: flex; gap: 16px; margin-bottom: 28px; }
  .summary-box { flex: 1; border: 1px solid #e5e5e5; border-radius: 4px; padding: 16px; text-align: center; }
  .summary-box .val { font-size: 20px; font-weight: 700; color: #1a1a1a; }
  .summary-box .lbl { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #a3a3a3; margin-top: 2px; }

  /* Tables */
  table { width: 100%; border-collapse: collapse; }
  th { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #737373; padding: 8px 12px; text-align: left; border-bottom: 1px solid #d4d4d4; }
  td { padding: 9px 12px; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
  .total-row td { font-weight: 700; border-top: 1px solid #d4d4d4; border-bottom: none; }

  /* Badges */
  .tag { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.3px; }
  .tag-paid { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
  .tag-pending { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
  .tag-overdue { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
  .tag-initial { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }

  /* Section divider */
  .section { font-size: 13px; font-weight: 700; margin: 24px 0 10px; padding-bottom: 6px; border-bottom: 1px solid #e5e5e5; color: #1a1a1a; }

  /* Footer */
  .doc-footer { display: flex; justify-content: space-between; margin-top: 36px; padding-top: 16px; border-top: 1px solid #d4d4d4; font-size: 11px; color: #a3a3a3; }

  @media print { body { padding: 24px; } .no-print { display: none !important; } }
`

function openPrintWindow(htmlContent, title) {
  const win = window.open('', '_blank', 'width=800,height=900')
  win.document.write(`<!DOCTYPE html><html><head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title><style>${PRINT_STYLES}</style></head><body>
    <div class="doc">${htmlContent}</div>
    <div class="no-print" style="text-align:center;margin-top:32px;">
      <button onclick="window.print()" style="background:#262626;color:#fff;border:none;padding:10px 28px;border-radius:4px;font-weight:600;font-size:13px;cursor:pointer;">Print / Save as PDF</button>
    </div>
  </body></html>`)
  win.document.close()
}

// ============ REPORT BUILDERS ============

function buildReceiptHTML(items, tenantInfo, ownerName, signatureDataUrl) {
  const total = items.reduce((s, d) => s + Number(d.amount), 0)
  const receiptId = `RR-${new Date().getFullYear()}-${String(items[0]?.id || 0).padStart(4, '0')}`

  // Figure out the period covered
  const periods = [...new Set(items.map(d => {
    if (d.due_date) {
      const dt = new Date(d.due_date)
      return `${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`
    }
    if (d.month) return `${MONTHS[d.month - 1]} ${d.year}`
    return null
  }).filter(Boolean))]
  const periodStr = periods.length <= 2 ? periods.join(' & ') : `${periods[0]} to ${periods[periods.length - 1]}`

  const lineItems = items.map(d => {
    let desc = d.title || 'Payment'
    if (d.due_date) {
      const dt = new Date(d.due_date)
      desc += `, ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`
    } else if (d.month) {
      desc += `, ${MONTHS[d.month - 1]} ${d.year}`
    }
    return `<tr><td>${desc}</td><td style="text-align:right;">${formatCurrency(d.amount)}</td></tr>`
  }).join('')

  return `
    <div class="doc-header">
      <div>
        <div class="title">Payment Receipt</div>
        <div class="date">${receiptId}</div>
      </div>
      <div style="text-align:right;">
        <div class="date">Date of Issue: ${formatDate(new Date())}</div>
      </div>
    </div>

    <div class="info-row">
      <div class="info-col">
        <div class="info-label">Received From</div>
        <div class="info-val">
          <strong>${tenantInfo.name}</strong><br/>
          Unit ${tenantInfo.unit_label}, ${tenantInfo.property_name}<br/>
          ${tenantInfo.property_address || ''}
        </div>
      </div>
      <div class="info-col">
        <div class="info-label">Payment Details</div>
        <div class="info-val">
          Period: <strong>${periodStr}</strong><br/>
          Items: ${items.length} payment${items.length > 1 ? 's' : ''}<br/>
          Mode of Payment: Cash / Bank Transfer
        </div>
      </div>
    </div>

    <div class="amount-block">
      <div class="label">Total Amount Received</div>
      <div class="value">${formatCurrency(total)}</div>
      <div class="note">Towards rent and dues for the above-mentioned premises</div>
    </div>

    <table style="margin:24px 0;">
      <thead><tr><th>Description</th><th style="text-align:right;">Amount</th></tr></thead>
      <tbody>
        ${lineItems}
        <tr class="total-row"><td><strong>Total Paid</strong></td><td style="text-align:right;"><strong>${formatCurrency(total)}</strong></td></tr>
      </tbody>
    </table>

    <div class="info-row" style="margin-top:28px;">
      <div class="info-col">
        <div class="info-label">Received By</div>
        <div class="info-val"><strong>${ownerName}</strong><br/>Property Owner / Manager</div>
      </div>
      <div class="info-col">
        <div class="info-label">Authorized Signature</div>
        ${signatureDataUrl
            ? `<img src="${signatureDataUrl}" alt="Signature" style="max-height:60px;max-width:180px;margin-top:8px;object-fit:contain;display:block;" />`
            : `<div style="border-bottom:1px solid #d4d4d4;height:48px;margin-top:8px;"></div>`
        }
      </div>
    </div>

    <div style="margin-top:28px; padding:12px 16px; background:#fafafa; border:1px solid #e5e5e5; border-radius:4px; font-size:11px; color:#737373; line-height:1.7;">
      <strong style="color:#525252;">Terms & Conditions</strong><br/>
      1. This receipt is valid only for the items and period mentioned above.<br/>
      2. This receipt covers only the dues explicitly listed. Any unlisted charges remain outstanding.<br/>
      3. The tenant is advised to retain this receipt for future reference and tax purposes.
    </div>

    <div class="doc-footer">
      <span>${receiptId}</span>
      <span>${signatureDataUrl ? 'Signed' : 'This is a computer-generated receipt and does not require a physical signature'}</span>
    </div>`
}

function buildCollectionHTML(data, monthLabel, year, ownerName) {
  const tenants = (data.tenants || []).filter(t => t.dues.length > 0)
  const byProp = {}
  tenants.forEach(t => {
    if (!byProp[t.property_name]) byProp[t.property_name] = []
    byProp[t.property_name].push(t)
  })

  let tables = ''
  Object.entries(byProp).forEach(([prop, list]) => {
    const rows = list.flatMap(t =>
      t.dues.filter(d => !d.is_shared_reference).map(d => `
        <tr>
          <td>${t.tenant_name}</td>
          <td>${t.unit_label}</td>
          <td>${d.title}</td>
          <td style="text-align:right;">${formatCurrency(d.amount)}</td>
          <td><span class="tag ${d.status === 'paid' ? 'tag-paid' : 'tag-pending'}">${d.status}</span></td>
        </tr>`)
    ).join('')
    tables += `<div class="section">${prop}</div>
      <table><thead><tr><th>Tenant</th><th>Unit</th><th>Type</th><th style="text-align:right;">Amount</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>`
  })

  return `
    <div class="doc-header">
      <div>
        <div class="title">${monthLabel === 'Full Year' ? 'Yearly' : 'Monthly'} Collection Report</div>
        <div class="date">${monthLabel} ${year}</div>
      </div>
      <div style="text-align:right;">
        <div class="date">${formatDate(new Date())}</div>
      </div>
    </div>

    <div class="summary-row">
      <div class="summary-box"><div class="val" style="color:#16a34a;">${formatCurrency(data.collected)}</div><div class="lbl">Collected</div></div>
      <div class="summary-box"><div class="val" style="color:#d97706;">${formatCurrency(data.pending)}</div><div class="lbl">Pending</div></div>
      <div class="summary-box"><div class="val">${formatCurrency(data.collected + data.pending)}</div><div class="lbl">Total Billed</div></div>
    </div>

    ${tables}

    <div class="doc-footer">
      <span>MCR-${monthLabel.substring(0, 3).toUpperCase()}-${year}</span>
      <span>Prepared by ${ownerName}</span>
    </div>`
}

function buildStatementHTML(tenant, rents, ownerName) {
  const paid = rents.filter(r => r.status === 'paid').reduce((s, r) => s + Number(r.amount), 0)
  const pending = rents.filter(r => r.status !== 'paid').reduce((s, r) => s + Number(r.amount), 0)

  const rows = rents.map(r => {
    const st = r.computed_status || r.status
    const tagClass = st === 'paid' ? 'tag-paid' : st === 'overdue' ? 'tag-overdue' : 'tag-pending'
    return `<tr>
      <td>${formatDate(r.due_date)}</td>
      <td style="text-align:right;">${formatCurrency(r.amount)}</td>
      <td><span class="tag ${tagClass}">${st}</span></td>
      <td>${r.paid_date ? formatDate(r.paid_date) : '-'}</td>
      <td>${r.title === 'Initial Payment' ? '<span class="tag tag-initial">Initial</span>' : '-'}</td>
    </tr>`
  }).join('')

  return `
    <div class="doc-header">
      <div>
        <div class="title">Tenant Ledger Statement</div>
        <div class="date">Payment History</div>
      </div>
      <div style="text-align:right;">
        <div class="date">${formatDate(new Date())}</div>
      </div>
    </div>

    <div class="info-row">
      <div class="info-col">
        <div class="info-label">Tenant</div>
        <div class="info-val">
          <strong>${tenant.name}</strong><br/>
          ${tenant.phone}<br/>
          Joined: ${formatDate(tenant.join_date)}
        </div>
      </div>
      <div class="info-col">
        <div class="info-label">Property</div>
        <div class="info-val">
          <strong>${tenant.property_name}</strong><br/>
          Unit ${tenant.label}<br/>
          Monthly Rent: ${formatCurrency(tenant.rent)}${tenant.security_deposit > 0 ? `<br/>Security Deposit: ${formatCurrency(tenant.security_deposit)}` : ''}
        </div>
      </div>
    </div>

    <div class="summary-row">
      <div class="summary-box"><div class="val" style="color:#16a34a;">${formatCurrency(paid)}</div><div class="lbl">Total Paid</div></div>
      <div class="summary-box"><div class="val" style="color:#dc2626;">${formatCurrency(pending)}</div><div class="lbl">Outstanding</div></div>
      <div class="summary-box"><div class="val">${rents.length}</div><div class="lbl">Records</div></div>
    </div>

    <table>
      <thead><tr><th>Due Date</th><th style="text-align:right;">Amount</th><th>Status</th><th>Paid Date</th><th>Note</th></tr></thead>
      <tbody>
        ${rows}
        <tr class="total-row">
          <td>Total</td>
          <td style="text-align:right;">${formatCurrency(paid + pending)}</td>
          <td colspan="3"></td>
        </tr>
      </tbody>
    </table>

    <div class="doc-footer">
      <span>TLS-${tenant.id}-${new Date().getFullYear()}</span>
      <span>Prepared by ${ownerName}</span>
    </div>`
}

// ============ COMPONENT ============

export default function Reports() {
  const { properties, owner } = useLoaderData()
  const now = new Date()

  const [reportType, setReportType] = useState(() => sessionStorage.getItem('reports_type') || 'rent_receipt')
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '' })
  const [generating, setGenerating] = useState(false)

  const [selectedProperty, setSelectedProperty] = useState(() => sessionStorage.getItem('reports_prop') || 'all')
  const [selectedTenant, setSelectedTenant] = useState('')
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [tenantList, setTenantList] = useState([])
  const [paidItems, setPaidItems] = useState([])
  const [tenantInfo, setTenantInfo] = useState(null)
  const [month, setMonth] = useState(() => Number(sessionStorage.getItem('reports_month')) || (now.getMonth() + 1))
  const [year, setYear] = useState(() => Number(sessionStorage.getItem('reports_year')) || now.getFullYear())
  const [showPastTenants, setShowPastTenants] = useState(() => sessionStorage.getItem('reports_past') === 'true')

  useEffect(() => {
    sessionStorage.setItem('reports_type', reportType)
    sessionStorage.setItem('reports_prop', selectedProperty)
    sessionStorage.setItem('reports_month', month.toString())
    sessionStorage.setItem('reports_year', year.toString())
    sessionStorage.setItem('reports_past', showPastTenants.toString())
  }, [reportType, selectedProperty, month, year, showPastTenants])

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)
  const ownerName = owner?.name || owner?.username || 'Owner'

  // Fetch tenants when property changes
  useEffect(() => {
    if (!selectedProperty || selectedProperty === 'all') {
      setTenantList([])
      setSelectedTenant('')
      setPaidItems([])
      setSelectedItems(new Set())
      setTenantInfo(null)
      return
    }
    const f = async () => {
      try {
        const status = showPastTenants ? 'all' : 'active'
        const res = await api(`/tenants?property_id=${selectedProperty}&status=${status}`)
        setTenantList(res.data || [])
      } catch { setTenantList([]) }
    }
    f()
  }, [selectedProperty, showPastTenants])

  // Fetch ALL paid items (rents + bills) via ledger when tenant changes
  useEffect(() => {
    if (!selectedTenant || !selectedProperty || selectedProperty === 'all') {
      setPaidItems([])
      setSelectedItems(new Set())
      setTenantInfo(null)
      return
    }
    const f = async () => {
      try {
        const [tRes, ledgerRes] = await Promise.all([
          api(`/tenants/${selectedTenant}`),
          getLedger({ month: reportType === 'rent_receipt' ? month : 'all', year, property_id: selectedProperty })
        ])
        setTenantInfo(tRes.data)
        // Find this tenant's block in the ledger
        const block = (ledgerRes.data?.tenants || []).find(t => String(t.tenant_id) === String(selectedTenant))
        if (block) {
          const paid = block.dues.filter(d => d.status === 'paid' && !d.is_shared_reference)
          setPaidItems(paid)
        } else {
          setPaidItems([])
        }
      } catch {
        setPaidItems([])
        setTenantInfo(null)
      }
    }
    f()
  }, [selectedTenant, year, month, reportType])

  const needsTenant = reportType === 'rent_receipt' || reportType === 'tenant_statement'
  const needsMonth = reportType === 'monthly_collection' || reportType === 'rent_receipt'
  const needsYear = reportType === 'monthly_collection' || reportType === 'rent_receipt' || reportType === 'yearly_collection'
  const needsRentPicker = reportType === 'rent_receipt'

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      if (reportType === 'rent_receipt') {
        if (!selectedTenant) { setAlertInfo({ open: true, message: 'Select a tenant first.' }); return }
        if (selectedItems.size === 0) { setAlertInfo({ open: true, message: 'Select at least one payment.' }); return }
        const items = paidItems.filter(d => selectedItems.has(`${d.item_type}-${d.id}`))
        if (!items.length) { setAlertInfo({ open: true, message: 'No valid items selected.' }); return }
        // Fetch property address
        let propertyAddress = ''
        try {
          const pRes = await api(`/properties/${tenantInfo.property_id}`)
          propertyAddress = pRes.data?.address || ''
        } catch { /* ignore */ }
        const info = { ...tenantInfo, unit_label: tenantInfo.label, property_address: propertyAddress }
        const signature = getSavedSignature()
        openPrintWindow(buildReceiptHTML(items, info, ownerName, signature), `Receipt - ${tenantInfo.name}`)
      }

      if (reportType === 'monthly_collection') {
        const data = await getLedger({ month, year, property_id: selectedProperty })
        openPrintWindow(buildCollectionHTML(data.data, MONTHS[month - 1], year, ownerName), `Collection - ${MONTHS[month - 1]} ${year}`)
      }

      if (reportType === 'yearly_collection') {
        const data = await getLedger({ month: 'all', year, property_id: selectedProperty })
        openPrintWindow(buildCollectionHTML(data.data, 'Full Year', year, ownerName), `Yearly Collection - ${year}`)
      }

      if (reportType === 'tenant_statement') {
        if (!selectedTenant) { setAlertInfo({ open: true, message: 'Select a tenant first.' }); return }
        const [tRes, rRes] = await Promise.all([api(`/tenants/${selectedTenant}`), api(`/rent?tenant_id=${selectedTenant}`)])
        openPrintWindow(buildStatementHTML(tRes.data, rRes.data || [], ownerName), `Statement - ${tRes.data.name}`)
      }
    } catch (err) {
      setAlertInfo({ open: true, message: err.message || 'Failed to generate report' })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">Reports</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">Generate rent receipts, collection reports, and tenant statements</p>
      </div>

      <Card className="p-5! border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        <div className="flex flex-wrap gap-4 items-end">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Report Type</label>
            <select
              className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 min-w-48 cursor-pointer transition-colors"
              value={reportType}
              onChange={(e) => { setReportType(e.target.value); setSelectedRent('') }}
            >
              <option value="rent_receipt">Rent Receipt</option>
              <option value="monthly_collection">Monthly Collection Report</option>
              <option value="yearly_collection">Yearly Collection Report</option>
              <option value="tenant_statement">Tenant Ledger Statement</option>
            </select>
          </div>

          {needsMonth && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Month</label>
              <select className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer transition-colors" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
          )}

          {needsYear && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Year</label>
              <select className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer transition-colors" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1.5 flex-1 min-w-44">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Property</label>
            <select
              className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 w-full cursor-pointer transition-colors"
              value={selectedProperty}
              onChange={(e) => { setSelectedProperty(e.target.value); setSelectedTenant(''); setSelectedRent('') }}
            >
              {needsTenant ? <option value="all">Select a property...</option> : <option value="all">All Properties</option>}
              {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {needsTenant && (
            <div className="flex flex-col gap-1.5 flex-1 min-w-44">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tenant</label>
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showPastTenants}
                    onChange={(e) => setShowPastTenants(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-700"
                  />
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 uppercase tracking-wide transition-colors">Include Former</span>
                </label>
              </div>
              <select
                className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 w-full cursor-pointer transition-colors"
                value={selectedTenant}
                onChange={(e) => { setSelectedTenant(e.target.value); setSelectedItems(new Set()) }}
                disabled={selectedProperty === 'all'}
              >
                <option value="">{selectedProperty === 'all' ? 'Pick a property first' : 'Select tenant...'}</option>
                {tenantList.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.label || t.unit_label}){t.leave_date ? ' (Moved Out)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Removed duplicate year picker since needsMonth now handles it */}
        </div>

        {/* Payment picker — rents + bills, multi-select */}
        {needsRentPicker && selectedTenant && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Select Payments</label>
              {paidItems.length > 0 && (
                <button
                  onClick={() => {
                    if (selectedItems.size === paidItems.length) {
                      setSelectedItems(new Set())
                    } else {
                      setSelectedItems(new Set(paidItems.map(d => `${d.item_type}-${d.id}`)))
                    }
                  }}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer bg-transparent border-none transition-colors"
                >
                  {selectedItems.size === paidItems.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>
            {paidItems.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">No paid items found for this tenant in {year}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {paidItems.map(d => {
                  const key = `${d.item_type}-${d.id}`
                  const isSelected = selectedItems.has(key)
                  let label = d.title
                  if (d.due_date) {
                    label += `, ${formatDate(d.due_date)}`
                  } else if (d.month) {
                    label += `, ${MONTHS[d.month - 1]}`
                  }
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        const next = new Set(selectedItems)
                        isSelected ? next.delete(key) : next.add(key)
                        setSelectedItems(next)
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all cursor-pointer flex items-center gap-2 ${isSelected
                          ? 'border-slate-700 dark:border-slate-400 bg-slate-800 dark:bg-slate-300 text-white dark:text-slate-900'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] transition-colors ${isSelected ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-white dark:border-slate-400' : 'border-slate-300 dark:border-slate-600'
                        }`}>
                        {isSelected ? '✓' : ''}
                      </span>
                      {formatCurrency(d.amount)} · {label}
                    </button>
                  )
                })}
              </div>
            )}
            {selectedItems.size > 0 && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">
                {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} selected · Total: {formatCurrency(
                  paidItems.filter(d => selectedItems.has(`${d.item_type}-${d.id}`)).reduce((s, d) => s + Number(d.amount), 0)
                )}
              </p>
            )}
          </div>
        )}

        {/* Generate button */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 transition-colors flex items-center gap-4">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-slate-800 dark:bg-slate-300 hover:bg-slate-900 dark:hover:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 cursor-pointer border-none shadow-sm"
          >
            {generating ? 'Generating...' : 'Generate Report'}
          </button>
          {reportType === 'rent_receipt' && (() => {
            const sig = getSavedSignature()
            return sig ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                Signature will be included
              </span>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                No signature — add one in <a href="/settings" className="underline hover:text-slate-600 dark:hover:text-slate-300">Settings</a>
              </span>
            )
          })()}
        </div>
      </Card>

      {/* Description cards — clickable to switch report type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => setReportType('rent_receipt')} className={`p-5 rounded-xl border transition-all cursor-pointer text-left ${reportType === 'rent_receipt' ? 'border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-800/80 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1 transition-colors">Rent Receipt</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">Formal receipt for a specific paid rent. Pick the tenant & payment to generate.</p>
        </button>
        <button onClick={() => setReportType('monthly_collection')} className={`p-5 rounded-xl border transition-all cursor-pointer text-left ${reportType === 'monthly_collection' ? 'border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-800/80 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1 transition-colors">Monthly Collection</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">Summary of all rent and bill collections for a given month, grouped by property.</p>
        </button>
        <button onClick={() => setReportType('yearly_collection')} className={`p-5 rounded-xl border transition-all cursor-pointer text-left ${reportType === 'yearly_collection' ? 'border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-800/80 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1 transition-colors">Yearly Collection</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">Summary of all collections for a full year. Useful for tax and annual accounting.</p>
        </button>
        <button onClick={() => setReportType('tenant_statement')} className={`p-5 rounded-xl border transition-all cursor-pointer text-left ${reportType === 'tenant_statement' ? 'border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-800/80 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1 transition-colors">Tenant Statement</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">Complete payment history for a specific tenant. Useful for move-out settlements.</p>
        </button>
      </div>

      <AlertModal open={alertInfo.open} onClose={() => setAlertInfo({ open: false, message: '' })} message={alertInfo.message} />
    </div>
  )
}
