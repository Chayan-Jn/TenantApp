import { formatCurrency, CURRENCY_SYMBOL } from '../../utils/currency.js'
import { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOverdueRents, markRentPaid, markRentUnpaid, updateRent, deleteRent } from '../../api/rent.api.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import AlertModal from '../../components/ui/AlertModal.jsx'
import Modal from '../../components/ui/Modal.jsx'
import ConfirmModal from '../../components/ui/ConfirmModal.jsx'
import Input from '../../components/ui/Input.jsx'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'


export default function Overdue() {
  const { properties } = useLoaderData()
  const queryClient = useQueryClient()
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '' })

  const [editRentModal, setEditRentModal] = useState(false)
  const [editRentForm, setEditRentForm] = useState({ id: null, amount: '', due_date: '' })
  const [editLoading, setEditLoading] = useState(false)
  const [error, setError] = useState('')

  const [deleteRentId, setDeleteRentId] = useState(null)
  const [deleteRentLoading, setDeleteRentLoading] = useState(false)

  const [selectedProperty, setSelectedProperty] = useState(() => sessionStorage.getItem('overdue_property') || '')

  useEffect(() => {
    sessionStorage.setItem('overdue_property', selectedProperty)
  }, [selectedProperty])

  const { data: overdueData, isFetching } = useQuery({
    queryKey: ['overdueRents', selectedProperty],
    queryFn: () => getOverdueRents(selectedProperty),
    enabled: !!selectedProperty,
    staleTime: 1000 * 60 * 5 
  })

  const overdueRents = overdueData?.data || []

  // COMBINED MUTATION: 1 Button transforms based on status
  const actionMutation = useMutation({
    mutationFn: async (rent) => {
      // Assuming rent object has a status field. If not, it defaults to marking paid.
      return rent.status === 'paid' ? await markRentUnpaid(rent.id) : await markRentPaid(rent.id)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['overdueRents'] }),
    onError: (err) => setAlertInfo({ open: true, message: err.response?.data?.message || err.message })
  })

  const handleOpenEditRent = (rent) => {
    setEditRentForm({
      id: rent.id,
      amount: rent.amount,
      due_date: new Date(rent.due_date).toISOString().split('T')[0]
    })
    setEditRentModal(true)
  }

  const handleEditRentSubmit = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    setError('')
    try {
      await updateRent(editRentForm.id, {
        amount: Number(editRentForm.amount),
        due_date: editRentForm.due_date
      })
      queryClient.invalidateQueries({ queryKey: ['overdueRents'] })
      setEditRentModal(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setEditLoading(false)
    }
  }

  const handleConfirmDeleteRent = async () => {
    if (!deleteRentId) return
    setDeleteRentLoading(true)
    try {
      await deleteRent(deleteRentId)
      queryClient.invalidateQueries({ queryKey: ['overdueRents'] })
      setDeleteRentId(null)
    } catch (err) {
      setAlertInfo({ open: true, message: err.message })
    } finally {
      setDeleteRentLoading(false)
    }
  }

  // GROUPING LOGIC: Group by Property, then sort by Unit
  const groupedData = {}
  if (overdueRents.length > 0) {
    overdueRents.forEach(rent => {
      if (!groupedData[rent.property_name]) {
        groupedData[rent.property_name] = []
      }
      groupedData[rent.property_name].push(rent)
    })
  }
  
  const sortedProps = Object.keys(groupedData).sort()

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-16 relative">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Overdue Rent</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">Track unpaid rent across your properties</p>
      </div>

      <Card className="p-5 border-gray-200 dark:border-slate-700 shadow-sm transition-colors">
        <div className="flex gap-3 items-end">
          <div className="flex flex-col gap-1.5 flex-1 max-w-sm">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Select Property</label>
            <select
              className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 cursor-pointer w-full transition-colors"
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
            >
              <option value="">Select a property</option>
              <option value="all">All Properties</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {isFetching && (
        <div className="flex justify-center py-4">
          <div className="animate-pulse flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="4" strokeLinecap="round" strokeDasharray="31.4 31.4" />
            </svg>
            Fetching overdue rents...
          </div>
        </div>
      )}

      {selectedProperty && !isFetching && overdueRents.length === 0 && (
        <Card className="py-12 border-gray-200 dark:border-slate-700 shadow-sm transition-colors">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">No overdue rents found for this property.</p>
        </Card>
      )}

      {/* RENDER GROUPED DATA */}
      {sortedProps.length > 0 && (
        <div className={`flex flex-col gap-6 transition-opacity duration-200 ${isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {sortedProps.map(propertyName => {
            // Sort units within the property numerically/alphabetically
            const rents = groupedData[propertyName].sort((a, b) => 
              a.unit_label.localeCompare(b.unit_label, undefined, { numeric: true, sensitivity: 'base' })
            )

            return (
              <div key={propertyName} className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-gray-600 dark:text-slate-400 border-b border-gray-200 dark:border-slate-700 pb-1 mt-2 transition-colors">
                  {propertyName}
                </h3>
                
                <div className="flex flex-col gap-3 ml-2">
                  {rents.map((rent) => (
                    <Card key={rent.id} className="p-0 overflow-hidden border-gray-200 dark:border-slate-700 shadow-sm transition-colors">
                      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/60 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                        
                        <div className="flex flex-col gap-1">
                          <div className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center flex-wrap gap-2 transition-colors">
                            <span>Unit {rent.unit_label}</span>
                            <span className="text-gray-400 dark:text-gray-500 font-normal">|</span>
                            <span>{rent.tenant_name}</span>
                            {rent.title === 'Initial Payment' && (
                              <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded uppercase font-bold tracking-wider mt-px whitespace-nowrap transition-colors">
                                Initial Payment
                              </span>
                            )}
                            {rent.title === 'Security Deposit' && (
                              <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded uppercase font-bold tracking-wider mt-px whitespace-nowrap transition-colors">
                                Security Deposit
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">
                            Due: {formatDate(rent.due_date)}
                          </span>
                        </div>

                        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-0 border-gray-100 dark:border-slate-700 pt-3 sm:pt-0">
                          <div className="flex items-center gap-3">
                            <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 transition-colors">
                              {formatCurrency(rent.amount)}
                            </span>
                            
                            <Badge variant={rent.status === 'paid' ? 'green' : 'crimson'}>
                              {rent.status === 'paid' ? 'paid' : 'overdue'}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-end gap-2 w-full xs:w-auto">
                            <Button 
                              type="button"
                              size="sm" 
                              variant={rent.status === 'paid' ? 'ghost' : 'default'}
                              disabled={actionMutation.isPending}
                              className={
                                rent.status === 'paid' 
                                  ? 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer disabled:opacity-50 transition-colors flex-1 xs:flex-none' 
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-none cursor-pointer disabled:opacity-50 transition-colors flex-1 xs:flex-none'
                              }
                              onClick={() => actionMutation.mutate(rent)}
                            >
                              {rent.status === 'paid' ? 'Undo' : 'Mark Paid'}
                            </Button>
                            
                            {rent.status !== 'paid' && (
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => handleOpenEditRent(rent)} 
                                  className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-2 sm:p-1.5 cursor-pointer transition-colors bg-gray-50 dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                                  title="Edit Rent"
                                >
                                  <FiEdit2 size={16} className="sm:w-3.5 sm:h-3.5" />
                                </button>
                                <button 
                                  onClick={() => setDeleteRentId(rent.id)} 
                                  className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-2 sm:p-1.5 cursor-pointer transition-colors bg-gray-50 dark:bg-slate-700/50 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                                  title="Delete Rent"
                                >
                                  <FiTrash2 size={16} className="sm:w-3.5 sm:h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
      {/* Edit Rent Modal */}
      <Modal open={editRentModal} onClose={() => setEditRentModal(false)} title="Edit Overdue Rent">
        <form onSubmit={handleEditRentSubmit} className="flex flex-col gap-4">
          <Input label={`Amount (${CURRENCY_SYMBOL})`} name="amount" type="number" value={editRentForm.amount} onChange={(e) => setEditRentForm({...editRentForm, amount: e.target.value})} required />
          <Input label="Due Date" name="due_date" type="date" value={editRentForm.due_date} onChange={(e) => setEditRentForm({...editRentForm, due_date: e.target.value})} required />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" type="button" onClick={() => setEditRentModal(false)}>Cancel</Button>
            <Button type="submit" loading={editLoading}>Save</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Rent Confirm Modal */}
      <ConfirmModal
        open={!!deleteRentId}
        onClose={() => setDeleteRentId(null)}
        onConfirm={handleConfirmDeleteRent}
        title="Delete Rent Record?"
        message="Are you sure you want to delete this rent entry? This action is permanent."
        loading={deleteRentLoading}
      />

      <AlertModal open={alertInfo.open} onClose={() => setAlertInfo({ open: false, message: '' })} message={alertInfo.message} />
    </div>
  )
}