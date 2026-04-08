import { useState } from 'react'
import { useLoaderData, useNavigate, Link } from 'react-router'
import { createUnit, deleteUnit } from '../../api/unit.api.js'
import { deleteProperty } from '../../api/property.api.js'

export default function PropertyDetail() {
  const { units: initialUnits, property_id } = useLoaderData()
  const navigate = useNavigate()

  const [units, setUnits] = useState(initialUnits || [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // State perfectly matched to the Zod schema
  const [form, setForm] = useState({ 
    label: '', 
    rent: '' 
  })
  const [creating, setCreating] = useState(false)

  const handleCreateUnit = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      // Formatting the payload to exactly match your Zod schema
      const payload = {
        property_id: parseInt(property_id, 10), // z.number().int()
        label: form.label,                      // z.string().min(1)
        rent: parseInt(form.rent, 10)           // z.number().int().min(0)
      }

      const res = await createUnit(payload)
      setUnits([...units, res.data])
      
      // Reset form
      setForm({ label: '', rent: '' })
      setIsModalOpen(false)
    } catch (err) {
      alert(err.message || 'Failed to create unit')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteUnit = async (unitId, e) => {
    e.preventDefault() 
    if (!window.confirm('Are you sure you want to delete this unit?')) return
    
    try {
      await deleteUnit(unitId)
      setUnits(units.filter(u => u.id !== unitId))
    } catch (err) {
      alert(err.message || 'Failed to delete unit')
    }
  }

  const handleDeleteProperty = async () => {
    if (!window.confirm('WARNING: Are you sure you want to delete this entire property and all its units? This cannot be undone.')) return
    
    try {
      await deleteProperty(property_id)
      navigate('/properties')
    } catch (err) {
      alert(err.message || 'Failed to delete property')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/properties" className="text-sm text-blue-600 hover:underline mb-1 inline-block">
            &larr; Back to Properties
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Property Units</h1>
          <p className="text-gray-500 mt-1">Manage individual units for this building</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Add Unit
          </button>
          <button
            onClick={handleDeleteProperty}
            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors border border-red-200"
          >
            Delete Property
          </button>
        </div>
      </div>

      {units.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">No units found</h3>
          <p className="text-gray-500 mt-1">Add your first unit to start managing tenants.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {units.map((unit) => (
            <Link 
              key={unit.id} 
              to={`/units/${unit.id}`}
              className="group block bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-500 hover:shadow-md transition-all relative"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {unit.label} {/* Updated to render unit.label */}
                </h3>
                <button 
                  onClick={(e) => handleDeleteUnit(unit.id, e)}
                  className="text-gray-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Unit"
                >
                  &times;
                </button>
              </div>
              <p className="text-gray-500 text-sm mb-4">Rent: ₹{unit.rent}</p> {/* Optional: display the rent */}
              
              <div className="pt-4 border-t border-gray-100 text-sm text-blue-600 font-medium">
                Manage Tenants &rarr;
              </div>
            </Link>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Unit</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateUnit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Label</label>
                <input
                  type="text"
                  required
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="e.g. 101, Apt B, Shop 4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rent Amount</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.rent}
                  onChange={(e) => setForm({ ...form, rent: e.target.value })}
                  placeholder="e.g. 15000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                  {creating ? 'Saving...' : 'Save Unit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}