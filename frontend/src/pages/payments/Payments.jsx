import { useState } from 'react'
import { useLoaderData } from 'react-router'
import { getPayments } from '../../api/payments.api.js'
import { markRentPaid, markRentUnpaid } from '../../api/rent.api.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '-'
const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const statusVariant = { paid: 'green', pending: 'yellow', overdue: 'red' }

const getStatus = (rent) => {
  if (rent.status === 'paid') return 'paid'
  if (new Date(rent.due_date) < new Date()) return 'overdue'
  return 'pending'
}

export default function Payments() {
  const { properties } = useLoaderData()
  const now = new Date()

  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [propertyId, setPropertyId] = useState('all')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    const res = await getPayments({ month, year, property_id: propertyId })
    setData(res.data)
  }

  const handleFetch = async () => {
    setLoading(true)
    try {
      await fetchData()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPaid = async (id) => {
    try {
      await markRentPaid(id)
      await fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleMarkUnpaid = async (id) => {
    try {
      await markRentUnpaid(id)
      await fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500 mt-1">Monthly rent collection overview</p>
      </div>

      <Card>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Month</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Year</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-40">
            <label className="text-sm font-medium text-gray-700">Property</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
            >
              <option value="all">All Properties</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <Button onClick={handleFetch} loading={loading}>
            Fetch
          </Button>
        </div>
      </Card>

      {data && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Collected</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{formatCurrency(data.collected)}</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Pending</p>
              <p className="text-2xl font-bold text-amber-700 mt-1">{formatCurrency(data.pending)}</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Total</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(data.collected + data.pending)}</p>
            </div>
          </div>

          {data.payments.length === 0 ? (
            <Card>
              <p className="text-sm text-gray-500 text-center">No payments found for this period</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {data.payments.map((payment) => {
                const status = getStatus(payment)
                return (
                  <Card key={payment.id} className="flex items-center justify-between py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-900">{payment.tenant_name}</span>
                      <span className="text-xs text-gray-500">{payment.property_name} - {payment.unit_label}</span>
                      <span className="text-xs text-gray-500">
                        Due: {formatDate(payment.due_date)}
                        {payment.paid_date && ` · Paid: ${formatDate(payment.paid_date)}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                      <Badge variant={statusVariant[status]}>{status}</Badge>
                      {status !== 'paid' ? (
                        <Button size="sm" onClick={() => handleMarkPaid(payment.id)}>
                          Mark Paid
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => handleMarkUnpaid(payment.id)}>
                          Undo
                        </Button>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}