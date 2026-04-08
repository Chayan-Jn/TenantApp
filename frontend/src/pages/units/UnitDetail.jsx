import { useState } from 'react'
import { useLoaderData, useNavigate, Link } from 'react-router'
import { createTenant, removeTenant } from '../../api/tenant.api.js'

export default function UnitDetail() {
  const { tenants: initialTenants, unit_id } = useLoaderData()
  const navigate = useNavigate()

  const [tenants, setTenants] = useState(initialTenants || [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [form, setForm] = useState({ 
    name: '', 
    phone: '',
    join_date: '' 
  })
  const [creating, setCreating] = useState(false)

  const handleCreateTenant = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const payload = {
        unit_id: parseInt(unit_id, 10),
        name: form.name,
        phone: form.phone,
        join_date: form.join_date
      }

      const res = await createTenant(payload)
      setTenants([...tenants, res.data])
      
      setForm({ name: '', phone: '', join_date: '' })
      setIsModalOpen(false)
    } catch (err) {
      alert(err.message || 'Failed to add tenant')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteTenant = async (tenantId, e) => {
    e.preventDefault() 
    if (!window.confirm('Are you sure you want to remove this tenant?')) return
    
    try {
      await removeTenant(tenantId)
      setTenants(tenants.filter(t => t.id !== tenantId))
    } catch (err) {
      alert(err.message || 'Failed to remove tenant')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline mb-1 inline-block">
            &larr; Back to Property Units
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Unit Tenants</h1>
          <p className="text-gray-500 mt-1">Manage the people living in this unit</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Tenant
        </button>
      </div>

      {tenants.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">No tenants yet</h3>
          <p className="text-gray-500 mt-1">This unit is currently empty. Add a tenant to start tracking rent.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <Link 
              key={tenant.id} 
              to={`/tenants/${tenant.id}`}
              className="group block bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-blue-500 hover:shadow-md transition-all relative"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900 pr-6">
                  {tenant.name}
                </h3>
                <button 
                  onClick={(e) => handleDeleteTenant(tenant.id, e)}
                  className="text-gray-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4"
                  title="Remove Tenant"
                >
                  &times;
                </button>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p>{tenant.phone}</p>
                {tenant.join_date && (
                  <p>Joined: {new Date(tenant.join_date).toLocaleDateString()}</p>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-100 text-sm text-blue-600 font-medium">
                View Rent History &rarr;
              </div>
            </Link>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Tenant</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  minLength="2"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  title="Phone must be a 10 digit number"
                  maxLength="10"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <input
                  type="date"
                  required
                  value={form.join_date}
                  onChange={(e) => setForm({ ...form, join_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {creating ? 'Adding...' : 'Add Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}