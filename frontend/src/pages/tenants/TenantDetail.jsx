import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router'
import { createRent, markRentPaid, markRentUnpaid, getRentByTenant } from '../../api/rent.api.js'
import { removeTenant, updateTenant } from '../../api/tenant.api.js'
import { FiEdit2, FiTrash2, FiCalendar, FiCheck, FiX, FiClock, FiUser, FiMapPin, FiPhone } from 'react-icons/fi'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Breadcrumb from '../../components/ui/Breadcrumb.jsx'

const statusVariant = { paid: 'emerald', pending: 'amber', overdue: 'rose' }
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const getStatus = (rent) => {
  if (rent.status === 'paid') return 'paid'
  if (new Date(rent.due_date) < new Date()) return 'overdue'
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
  
  const [loading, setLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  
  const [form, setForm] = useState({ amount: '', due_date: '' })
  const [editForm, setEditForm] = useState({ name: initialTenant.name, phone: initialTenant.phone })

  const handleAddRent = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createRent({ tenant_id: Number(tenant_id), amount: Number(form.amount), due_date: form.due_date })
      const updated = await getRentByTenant(tenant_id)
      setRents(updated.data)
      setRentModal(false)
      setForm({ amount: '', due_date: '' })
    } catch (err) { alert(err.message) } finally { setLoading(false) }
  }

  const handleMarkPaid = async (id) => {
    setActionLoading(id)
    try {
      await markRentPaid(id)
      setRents(rents.map(r => r.id === id ? { ...r, status: 'paid', paid_date: new Date().toISOString() } : r))
    } catch (err) { alert(err.message) } finally { setActionLoading(null) }
  }

  const handleMarkUnpaid = async (id) => {
    setActionLoading(id)
    try {
      await markRentUnpaid(id)
      setRents(rents.map(r => r.id === id ? { ...r, status: 'pending', paid_date: null } : r))
    } catch (err) { alert(err.message) } finally { setActionLoading(null) }
  }

  const handleRemoveTenant = async () => {
    setLoading(true)
    try {
      await removeTenant(tenant_id)
      navigate(`/units/${tenant.unit_id}`)
    } catch (err) { alert(err.message) } finally { setLoading(false) }
  }

  const handleUpdateTenant = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    try {
      const res = await updateTenant(tenant_id, editForm)
      setTenant({ ...tenant, ...res.data })
      setEditModal(false)
    } catch (err) { alert(err.message) } finally { setEditLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 p-4 text-slate-900">
      <Breadcrumb crumbs={[
        { label: 'Properties', to: '/properties' },
        { label: tenant.property_name, to: `/properties/${tenant.property_id}` },
        { label: `Unit ${tenant.label}`, to: `/units/${tenant.unit_id}` },
        { label: tenant.name }
      ]} />

      <header className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-5 items-center">
          <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-slate-100">
            <FiUser size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{tenant.name}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-slate-500 mt-1">
              <span className="flex items-center gap-1.5"><FiMapPin size={14} className="text-slate-400"/> {tenant.property_name} • {tenant.label}</span>
              <span className="flex items-center gap-1.5"><FiPhone size={14} className="text-slate-400"/> {tenant.phone}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <button onClick={() => setEditModal(true)} className="p-2.5 cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-xl transition-all border border-slate-200">
            <FiEdit2 size={18} />
          </button>
          <button onClick={() => setRemoveModal(true)} className="p-2.5 cursor-pointer bg-rose-50 hover:bg-rose-100 text-rose-400 hover:text-rose-600 rounded-xl transition-all border border-rose-100">
            <FiTrash2 size={18} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl shadow-md">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">Monthly Rent</p>
          <p className="text-xl font-bold text-white">{formatCurrency(tenant.rent)}</p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">Joined Since</p>
          <p className="text-xl font-bold text-slate-800">{formatDate(tenant.join_date)}</p>
        </div>
        <div className="hidden md:block bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
          <p className="text-emerald-600/70 text-[10px] font-black uppercase tracking-wider mb-1">Occupancy</p>
          <p className="text-xl font-bold text-emerald-700">Active Tenant</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Ledger Entries</h2>
            <p className="text-xs text-slate-500">Financial history for this resident</p>
          </div>
          <Button onClick={() => setRentModal(true)} className="cursor-pointer">
            + Add Record
          </Button>
        </div>

        <div className="grid gap-3">
          {rents.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-16 text-center text-slate-400 font-medium">
              No rent records found.
            </div>
          ) : rents.map((rent) => {
            const status = getStatus(rent)
            const isPaid = status === 'paid'
            const isProcessing = actionLoading === rent.id

            return (
              <div key={rent.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between gap-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-6">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {isPaid ? <FiCheck size={28} /> : <FiClock size={28} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-slate-800 tracking-tight">{formatCurrency(rent.amount)}</span>
                      <Badge variant={statusVariant[status]} className="font-bold tracking-tight">{status.toUpperCase()}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-0.5 text-xs text-slate-500 mt-2 font-medium">
                      <span className="flex items-center gap-1.5 text-slate-400"><FiCalendar size={13}/> Due: {formatDate(rent.due_date)}</span>
                      {isPaid && <span className="text-emerald-600 flex items-center gap-1.5"><FiCheck size={13}/> Paid: {formatDate(rent.paid_date)}</span>}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {!isPaid ? (
                    <button 
                      disabled={isProcessing}
                      onClick={() => handleMarkPaid(rent.id)}
                      className={`px-8 py-3 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm ${isProcessing ? 'opacity-40 cursor-wait' : ''}`}
                    >
                      Mark Paid
                    </button>
                  ) : (
                    <button 
                      disabled={isProcessing}
                      onClick={() => handleMarkUnpaid(rent.id)}
                      className={`px-8 py-3 cursor-pointer bg-white text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-100 hover:bg-rose-50 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isProcessing ? 'opacity-40 cursor-wait' : ''}`}
                    >
                      Undo
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Modal open={rentModal} onClose={() => setRentModal(false)} title="New Rent Entry">
        <form onSubmit={handleAddRent} className="flex flex-col gap-5 mt-4">
          <Input label="Rent Amount (₹)" type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} placeholder="e.g. 15000" required />
          <Input label="Payment Due Date" type="date" value={form.due_date} onChange={(e) => setForm({...form, due_date: e.target.value})} required />
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="ghost" className="cursor-pointer" onClick={() => setRentModal(false)}>Cancel</Button>
            <Button type="submit" className="cursor-pointer" loading={loading}>Save Record</Button>
          </div>
        </form>
      </Modal>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Profile">
        <form onSubmit={handleUpdateTenant} className="flex flex-col gap-5 mt-4">
          <Input label="Resident Name" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} required />
          <Input label="Phone Contact" type="tel" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} required />
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="ghost" className="cursor-pointer" onClick={() => setEditModal(false)}>Cancel</Button>
            <Button type="submit" className="cursor-pointer" loading={editLoading}>Update Changes</Button>
          </div>
        </form>
      </Modal>

      <Modal open={removeModal} onClose={() => setRemoveModal(false)} title="Remove Resident">
        <div className="py-2">
          <p className="text-slate-600 leading-relaxed text-sm">Are you sure you want to remove <b>{tenant.name}</b>? The unit records will be preserved but the tenant will be moved out.</p>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="ghost" className="cursor-pointer" onClick={() => setRemoveModal(false)}>Cancel</Button>
          <button onClick={handleRemoveTenant} disabled={loading} className={`px-6 py-2.5 cursor-pointer bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-50 ${loading ? 'opacity-50 cursor-wait' : 'hover:bg-rose-700'}`}>
            Confirm Removal
          </button>
        </div>
      </Modal>
    </div>
  )
}