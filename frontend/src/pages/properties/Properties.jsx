import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { getProperties, createProperty } from '../../api/property.api.js'

const TYPE_LABELS = { flat: 'Flats', pg: 'PGs', commercial: 'Commercial' }

export default function Properties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', address: '', type: 'flat' })
  const [creating, setCreating] = useState(false)

  const fetchProperties = async () => {
    try {
      const res = await getProperties()
      setProperties(res.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await createProperty(form)
      setForm({ name: '', address: '', type: 'flat' })
      setIsModalOpen(false)
      fetchProperties()
    } catch (err) {
      alert(err.message || 'Failed to create property')
    } finally {
      setCreating(false)
    }
  }

  const grouped = properties.reduce((acc, p) => {
    if (!acc[p.type]) acc[p.type] = []
    acc[p.type].push(p)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 mt-1">Manage your buildings and properties</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Property
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading properties...</p>
      ) : properties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
          <p className="text-gray-500 mt-1">Get started by adding your first property.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {Object.entries(grouped).map(([type, list]) => (
            <div key={type}>
              <h2 className="text-base font-semibold text-gray-700 mb-3">{TYPE_LABELS[type]}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map((property) => (
                    <div
                    key={property.id}
                    className="block bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all"
                    >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-gray-900 pr-4">{property.name}</h3>
                      <span className="capitalize bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-md border border-blue-100">
                        {property.type}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{property.address}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <Link
                        to={`/properties/${property.id}`}
                        className="text-sm text-blue-600 font-medium hover:text-blue-700"
                      >
                        Manage Units &rarr;
                      </Link>
                      <Link
                        to={`/properties/${property.id}/tenants`}
                        className="text-sm text-gray-500 font-medium hover:text-gray-700"
                      >
                        View Tenants &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Property</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Sunset Apartments"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                  required
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="flat">Flat / Apartment</option>
                  <option value="pg">PG / Co-living</option>
                  <option value="commercial">Commercial Space</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="123 Main St, City, State"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
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
                  {creating ? 'Saving...' : 'Save Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}