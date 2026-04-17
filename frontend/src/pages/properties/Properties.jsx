import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { getProperties, createProperty } from '../../api/property.api.js'
import { 
  MdAdd, 
  MdOutlineLocationOn, 
  MdDomain, 
  MdHomeWork, 
  MdStorefront, 
  MdPeopleAlt,
  MdOutlineDoorFront
} from 'react-icons/md'
import AlertModal from '../../components/ui/AlertModal.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Button from '../../components/ui/Button.jsx'

// Softened the colors significantly for a cleaner look
const TYPE_CONFIG = { 
  flat: { 
    label: 'Flats & Apartments', 
    icon: MdHomeWork,
    accent: 'bg-blue-300',
    badge: 'bg-blue-50 text-blue-600 border-blue-100'
  }, 
  pg: { 
    label: 'PGs & Co-living', 
    icon: MdPeopleAlt,
    accent: 'bg-purple-300',
    badge: 'bg-purple-50 text-purple-600 border-purple-100'
  }, 
  commercial: { 
    label: 'Commercial Spaces', 
    icon: MdStorefront,
    accent: 'bg-orange-300',
    badge: 'bg-orange-50 text-orange-600 border-orange-100'
  } 
}

export default function Properties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', address: '', type: 'flat' })
  const [creating, setCreating] = useState(false)
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '' })

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
      setAlertInfo({ open: true, message: err.message || 'Failed to create property' })
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
    <div className="flex flex-col gap-8 pb-10 w-full max-w-7xl mx-auto">
      
      {/* --- HEADER CONTROL PANEL --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">Properties</h1>
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Manage your buildings, flats, and commercial spaces</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm whitespace-nowrap"
        >
          <MdAdd className="w-5 h-5" /> Add Property
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium flex items-center gap-2">
          {error}
        </div>
      )}

      {/* --- CONTENT AREA --- */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-full"></div>
            <p className="text-gray-400 dark:text-slate-500 font-medium">Loading properties...</p>
          </div>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-300 dark:border-slate-600 p-16 text-center flex flex-col items-center justify-center transition-colors">
          <div className="w-20 h-20 bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-5">
            <MdDomain className="w-10 h-10 text-gray-400 dark:text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No properties found</h3>
          <p className="text-gray-500 dark:text-slate-400 font-medium mb-8 max-w-md">You haven't added any properties yet. Get started by adding your first building, PG, or flat.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            + Create First Property
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {Object.entries(grouped).map(([type, list]) => {
            const config = TYPE_CONFIG[type] || TYPE_CONFIG.flat
            const Icon = config.icon

            return (
              <div key={type}>
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-5 px-1">
                  <div className={`p-2 rounded-lg border ${config.badge}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{config.label}</h2>
                  <span className="bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 px-2.5 py-0.5 rounded-full text-sm font-bold border border-gray-200 dark:border-slate-600 ml-1 transition-colors">
                    {list.length}
                  </span>
                </div>

                {/* Property Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {list.map((property) => (
                    <div
                      key={property.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                    >
                      {/* Thin, soft color accent line */}
                      <div className={`h-1 w-full ${config.accent}`}></div>
                      
                      <div className="p-5 flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight pr-2 transition-colors">{property.name}</h3>
                        </div>
                        
                        <div className="flex items-start gap-1.5 text-sm font-medium text-gray-500 dark:text-slate-400 mt-2 transition-colors">
                          <MdOutlineLocationOn className="w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 leading-snug">{property.address}</span>
                        </div>
                      </div>

                      {/* LIGHTER ACTION BUTTONS */}
                      <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-3 transition-colors">
                        <Link
                          to={`/properties/${property.id}`}
                          className="flex-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-300 text-center font-semibold py-2 rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5"
                        >
                          <MdOutlineDoorFront className="w-4 h-4" /> Units
                        </Link>
                        <Link
                          to={`/properties/${property.id}/tenants`}
                          className="flex-[1.2] bg-yellow-100 dark:bg-yellow-900/30 border border-transparent hover:bg-gray-200 dark:hover:bg-yellow-800/40 text-gray-800 dark:text-yellow-200 text-center font-semibold py-2 rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5"
                        >
                          <MdPeopleAlt className="w-4 h-4 text-gray-500 dark:text-yellow-300" /> Tenants
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* --- ADD PROPERTY MODAL --- */}
      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Property"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Property Name</label>
            <input
              type="text"
              required
              maxLength="50"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Sunset Apartments..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Property Type</label>
            <select
              required
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium appearance-none cursor-pointer bg-white"
            >
              <option value="flat">Flat / Apartment</option>
              <option value="pg">PG / Co-living</option>
              <option value="commercial">Commercial Space</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Full Address</label>
            <textarea
              required
              maxLength="200"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="123 Main St..."
              rows="3"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium resize-none text-slate-700"
            />
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={creating}
              loading={creating}
              className="flex-[1.5] font-bold"
            >
              Save Property
            </Button>
          </div>
        </form>
      </Modal>

      <AlertModal open={alertInfo.open} onClose={() => setAlertInfo({ open: false, message: '' })} message={alertInfo.message} />
    </div>
  )
}