import { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBills, getBillSplits, deleteBill, updateBill, updateBillStatus, updateSplitStatus } from '../../api/bills.api.js'
import { api } from '../../api/client.js'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { FiTrash2, FiEdit2 } from 'react-icons/fi'

const BILL_TYPES = ['electricity', 'water', 'gas', 'maintenance', 'parking', 'other']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const TYPE_COLORS = { electricity: 'yellow', water: 'blue', gas: 'red', maintenance: 'gray', parking: 'gray', other: 'gray' }
const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`

// --- NEW SUB-COMPONENT: Auto-fetches and displays splits for shared bills ---
function BillSplitsList({ billId, splitStatusMutation }) {
  const { data, isFetching } = useQuery({
    queryKey: ['billSplits', billId],
    queryFn: () => getBillSplits(billId),
    staleTime: 1000 * 60 * 5
  })

  const splits = data?.data || []

  if (isFetching) {
    return <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">Loading split details...</div>
  }

  if (splits.length === 0) return null

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Split Details</p>
      {splits.map(s => (
        <div key={s.id} className="flex items-center justify-between text-sm bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-gray-800 font-medium">{s.tenant_name}</span>
            {s.status === 'paid' && <Badge variant="green">Paid</Badge>}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">{formatCurrency(s.amount)}</span>
            <button 
              onClick={() => splitStatusMutation.mutate({ id: s.id, status: s.status === 'paid' ? 'pending' : 'paid' })} 
              className={
                s.status === 'paid'
                  ? 'text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-200 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded transition-colors cursor-pointer'
                  : 'text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-none px-3 py-1.5 rounded transition-colors cursor-pointer'
              }
            >
              {s.status === 'paid' ? 'Undo' : 'Mark Paid'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
// ----------------------------------------------------------------------------

export default function Bills() {
  const { properties } = useLoaderData()
  const queryClient = useQueryClient()
  const now = new Date()

  const [selectedProperty, setSelectedProperty] = useState(() => sessionStorage.getItem('bills_property') || '')
  const [selectedUnit, setSelectedUnit] = useState(() => sessionStorage.getItem('bills_unit') || '')
  const [month, setMonth] = useState(() => {
    const saved = sessionStorage.getItem('bills_month')
    return saved ? Number(saved) : now.getMonth() + 1
  })
  const [year, setYear] = useState(() => {
    const saved = sessionStorage.getItem('bills_year')
    return saved ? Number(saved) : now.getFullYear()
  })

  useEffect(() => {
    sessionStorage.setItem('bills_property', selectedProperty)
    sessionStorage.setItem('bills_unit', selectedUnit)
    sessionStorage.setItem('bills_month', month.toString())
    sessionStorage.setItem('bills_year', year.toString())
  }, [selectedProperty, selectedUnit, month, year])

  const [units, setUnits] = useState([])
  const [editBillModal, setEditBillModal] = useState(false)
  const [editingBill, setEditingBill] = useState(null)
  const [editBillForm, setEditBillForm] = useState({
    type: 'electricity', amount: '', split_type: 'unit',
    month: now.getMonth() + 1, year: now.getFullYear(), note: ''
  })
  const [editCustomSplits, setEditCustomSplits] = useState([])
  const [unitTenants, setUnitTenants] = useState([])

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)

  useEffect(() => {
    if (!selectedProperty || selectedProperty === 'all') {
      setUnits([])
      return
    }
    const fetchUnits = async () => {
      try {
        const res = await api(`/units?property_id=${selectedProperty}`)
        setUnits(res.data || [])
      } catch {
        setUnits([])
      }
    }
    fetchUnits()
  }, [selectedProperty])

  const billsQueryKey = ['bills', selectedProperty, selectedUnit, month, year]

  const { data: billsData, isFetching } = useQuery({
    queryKey: billsQueryKey,
    queryFn: async () => {
      if (!selectedProperty) return { data: [] }
      const params = selectedProperty === 'all'
        ? { month, year }
        : selectedUnit
          ? { unit_id: selectedUnit, month, year }
          : { property_id: selectedProperty, month, year }
      return getBills(params)
    },
    enabled: !!selectedProperty,
    staleTime: 1000 * 60 * 5 
  })

  const bills = billsData?.data || []

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteBill(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: billsQueryKey })
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateBill(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billsQueryKey })
      setEditBillModal(false)
      setEditingBill(null)
    }
  })

  const billStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateBillStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: billsQueryKey })
  })

  const splitStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateSplitStatus(id, status),
    onSuccess: () => {
      // Invalidate the main bills to update overall status, and all billSplits to refresh the sub-components
      queryClient.invalidateQueries({ queryKey: billsQueryKey })
      queryClient.invalidateQueries({ queryKey: ['billSplits'] })
    }
  })

  const handlePropertyChange = (propertyId) => {
    setSelectedProperty(propertyId)
    setSelectedUnit('') 
  }

  const handleDeleteBill = async (id) => {
    if (!window.confirm('Delete this bill?')) return
    deleteMutation.mutate(id)
  }

  const openEditBillModal = async (bill) => {
    setEditingBill(bill)
    setEditBillForm({
      type: bill.type, amount: bill.amount, split_type: bill.split_type,
      month: bill.month, year: bill.year, note: bill.note || ''
    })
    try {
      const tenantsRes = await api(`/tenants?unit_id=${bill.unit_id}`)
      setUnitTenants(tenantsRes.data || [])
      if (bill.split_type === 'custom') {
        const splitsRes = await getBillSplits(bill.id)
        setEditCustomSplits(splitsRes.data.map(s => ({
          tenant_id: s.tenant_id, name: s.tenant_name, amount: s.amount
        })))
      } else {
        setEditCustomSplits([])
      }
    } catch {
      setUnitTenants([])
      setEditCustomSplits([])
    }
    setEditBillModal(true)
  }

  const handleEditSplitTypeChange = (split_type) => {
    setEditBillForm({ ...editBillForm, split_type })
    if (split_type === 'custom') {
      setEditCustomSplits(unitTenants.map(t => ({ tenant_id: t.id, name: t.name, amount: '' })))
    } else {
      setEditCustomSplits([])
    }
  }

  const handleUpdateBill = async (e) => {
    e.preventDefault()
    const payload = {
      type: editBillForm.type, amount: Number(editBillForm.amount),
      split_type: editBillForm.split_type, month: Number(editBillForm.month),
      year: Number(editBillForm.year), note: editBillForm.note || undefined
    }
    if (editBillForm.split_type === 'custom') {
      payload.splits = editCustomSplits.map(s => ({ tenant_id: s.tenant_id, amount: Number(s.amount) }))
    }
    updateMutation.mutate({ id: editingBill.id, payload })
  }

  const groupedBills = bills.reduce((acc, bill) => {
    const propName = bill.property_name || 'Unknown Property'
    const unitName = bill.unit_label || 'Unknown Unit'
    if (!acc[propName]) acc[propName] = {}
    if (!acc[propName][unitName]) acc[propName][unitName] = []
    acc[propName][unitName].push(bill)
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Bills</h1>
        <p className="text-sm text-gray-500 mt-1">View all bills across your properties</p>
      </div>

      <Card>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1 flex-1 min-w-40">
            <label className="text-sm font-medium text-gray-700">Property</label>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer" 
              value={selectedProperty} 
              onChange={(e) => handlePropertyChange(e.target.value)}
            >
              <option value="">Select property</option>
              <option value="all">All Properties</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          {units.length > 0 && (
            <div className="flex flex-col gap-1 flex-1 min-w-40">
              <label className="text-sm font-medium text-gray-700">Unit (optional)</label>
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer" 
                value={selectedUnit} 
                onChange={(e) => setSelectedUnit(e.target.value)}
              >
                <option value="">All Units</option>
                {units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Month</label>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer" 
              value={month} 
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Year</label>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer" 
              value={year} 
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {isFetching && (
        <div className="flex justify-center py-8">
          <div className="animate-pulse flex items-center gap-2 text-blue-600 font-medium">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="4" strokeLinecap="round" strokeDasharray="31.4 31.4" />
            </svg>
            Fetching bills...
          </div>
        </div>
      )}

      {selectedProperty && !isFetching && bills.length === 0 && (
        <Card><p className="text-sm text-gray-500 text-center">No bills found for this period</p></Card>
      )}

      {bills.length > 0 && (
        <div className={`flex flex-col gap-8 transition-opacity duration-200 ${isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {Object.entries(groupedBills).map(([propertyName, units]) => (
            <div key={propertyName} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">{propertyName}</h2>
              </div>
              <div className="p-5 flex flex-col gap-6">
                {Object.entries(units).map(([unitName, unitBills]) => (
                  <div key={unitName}>
                    <h3 className="text-md font-semibold text-gray-700 mb-3 border-b border-gray-100 pb-1">{unitName}</h3>
                    <div className="flex flex-col gap-3">
                      {unitBills.map((bill) => (
                        <div key={bill.id} className="border border-gray-100 rounded-lg p-4 hover:border-gray-300 transition-colors bg-white">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            
                            {/* Bill Info & Names */}
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900 capitalize">{bill.type}</span>
                                <Badge variant={TYPE_COLORS[bill.type]}>{bill.type}</Badge>
                                {bill.split_type !== 'unit' && <Badge variant="blue">{bill.split_type} split</Badge>}
                                {bill.status === 'paid' && <Badge variant="green">Paid</Badge>}
                              </div>
                              
                              <span className="text-sm font-medium text-gray-700">
                                {bill.split_type === 'unit' 
                                  ? (bill.tenant_name || 'All Unit Tenants') 
                                  : <span className="text-gray-500 italic">Shared Bill</span>}
                              </span>

                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-gray-400">{MONTHS[bill.month - 1]} {bill.year}</span>
                                {bill.note && (
                                  <>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-xs text-gray-500">{bill.note}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Actions & Amounts */}
                            <div className="flex items-center gap-3">
                              <span className="text-base font-bold text-gray-900 mr-2">{formatCurrency(bill.amount)}</span>
                              
                              {bill.split_type === 'unit' && (
                                <button 
                                  onClick={() => billStatusMutation.mutate({ id: bill.id, status: bill.status === 'paid' ? 'pending' : 'paid' })} 
                                  className={
                                    bill.status === 'paid' 
                                      ? 'text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-md transition-colors cursor-pointer bg-white' 
                                      : 'text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-none px-3 py-1.5 rounded-md transition-colors cursor-pointer'
                                  }
                                >
                                  {bill.status === 'paid' ? 'Undo' : 'Mark Paid'}
                                </button>
                              )}
                              
                              <button onClick={() => openEditBillModal(bill)} className="text-gray-400 hover:text-blue-600 p-1.5 cursor-pointer bg-gray-50 hover:bg-blue-50 rounded-md transition-colors">
                                <FiEdit2 size={16} />
                              </button>
                              
                              <button onClick={() => handleDeleteBill(bill.id)} className="text-gray-400 hover:text-red-600 p-1.5 cursor-pointer bg-gray-50 hover:bg-red-50 rounded-md transition-colors">
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Auto-load Splits if it's not a standard unit bill */}
                          {bill.split_type !== 'unit' && (
                            <BillSplitsList billId={bill.id} splitStatusMutation={splitStatusMutation} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Bill Modal */}
      {editBillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-900">Edit Bill</h2>
              <button onClick={() => setEditBillModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer bg-transparent border-none">&times;</button>
            </div>
            <form onSubmit={handleUpdateBill} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill Type</label>
                <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer" value={editBillForm.type} onChange={(e) => setEditBillForm({ ...editBillForm, type: e.target.value })}>
                  {BILL_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input type="number" required min="1" value={editBillForm.amount} onChange={(e) => setEditBillForm({ ...editBillForm, amount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer" value={editBillForm.month} onChange={(e) => setEditBillForm({ ...editBillForm, month: Number(e.target.value) })}>
                    {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer" value={editBillForm.year} onChange={(e) => setEditBillForm({ ...editBillForm, year: Number(e.target.value) })}>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Split Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer" value={editBillForm.split_type} onChange={(e) => handleEditSplitTypeChange(e.target.value)}>
                  <option value="unit">Per Unit (no split)</option>
                  <option value="equal">Equal Split</option>
                  <option value="custom">Custom Split</option>
                </select>
              </div>
              {editBillForm.split_type === 'custom' && editCustomSplits.length > 0 && (
                <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <label className="text-sm font-medium text-gray-700">Custom Amounts</label>
                  {editCustomSplits.map((s, i) => (
                    <div key={s.tenant_id} className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 flex-1 font-medium">{s.name}</span>
                      <input type="number" min="0" placeholder="₹" value={s.amount}
                        onChange={(e) => {
                          const updated = [...editCustomSplits]
                          updated[i] = { ...updated[i], amount: e.target.value }
                          setEditCustomSplits(updated)
                        }}
                        className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                  ))}
                  <div className="mt-1 pt-2 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Allocated</span>
                    <span className={`text-sm font-bold ${editCustomSplits.reduce((s, c) => s + (Number(c.amount) || 0), 0) === Number(editBillForm.amount) ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(editCustomSplits.reduce((s, c) => s + (Number(c.amount) || 0), 0))} / {formatCurrency(Number(editBillForm.amount) || 0)}
                    </span>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                <input type="text" value={editBillForm.note} onChange={(e) => setEditBillForm({ ...editBillForm, note: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Q3 Water Tax" />
              </div>
              <div className="flex justify-end gap-3 mt-6 border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setEditBillModal(false)} className="px-4 py-2 cursor-pointer text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors border-none bg-transparent">Cancel</button>
                <button type="submit" disabled={updateMutation.isPending} className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 border-none shadow-sm">{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}