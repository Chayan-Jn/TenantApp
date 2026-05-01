import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router'
import { createRent, markRentPaid, markRentUnpaid, getRentByTenant, updateRent, deleteRent } from '../../api/rent.api.js'
import { removeTenant, updateTenant, giveNotice } from '../../api/tenant.api.js'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Breadcrumb from '../../components/ui/Breadcrumb.jsx'
import AlertModal from '../../components/ui/AlertModal.jsx'
import ConfirmModal from '../../components/ui/ConfirmModal.jsx'

const statusVariant = { paid: 'green', pending: 'yellow', overdue: 'crimson' }

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const getLocalISODate = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().split('T')[0]
}

const getStatus = (rent) => {
  if (rent.status === 'paid') return 'paid'

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignore current time

  const dueDate = new Date(rent.due_date);
  dueDate.setHours(0, 0, 0, 0); // Ignore time just to be safe

  if (dueDate < today) return 'overdue'
  return 'pending'
}

export default function TenantDetail() {
  const { tenant: initialTenant, rents: initialRents, tenant_id } = useLoaderData()
  const navigate = useNavigate()

  const [tenant, setTenant] = useState(initialTenant)
  const [rents, setRents] = useState(initialRents || [])
  const [rentModal, setRentModal] = useState(false)
  const [removeModal, setRemoveModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [noticeModal, setNoticeModal] = useState({ open: false, date: '' })
  const [editMoveOutModal, setEditMoveOutModal] = useState({ open: false, date: '' })
  const [refundForm, setRefundForm] = useState({ deposit_refunded: String(initialTenant.security_deposit || 0), deposit_note: '', leave_date: getLocalISODate() })
  const [loading, setLoading] = useState(false)
  const [noticeLoading, setNoticeLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [error, setError] = useState('')
  const [editError, setEditError] = useState('')
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '' })
  const [form, setForm] = useState({ amount: '', due_date: '' })
  const [editForm, setEditForm] = useState({ 
    name: '', 
    phone: '', 
    rent_due_day: '', 
    notice_period_days: '' 
  })
  const [editRentModal, setEditRentModal] = useState(false)
  const [editRentForm, setEditRentForm] = useState({ id: null, amount: '', due_date: '' })
  const [deleteRentId, setDeleteRentId] = useState(null)
  const [deleteRentLoading, setDeleteRentLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value })

  const handleAddRent = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await createRent({
        tenant_id: Number(tenant_id),
        amount: Number(form.amount),
        due_date: form.due_date
      })
      const updated = await getRentByTenant(tenant_id)
      setRents(updated.data)
      setRentModal(false)
      setForm({ amount: '', due_date: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPaid = async (id) => {
    try {
      await markRentPaid(id)
      setRents(rents.map(r => r.id === id ? { ...r, status: 'paid', paid_date: new Date().toISOString() } : r))
    } catch (err) {
      setAlertInfo({ open: true, message: err.response?.data?.message || err.message })
    }
  }

  const handleMarkUnpaid = async (id) => {
    try {
      await markRentUnpaid(id)
      setRents(rents.map(r => r.id === id ? { ...r, status: 'pending', paid_date: null } : r))
    } catch (err) {
      setAlertInfo({ open: true, message: err.response?.data?.message || err.message })
    }
  }

  const handleRemoveTenant = async () => {
    setLoading(true)
    try {
      await removeTenant(tenant_id, {
        deposit_refunded: Number(refundForm.deposit_refunded) || 0,
        deposit_note: refundForm.deposit_note,
        leave_date: refundForm.leave_date || undefined
      })
      navigate(`/units/${tenant.unit_id}`)
    } catch (err) {
      setAlertInfo({ open: true, message: err.response?.data?.message || err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleGiveNotice = async (e) => {
    if (e) e.preventDefault()
    setNoticeLoading(true)
    try {
      const payload = noticeModal.date ? { expected_move_out: noticeModal.date } : {}
      const res = await giveNotice(tenant_id, payload)
      setTenant({ ...tenant, ...res.data })
      setNoticeModal({ open: false, date: '' })
    } catch (err) {
      setAlertInfo({ open: true, message: err.response?.data?.message || err.message })
    } finally {
      setNoticeLoading(false)
    }
  }

  const openNoticeModal = () => {
    // Pre-calculate the default date (Today + notice_period_days)
    const defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate() + (tenant.notice_period_days || 0))
    defaultDate.setMinutes(defaultDate.getMinutes() - defaultDate.getTimezoneOffset())
    setNoticeModal({ open: true, date: defaultDate.toISOString().split('T')[0] })
  }

  const openEditModal = () => {
    setEditForm({
      name: tenant.name,
      phone: tenant.phone,
      rent_due_day: tenant.rent_due_day ? String(tenant.rent_due_day) : '',
      notice_period_days: tenant.notice_period_days !== null ? String(tenant.notice_period_days) : '0'
    })
    setEditModal(true)
  }

  const getDuration = () => {
    const start = new Date(tenant.join_date)
    const end = refundForm.leave_date ? new Date(refundForm.leave_date) : new Date()
    const diffMs = end - start
    if (diffMs < 0) return null
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const months = Math.floor(totalDays / 30)
    const days = totalDays % 30
    return { months, days, totalDays }
  }

  const getNoticeCompliance = () => {
    if (!tenant.notice_period_days || tenant.notice_period_days === 0) return null
    if (!tenant.notice_date) return { ok: false, label: 'No notice given' }
    const moveOut = refundForm.leave_date ? new Date(refundForm.leave_date) : new Date()
    const expected = new Date(tenant.expected_move_out)
    return moveOut >= expected
      ? { ok: true, label: 'Notice period served ✓' }
      : { ok: false, label: 'Early departure — notice not fully served' }
  }

  const handleUpdateTenant = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    setEditError('')
    try {
      const payload = {
        name: editForm.name,
        phone: editForm.phone,
        rent_due_day: editForm.rent_due_day ? Number(editForm.rent_due_day) : null,
        notice_period_days: editForm.notice_period_days !== '' ? Number(editForm.notice_period_days) : 0
      }
      const res = await updateTenant(tenant_id, payload)
      setTenant({ ...tenant, ...res.data })
      setEditModal(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setEditLoading(false)
    }
  }

  const handleUpdateMoveOutDate = async (e) => {
    if (e) e.preventDefault()
    setNoticeLoading(true)
    try {
      const res = await updateTenant(tenant_id, { expected_move_out: editMoveOutModal.date })
      setTenant({ ...tenant, ...res.data })
      setEditMoveOutModal({ open: false, date: '' })
    } catch (err) {
      setAlertInfo({ open: true, message: err.response?.data?.message || err.message })
    } finally {
      setNoticeLoading(false)
    }
  }

  const handleOpenEditRent = (rent) => {
    setEditRentForm({
      id: rent.id,
      amount: rent.amount,
      due_date: new Date(rent.due_date).toISOString().split('T')[0]
    })
    setEditRentModal(true)
  }

  const handleEditRentSubmit = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    setError('')
    try {
      await updateRent(editRentForm.id, {
        amount: Number(editRentForm.amount),
        due_date: editRentForm.due_date
      })
      const updated = await getRentByTenant(tenant_id)
      setRents(updated.data)
      setEditRentModal(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setEditLoading(false)
    }
  }

  const handleConfirmDeleteRent = async () => {
    if (!deleteRentId) return
    setDeleteRentLoading(true)
    try {
      await deleteRent(deleteRentId)
      setRents(rents.filter(r => r.id !== deleteRentId))
      setDeleteRentId(null)
    } catch (err) {
      setAlertInfo({ open: true, message: err.message })
    } finally {
      setDeleteRentLoading(false)
    }
  }

  const isActive = !tenant.leave_date

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">

      <Breadcrumb crumbs={[
        { label: 'Properties', to: '/properties' },
        { label: tenant.property_name, to: `/properties/${tenant.property_id}` },
        { label: tenant.label, to: `/units/${tenant.unit_id}` },
        { label: tenant.name }
      ]} />

      {/* Tenant Info */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{tenant.name}</h1>
              <Badge variant={isActive ? 'green' : 'red'}>
                {isActive ? 'active' : 'moved out'}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">{tenant.phone}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{tenant.property_name} - {tenant.label}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600 dark:text-gray-300 transition-colors">
              <span>Joined: {formatDate(tenant.join_date)}</span>
              {isActive
                ? <span>Rent: {formatCurrency(tenant.rent)}/mo</span>
                : <span className="text-rose-500 dark:text-rose-400 font-medium">Left: {formatDate(tenant.leave_date)}</span>
              }
              <span>Deposit: {formatCurrency(tenant.security_deposit || 0)}</span>
              {tenant.notice_period_days > 0 && <span>Notice: {tenant.notice_period_days} days</span>}
              {tenant.rent_due_day && <span>Due day: {tenant.rent_due_day}{tenant.rent_due_day === 1 ? 'st' : tenant.rent_due_day === 2 ? 'nd' : tenant.rent_due_day === 3 ? 'rd' : 'th'}</span>}
            </div>
            {/* Notice Given Banner */}
            {isActive && tenant.notice_date && (
              <div className="mt-3 flex flex-wrap items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg px-3 py-2 transition-colors">
                <span className="text-amber-700 dark:text-amber-300 text-sm font-medium">🔔 Notice given {formatDate(tenant.notice_date)}</span>
                <div className="flex items-center gap-1">
                  <span className="text-amber-600 dark:text-amber-400 text-xs">· Expected move-out: {formatDate(tenant.expected_move_out)}</span>
                  <button onClick={() => setEditMoveOutModal({ open: true, date: new Date(tenant.expected_move_out).toISOString().split('T')[0] })} className="text-amber-600 hover:text-amber-800 dark:text-amber-500 dark:hover:text-amber-300 p-1 rounded transition-colors cursor-pointer" title="Edit move-out date">
                    <FiEdit2 size={16} />
                  </button>
                </div>
                {(() => {
                  const today = new Date(); today.setHours(0,0,0,0)
                  const exp = new Date(tenant.expected_move_out); exp.setHours(0,0,0,0)
                  const diff = Math.ceil((exp - today) / (1000*60*60*24))
                  if (diff > 0) return <span className="text-xs bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">{diff}d left</span>
                  if (diff === 0) return <span className="text-xs bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full font-bold">Today</span>
                  return <span className="text-xs bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full font-bold">{Math.abs(diff)}d overdue</span>
                })()}
              </div>
            )}
            {/* Give Notice Button */}
            {isActive && !tenant.notice_date && tenant.notice_period_days > 0 && (
              <button
                onClick={openNoticeModal}
                disabled={noticeLoading}
                className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/50 px-3 py-1.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
              >
                🔔 Give Notice
              </button>
            )}
            {!isActive && tenant.deposit_refunded > 0 && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 transition-colors">
                Deposit refunded: {formatCurrency(tenant.deposit_refunded)}
                {tenant.deposit_note && <> / {tenant.deposit_note}</>}
              </div>
            )}
          </div>
          {isActive && (
            <div className="flex items-center gap-2">
              <button
                onClick={openEditModal}
                className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-1 cursor-pointer transition-colors"
              >
                <FiEdit2 size={20} />
              </button>
              <button
                onClick={() => setRemoveModal(true)}
                className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-1 cursor-pointer transition-colors"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Rent Records */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Rent History</h2>
        {isActive && (
          <Button size="sm" onClick={() => setRentModal(true)}>+ Add Rent</Button>
        )}
      </div>

      {rents.length === 0 ? (
        <Card className="border-gray-200 dark:border-slate-700 transition-colors">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">No rent records yet</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {rents.map((rent) => {
            const status = getStatus(rent)
            return (
              <Card key={rent.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 py-4 border-gray-200 dark:border-slate-700 transition-colors">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white flex flex-wrap items-center gap-2 transition-colors">
                    {formatCurrency(rent.amount)}
                    {rent.title === 'Initial Payment' && (
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded uppercase font-bold tracking-wider mt-px transition-colors">
                        Initial Payment
                      </span>
                    )}
                    {rent.title === 'Security Deposit' && (
                      <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded uppercase font-bold tracking-wider mt-px transition-colors">
                        Security Deposit
                      </span>
                    )}
                    {rent.title && rent.title !== 'Initial Payment' && rent.title !== 'Security Deposit' && rent.title !== 'Monthly Rent' && rent.title !== 'Rent' && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-normal transition-colors">({rent.title})</span>
                    )}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                    Due: {formatDate(rent.due_date)}
                    {rent.paid_date && ` · Paid: ${formatDate(rent.paid_date)}`}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">
                  <Badge variant={statusVariant[status]}>{status}</Badge>
                  {status !== 'paid' ? (
                    <Button size="sm" onClick={() => handleMarkPaid(rent.id)}>
                      Mark Paid
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => handleMarkUnpaid(rent.id)}>
                      Undo
                    </Button>
                  )}
                  {status !== 'paid' && (
                    <>
                      <button
                        onClick={() => handleOpenEditRent(rent)}
                        className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-1 cursor-pointer transition-colors"
                        title="Edit Rent"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteRentId(rent.id)}
                        className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-1 cursor-pointer transition-colors"
                        title="Delete Rent"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add Rent Modal */}
      <Modal open={rentModal} onClose={() => setRentModal(false)} title="Add Rent Record">
        <form onSubmit={handleAddRent} className="flex flex-col gap-4">
          <Input label="Amount (₹)" name="amount" type="number" value={form.amount} onChange={handleChange} required />
          <Input label="Due Date" name="due_date" type="date" value={form.due_date} onChange={handleChange} required />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" type="button" onClick={() => setRentModal(false)}>Cancel</Button>
            <Button type="submit" loading={loading}>Add</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Tenant Modal */}
      <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Tenant">
        <form onSubmit={handleUpdateTenant} className="flex flex-col gap-4">
          <Input label="Name" name="name" type="text" value={editForm.name} onChange={handleEditChange} required />
          <Input label="Phone" name="phone" type="tel" value={editForm.phone} onChange={handleEditChange} required />
          <Input label="Rent Due Day" name="rent_due_day" type="number" min="1" max="31" value={editForm.rent_due_day} onChange={handleEditChange} />
          <Input label="Notice Period (Days)" name="notice_period_days" type="number" min="0" value={editForm.notice_period_days} onChange={handleEditChange} />
          {editError && <p className="text-sm text-red-500">{editError}</p>}
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" type="button" onClick={() => setEditModal(false)}>Cancel</Button>
            <Button type="submit" loading={editLoading}>Save</Button>
          </div>
        </form>
      </Modal>

      {/* Remove Tenant Modal */}
      <Modal open={removeModal} onClose={() => setRemoveModal(false)} title="Remove Tenant">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 transition-colors">
          Remove <strong>{tenant.name}</strong>? This will mark them as moved out.
        </p>

        {/* Move-out Date */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1 transition-colors">Move-Out Date</label>
          <input type="date" value={refundForm.leave_date} onChange={(e) => setRefundForm({ ...refundForm, leave_date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 transition-colors" />
        </div>

        {/* Move-out Summary */}
        {(() => {
          const dur = getDuration()
          const compliance = getNoticeCompliance()
          if (!dur) return null
          return (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-3 mb-4 space-y-1 transition-colors">
              <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 transition-colors">Move-out Summary</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 transition-colors">Duration: {dur.months > 0 ? `${dur.months} month${dur.months !== 1 ? 's' : ''}` : ''}{dur.months > 0 && dur.days > 0 ? ' ' : ''}{dur.days > 0 ? `${dur.days} day${dur.days !== 1 ? 's' : ''}` : dur.months === 0 ? '0 days' : ''}</p>
              {compliance && (
                <p className={`text-xs font-medium ${compliance.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'} transition-colors`}>
                  {compliance.label}
                </p>
              )}
            </div>
          )
        })()}

        <div className="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-700 rounded-lg p-4 mb-4 space-y-3 transition-colors">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 transition-colors">Security Deposit: {formatCurrency(tenant.security_deposit || 0)}</p>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1 transition-colors">Refund Amount (₹)</label>
            <input type="number" min="0" value={refundForm.deposit_refunded} onChange={(e) => setRefundForm({ ...refundForm, deposit_refunded: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1 transition-colors">Deduction Note (optional)</label>
            <input type="text" placeholder="e.g. Wall damage, cleaning" value={refundForm.deposit_note} onChange={(e) => setRefundForm({ ...refundForm, deposit_note: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 transition-colors" />
          </div>
          {(tenant.security_deposit || 0) > 0 && Number(refundForm.deposit_refunded) < (tenant.security_deposit || 0) && (
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium transition-colors">
              Deducting {formatCurrency((tenant.security_deposit || 0) - Number(refundForm.deposit_refunded || 0))}
            </p>
          )}
          {Number(refundForm.deposit_refunded) > (tenant.security_deposit || 0) && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium transition-colors">
              Refund cannot exceed the original deposit amount.
            </p>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setRemoveModal(false)}>Cancel</Button>
          <Button variant="danger" loading={loading} disabled={Number(refundForm.deposit_refunded) > (tenant.security_deposit || 0)} onClick={handleRemoveTenant}>Remove</Button>
        </div>
      </Modal>

      {/* Give Notice Modal */}
      <Modal open={noticeModal.open} onClose={() => setNoticeModal({ open: false, date: '' })} title="Give Notice">
        <form onSubmit={handleGiveNotice}>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 transition-colors">
            Record that <strong>{tenant.name}</strong> has given notice to vacate.
          </p>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 mb-5 space-y-2 transition-colors">
            <p className="text-xs text-amber-800 dark:text-amber-200 font-medium transition-colors">
              Standard Notice Period: {tenant.notice_period_days} days
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1 transition-colors">Expected Move-Out Date</label>
              <input 
                type="date" 
                required
                value={noticeModal.date} 
                onChange={(e) => setNoticeModal({ ...noticeModal, date: e.target.value })} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 transition-colors" 
              />
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 leading-snug transition-colors">
              You can modify this date if you are allowing an early move-out or extending their stay.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setNoticeModal({ open: false, date: '' })}>Cancel</Button>
            <Button type="submit" variant="primary" loading={noticeLoading}>Confirm Notice</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Move-Out Date Modal */}
      <Modal open={editMoveOutModal.open} onClose={() => setEditMoveOutModal({ open: false, date: '' })} title="Edit Move-Out Date">
        <form onSubmit={handleUpdateMoveOutDate}>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 transition-colors">
            Update the expected move-out date for <strong>{tenant.name}</strong>.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4 mb-5 space-y-2 transition-colors">
            <div>
              <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1 transition-colors">New Expected Move-Out Date</label>
              <input 
                type="date" 
                required
                value={editMoveOutModal.date} 
                onChange={(e) => setEditMoveOutModal({ ...editMoveOutModal, date: e.target.value })} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 transition-colors" 
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setEditMoveOutModal({ open: false, date: '' })}>Cancel</Button>
            <Button type="submit" variant="primary" loading={noticeLoading}>Save Change</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Rent Modal */}
      <Modal open={editRentModal} onClose={() => setEditRentModal(false)} title="Edit Rent Record">
        <form onSubmit={handleEditRentSubmit} className="flex flex-col gap-4">
          <Input label="Amount (₹)" name="amount" type="number" value={editRentForm.amount} onChange={(e) => setEditRentForm({ ...editRentForm, amount: e.target.value })} required />
          <Input label="Due Date" name="due_date" type="date" value={editRentForm.due_date} onChange={(e) => setEditRentForm({ ...editRentForm, due_date: e.target.value })} required />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" type="button" onClick={() => setEditRentModal(false)}>Cancel</Button>
            <Button type="submit" loading={editLoading}>Save</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Rent Confirm Modal */}
      <ConfirmModal
        open={!!deleteRentId}
        onClose={() => setDeleteRentId(null)}
        onConfirm={handleConfirmDeleteRent}
        title="Delete Rent Record?"
        message="Are you sure you want to delete this rent entry? This action is permanent."
        loading={deleteRentLoading}
      />

      <AlertModal open={alertInfo.open} onClose={() => setAlertInfo({ open: false, message: '' })} message={alertInfo.message} />
    </div>
  )
}