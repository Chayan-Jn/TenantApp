import { useState } from 'react'
import { useLoaderData, useNavigate, Link } from 'react-router'
import { removeTenant } from '../../api/tenant.api.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Breadcrumb from '../../components/ui/Breadcrumb.jsx'




const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '-'
const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`

export default function PropertyTenants() {
  const { tenants: initialTenants, property_id } = useLoaderData()
  const navigate = useNavigate()
  const [tenants, setTenants] = useState(initialTenants || [])
  const [search, setSearch] = useState('')

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this tenant?')) return
    try {
      await removeTenant(id)
      setTenants(tenants.filter(t => t.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search)
  )

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div>
      <Breadcrumb crumbs={[
        { label: 'Properties', to: '/properties' },
        { label: 'Units', to: `/properties/${property_id}` },
        { label: 'All Tenants' }
        ]} />
        <h1 className="text-xl font-bold text-gray-900">All Tenants</h1>
        <p className="text-sm text-gray-500 mt-1">
          {filtered.length} active tenant{filtered.length !== 1 ? 's' : ''}
          {search && ` matching "${search}"`}
        </p>
      </div>

      <input
        type="text"
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white "
      />

      {filtered.length === 0 ? (
        <Card>
          <p className="text-sm text-gray-500 text-center">
            {search ? 'No tenants match your search' : 'No active tenants in this property'}
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((tenant) => (
            <Card key={tenant.id} className="flex items-center justify-between py-4">
              <div className="flex flex-col gap-1">
                <Link
                  to={`/tenants/${tenant.id}`}
                  className="text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  {tenant.name}
                </Link>
                <span className="text-xs text-gray-500">{tenant.unit_label} · {tenant.phone}</span>
                <span className="text-xs text-gray-500">
                  Joined: {formatDate(tenant.join_date)} · Rent: {formatCurrency(tenant.rent)}/mo
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="green">active</Badge>
                <Link to={`/tenants/${tenant.id}`}>
                  <Button size="sm" variant="outline">View</Button>
                </Link>
                <Button size="sm" variant="danger" onClick={() => handleRemove(tenant.id)}>
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}