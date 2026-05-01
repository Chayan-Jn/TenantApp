import { useState } from 'react'
import { useLoaderData, useNavigate, Link } from 'react-router'
import { createTenant, removeTenant } from '../../api/tenant.api.js'
import { createBill, updateBill, deleteBill, getBillSplits, updateBillStatus, updateSplitStatus } from '../../api/bills.api.js'
import Breadcrumb from '../../components/ui/Breadcrumb.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { FiTrash2, FiEdit2, FiChevronDown, FiChevronUp, FiCheckCircle, FiCamera } from 'react-icons/fi'
import Modal from '../../components/ui/Modal.jsx'
import Button from '../../components/ui/Button.jsx'
import ConfirmModal from '../../components/ui/ConfirmModal.jsx'
import PhotoManagerModal from '../../components/photos/PhotoManagerModal.jsx'

const BILL_TYPES = ['electricity', 'water', 'gas', 'maintenance', 'parking', 'other']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const TYPE_COLORS = { electricity: 'yellow', water: 'blue', gas: 'red', maintenance: 'gray', parking: 'gray', other: 'gray' }

const formatCurrency = (n) => n ? `₹${Number(n).toLocaleString('en-IN')}` : '₹0'
const now = new Date()
const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)

// --- REUSABLE BILL FORM COMPONENT ---
const BillForm = ({ form, setForm, customSplits, setCustomSplits, onSplitTypeChange, onSubmit, loading, submitLabel, tenants, onCancel }) => {
  const hasNoTenants = !tenants || tenants.length === 0;
  const isSplitDisabled = form.split_type !== 'unit' && hasNoTenants;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Bill Type</label>
        <select required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 cursor-pointer transition-colors" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          {BILL_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Amount (₹)</label>
        <input type="number" required min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 transition-colors" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Month</label>
          <select className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 cursor-pointer transition-colors" value={form.month} onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}>
            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Year</label>
          <select className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 cursor-pointer transition-colors" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Split Type</label>
        <select className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 cursor-pointer transition-colors" value={form.split_type} onChange={(e) => onSplitTypeChange(e.target.value)}>
          <option value="unit">Per Unit (no split)</option>
          <option value="equal">Equal Split</option>
          <option value="custom">Custom Split</option>
        </select>
        {isSplitDisabled && (
          <p className="mt-2 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-md border border-red-100 dark:border-red-800/50 transition-colors">
            No available tenants to split this bill with.
          </p>
        )}
      </div>

      {form.split_type === 'custom' && (
        <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <label className="text-sm font-medium text-gray-700">Custom Amounts</label>
          {hasNoTenants ? (
            <p className="text-sm text-gray-400 italic py-2 text-center">No tenants found for this unit.</p>
          ) : (
            <>
              {customSplits.map((s, i) => (
                <div key={s.tenant_id} className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 flex-1 font-medium">{s.name}</span>
                  <input type="number" min="0" placeholder="₹" value={s.amount}
                    onChange={(e) => {
                      const updated = [...customSplits]
                      updated[i] = { ...updated[i], amount: e.target.value }
                      setCustomSplits(updated)
                    }}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                  />
                </div>
              ))}
              <div className="mt-1 pt-2 border-t border-gray-200 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase">Total</span>
                <span className={`text-sm font-bold ${customSplits.reduce((s, c) => s + (Number(c.amount) || 0), 0) === Number(form.amount) ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(customSplits.reduce((s, c) => s + (Number(c.amount) || 0), 0))} / {formatCurrency(Number(form.amount) || 0)}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Note (optional)</label>
        <input type="text" maxLength="255" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. March meter reading" className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 transition-colors" />
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-slate-700 transition-colors">
        <button type="button" onClick={onCancel} className="px-4 py-2 cursor-pointer text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-all">Cancel</button>
        <button type="submit" disabled={loading || isSplitDisabled} className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

// --- MAIN UNIT DETAIL COMPONENT ---
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

  // Photo Modal State
  const [photoModalOpen, setPhotoModalOpen] = useState(false)

  // State for Split Data
  const [expandedBill, setExpandedBill] = useState(null)
  const [splits, setSplits] = useState([])

  // Loading States
  const [creating, setCreating] = useState(false)
  const [creatingBill, setCreatingBill] = useState(false)
  const [updatingBill, setUpdatingBill] = useState(false)
  const [deletingTenant, setDeletingTenant] = useState(false)

  // Form States
  const [form, setForm] = useState({ name: '', phone: '', join_date: '', security_deposit: '', notice_period_days: '', rent_due_day: '' })
  const [billForm, setBillForm] = useState({ type: 'electricity', amount: '', split_type: 'unit', month: now.getMonth() + 1, year: now.getFullYear(), note: '' })
  const [editBillForm, setEditBillForm] = useState({ type: 'electricity', amount: '', split_type: 'unit', month: now.getMonth() + 1, year: now.getFullYear(), note: '' })
  const [customSplits, setCustomSplits] = useState([])
  const [editCustomSplits, setEditCustomSplits] = useState([])

  const handleSplitTypeChange = (split_type) => {
    setBillForm({ ...billForm, split_type })
    if (split_type === 'custom') {
      setCustomSplits(tenants?.length > 0 ? tenants.map(t => ({ tenant_id: t.id, name: t.name, amount: '' })) : [])
    } else {
      setCustomSplits([])
    }
  }

  const handleEditSplitTypeChange = (split_type) => {
    setEditBillForm({ ...editBillForm, split_type })
    if (split_type === 'custom') {
      setEditCustomSplits(tenants?.length > 0 ? tenants.map(t => ({ tenant_id: t.id, name: t.name, amount: '' })) : [])
    } else {
      setEditCustomSplits([])
    }
  }

  const openEditBillModal = async (bill) => {
    setEditingBill(bill)
    setEditBillForm({ type: bill.type, amount: bill.amount, split_type: bill.split_type, month: bill.month, year: bill.year, note: bill.note || '' })
    if (bill.split_type === 'custom') {
      try {
        const res = await getBillSplits(bill.id)
        setEditCustomSplits(res.data.map(s => ({ tenant_id: s.tenant_id, name: s.tenant_name, amount: s.amount })))
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
      const res = await createTenant({ unit_id: parseInt(unit_id, 10), ...form, security_deposit: Number(form.security_deposit) || 0, notice_period_days: Number(form.notice_period_days) || 0, rent_due_day: form.rent_due_day ? Number(form.rent_due_day) : undefined })
      setTenants([...tenants, res.data]); setForm({ name: '', phone: '', join_date: '', security_deposit: '', notice_period_days: '', rent_due_day: '' }); setIsModalOpen(false)
    } catch (err) { setErrorMsg(err.message || 'Failed to add tenant') } finally { setCreating(false) }
  }

  // Remove tenant state
  const [removeModal, setRemoveModal] = useState({ open: false, tenantId: null, tenantName: '', depositAmount: 0 })
  const [refundForm, setRefundForm] = useState({ deposit_refunded: '', deposit_note: '' })

  const handleDeleteTenant = (tenant, e) => {
    e.preventDefault(); e.stopPropagation()
    setRemoveModal({ open: true, tenantId: tenant.id, tenantName: tenant.name, depositAmount: tenant.security_deposit || 0 })
    setRefundForm({ deposit_refunded: String(tenant.security_deposit || 0), deposit_note: '' })
  }

  const handleConfirmRemove = async () => {
    setDeletingTenant(true)
    try {
      await removeTenant(removeModal.tenantId, {
        deposit_refunded: Number(refundForm.deposit_refunded) || 0,
        deposit_note: refundForm.deposit_note
      })
      setTenants(tenants.filter(t => t.id !== removeModal.tenantId))
      setRemoveModal({ open: false, tenantId: null, tenantName: '', depositAmount: 0 })
    } catch (err) {
      setErrorMsg(err.message || 'Error')
    } finally {
      setDeletingTenant(false)
    }
  }

  const handleCreateBill = async (e) => {
    e.preventDefault()
    if (billForm.split_type !== 'unit' && tenants.length === 0) {
      setErrorMsg(`Cannot use ${billForm.split_type} split with zero tenants.`); return
    }
    setCreatingBill(true)
    try {
      const payload = { unit_id: parseInt(unit_id, 10), ...billForm, amount: Number(billForm.amount) }
      if (billForm.split_type === 'custom') payload.splits = customSplits.map(s => ({ tenant_id: s.tenant_id, amount: Number(s.amount) }))
      const res = await createBill(payload)
      setBills([res.data, ...bills])
      setBillModal(false)
      setBillForm({ type: 'electricity', amount: '', split_type: 'unit', month: now.getMonth() + 1, year: now.getFullYear(), note: '' })
      setCustomSplits([])
    } catch (err) { setErrorMsg(err.message || 'Failed to add bill') } finally { setCreatingBill(false) }
  }

  const handleUpdateBill = async (e) => {
    e.preventDefault(); setUpdatingBill(true)
    try {
      const payload = { ...editBillForm, amount: Number(editBillForm.amount) }
      if (editBillForm.split_type === 'custom') payload.splits = editCustomSplits.map(s => ({ tenant_id: s.tenant_id, amount: Number(s.amount) }))
      const res = await updateBill(editingBill.id, payload)
      setBills(bills.map(b => b.id === editingBill.id ? { ...b, ...res.data } : b))
      setEditBillModal(false)
    } catch (err) { setErrorMsg(err.message || 'Failed') } finally { setUpdatingBill(false) }
  }

  const handleDeleteBill = (id) => {
    setConfirmDialog({
      isOpen: true, title: 'Delete Bill', message: 'Delete this bill?', onConfirm: async () => {
        try { await deleteBill(id); setBills(bills.filter(b => b.id !== id)) } catch (err) { setErrorMsg(err.message) }
      }
    })
  }

  const handleExpandBill = async (billId) => {
    if (expandedBill === billId) { setExpandedBill(null); setSplits([]); return }
    try { const res = await getBillSplits(billId); setSplits(res.data); setExpandedBill(billId) } catch { setSplits([]) }
  }

  const handleToggleBillStatus = async (billId, currentStatus) => {
    const status = currentStatus === 'paid' ? 'pending' : 'paid'
    try { await updateBillStatus(billId, status); setBills(bills.map(b => b.id === billId ? { ...b, status } : b)) } catch (err) { setErrorMsg(err.message) }
  }

  const handleToggleSplitStatus = async (billId, splitId, currentStatus) => {
    const status = currentStatus === 'paid' ? 'pending' : 'paid'
    try {
      await updateSplitStatus(splitId, status)
      const updatedSplits = splits.map(s => s.id === splitId ? { ...s, status } : s)
      setSplits(updatedSplits)
      const allPaid = updatedSplits.every(s => s.status === 'paid')
      setBills(bills.map(b => b.id === billId ? { ...b, status: allPaid ? 'paid' : 'pending' } : b))
    } catch (err) { setErrorMsg(err.message) }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb crumbs={[{ label: 'Properties', to: '/properties' }, { label: property_name || 'Property', to: `/properties/${property_id}` }, { label: unit_name || 'Unit' }]} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{unit_name || 'Unit'}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Rent: {formatCurrency(unit?.rent)}/mo</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">+ Add Tenant</button>
      </div>

      {/* Unit Photos Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center transition-colors shrink-0">
            <FiCamera className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white transition-colors">Unit Condition Photos</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors mt-0.5">Document the unit's state at move-in/move-out</p>
          </div>
        </div>
        <button
          onClick={() => setPhotoModalOpen(true)}
          className="w-full sm:w-auto text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-4 py-2.5 rounded-lg transition-all cursor-pointer border border-emerald-100 dark:border-emerald-800/50 flex justify-center items-center"
        >
          Manage Photos
        </button>
      </div>

      {/* Tenant Cards */}
      {tenants.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm transition-colors">
          <p className="text-gray-500 dark:text-gray-400">No tenants yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <Link key={tenant.id} to={`/tenants/${tenant.id}`} className="group block bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all relative transition-colors">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate pr-16 transition-colors">{tenant.name}</h3>
              <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <Link to={`/tenants/${tenant.id}`} className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg cursor-pointer transition-colors" title="Edit Tenant">
                  <FiEdit2 size={16} />
                </Link>
                <button onClick={(e) => handleDeleteTenant(tenant, e)} className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg cursor-pointer transition-colors" title="Remove Tenant"><FiTrash2 size={18} /></button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors">{tenant.phone}</p>
              {tenant.security_deposit > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">Deposit: {formatCurrency(tenant.security_deposit)}</p>
              )}
              {tenant.notice_date && (
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider transition-colors">🔔 Notice Given</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Move-out: {new Date(tenant.expected_move_out).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                </div>
              )}
              <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mt-4 text-sm text-blue-600 dark:text-blue-400 font-medium transition-colors">View History &rarr;</div>
            </Link>
          ))}
        </div>
      )}

      {/* Bills Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Bills</h2>
        <button onClick={() => setBillModal(true)} className="bg-gray-100 dark:bg-slate-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-transparent dark:border-slate-700">
          + Add Bill
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {bills.length === 0 ? (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors">
            No bills added yet
          </p>
        ) : bills.map((bill) => (
          <div key={bill.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-5 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize transition-colors">{bill.type}</span>
                  <Badge variant={TYPE_COLORS[bill.type]}>{bill.type}</Badge>
                  {bill.split_type !== 'unit' && <Badge variant="blue">{bill.split_type} split</Badge>}
                  {bill.status === 'paid' && <Badge variant="green">Paid</Badge>}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{MONTHS[bill.month - 1]} {bill.year} {bill.note && `• ${bill.note}`}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 border-t md:border-0 border-gray-100 dark:border-slate-700 pt-3 md:pt-0">
                <span className="text-base font-bold text-gray-900 dark:text-white mr-0 md:mr-2 transition-colors">{formatCurrency(bill.amount)}</span>

                <div className="flex items-center gap-2">
                  {/* Mark Paid Button (Unit Bills Only) */}
                  {bill.split_type === 'unit' && (
                    <button onClick={() => handleToggleBillStatus(bill.id, bill.status)}
                      className={bill.status === 'paid'
                        ? "text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600 px-3 py-1.5 rounded-md transition-colors cursor-pointer bg-white dark:bg-slate-800"
                        : "text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md transition-colors cursor-pointer shadow-sm border-none"}>
                      {bill.status === 'paid' ? 'Undo' : 'Mark Paid'}
                    </button>
                  )}

                  {bill.split_type !== 'unit' && (
                    <button onClick={() => handleExpandBill(bill.id)} className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 bg-gray-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-md cursor-pointer transition-colors">
                      {expandedBill === bill.id ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                    </button>
                  )}
                  <button onClick={() => openEditBillModal(bill)} className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 bg-gray-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-md cursor-pointer transition-colors"><FiEdit2 size={16} /></button>
                  <button onClick={() => handleDeleteBill(bill.id)} className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-1.5 bg-gray-50 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-md cursor-pointer transition-colors"><FiTrash2 size={16} /></button>
                </div>
              </div>
            </div>

            {/* Auto-Expanding Split Details */}
            {expandedBill === bill.id && splits.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex flex-col gap-2 transition-colors">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide transition-colors">Split Details</p>
                {splits.map(s => (
                  <div key={s.id} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-gray-100 dark:border-slate-700 transition-colors">
                    <div className="flex items-center gap-2"><span className="text-gray-800 dark:text-gray-200 font-medium transition-colors">{s.tenant_name}</span>{s.status === 'paid' && <Badge variant="green">Paid</Badge>}</div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900 dark:text-white transition-colors">{formatCurrency(s.amount)}</span>
                      <button onClick={() => handleToggleSplitStatus(bill.id, s.id, s.status)}
                        className={s.status === 'paid'
                          ? "text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 px-3 py-1.5 rounded transition-colors cursor-pointer"
                          : "text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded transition-colors cursor-pointer shadow-sm border-none"}>
                        {s.status === 'paid' ? 'Undo' : 'Mark Paid'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5"><h2 className="text-xl font-bold text-gray-900">Add New Tenant</h2><button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer">&times;</button></div>
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" required minLength="2" title="Name must be at least 2 characters long" maxLength="50" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label><input type="tel" required maxLength="10" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label><input type="date" required value={form.join_date} onChange={(e) => setForm({ ...form, join_date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₹)</label><input type="number" min="0" placeholder="0" value={form.security_deposit} onChange={(e) => setForm({ ...form, security_deposit: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg border border-gray-100 dark:border-slate-700 space-y-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-slate-700 pb-2">Advanced Settings (Optional)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notice Period (Days)</label>
                    <input type="number" min="0" max="365" placeholder="e.g. 30" value={form.notice_period_days} onChange={(e) => setForm({ ...form, notice_period_days: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200" />
                    <p className="text-[11px] text-gray-500 mt-1 leading-snug">Days of warning required before moving out.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rent Due Date</label>
                    <input type="number" min="1" max="31" placeholder="e.g. 1 (for 1st)" value={form.rent_due_day} onChange={(e) => setForm({ ...form, rent_due_day: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200" />
                    <p className="text-[11px] text-gray-500 mt-1 leading-snug">Day of the month rent is due. <br/>If empty, defaults to the day they joined.</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 cursor-pointer text-gray-700 font-medium hover:bg-gray-100 rounded-lg">Cancel</button><button type="submit" disabled={creating} className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">{creating ? 'Adding...' : 'Add Tenant'}</button></div>
            </form>
          </div>
        </div>
      )}

      {billModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5"><h2 className="text-xl font-bold text-gray-900">Add Bill</h2><button onClick={() => setBillModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer">&times;</button></div>
            <BillForm form={billForm} setForm={setBillForm} customSplits={customSplits} setCustomSplits={setCustomSplits} onSplitTypeChange={handleSplitTypeChange} onSubmit={handleCreateBill} loading={creatingBill} submitLabel="Add Bill" tenants={tenants} onCancel={() => setBillModal(false)} />
          </div>
        </div>
      )}

      {editBillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5"><h2 className="text-xl font-bold text-gray-900">Edit Bill</h2><button onClick={() => setEditBillModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer">&times;</button></div>
            <BillForm form={editBillForm} setForm={setEditBillForm} customSplits={editCustomSplits} setCustomSplits={setEditCustomSplits} onSplitTypeChange={handleEditSplitTypeChange} onSubmit={handleUpdateBill} loading={updatingBill} submitLabel="Save Changes" tenants={tenants} onCancel={() => setEditBillModal(false)} />
          </div>
        </div>
      )}

      {/* Global Dialogs */}
      {errorMsg && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Notice</h2><p className="text-gray-600 mb-6">{errorMsg}</p>
            <div className="flex justify-end"><button onClick={() => setErrorMsg('')} className="px-4 py-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg">Close</button></div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={() => {
          confirmDialog.onConfirm()
          setConfirmDialog({ ...confirmDialog, isOpen: false })
        }}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Confirm"
        variant="danger"
      />

      {/* Remove Tenant Modal with Deposit Refund */}
      <Modal open={removeModal.open} onClose={() => setRemoveModal({ open: false, tenantId: null, tenantName: '', depositAmount: 0 })} title="Remove Tenant">
        <p className="text-sm text-gray-500 mb-4">Remove <strong>{removeModal.tenantName}</strong> from this unit?</p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-semibold text-gray-800 mb-3">Security Deposit: {formatCurrency(removeModal.depositAmount)}</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Refund Amount (₹)</label>
              <input type="number" min="0" value={refundForm.deposit_refunded} onChange={(e) => setRefundForm({ ...refundForm, deposit_refunded: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Deduction Note (optional)</label>
              <input type="text" maxLength="255" placeholder="e.g. Wall damage, cleaning charges" value={refundForm.deposit_note} onChange={(e) => setRefundForm({ ...refundForm, deposit_note: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            {removeModal.depositAmount > 0 && Number(refundForm.deposit_refunded) < removeModal.depositAmount && (
              <p className="text-xs text-amber-700 font-medium">
                Deducting {formatCurrency(removeModal.depositAmount - Number(refundForm.deposit_refunded || 0))} from deposit
              </p>
            )}
            {Number(refundForm.deposit_refunded) > removeModal.depositAmount && (
              <p className="text-xs text-red-600 font-medium">
                Refund cannot exceed the original deposit amount.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="ghost" onClick={() => setRemoveModal({ open: false, tenantId: null, tenantName: '', depositAmount: 0 })}>Cancel</Button>
          <Button variant="danger" disabled={Number(refundForm.deposit_refunded) > removeModal.depositAmount} loading={deletingTenant} onClick={handleConfirmRemove}>Remove Tenant</Button>
        </div>
      </Modal>

      <PhotoManagerModal
        open={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        unitId={unit_id}
        unitName={unit_name}
      />
    </div>
  )
}