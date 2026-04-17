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

export default function PropertyTenants() {
  const { tenants: initialTenants, property_id, property_name } = useLoaderData()
  const [tenants, setTenants] = useState(initialTenants || [])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState(() => sessionStorage.getItem(`pt_filter_${property_id}`) || 'active')
  const [filterLoading, setFilterLoading] = useState(false)
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '' })
  const [confirmRemoveId, setConfirmRemoveId] = useState(null)

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
    if (!confirmRemoveId) return
    try {
      await removeTenant(confirmRemoveId)
      setTenants(tenants.filter(t => t.id !== confirmRemoveId))
    } catch (err) {
      setAlertInfo({ open: true, message: err.message })
    }
  }

  const handleRemove = (id) => {
    setConfirmRemoveId(id)
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

      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 transition-colors"
        />
        <select
          className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 cursor-pointer transition-colors"
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
                <Card key={tenant.id} className="flex items-center justify-between py-4 border-gray-200 dark:border-slate-700 transition-colors">
                  <div className="flex flex-col gap-1">
                    <Link to={`/tenants/${tenant.id}`} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {tenant.name}
                    </Link>
                    <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Phone: {tenant.phone}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                      Joined: {formatDate(tenant.join_date)} · Rent: {formatCurrency(tenant.rent)}/mo
                    </span>
                    {tenant.leave_date && (
                      <span className="text-xs text-rose-500 dark:text-rose-400 font-medium transition-colors">Left: {formatDate(tenant.leave_date)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={tenant.leave_date ? 'red' : 'green'}>
                      {tenant.leave_date ? 'left' : 'active'}
                    </Badge>
                    <Link to={`/tenants/${tenant.id}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                    {!tenant.leave_date && (
                      <Button size="sm" variant="danger" onClick={() => handleRemove(tenant.id)}>
                        Remove
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal 
        open={!!confirmRemoveId} 
        onClose={() => setConfirmRemoveId(null)} 
        onConfirm={proceedRemove} 
        title="Remove Tenant" 
        message="Are you sure you want to remove this tenant? This will mark them as moved out."
        confirmText="Remove"
        variant="danger"
      />
      <AlertModal open={alertInfo.open} onClose={() => setAlertInfo({ open: false, message: '' })} message={alertInfo.message} />
    </div>
  )
}