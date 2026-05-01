import { useState, useEffect } from 'react'
import { useLoaderData, Link } from 'react-router'
import { removeTenant, getTenants } from '../../api/tenant.api.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Breadcrumb from '../../components/ui/Breadcrumb.jsx'
import ConfirmModal from '../../components/ui/ConfirmModal.jsx'
import AlertModal from '../../components/ui/AlertModal.jsx'

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const getLocalISODate = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().split('T')[0]
}

export default function PropertyTenants() {
  const { tenants: initialTenants, property_id, property_name } = useLoaderData()
  const [tenants, setTenants] = useState(initialTenants || [])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState(() => sessionStorage.getItem(`pt_filter_${property_id}`) || 'active')
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '' })
  const [removeModal, setRemoveModal] = useState({ open: false, tenant: null })
  const [refundForm, setRefundForm] = useState({ deposit_refunded: '', deposit_note: '', leave_date: getLocalISODate() })
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    sessionStorage.setItem(`pt_filter_${property_id}`, filter)
  }, [filter, property_id])

  const handleFilterChange = async (status) => {
    setFilter(status)
    setFilterLoading(true)
    try {
      const res = await getTenants({ property_id, status })
      setTenants(res.data)
    } catch (err) {
      setAlertInfo({ open: true, message: err.message })
    } finally {
      setFilterLoading(false)
    }
  }

  const proceedRemove = async () => {
    if (!removeModal.tenant) return
    setRemovingId(removeModal.tenant.id)
    try {
      await removeTenant(removeModal.tenant.id, {
        deposit_refunded: Number(refundForm.deposit_refunded) || 0,
        deposit_note: refundForm.deposit_note,
        leave_date: refundForm.leave_date || undefined
      })
      setTenants(tenants.filter(t => t.id !== removeModal.tenant.id))
      setRemoveModal({ open: false, tenant: null })
    } catch (err) {
      setAlertInfo({ open: true, message: err.response?.data?.message || err.message })
    } finally {
      setRemovingId(null)
    }
  }

  const handleRemove = (tenant) => {
    setRemoveModal({ open: true, tenant })
    setRefundForm({ 
      deposit_refunded: String(tenant.security_deposit || 0), 
      deposit_note: '', 
      leave_date: getLocalISODate() 
    })
  }

  const getDuration = (tenant) => {
    if (!tenant) return null
    const start = new Date(tenant.join_date)
    const end = refundForm.leave_date ? new Date(refundForm.leave_date) : new Date()
    const diffMs = end - start
    if (diffMs < 0) return null
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const months = Math.floor(totalDays / 30)
    const days = totalDays % 30
    return { months, days, totalDays }
  }

  const getNoticeCompliance = (tenant) => {
    if (!tenant || !tenant.notice_period_days || tenant.notice_period_days === 0) return null
    if (!tenant.notice_date) return { ok: false, label: 'No notice given' }
    const moveOut = refundForm.leave_date ? new Date(refundForm.leave_date) : new Date()
    const expected = new Date(tenant.expected_move_out)
    return moveOut >= expected
      ? { ok: true, label: 'Notice period served ✓' }
      : { ok: false, label: 'Early departure — notice not fully served' }
  }

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search)
  )

  const grouped = filtered.reduce((acc, tenant) => {
    const unit = tenant.label || tenant.unit_label || 'Unknown Unit'
    if (!acc[unit]) acc[unit] = []
    acc[unit].push(tenant)
    return acc
  }, {})

  const statusLabel = filter === 'active' ? 'active tenant' : filter === 'left' ? 'past tenant' : 'tenant'

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div>
        <Breadcrumb crumbs={[
          { label: 'Properties', to: '/properties' },
          { label: property_name || 'Property', to: `/properties/${property_id}` },
          { label: 'All Tenants' }
        ]} />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-2 transition-colors">All Tenants</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">
          {filterLoading ? 'Loading...' : `${filtered.length} ${statusLabel}${filtered.length !== 1 ? 's' : ''}${search ? ` matching "${search}"` : ''}`}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 transition-colors w-full"
        />
        <select
          className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 cursor-pointer transition-colors w-full sm:w-auto"
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="active">Active</option>
          <option value="left">Left</option>
          <option value="all">All</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-gray-200 dark:border-slate-700 transition-colors">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {search ? 'No tenants match your search' : `No ${filter === 'all' ? '' : filter} tenants in this property`}
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-8">
          {Object.entries(grouped).map(([unitLabel, unitTenants]) => (
            <div key={unitLabel} className="flex flex-col gap-3">
              <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700 pb-2 pl-1 transition-colors">
                {unitLabel} <span className="text-gray-400 dark:text-gray-500 font-normal normal-case ml-2 transition-colors">({unitTenants.length})</span>
              </h2>
              {unitTenants.map((tenant) => (
                <Card key={tenant.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 px-4 sm:px-6 border-gray-200 dark:border-slate-700 gap-4 transition-colors">
                  <div className="flex flex-col gap-1">
                    <Link to={`/tenants/${tenant.id}`} className="text-sm font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {tenant.name}
                    </Link>
                    <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Phone: {tenant.phone}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                      Joined: {formatDate(tenant.join_date)} · Rent: {formatCurrency(tenant.rent)}/mo
                    </span>
                    {tenant.leave_date && (
                      <span className="text-xs text-rose-500 dark:text-rose-400 font-medium transition-colors">Left: {formatDate(tenant.leave_date)}</span>
                    )}
                    {!tenant.leave_date && tenant.notice_date && (
                      <span className="text-xs text-amber-700 dark:text-amber-400 font-medium transition-colors">🔔 Notice given · Move-out: {formatDate(tenant.expected_move_out)}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-0 border-gray-100 dark:border-slate-700 pt-3 sm:pt-0">
                    <Badge variant={tenant.leave_date ? 'red' : 'green'}>
                      {tenant.leave_date ? 'left' : 'active'}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Link to={`/tenants/${tenant.id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                      {!tenant.leave_date && (
                        <Button size="sm" variant="danger" onClick={() => handleRemove(tenant)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Advanced Remove Modal */}
      {removeModal.tenant && (
        <Modal open={removeModal.open} onClose={() => setRemoveModal({ open: false, tenant: null })} title="Remove Tenant">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 transition-colors">
            Remove <strong>{removeModal.tenant.name}</strong>? This will mark them as moved out.
          </p>

          {/* Move-out Date */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1 transition-colors">Move-Out Date</label>
            <input type="date" value={refundForm.leave_date} onChange={(e) => setRefundForm({ ...refundForm, leave_date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 transition-colors" />
          </div>

          {/* Move-out Summary */}
          {(() => {
            const dur = getDuration(removeModal.tenant)
            const compliance = getNoticeCompliance(removeModal.tenant)
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
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 transition-colors">Security Deposit: {formatCurrency(removeModal.tenant.security_deposit || 0)}</p>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1 transition-colors">Refund Amount (₹)</label>
              <input type="number" min="0" value={refundForm.deposit_refunded} onChange={(e) => setRefundForm({ ...refundForm, deposit_refunded: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1 transition-colors">Deduction Note (optional)</label>
              <input type="text" placeholder="e.g. Wall damage, cleaning" value={refundForm.deposit_note} onChange={(e) => setRefundForm({ ...refundForm, deposit_note: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 transition-colors" />
            </div>
            {(removeModal.tenant.security_deposit || 0) > 0 && Number(refundForm.deposit_refunded) < (removeModal.tenant.security_deposit || 0) && (
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium transition-colors">
                Deducting {formatCurrency((removeModal.tenant.security_deposit || 0) - Number(refundForm.deposit_refunded || 0))}
              </p>
            )}
            {Number(refundForm.deposit_refunded) > (removeModal.tenant.security_deposit || 0) && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium transition-colors">
                Refund cannot exceed the original deposit amount.
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setRemoveModal({ open: false, tenant: null })}>Cancel</Button>
            <Button variant="danger" loading={!!removingId} disabled={Number(refundForm.deposit_refunded) > (removeModal.tenant.security_deposit || 0)} onClick={proceedRemove}>Remove</Button>
          </div>
        </Modal>
      )}
      <AlertModal open={alertInfo.open} onClose={() => setAlertInfo({ open: false, message: '' })} message={alertInfo.message} />
    </div>
  )
}