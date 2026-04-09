import { useState } from 'react'
import { useLoaderData } from 'react-router'
import { getOverdueRents, markRentPaid, markRentUnpaid } from '../../api/rent.api.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '-'
const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`

export default function Overdue() {
  const { properties } = useLoaderData()
  const [selectedProperty, setSelectedProperty] = useState('')
  const [overdueRents, setOverdueRents] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)

  const handleFetch = async () => {
    if (!selectedProperty) return
    setLoading(true)
    try {
      const result = await getOverdueRents(selectedProperty)
      setOverdueRents(result.data)
      setFetched(true)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPaid = async (id) => {
    try {
      await markRentPaid(id)
      setOverdueRents(overdueRents.filter(r => r.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleMarkUnpaid = async (id) => {
    try {
      await markRentUnpaid(id)
      setOverdueRents(overdueRents.filter(r => r.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

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
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedProperty}
              onChange={(e) => {
                setSelectedProperty(e.target.value)
                setFetched(false)
                setOverdueRents([])
              }}
            >
              <option value="">Select a property</option>
              <option value="all">All Properties</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleFetch} loading={loading} disabled={!selectedProperty}>
            Fetch
          </Button>
        </div>
      </Card>

      {fetched && overdueRents.length === 0 && (
        <Card>
          <p className="text-sm text-gray-500 text-center">No overdue rents</p>
        </Card>
      )}

      {overdueRents.length > 0 && (
        <div className="flex flex-col gap-3">
          {overdueRents.map((rent) => (
            <Card key={rent.id} className="flex items-center justify-between py-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-900">{rent.tenant_name}</span>
                <span className="text-xs text-gray-500">{rent.property_name} - {rent.unit_label}</span>
                <span className="text-xs text-gray-500">
                  Due: {formatDate(rent.due_date)} · {formatCurrency(rent.amount)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="red">overdue</Badge>
                <Button size="sm" onClick={() => handleMarkPaid(rent.id)}>
                  Mark Paid
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleMarkUnpaid(rent.id)}>
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