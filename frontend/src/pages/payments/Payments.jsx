import { useState } from 'react'
import { useLoaderData } from 'react-router'
import { getLedger } from '../../api/ledger.api.js'
import { markRentPaid, markRentUnpaid, generateMonthlyRent } from '../../api/rent.api.js'
import { updateBillStatus, updateSplitStatus } from '../../api/bills.api.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '-'
const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const statusVariant = { paid: 'green', pending: 'yellow', overdue: 'red' }

export default function Payments() {
  const { properties } = useLoaderData()
  const now = new Date()

  // Default to current month, but can now be "all"
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [propertyId, setPropertyId] = useState('all')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  const fetchData = async () => {
    const res = await getLedger({ month, year, property_id: propertyId })
    setData(res.data)
  }

  const handleFetch = async () => {
    setLoading(true)
    try {
      await fetchData()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (item) => {
    try {
      if (item.item_type === 'rent') {
        item.status === 'paid' ? await markRentUnpaid(item.id) : await markRentPaid(item.id)
      } else if (item.item_type === 'split') {
        const targetStatus = item.status === 'paid' ? 'pending' : 'paid'
        await updateSplitStatus(item.id, targetStatus)
      } else if (item.item_type === 'unit_bill') {
        const targetStatus = item.status === 'paid' ? 'pending' : 'paid'
        await updateBillStatus(item.id, targetStatus)
      }
      await fetchData() 
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  const handleGenerate = async () => {
    if (month === 'all') return
    const isAll = propertyId === 'all'
    const promptMsg = isAll 
      ? `Generate rent for ALL active tenants across ALL properties for ${MONTHS[month - 1]} ${year}?`
      : `Generate rent for this specific property for ${MONTHS[month - 1]} ${year}?`

    if (!window.confirm(promptMsg)) return

    setGenerating(true)
    try {
      const res = await generateMonthlyRent({
        property_id: isAll ? 'all' : Number(propertyId),
        month,
        year
      })
      alert(`Generated: ${res.data.generated} records, Skipped: ${res.data.skipped} already existing`)
      await fetchData()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    } finally {
      setGenerating(false)
    }
  }

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)

  // --- NEW MASTER GROUPING LOGIC ---
  const groupedData = {} 
  if (data?.tenants) {
    data.tenants.forEach(tenant => {
      const duesByMonth = {}
      
      // Separate the tenant's dues into their respective months
      tenant.dues.forEach(due => {
        if (!duesByMonth[due.month]) duesByMonth[due.month] = []
        duesByMonth[due.month].push(due)
      })

      // If viewing a specific month, ensure empty tenants still show up so rent can be generated
      if (tenant.dues.length === 0 && month !== 'all') {
        duesByMonth[month] = [] 
      }

      // Build the hierarchy: Month -> Property -> Tenant
      Object.keys(duesByMonth).forEach(m => {
        const mInt = Number(m)
        if (!groupedData[mInt]) groupedData[mInt] = {}
        if (!groupedData[mInt][tenant.property_name]) groupedData[mInt][tenant.property_name] = []
        
        const monthDues = duesByMonth[m]
        groupedData[mInt][tenant.property_name].push({
          ...tenant,
          dues: monthDues,
          total_pending: monthDues.filter(d => d.status !== 'paid').reduce((sum, d) => sum + d.amount, 0)
        })
      })
    })
  }

  // Sort months ascending (Jan to Dec)
  const sortedMonths = Object.keys(groupedData).map(Number).sort((a, b) => a - b)

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Payments & Ledger</h1>
        <p className="text-sm text-slate-500 mt-1">Manage monthly rent and utility collections</p>
      </div>

      {/* Controls */}
      <Card className="p-5! border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Month</label>
            <select
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 bg-white min-w-35 cursor-pointer"
              value={month}
              onChange={(e) => setMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            >
              <option value="all">All Months</option>
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Year</label>
            <select
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 bg-white cursor-pointer"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-50">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Property</label>
            <select
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 bg-white w-full cursor-pointer"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
            >
              <option value="all">All Properties</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <Button onClick={handleFetch} loading={loading} className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-800 text-white cursor-pointer">
              Fetch Ledger
            </Button>
            <Button
              variant="outline"
              onClick={handleGenerate}
              loading={generating}
              disabled={month === 'all'}
              className={`flex-1 sm:flex-none border-slate-300 ${month === 'all' ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
            >
              {month === 'all' ? 'Select Month to Generate' : 'Generate Rent'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Data View */}
      {data && (
        <div className="flex flex-col gap-12">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700/70 mb-1">Total Collected</p>
              <p className="text-2xl font-black text-emerald-700">{formatCurrency(data.collected)}</p>
            </div>
            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700/70 mb-1">Total Pending</p>
              <p className="text-2xl font-black text-amber-700">{formatCurrency(data.pending)}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Total Billed</p>
              <p className="text-2xl font-black text-slate-700">{formatCurrency(data.collected + data.pending)}</p>
            </div>
          </div>

          {/* Master View: Sorted by Month -> Property -> Tenant */}
          {sortedMonths.length === 0 ? (
            <Card className="py-12 border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 text-center">No tenants or dues found for this period.</p>
            </Card>
          ) : (
            sortedMonths.map(mInt => {
              const propertiesForMonth = groupedData[mInt]
              const sortedProps = Object.keys(propertiesForMonth).sort()

              return (
                <div key={mInt} className="flex flex-col gap-6">
                  {/* Month Header */}
                  <div className="border-b-2 border-slate-800 pb-2 flex justify-between items-end">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                      {MONTHS[mInt - 1]} {year}
                    </h2>
                  </div>

                  {/* Properties within that month */}
                  {sortedProps.map(propertyName => {
                    const tenants = propertiesForMonth[propertyName].sort((a, b) => 
                      a.unit_label.localeCompare(b.unit_label, undefined, { numeric: true, sensitivity: 'base' })
                    )

                    return (
                      <div key={`${mInt}-${propertyName}`} className="flex flex-col gap-4 ml-2">
                        <h3 className="text-lg font-bold text-slate-600 border-b border-slate-200 pb-1 mt-2">
                          {propertyName}
                        </h3>

                        <div className="flex flex-col gap-5">
                          {tenants.map((tenant) => (
                            <Card key={tenant.tenant_id} className="p-0! overflow-hidden border-slate-200 shadow-sm">
                              
                              <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                  <h4 className="text-base font-bold text-slate-800">
                                    Unit {tenant.unit_label} <span className="text-slate-400 font-normal mx-1">|</span> {tenant.tenant_name}
                                  </h4>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Pending (This Month)</p>
                                  <p className={`text-lg font-black ${tenant.total_pending > 0 ? 'text-slate-700' : 'text-slate-400'}`}>
                                    {formatCurrency(tenant.total_pending)}
                                  </p>
                                </div>
                              </div>

                              <div className="divide-y divide-slate-100">
                                {tenant.dues.length === 0 ? (
                                  <div className="px-5 py-4 text-center text-sm text-slate-400">No dues generated for this month.</div>
                                ) : (
                                  tenant.dues.map((due) => (
                                    <div key={`${due.item_type}-${due.id}`} className="px-5 py-3.5 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                                      
                                      <div className="flex flex-col gap-1">
                                        <span className="text-sm font-semibold text-slate-700">{due.title}</span>
                                        {due.due_date && (
                                          <span className="text-xs text-slate-400 font-medium">Due: {formatDate(due.due_date)}</span>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-4">
                                        <span className="text-sm font-bold text-slate-700 w-20 text-right">
                                          {formatCurrency(due.amount)}
                                        </span>
                                        
                                        <div className="w-20 flex justify-center">
                                          <Badge variant={statusVariant[due.status] || 'yellow'}>{due.status}</Badge>
                                        </div>
                                        
                                        <div className="w-24 flex justify-end">
                                          <Button 
                                            type="button"
                                            size="sm" 
                                            variant={due.status === 'paid' ? 'ghost' : 'default'}
                                            className={
                                              due.status === 'paid' 
                                                ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer' 
                                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-none cursor-pointer'
                                            }
                                            onClick={() => handleAction(due)}
                                          >
                                            {due.status === 'paid' ? 'Undo' : 'Mark Paid'}
                                          </Button>
                                        </div>
                                      </div>

                                    </div>
                                  ))
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}