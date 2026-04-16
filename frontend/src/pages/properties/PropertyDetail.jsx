import { useState } from 'react'
import { useLoaderData, useNavigate, Link } from 'react-router'
import { createUnit, deleteUnit, updateUnit } from '../../api/unit.api.js'
import { deleteProperty, updateProperty } from '../../api/property.api.js'
import { FiEdit2, FiTrash2, FiCamera } from 'react-icons/fi'
import Breadcrumb from '../../components/ui/Breadcrumb.jsx'
import PhotoManagerModal from '../../components/photos/PhotoManagerModal.jsx'

export default function PropertyDetail() {
  const { units: initialUnits, property_id, property } = useLoaderData()
  const navigate = useNavigate()

  const [units, setUnits] = useState(initialUnits || [])
  const [currentProperty, setCurrentProperty] = useState(property)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editingUnit, setEditingUnit] = useState(null)
  const [editPropertyModal, setEditPropertyModal] = useState(false)
  const [form, setForm] = useState({ label: '', rent: '' })
  const [editForm, setEditForm] = useState({ label: '', rent: '' })
  const [editPropertyForm, setEditPropertyForm] = useState({ name: '', address: '', type: 'flat' })
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [updatingProperty, setUpdatingProperty] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null })
  
  // Photo Modal State
  const [photoModal, setPhotoModal] = useState({ isOpen: false, unitId: null, unitName: '' })

  const handleCreateUnit = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const payload = {
        property_id: parseInt(property_id, 10),
        label: form.label,
        rent: parseInt(form.rent, 10)
      }
      const res = await createUnit(payload)
      setUnits([...units, res.data])
      setForm({ label: '', rent: '' })
      setIsModalOpen(false)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create unit')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteUnit = (unitId, e) => {
    e.preventDefault()
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Unit',
      message: 'Are you sure you want to delete this unit?',
      onConfirm: async () => {
        try {
          await deleteUnit(unitId)
          setUnits(units.filter(u => u.id !== unitId))
        } catch (err) {
          setErrorMsg(err.message || 'Failed to delete unit')
        }
      }
    })
  }

  const handleDeleteProperty = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Property',
      message: 'WARNING: Are you sure you want to delete this entire property and all its units? This cannot be undone.',
      onConfirm: async () => {
        try {
          await deleteProperty(property_id)
          navigate('/properties')
        } catch (err) {
          setErrorMsg(err.message || 'Failed to delete property')
        }
      }
    })
  }

  const openEditModal = (unit, e) => {
    e.preventDefault()
    setEditingUnit(unit)
    setEditForm({ label: unit.label, rent: unit.rent })
    setEditModal(true)
  }

  const handleUpdateUnit = async (e) => {
    e.preventDefault()
    setUpdating(true)
    try {
      const res = await updateUnit(editingUnit.id, {
        label: editForm.label,
        rent: parseInt(editForm.rent, 10)
      })
      setUnits(units.map(u => u.id === editingUnit.id ? res.data : u))
      setEditModal(false)
      setEditingUnit(null)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update unit')
    } finally {
      setUpdating(false)
    }
  }

  const handleUpdateProperty = async (e) => {
    e.preventDefault()
    setUpdatingProperty(true)
    try {
      const res = await updateProperty(property_id, editPropertyForm)
      setCurrentProperty(res.data)
      setEditPropertyModal(false)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update property')
    } finally {
      setUpdatingProperty(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb crumbs={[
            { label: 'Properties', to: '/properties' },
            { label: currentProperty?.name || 'Units' }
          ]} />
          <h1 className="text-2xl font-bold text-gray-900">{currentProperty?.name}</h1>
          <p className="text-gray-500 mt-1 capitalize">{currentProperty?.type} · {currentProperty?.address}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Add Unit
          </button>
          <Link
            to={`/properties/${property_id}/tenants`}
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors border border-purple-200 flex items-center gap-2"
          >
            View All Tenants
          </Link>
          <button
            onClick={() => {
              setEditPropertyForm({
                name: currentProperty.name,
                address: currentProperty.address,
                type: currentProperty.type
              })
              setEditPropertyModal(true)
            }}
            className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-200 flex items-center gap-2"
          >
            <FiEdit2 size={16} /> Edit Property
          </button>
          <button
            onClick={handleDeleteProperty}
            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors border border-red-200 flex items-center gap-2"
          >
            <FiTrash2 size={16} /> Delete Property
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
                <h3 className="text-xl font-bold text-gray-900">{unit.label}</h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setPhotoModal({ isOpen: true, unitId: unit.id, unitName: unit.label });
                    }} 
                    className="text-gray-400 hover:text-emerald-600 p-1 cursor-pointer" 
                    title="Unit Photos"
                  >
                    <FiCamera size={20} />
                  </button>
                  <button onClick={(e) => openEditModal(unit, e)} className="text-gray-400 hover:text-blue-600 p-1 cursor-pointer" title="Edit Unit">
                    <FiEdit2 size={20} />
                  </button>
                  <button onClick={(e) => handleDeleteUnit(unit.id, e)} className="text-gray-400 hover:text-red-600 p-1 cursor-pointer" title="Delete Unit">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-4">Rent: ₹{unit.rent}</p>
              <div className="pt-4 border-t border-gray-100 text-sm text-blue-600 font-medium">
                Manage Tenants 
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
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreateUnit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Label</label>
                <input type="text" required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. 101, Apt B, Shop 4" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rent Amount</label>
                <input type="number" required min="0" value={form.rent} onChange={(e) => setForm({ ...form, rent: e.target.value })} placeholder="e.g. 15000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={creating} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">{creating ? 'Saving...' : 'Save Unit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Unit</h2>
              <button onClick={() => setEditModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleUpdateUnit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Label</label>
                <input type="text" required value={editForm.label} onChange={(e) => setEditForm({ ...editForm, label: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rent Amount</label>
                <input type="number" required min="0" value={editForm.rent} onChange={(e) => setEditForm({ ...editForm, rent: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setEditModal(false)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={updating} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">{updating ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editPropertyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Property</h2>
              <button onClick={() => setEditPropertyModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleUpdateProperty} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                <input type="text" required value={editPropertyForm.name} onChange={(e) => setEditPropertyForm({ ...editPropertyForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select required value={editPropertyForm.type} onChange={(e) => setEditPropertyForm({ ...editPropertyForm, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                  <option value="flat">Flat / Apartment</option>
                  <option value="pg">PG / Co-living</option>
                  <option value="commercial">Commercial Space</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea required value={editPropertyForm.address} onChange={(e) => setEditPropertyForm({ ...editPropertyForm, address: e.target.value })} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setEditPropertyModal(false)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={updatingProperty} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">{updatingProperty ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{errorMsg}</p>
            <div className="flex justify-end">
              <button onClick={() => setErrorMsg('')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{confirmDialog.title}</h2>
            <p className="text-gray-600 mb-6">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} 
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  confirmDialog.onConfirm()
                  setConfirmDialog({ ...confirmDialog, isOpen: false })
                }} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <PhotoManagerModal 
        isOpen={photoModal.isOpen}
        onClose={() => setPhotoModal({ ...photoModal, isOpen: false })}
        unitId={photoModal.unitId}
        unitName={photoModal.unitName}
      />
    </div>
  )
}