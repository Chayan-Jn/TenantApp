import { useState, useEffect } from 'react'
import { useRouteLoaderData, Link } from 'react-router'
import { getProperties } from '../../api/property.api.js'
import Card from '../../components/ui/Card.jsx'

export default function Dashboard() {
  // Access the owner data loaded by the root authLoader
  const { data: owner } = useRouteLoaderData('root')
  
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getProperties()
        setProperties(res.data || [])
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {owner?.name?.split(' ')[0] || 'Owner'}!
        </h1>
        <p className="text-gray-500 mt-1">Here is what's happening with your properties today.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Total Properties
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {loading ? '-' : properties.length}
            </span>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Quick Actions
          </h3>
          <div className="mt-4 flex flex-col gap-2">
            <Link 
              to="/properties" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              &rarr; View all properties
            </Link>
            <Link 
              to="/rent/overdue" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              &rarr; Check overdue rent
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}