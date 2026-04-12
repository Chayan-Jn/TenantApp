import { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOverdueRents, markRentPaid, markRentUnpaid } from '../../api/rent.api.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '-'
const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`

export default function Overdue() {
  const { properties } = useLoaderData()
  const queryClient = useQueryClient()

  // 1. Initialize state from sessionStorage
  const [selectedProperty, setSelectedProperty] = useState(() => sessionStorage.getItem('overdue_property') || '')

  // 2. Sync to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('overdue_property', selectedProperty)
  }, [selectedProperty])

  // 3. React Query for fetching
  const { data: overdueData, isFetching } = useQuery({
    queryKey: ['overdueRents', selectedProperty],
    queryFn: () => getOverdueRents(selectedProperty),
    enabled: !!selectedProperty,
    staleTime: 1000 * 60 * 5 // Cache for 5 mins
  })

  const overdueRents = overdueData?.data || []

  // 4. React Query Mutations for actions
  const markPaidMutation = useMutation({
    mutationFn: (id) => markRentPaid(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['overdueRents'] })
  })

  const markUnpaidMutation = useMutation({
    mutationFn: (id) => markRentUnpaid(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['overdueRents'] })
  })

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Overdue Rent</h1>
        <p className="text-sm text-gray-500 mt-1">Track unpaid rent across your properties</p>
      </div>

      <Card>
        <div className="flex gap-3 items-end">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium text-gray-700">Select Property</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
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
          {/* Note: Fetch button removed for auto-fetching! */}
        </div>
      </Card>

      {/* Loading State Overlay */}
      {isFetching && (
        <div className="flex justify-center py-8">
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
        <Card>
          <p className="text-sm text-gray-500 text-center">No overdue rents</p>
        </Card>
      )}

      {overdueRents.length > 0 && (
        <div className={`flex flex-col gap-3 transition-opacity duration-200 ${isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {overdueRents.map((rent) => (
            <Card key={rent.id} className="flex items-center justify-between py-4 bg-white">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-900">{rent.tenant_name}</span>
                <span className="text-xs text-gray-500">{rent.property_name} - {rent.unit_label}</span>
                <span className="text-xs text-gray-500">
                  Due: {formatDate(rent.due_date)} · <span className="font-semibold">{formatCurrency(rent.amount)}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="red">overdue</Badge>
                <Button 
                  size="sm" 
                  onClick={() => markPaidMutation.mutate(rent.id)}
                  disabled={markPaidMutation.isPending}
                >
                  Mark Paid
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => markUnpaidMutation.mutate(rent.id)}
                  disabled={markUnpaidMutation.isPending}
                >
                  Undo
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}