import { useState } from 'react'
import { useLoaderData } from 'react-router'
import { getBills, getBillSplits, deleteBill, updateBill, updateBillStatus, updateSplitStatus } from '../../api/bills.api.js'
import { api } from '../../api/client.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { FiTrash2, FiEdit2, FiChevronDown, FiChevronUp, FiCheckCircle } from 'react-icons/fi'

const BILL_TYPES = ['electricity', 'water', 'gas', 'maintenance', 'parking', 'other']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const TYPE_COLORS = { electricity: 'yellow', water: 'blue', gas: 'red', maintenance: 'gray', parking: 'gray', other: 'gray' }
const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`

export default function Bills() {
  const { properties } = useLoaderData()
  const now = new Date()

  const [selectedProperty, setSelectedProperty] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')
  const [units, setUnits] = useState([])
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [bills, setBills] = useState([])
  const [fetched, setFetched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [expandedBill, setExpandedBill] = useState(null)
  const [splits, setSplits] = useState([])
  const [editBillModal, setEditBillModal] = useState(false)
  const [editingBill, setEditingBill] = useState(null)
  const [editBillForm, setEditBillForm] = useState({
    type: 'electricity', amount: '', split_type: 'unit',
    month: now.getMonth() + 1, year: now.getFullYear(), note: ''
  })
  const [editCustomSplits, setEditCustomSplits] = useState([])
  const [unitTenants, setUnitTenants] = useState([])
  const [updatingBill, setUpdatingBill] = useState(false)

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)

  const handlePropertyChange = async (propertyId) => {
    setSelectedProperty(propertyId)
    setSelectedUnit('')
    setBills([])
    setFetched(false)
    setUnits([])
    if (!propertyId || propertyId === 'all') return
    try {
      const res = await api(`/units?property_id=${propertyId}`)
      setUnits(res.data || [])
    } catch { setUnits([]) }
  }

  const handleFetch = async () => {
    if (!selectedProperty) return
    setLoading(true)
    try {
      const params = selectedProperty === 'all'
        ? { month, year }
        : selectedUnit
          ? { unit_id: selectedUnit, month, year }
          : { property_id: selectedProperty, month, year }
      const res = await getBills(params)
      setBills(res.data)
      setFetched(true)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExpandBill = async (billId) => {
    if (expandedBill === billId) { setExpandedBill(null); setSplits([]); return }
    try {
      const res = await getBillSplits(billId)
      setSplits(res.data)
      setExpandedBill(billId)
    } catch { setSplits([]) }
  }

  const handleDeleteBill = async (id) => {
    if (!window.confirm('Delete this bill?')) return
    try {
      await deleteBill(id)
      setBills(bills.filter(b => b.id !== id))
    } catch (err) {
      alert(err.message)
    }
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
    setUpdatingBill(true)
    try {
      const payload = {
        type: editBillForm.type, amount: Number(editBillForm.amount),
        split_type: editBillForm.split_type, month: Number(editBillForm.month),
        year: Number(editBillForm.year), note: editBillForm.note || undefined
      }
      if (editBillForm.split_type === 'custom') {
        payload.splits = editCustomSplits.map(s => ({ tenant_id: s.tenant_id, amount: Number(s.amount) }))
      }
      const res = await updateBill(editingBill.id, payload)
      setBills(bills.map(b => b.id === editingBill.id ? { ...b, ...res.data } : b))
      setEditBillModal(false)
      setEditingBill(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdatingBill(false)
    }
  }

  // ---- Status Toggle Logic ----
  const handleToggleBillStatus = async (billId, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    try {
      await updateBillStatus(billId, newStatus);
      setBills(bills.map(b => b.id === billId ? { ...b, status: newStatus } : b));
    } catch (err) {
      alert(err.message || 'Failed to update bill status');
    }
  }

  const handleToggleSplitStatus = async (billId, splitId, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    try {
      await updateSplitStatus(splitId, newStatus);
      const updatedSplits = splits.map(s => s.id === splitId ? { ...s, status: newStatus } : s);
      setSplits(updatedSplits);
      
      const allPaid = updatedSplits.every(s => s.status === 'paid');
      setBills(bills.map(b => b.id === billId ? { ...b, status: allPaid ? 'paid' : 'pending' } : b));
    } catch (err) {
      alert(err.message || 'Failed to update split status');
    }
  }

  // ---- Grouping Logic ----
  // This groups bills by Property Name, then by Unit Label
  const groupedBills = bills.reduce((acc, bill) => {
    const propName = bill.property_name || 'Unknown Property';
    const unitName = bill.unit_label || 'Unknown Unit';
    
    if (!acc[propName]) acc[propName] = {};
    if (!acc[propName][unitName]) acc[propName][unitName] = [];
    
    acc[propName][unitName].push(bill);
    return acc;
  }, {});

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
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer" value={selectedProperty} onChange={(e) => handlePropertyChange(e.target.value)}>
              <option value="">Select property</option>
              <option value="all">All Properties</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          {units.length > 0 && (
            <div className="flex flex-col gap-1 flex-1 min-w-40">
              <label className="text-sm font-medium text-gray-700">Unit (optional)</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer" value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
                <option value="">All Units</option>
                {units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Month</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Year</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer" value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <Button onClick={handleFetch} loading={loading} disabled={!selectedProperty}>Fetch</Button>
        </div>
      </Card>

      {fetched && bills.length === 0 && (
        <Card><p className="text-sm text-gray-500 text-center">No bills found for this period</p></Card>
      )}

      {/* Render Grouped Bills */}
      {bills.length > 0 && (
        <div className="flex flex-col gap-8">
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
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900 capitalize">{bill.type}</span>
                                <Badge variant={TYPE_COLORS[bill.type]}>{bill.type}</Badge>
                                {bill.split_type !== 'unit' && <Badge variant="blue">{bill.split_type} split</Badge>}
                                {bill.status === 'paid' && <Badge variant="green">Paid</Badge>}
                              </div>
                              <span className="text-xs text-gray-400">{MONTHS[bill.month - 1]} {bill.year}</span>
                              {bill.note && <span className="text-xs text-gray-500 mt-1">{bill.note}</span>}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900 mr-2">{formatCurrency(bill.amount)}</span>
                              
                              {/* Main Bill Status Toggle (for Unit bills) */}
                              {bill.split_type === 'unit' && (
                                bill.status === 'paid' ? (
                                  <button 
                                    onClick={() => handleToggleBillStatus(bill.id, bill.status)} 
                                    title="Undo Payment"
                                    className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200 px-2 py-1 rounded transition-colors cursor-pointer bg-white"
                                  >
                                    Undo
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => handleToggleBillStatus(bill.id, bill.status)} 
                                    title="Mark as Paid"
                                    className="text-gray-400 hover:text-green-600 p-1 cursor-pointer transition-colors"
                                  >
                                    <FiCheckCircle size={18} />
                                  </button>
                                )
                              )}

                              {bill.split_type !== 'unit' && (
                                <button onClick={() => handleExpandBill(bill.id)} className="text-gray-400 hover:text-blue-600 p-1 cursor-pointer">
                                  {expandedBill === bill.id ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                                </button>
                              )}
                              <button onClick={() => openEditBillModal(bill)} className="text-gray-400 hover:text-blue-600 p-1 cursor-pointer">
                                <FiEdit2 size={18} />
                              </button>
                              <button onClick={() => handleDeleteBill(bill.id)} className="text-gray-400 hover:text-red-600 p-1 cursor-pointer">
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </div>

                          {/* Splits Section */}
                          {expandedBill === bill.id && splits.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Split Details</p>
                              {splits.map(s => (
                                <div key={s.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-700 font-medium">{s.tenant_name}</span>
                                    {s.status === 'paid' && <Badge variant="green">Paid</Badge>}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-semibold text-gray-900">{formatCurrency(s.amount)}</span>
                                    
                                    {/* Toggle Split Paid Button */}
                                    {s.status === 'paid' ? (
                                      <button 
                                        onClick={() => handleToggleSplitStatus(bill.id, s.id, s.status)} 
                                        className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-200 bg-gray-100 border border-gray-200 px-2 py-1 rounded transition-colors cursor-pointer"
                                      >
                                        Undo
                                      </button>
                                    ) : (
                                      <button 
                                        onClick={() => handleToggleSplitStatus(bill.id, s.id, s.status)} 
                                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 transition-colors cursor-pointer bg-white border border-gray-200 px-2 py-1 rounded"
                                      >
                                        <FiCheckCircle size={14} /> Pay
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Bill</h2>
              <button onClick={() => setEditBillModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
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
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Custom Amounts</label>
                  {editCustomSplits.map((s, i) => (
                    <div key={s.tenant_id} className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 flex-1">{s.name}</span>
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
                  <p className="text-xs text-gray-400">
                    Total: {formatCurrency(editCustomSplits.reduce((s, c) => s + (Number(c.amount) || 0), 0))} / {formatCurrency(Number(editBillForm.amount) || 0)}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                <input type="text" value={editBillForm.note} onChange={(e) => setEditBillForm({ ...editBillForm, note: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setEditBillModal(false)} className="px-4 py-2 cursor-pointer text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={updatingBill} className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">{updatingBill ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}