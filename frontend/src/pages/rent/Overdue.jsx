import { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOverdueRents, markRentPaid, markRentUnpaid } from '../../api/rent.api.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import AlertModal from '../../components/ui/AlertModal.jsx'

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`

export default function Overdue() {
  const { properties } = useLoaderData()
  const queryClient = useQueryClient()
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '' })

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
        <h1 className="text-2xl font-bold text-gray-900">Overdue Rent</h1>
        <p className="text-sm text-gray-500 mt-1">Track unpaid rent across your properties</p>
      </div>

      <Card className="p-5 border-gray-200 shadow-sm">
        <div className="flex gap-3 items-end">
          <div className="flex flex-col gap-1.5 flex-1 max-w-sm">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Property</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer w-full"
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
          <div className="animate-pulse flex items-center gap-2 text-blue-600 font-medium">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="4" strokeLinecap="round" strokeDasharray="31.4 31.4" />
            </svg>
            Fetching overdue rents...
          </div>
        </div>
      )}

      {selectedProperty && !isFetching && overdueRents.length === 0 && (
        <Card className="py-12 border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 text-center">No overdue rents found for this property.</p>
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
                <h3 className="text-lg font-bold text-gray-600 border-b border-gray-200 pb-1 mt-2">
                  {propertyName}
                </h3>
                
                <div className="flex flex-col gap-3 ml-2">
                  {rents.map((rent) => (
                    <Card key={rent.id} className="p-0 overflow-hidden border-gray-200 shadow-sm">
                      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-gray-50/50 transition-colors">
                        
                        <div className="flex flex-col gap-1">
                          <div className="text-base font-bold text-gray-800 flex items-center flex-wrap gap-2">
                            <span>Unit {rent.unit_label}</span>
                            <span className="text-gray-400 font-normal">|</span>
                            <span>{rent.tenant_name}</span>
                            {rent.title === 'Initial Payment' && (
                              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase font-bold tracking-wider mt-px whitespace-nowrap">
                                Initial Payment
                              </span>
                            )}
                            {rent.title === 'Security Deposit' && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase font-bold tracking-wider mt-px whitespace-nowrap">
                                Security Deposit
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 font-medium">
                            Due: {formatDate(rent.due_date)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-base font-bold text-red-600 w-24 text-right">
                            {formatCurrency(rent.amount)}
                          </span>
                          
                          <div className="w-20 flex justify-center">
                            <Badge variant={rent.status === 'paid' ? 'green' : 'red'}>
                              {rent.status === 'paid' ? 'paid' : 'overdue'}
                            </Badge>
                          </div>
                          
                          <div className="w-24 flex justify-end">
                            <Button 
                              type="button"
                              size="sm" 
                              variant={rent.status === 'paid' ? 'ghost' : 'default'}
                              disabled={actionMutation.isPending}
                              className={
                                rent.status === 'paid' 
                                  ? 'text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer disabled:opacity-50' 
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-none cursor-pointer disabled:opacity-50'
                              }
                              onClick={() => actionMutation.mutate(rent)}
                            >
                              {rent.status === 'paid' ? 'Undo' : 'Mark Paid'}
                            </Button>
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
      <AlertModal open={alertInfo.open} onClose={() => setAlertInfo({ open: false, message: '' })} message={alertInfo.message} />
    </div>
  )
}