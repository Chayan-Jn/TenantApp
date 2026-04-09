import { useLoaderData, Link } from 'react-router'

const TYPE_LABELS = { flat: 'Flats', pg: 'PGs', commercial: 'Commercial' }

const TYPE_COLORS = {
  flat: 'bg-violet-50 text-violet-700 border-violet-100',
  pg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  commercial: 'bg-amber-50 text-amber-700 border-amber-100'
}

const PROGRESS_COLORS = {
  flat: 'bg-violet-500',
  pg: 'bg-emerald-500',
  commercial: 'bg-amber-500'
}

const statCards = (stats) => [
  {
    label: 'Total Properties',
    value: stats?.total_properties,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100'
  },
  {
    label: 'Total Units',
    value: stats?.total_units,
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-100'
  },
  {
    label: 'Occupied',
    value: stats?.occupied_units,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-100'
  },
  {
    label: 'Vacant',
    value: stats?.vacant_units,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-100'
  },
  {
    label: 'Overdue Rent',
    value: stats?.overdue_count,
    sub: stats?.overdue_count > 0 ? 'needs attention' : 'all clear',
    bg: stats?.overdue_count > 0 ? 'bg-red-50' : 'bg-gray-50',
    text: stats?.overdue_count > 0 ? 'text-red-700' : 'text-gray-700',
    border: stats?.overdue_count > 0 ? 'border-red-100' : 'border-gray-100'
  }
]

export default function Dashboard() {
  const { stats } = useLoaderData()

  const grouped = (stats?.properties || []).reduce((acc, p) => {
    if (!acc[p.type]) acc[p.type] = []
    acc[p.type].push(p)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Here is what's happening with your properties today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards(stats).map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border ${card.border} ${card.bg} p-5`}
          >
            <p className={`text-xs font-semibold uppercase tracking-wide ${card.text}`}>{card.label}</p>
            <p className={`text-3xl font-bold mt-1 ${card.text}`}>{card.value ?? '-'}</p>
            {card.sub && <p className={`text-xs mt-1 ${card.text} opacity-70`}>{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Property Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Property Overview</h2>
          <Link to="/properties" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all
          </Link>
        </div>

        {!stats?.properties?.length ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-sm">No properties yet.</p>
            <Link to="/properties" className="text-blue-600 text-sm font-medium mt-2 inline-block">
              Add your first property
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {Object.entries(grouped).map(([type, list]) => (
              <div key={type}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {TYPE_LABELS[type]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {list.map((p) => {
                    const occupancyRate = p.total_units > 0
                      ? Math.round((p.occupied_units / p.total_units) * 100)
                      : 0

                    return (
                      <Link
                        key={p.id}
                        to={`/properties/${p.id}`}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-gray-300 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{p.name}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{p.total_units} units</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border capitalize ${TYPE_COLORS[type]}`}>
                              {type}
                            </span>
                            <span className="text-lg font-bold text-gray-900">{occupancyRate}%</span>
                          </div>
                        </div>

                        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                          <div
                            className={`h-1.5 rounded-full transition-all ${PROGRESS_COLORS[type]}`}
                            style={{ width: `${occupancyRate}%` }}
                          />
                        </div>

                        <div className="flex gap-6 text-sm">
                          <div>
                            <p className="text-gray-400 text-xs">Occupied</p>
                            <p className="font-semibold text-gray-900">{p.occupied_units}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Vacant</p>
                            <p className="font-semibold text-gray-900">
                              {parseInt(p.total_units) - parseInt(p.occupied_units)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}