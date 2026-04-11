// Overwrite your existing UnitDetail.jsx with this:
import { useState } from 'react'
import { useLoaderData, useNavigate, Link } from 'react-router'
import { createTenant, removeTenant } from '../../api/tenant.api.js'
import { createBill, updateBill, deleteBill, getBillSplits, updateBillStatus, updateSplitStatus } from '../../api/bills.api.js'
import Breadcrumb from '../../components/ui/Breadcrumb.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { FiTrash2, FiEdit2, FiChevronDown, FiChevronUp, FiCheckCircle } from 'react-icons/fi'

const BILL_TYPES = ['electricity', 'water', 'gas', 'maintenance', 'parking', 'other']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const TYPE_COLORS = { electricity: 'yellow', water: 'blue', gas: 'red', maintenance: 'gray', parking: 'gray', other: 'gray' }

const formatCurrency = (n) => n ? `₹${Number(n).toLocaleString('en-IN')}` : '₹0'

const now = new Date()
const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)

const BillForm = ({ form, setForm, customSplits, setCustomSplits, onSplitTypeChange, onSubmit, loading, submitLabel, tenants, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Bill Type</label>
      <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
        {BILL_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
      <input type="number" required min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer" value={form.month} onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Split Type</label>
      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer" value={form.split_type} onChange={(e) => onSplitTypeChange(e.target.value)}>
        <option value="unit">Per Unit (no split)</option>
        <option value="equal">Equal Split</option>
        <option value="custom">Custom Split</option>
      </select>
    </div>
    {form.split_type === 'custom' && customSplits.length > 0 && (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Custom Amounts</label>
        {customSplits.map((s, i) => (
          <div key={s.tenant_id} className="flex items-center gap-2">
            <span className="text-sm text-gray-700 flex-1">{s.name}</span>
            <input type="number" min="0" placeholder="₹" value={s.amount}
              onChange={(e) => {
                const updated = [...customSplits]
                updated[i] = { ...updated[i], amount: e.target.value }
                setCustomSplits(updated)
              }}
              className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
        ))}
        <p className="text-xs text-gray-400">
          Total: {formatCurrency(customSplits.reduce((s, c) => s + (Number(c.amount) || 0), 0))} / {formatCurrency(Number(form.amount) || 0)}
        </p>
      </div>
    )}
    {form.split_type === 'equal' && tenants.length === 0 && (
      <p className="text-xs text-red-500">No active tenants for equal split</p>
    )}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
      <input type="text" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. March meter reading" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
    </div>
    <div className="flex justify-end gap-3 mt-6">
      <button type="button" onClick={onCancel} className="px-4 py-2 cursor-pointer text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
      <button type="submit" disabled={loading} className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">{loading ? 'Saving...' : submitLabel}</button>
    </div>
  </form>
)

export default function UnitDetail() {
  const { tenants: initialTenants, unit_id, property_id, unit_name, property_name, unit, bills: initialBills } = useLoaderData()

  const [tenants, setTenants] = useState(initialTenants || [])
  const [bills, setBills] = useState(initialBills || [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [billModal, setBillModal] = useState(false)
  const [editBillModal, setEditBillModal] = useState(false)
  const [editingBill, setEditingBill] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null })
  const [expandedBill, setExpandedBill] = useState(null)
  const [splits, setSplits] = useState([])
  const [creating, setCreating] = useState(false)
  const [creatingBill, setCreatingBill] = useState(false)
  const [updatingBill, setUpdatingBill] = useState(false)

  const [form, setForm] = useState({ name: '', phone: '', join_date: '' })
  const [billForm, setBillForm] = useState({
    type: 'electricity', amount: '', split_type: 'unit',
    month: now.getMonth() + 1, year: now.getFullYear(), note: ''
  })
  const [editBillForm, setEditBillForm] = useState({
    type: 'electricity', amount: '', split_type: 'unit',
    month: now.getMonth() + 1, year: now.getFullYear(), note: ''
  })
  const [customSplits, setCustomSplits] = useState([])
  const [editCustomSplits, setEditCustomSplits] = useState([])

  const handleSplitTypeChange = (split_type) => {
    setBillForm({ ...billForm, split_type })
    if (split_type === 'custom') {
      setCustomSplits(tenants.map(t => ({ tenant_id: t.id, name: t.name, amount: '' })))
    } else {
      setCustomSplits([])
    }
  }

  const handleEditSplitTypeChange = (split_type) => {
    setEditBillForm({ ...editBillForm, split_type })
    if (split_type === 'custom') {
      setEditCustomSplits(tenants.map(t => ({ tenant_id: t.id, name: t.name, amount: '' })))
    } else {
      setEditCustomSplits([])
    }
  }

  const openEditBillModal = async (bill) => {
    setEditingBill(bill)
    setEditBillForm({
      type: bill.type,
      amount: bill.amount,
      split_type: bill.split_type,
      month: bill.month,
      year: bill.year,
      note: bill.note || ''
    })
    if (bill.split_type === 'custom') {
      try {
        const res = await getBillSplits(bill.id)
        setEditCustomSplits(res.data.map(s => ({
          tenant_id: s.tenant_id,
          name: s.tenant_name,
          amount: s.amount
        })))
      } catch {
        setEditCustomSplits(tenants.map(t => ({ tenant_id: t.id, name: t.name, amount: '' })))
      }
    } else {
      setEditCustomSplits([])
    }
    setEditBillModal(true)
  }

  const handleCreateTenant = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const payload = {
        unit_id: parseInt(unit_id, 10),
        name: form.name, phone: form.phone, join_date: form.join_date
      }
      const res = await createTenant(payload)
      setTenants([...tenants, res.data])
      setForm({ name: '', phone: '', join_date: '' })
      setIsModalOpen(false)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add tenant')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteTenant = (tenantId, e) => {
    e.preventDefault()
    e.stopPropagation() 
    setConfirmDialog({
      isOpen: true, title: 'Remove Tenant',
      message: 'Are you sure you want to remove this tenant?',
      onConfirm: async () => {
        try {
          await removeTenant(tenantId)
          setTenants(tenants.filter(t => t.id !== tenantId))
        } catch (err) {
          setErrorMsg(err.message || 'Failed to remove tenant')
        }
      }
    })
  }

  const handleCreateBill = async (e) => {
    e.preventDefault()
    setCreatingBill(true)
    try {
      const payload = {
        unit_id: parseInt(unit_id, 10),
        type: billForm.type, amount: Number(billForm.amount),
        split_type: billForm.split_type, month: Number(billForm.month),
        year: Number(billForm.year), note: billForm.note || undefined
      }
      if (billForm.split_type === 'custom') {
        payload.splits = customSplits.map(s => ({ tenant_id: s.tenant_id, amount: Number(s.amount) }))
      }
      const res = await createBill(payload)
      setBills([...bills, res.data])
      setBillModal(false)
      setBillForm({ type: 'electricity', amount: '', split_type: 'unit', month: now.getMonth() + 1, year: now.getFullYear(), note: '' })
      setCustomSplits([])
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add bill')
    } finally {
      setCreatingBill(false)
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
      setErrorMsg(err.message || 'Failed to update bill')
    } finally {
      setUpdatingBill(false)
    }
  }

  const handleDeleteBill = (id) => {
    setConfirmDialog({
      isOpen: true, title: 'Delete Bill',
      message: 'Are you sure you want to delete this bill?',
      onConfirm: async () => {
        try {
          await deleteBill(id)
          setBills(bills.filter(b => b.id !== id))
        } catch (err) {
          setErrorMsg(err.message || 'Failed to delete bill')
        }
      }
    })
  }

  const handleExpandBill = async (billId) => {
    if (expandedBill === billId) { setExpandedBill(null); setSplits([]); return }
    try {
      const res = await getBillSplits(billId)
      setSplits(res.data)
      setExpandedBill(billId)
    } catch { setSplits([]) }
  }

  // ---- NEW: Toggling Paid Status logic ----

  const handleToggleBillStatus = async (billId, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    try {
      await updateBillStatus(billId, newStatus);
      setBills(bills.map(b => b.id === billId ? { ...b, status: newStatus } : b));
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update bill status');
    }
  }

  const handleToggleSplitStatus = async (billId, splitId, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    try {
      await updateSplitStatus(splitId, newStatus);
      const updatedSplits = splits.map(s => s.id === splitId ? { ...s, status: newStatus } : s);
      setSplits(updatedSplits);
      
      // Auto-update the main bill status based on the splits
      const allPaid = updatedSplits.every(s => s.status === 'paid');
      setBills(bills.map(b => b.id === billId ? { ...b, status: allPaid ? 'paid' : 'pending' } : b));

    } catch (err) {
      setErrorMsg(err.message || 'Failed to update split status');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb crumbs={[
            { label: 'Properties', to: '/properties' },
            { label: property_name || 'Property', to: `/properties/${property_id}` },
            { label: unit_name || 'Unit' }
          ]} />
          <h1 className="text-2xl font-bold text-gray-900">{unit_name || 'Unit'}</h1>
          <p className="text-gray-500 mt-1">Rent: {formatCurrency(unit?.rent)}/mo</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Add Tenant
        </button>
      </div>

      {tenants.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">No tenants yet</h3>
          <p className="text-gray-500 mt-1">This unit is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <Link key={tenant.id} to={`/tenants/${tenant.id}`} className="group block bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-blue-500 hover:shadow-md transition-all relative">
              <div className="flex justify-between items-start mb-2 pr-10">
                <h3 className="text-lg font-bold text-gray-900 truncate">{tenant.name}</h3>
              </div>
              <button onClick={(e) => handleDeleteTenant(tenant.id, e)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all absolute top-4 right-4 cursor-pointer">
                <FiTrash2 size={18} />
              </button>
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p>{tenant.phone}</p>
                {tenant.join_date && <p>Joined: {new Date(tenant.join_date).toLocaleDateString()}</p>}
              </div>
              <div className="pt-4 border-t border-gray-100 text-sm text-blue-600 font-medium">View Rent History &rarr;</div>
            </Link>
          ))}
        </div>
      )}

      {/* Bills Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Bills</h2>
        <button onClick={() => setBillModal(true)} className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm">
          + Add Bill
        </button>
      </div>

      {bills.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm">No bills added for this unit yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {bills.map((bill) => (
            <div key={bill.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 capitalize">{bill.type}</span>
                    <Badge variant={TYPE_COLORS[bill.type]}>{bill.type}</Badge>
                    {bill.split_type !== 'unit' && <Badge variant="blue">{bill.split_type} split</Badge>}
                    
                    {/* Badge showing if the main bill is paid */}
                    {bill.status === 'paid' && <Badge variant="green">Paid</Badge>}
                  </div>
                  <span className="text-xs text-gray-500">{MONTHS[bill.month - 1]} {bill.year}</span>
                  {bill.note && <span className="text-xs text-gray-400">{bill.note}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 mr-2">{formatCurrency(bill.amount)}</span>
                  
                  {/* Mark/Undo Paid Button for Unit Bills */}
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

              {/* Split Details (Expanded) */}
              {expandedBill === bill.id && splits.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
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
                            title="Undo Tenant Payment"
                            className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-200 bg-gray-100 border border-gray-200 px-2 py-1 rounded transition-colors cursor-pointer"
                          >
                            Undo
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleToggleSplitStatus(bill.id, s.id, s.status)} 
                            title="Mark Tenant as Paid"
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
      )}

      {/* Add Tenant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Tenant</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer">&times;</button>
            </div>
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" required minLength="2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. John Doe" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" required pattern="[0-9]{10}" maxLength="10" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} placeholder="e.g. 9876543210" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <input type="date" required value={form.join_date} onChange={(e) => setForm({ ...form, join_date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 cursor-pointer text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={creating} className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">{creating ? 'Adding...' : 'Add Tenant'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Bill Modal */}
      {billModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Bill</h2>
              <button onClick={() => setBillModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer">&times;</button>
            </div>
            <BillForm 
              form={billForm} 
              setForm={setBillForm} 
              customSplits={customSplits} 
              setCustomSplits={setCustomSplits} 
              onSplitTypeChange={handleSplitTypeChange} 
              onSubmit={handleCreateBill} 
              loading={creatingBill} 
              submitLabel="Add Bill" 
              tenants={tenants} 
              onCancel={() => setBillModal(false)} 
            />
          </div>
        </div>
      )}

      {/* Edit Bill Modal */}
      {editBillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Bill</h2>
              <button onClick={() => setEditBillModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer">&times;</button>
            </div>
            <BillForm 
              form={editBillForm} 
              setForm={setEditBillForm} 
              customSplits={editCustomSplits} 
              setCustomSplits={setEditCustomSplits} 
              onSplitTypeChange={handleEditSplitTypeChange} 
              onSubmit={handleUpdateBill} 
              loading={updatingBill} 
              submitLabel="Save Changes" 
              tenants={tenants} 
              onCancel={() => setEditBillModal(false)} 
            />
          </div>
        </div>
      )}

      {/* Notice/Error Dialog */}
      {errorMsg && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Notice</h2>
            <p className="text-gray-600 mb-6">{errorMsg}</p>
            <div className="flex justify-end">
              <button onClick={() => setErrorMsg('')} className="px-4 py-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{confirmDialog.title}</h2>
            <p className="text-gray-600 mb-6">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} className="px-4 py-2 cursor-pointer text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => { confirmDialog.onConfirm(); setConfirmDialog({ ...confirmDialog, isOpen: false }) }} className="px-4 py-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}