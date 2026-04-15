import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router'
import { createRent, markRentPaid, markRentUnpaid, getRentByTenant } from '../../api/rent.api.js'
import { removeTenant, updateTenant } from '../../api/tenant.api.js'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Breadcrumb from '../../components/ui/Breadcrumb.jsx'
import AlertModal from '../../components/ui/AlertModal.jsx'

const statusVariant = { paid: 'green', pending: 'yellow', overdue: 'red' }

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
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{tenant.name}</h1>
              <Badge variant={isActive ? 'green' : 'red'}>
                {isActive ? 'active' : 'moved out'}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">{tenant.phone}</p>
            <p className="text-sm text-gray-500">{tenant.property_name} - {tenant.label}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
              <span>Joined: {formatDate(tenant.join_date)}</span>
              {isActive
                ? <span>Rent: {formatCurrency(tenant.rent)}/mo</span>
                : <span className="text-red-400">Left: {formatDate(tenant.leave_date)}</span>
              }
              <span>Deposit: {formatCurrency(tenant.security_deposit || 0)}</span>
            </div>
            {!isActive && tenant.deposit_refunded > 0 && (
              <div className="mt-2 text-xs text-gray-500">
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
                className="text-gray-400 hover:text-blue-600 p-1 cursor-pointer transition-colors"
              >
                <FiEdit2 size={20} />
              </button>
              <button
                onClick={() => setRemoveModal(true)}
                className="text-gray-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Rent Records */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Rent History</h2>
        {isActive && (
          <Button size="sm" onClick={() => setRentModal(true)}>+ Add Rent</Button>
        )}
      </div>

      {rents.length === 0 ? (
        <Card>
          <p className="text-sm text-gray-500 text-center">No rent records yet</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {rents.map((rent) => {
            const status = getStatus(rent)
            return (
              <Card key={rent.id} className="flex items-center justify-between py-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    {formatCurrency(rent.amount)}
                    {rent.title === 'Initial Payment' && (
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase font-bold tracking-wider mt-px">
                        Initial Payment
                      </span>
                    )}
                    {rent.title === 'Security Deposit' && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase font-bold tracking-wider mt-px">
                        Security Deposit
                      </span>
                    )}
                    {rent.title && rent.title !== 'Initial Payment' && rent.title !== 'Security Deposit' && rent.title !== 'Monthly Rent' && rent.title !== 'Rent' && (
                      <span className="text-xs text-gray-500 font-normal">({rent.title})</span>
                    )}
                  </span>
                  <span className="text-xs text-gray-500">
                    Due: {formatDate(rent.due_date)}
                    {rent.paid_date && ` · Paid: ${formatDate(rent.paid_date)}`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
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
        <p className="text-sm text-gray-600 mb-4">
          Remove <strong>{tenant.name}</strong>? This will mark them as moved out.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 space-y-3">
            <p className="text-sm font-semibold text-gray-800">Security Deposit: {formatCurrency(tenant.security_deposit || 0)}</p>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Refund Amount (₹)</label>
              <input type="number" min="0" value={refundForm.deposit_refunded} onChange={(e) => setRefundForm({ ...refundForm, deposit_refunded: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Deduction Note (optional)</label>
              <input type="text" placeholder="e.g. Wall damage, cleaning" value={refundForm.deposit_note} onChange={(e) => setRefundForm({ ...refundForm, deposit_note: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            {(tenant.security_deposit || 0) > 0 && Number(refundForm.deposit_refunded) < (tenant.security_deposit || 0) && (
              <p className="text-xs text-amber-700 font-medium">
                Deducting {formatCurrency((tenant.security_deposit || 0) - Number(refundForm.deposit_refunded || 0))}
              </p>
            )}
            {Number(refundForm.deposit_refunded) > (tenant.security_deposit || 0) && (
              <p className="text-xs text-red-600 font-medium">
                Refund cannot exceed the original deposit amount.
              </p>
            )}
          </div>

        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setRemoveModal(false)}>Cancel</Button>
          <Button variant="danger" loading={loading} disabled={Number(refundForm.deposit_refunded) > (tenant.security_deposit || 0)} onClick={handleRemoveTenant}>Remove</Button>
        </div>
      </Modal>

      <AlertModal open={alertInfo.open} onClose={() => setAlertInfo({ open: false, message: '' })} message={alertInfo.message} />
    </div>
  )
}