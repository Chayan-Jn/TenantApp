import { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBills, getBillSplits, deleteBill, updateBill, updateBillStatus, updateSplitStatus } from '../../api/bills.api.js'
import { api } from '../../api/client.js'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ConfirmModal from '../../components/ui/ConfirmModal.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Button from '../../components/ui/Button.jsx'
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
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide transition-colors">Split Details</p>
      {splits.map(s => (
        <div key={s.id} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-gray-100 dark:border-slate-700 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-gray-800 dark:text-gray-200 font-medium transition-colors">{s.tenant_name}</span>
            {s.status === 'paid' && <Badge variant="green">Paid</Badge>}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900 dark:text-white transition-colors">{formatCurrency(s.amount)}</span>
            <button 
              onClick={() => splitStatusMutation.mutate({ id: s.id, status: s.status === 'paid' ? 'pending' : 'paid' })} 
              className={
                s.status === 'paid'
                  ? 'text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 px-3 py-1.5 rounded transition-colors cursor-pointer'
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
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

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

  const proceedDeleteBill = async () => {
    if (!confirmDeleteId) return
    deleteMutation.mutate(confirmDeleteId)
    setConfirmDeleteId(null)
  }

  const handleDeleteBill = (id) => {
    setConfirmDeleteId(id)
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
        <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Bills</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">View all bills across your properties</p>
      </div>

      <Card className="transition-colors border-gray-200 dark:border-slate-700">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1 flex-1 min-w-40">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Property</label>
            <select 
              className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 cursor-pointer transition-colors" 
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
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Unit (optional)</label>
              <select 
                className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 cursor-pointer transition-colors" 
                value={selectedUnit} 
                onChange={(e) => setSelectedUnit(e.target.value)}
              >
                <option value="">All Units</option>
                {units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Month</label>
            <select 
              className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 cursor-pointer transition-colors" 
              value={month} 
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
            <select 
              className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 cursor-pointer transition-colors" 
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
          <div className="animate-pulse flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
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
            <div key={propertyName} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
              <div className="bg-gray-50 dark:bg-slate-800/50 px-5 py-3 border-b border-gray-200 dark:border-slate-700 transition-colors">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">{propertyName}</h2>
              </div>
              <div className="p-5 flex flex-col gap-6">
                {Object.entries(units).map(([unitName, unitBills]) => (
                  <div key={unitName}>
                    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-100 dark:border-slate-700 pb-1 transition-colors">{unitName}</h3>
                    <div className="flex flex-col gap-3">
                      {unitBills.map((bill) => (
                        <div key={bill.id} className="border border-gray-100 dark:border-slate-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-slate-500 transition-colors bg-white dark:bg-slate-800/40">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            
                            {/* Bill Info & Names */}
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize transition-colors">{bill.type}</span>
                                <Badge variant={TYPE_COLORS[bill.type]}>{bill.type}</Badge>
                                {bill.split_type !== 'unit' && <Badge variant="blue">{bill.split_type} split</Badge>}
                                {bill.status === 'paid' && <Badge variant="green">Paid</Badge>}
                              </div>
                              
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                {bill.split_type === 'unit' 
                                  ? (bill.tenant_name || 'All Unit Tenants') 
                                  : <span className="text-gray-500 dark:text-gray-400 italic">Shared Bill</span>}
                              </span>

                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-gray-400 dark:text-gray-500 transition-colors">{MONTHS[bill.month - 1]} {bill.year}</span>
                                {bill.note && (
                                  <>
                                    <span className="text-gray-300 dark:text-gray-600">•</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{bill.note}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Actions & Amounts */}
                            <div className="flex items-center gap-3">
                              <span className="text-base font-bold text-gray-900 dark:text-white mr-2 transition-colors">{formatCurrency(bill.amount)}</span>
                              
                              {bill.split_type === 'unit' && (
                                <button 
                                  onClick={() => billStatusMutation.mutate({ id: bill.id, status: bill.status === 'paid' ? 'pending' : 'paid' })} 
                                  className={
                                    bill.status === 'paid' 
                                      ? 'text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600 px-3 py-1.5 rounded-md transition-colors cursor-pointer bg-white dark:bg-slate-800' 
                                      : 'text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-none px-3 py-1.5 rounded-md transition-colors cursor-pointer'
                                  }
                                >
                                  {bill.status === 'paid' ? 'Undo' : 'Mark Paid'}
                                </button>
                              )}
                              
                              <button onClick={() => openEditBillModal(bill)} className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 cursor-pointer bg-gray-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-md transition-colors">
                                <FiEdit2 size={16} />
                              </button>
                              
                              <button onClick={() => handleDeleteBill(bill.id)} className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-1.5 cursor-pointer bg-gray-50 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-md transition-colors">
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

      {/* --- EDIT BILL MODAL --- */}
      <Modal open={editBillModal} onClose={() => setEditBillModal(false)} title="Edit Bill">
        <form onSubmit={handleUpdateBill} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bill Type</label>
            <select required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer" value={editBillForm.type} onChange={(e) => setEditBillForm({ ...editBillForm, type: e.target.value })}>
              {BILL_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
            <input type="number" required min="1" value={editBillForm.amount} onChange={(e) => setEditBillForm({ ...editBillForm, amount: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Month</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer" value={editBillForm.month} onChange={(e) => setEditBillForm({ ...editBillForm, month: Number(e.target.value) })}>
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer" value={editBillForm.year} onChange={(e) => setEditBillForm({ ...editBillForm, year: Number(e.target.value) })}>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Split Type</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer" value={editBillForm.split_type} onChange={(e) => handleEditSplitTypeChange(e.target.value)}>
              <option value="unit">Per Unit (no split)</option>
              <option value="equal">Equal Split</option>
              <option value="custom">Custom Split</option>
            </select>
          </div>
          {editBillForm.split_type === 'custom' && editCustomSplits.length > 0 && (
            <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <label className="text-sm font-medium text-slate-700">Custom Amounts</label>
              {editCustomSplits.map((s, i) => (
                <div key={s.tenant_id} className="flex items-center gap-2">
                  <span className="text-sm text-slate-700 flex-1 font-medium">{s.name}</span>
                  <input type="number" min="0" placeholder="₹" value={s.amount}
                    onChange={(e) => {
                      const updated = [...editCustomSplits]
                      updated[i] = { ...updated[i], amount: e.target.value }
                      setEditCustomSplits(updated)
                    }}
                    className="w-28 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              ))}
              <div className="mt-1 pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Allocated</span>
                <span className={`text-sm font-bold ${editCustomSplits.reduce((s, c) => s + (Number(c.amount) || 0), 0) === Number(editBillForm.amount) ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(editCustomSplits.reduce((s, c) => s + (Number(c.amount) || 0), 0))} / {formatCurrency(Number(editBillForm.amount) || 0)}
                </span>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Note (optional)</label>
            <input type="text" value={editBillForm.note} onChange={(e) => setEditBillForm({ ...editBillForm, note: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Q3 Water Tax" />
          </div>
          <div className="flex justify-end gap-3 mt-6 border-t border-slate-100 pt-4">
            <Button type="button" variant="ghost" onClick={() => setEditBillModal(false)} className="font-bold">Cancel</Button>
            <Button type="submit" loading={updateMutation.isPending} className="font-bold">Save Changes</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal 
        open={!!confirmDeleteId} 
        onClose={() => setConfirmDeleteId(null)} 
        onConfirm={proceedDeleteBill} 
        title="Delete Bill" 
        message="Are you sure you want to delete this bill? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}