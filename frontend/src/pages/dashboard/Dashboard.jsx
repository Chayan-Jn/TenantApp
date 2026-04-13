import { useLoaderData, Link } from 'react-router'
import { 
  MdOutlineDomain, 
  MdOutlineMeetingRoom, 
  MdOutlinePeopleAlt, 
  MdOutlineKey, 
  MdOutlineWarningAmber,
  MdArrowRightAlt,
  MdOutlineAccountBalanceWallet
} from 'react-icons/md'

const TYPE_LABELS = { flat: 'Flats', pg: 'PGs', commercial: 'Commercial' }

const TYPE_COLORS = {
  flat: 'text-violet-700 bg-violet-100',
  pg: 'text-emerald-700 bg-emerald-100',
  commercial: 'text-amber-700 bg-amber-100'
}

const FRAME_BG = {
  flat: 'bg-violet-50/50 border-violet-100/50',
  pg: 'bg-emerald-50/50 border-emerald-100/50',
  commercial: 'bg-amber-50/50 border-amber-100/50'
}

const PROGRESS_COLORS = {
  flat: 'bg-violet-500',
  pg: 'bg-emerald-500',
  commercial: 'bg-amber-500'
}

const statCards = (stats) => [
  { label: 'Total Properties', value: stats?.total_properties || 0, icon: MdOutlineDomain, iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
  { label: 'Total Units', value: stats?.total_units || 0, icon: MdOutlineMeetingRoom, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-100' },
  { label: 'Occupied', value: stats?.occupied_units || 0, icon: MdOutlinePeopleAlt, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100' },
  { label: 'Vacant', value: stats?.vacant_units || 0, icon: MdOutlineKey, iconColor: 'text-amber-600', iconBg: 'bg-amber-100' },
  { 
    label: 'Overdue Rent', 
    value: stats?.overdue_count || 0, 
    icon: MdOutlineWarningAmber, 
    sub: stats?.overdue_count > 0 ? 'Needs Attention' : null,
    iconColor: stats?.overdue_count > 0 ? 'text-red-600' : 'text-gray-400',
    iconBg: stats?.overdue_count > 0 ? 'bg-red-100' : 'bg-gray-100',
    textColor: stats?.overdue_count > 0 ? 'text-red-600' : 'text-gray-900'
  }
]

export default function Dashboard() {
  const loaderData = useLoaderData()
  
  // SAFELY EXTRACT DATA: Handles { data: stats } from API or { stats } or direct object
  const stats = loaderData?.data || loaderData?.stats || loaderData || {}

  const grouped = (stats?.properties || []).reduce((acc, p) => {
    if (!acc[p.type]) acc[p.type] = []
    acc[p.type].push(p)
    return acc
  }, {})

  const financials = stats?.financials || { collected: 0, pending: 0, total: 0 }
  const collectionRate = financials.total > 0 ? Math.round((financials.collected / financials.total) * 100) : 0
  
  // Safe currency formatter that won't crash on null/undefined
  const formatCurrency = (n) => {
    const num = Number(n) || 0;
    return `₹${num.toLocaleString('en-IN')}`
  }

  // Fallback while loading or if no data
  if (!loaderData) {
    return <div className="p-6 text-gray-500">Loading dashboard data...</div>
  }

  return (
    <div className="flex flex-col gap-8 pb-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Here is what's happening with your properties today.</p>
      </div>

      {/* TOP STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full">
        {statCards(stats).map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-4 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${card.iconBg}`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                {card.sub && (
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${card.iconBg} ${card.iconColor}`}>
                    {card.sub}
                  </span>
                )}
              </div>
              <div>
                <p className={`text-2xl font-extrabold ${card.textColor || 'text-gray-900'}`}>{card.value}</p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">{card.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* FINANCIAL SNAPSHOT */}
      <div className="w-full bg-white rounded-xl border border-gray-200 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MdOutlineAccountBalanceWallet className="w-5 h-5 text-emerald-600" />
            This Month's Collections
          </h2>
          <Link to="/payments" className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            Go to Ledger
          </Link>
        </div>
        
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Collected</p>
            <p className="text-3xl font-black text-emerald-600">{formatCurrency(financials.collected)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pending</p>
            <p className="text-xl font-bold text-amber-500">{formatCurrency(financials.pending)}</p>
          </div>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
          <div
            className="h-3 rounded-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${collectionRate}%` }}
          />
        </div>
        <p className="text-xs font-semibold text-gray-500 text-right">{collectionRate}% Collected of {formatCurrency(financials.total)}</p>
      </div>

      {/* PROPERTIES OVERVIEW */}
      <div className="mt-2 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Property Overview</h2>
          <Link to="/properties" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            View all <MdArrowRightAlt className="w-4 h-4" />
          </Link>
        </div>

        {!stats?.properties?.length ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <h3 className="text-base font-semibold text-gray-900">No properties yet</h3>
            <Link to="/properties" className="text-blue-600 text-sm font-medium mt-2 inline-block hover:underline">
              Add your first property
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {Object.entries(grouped).map(([type, list]) => (
              <div key={type}>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  {TYPE_LABELS[type] || type}
                  <div className="h-px bg-gray-200 flex-1"></div>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {list.map((p) => {
                    const totalUnits = Number(p.total_units) || 0;
                    const occupiedUnits = Number(p.occupied_units) || 0;
                    const occupancyRate = totalUnits > 0 
                      ? Math.round((occupiedUnits / totalUnits) * 100) 
                      : 0

                    return (
                      <Link
                        key={p.id}
                        to={`/properties/${p.id}`}
                        className="group bg-white p-4 pb-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                      >
                        <div className={`rounded-xl border p-5 mb-4 ${FRAME_BG[type] || 'bg-gray-50 border-gray-100'} transition-colors flex-1`}>
                          <div className="flex items-start justify-between mb-5">
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{p.name}</h4>
                              <p className="text-sm text-gray-500 font-medium mt-1">{totalUnits} total units</p>
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1.5 rounded-md uppercase tracking-wider ${TYPE_COLORS[type] || 'text-gray-700 bg-gray-100'}`}>
                              {type}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-semibold text-gray-600">Occupancy</span>
                            <span className="font-bold text-gray-900">{occupancyRate}%</span>
                          </div>
                          <div className="w-full bg-black/5 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ease-out ${PROGRESS_COLORS[type] || 'bg-gray-500'}`}
                              style={{ width: `${occupancyRate}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center px-2">
                          <div className="flex flex-col">
                            <span className="text-xs uppercase font-bold text-gray-400 mb-1">Occupied</span>
                            <span className="font-bold text-emerald-600 text-lg">{occupiedUnits}</span>
                          </div>
                          <div className="h-8 w-px bg-gray-200"></div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs uppercase font-bold text-gray-400 mb-1">Vacant</span>
                            <span className="font-bold text-amber-500 text-lg">
                              {totalUnits - occupiedUnits}
                            </span>
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