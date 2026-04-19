import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router'
import { createRent, markRentPaid, markRentUnpaid, getRentByTenant, updateRent, deleteRent } from '../../api/rent.api.js'
import { removeTenant, updateTenant } from '../../api/tenant.api.js'
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
  const [refundForm, setRefundForm] = useState({ deposit_refunded: String(initialTenant.security_deposit || 0), deposit_note: '' })
  const [loading, setLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [error, setError] = useState('')
  const [editError, setEditError] = useState('')
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '' })
  const [form, setForm] = useState({ amount: '', due_date: '' })
  const [editForm, setEditForm] = useState({ name: tenant.name, phone: tenant.phone })
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
        deposit_note: refundForm.deposit_note
      })
      navigate(`/units/${tenant.unit_id}`)
    } catch (err) {
      setAlertInfo({ open: true, message: err.response?.data?.message || err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTenant = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    setEditError('')
    try {
      const res = await updateTenant(tenant_id, editForm)
      setTenant({ ...tenant, ...res.data })
      setEditModal(false)
    } catch (err) {
      setEditError(err.message)
    } finally {
      setEditLoading(false)
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
            </div>
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
                onClick={() => {
                  setEditForm({ name: tenant.name, phone: tenant.phone })
                  setEditModal(true)
                }}
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