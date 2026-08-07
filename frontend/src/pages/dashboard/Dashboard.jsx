import { useLoaderData, Link } from 'react-router-dom'
import {
  FiHome,
  FiHash,
  FiUsers,
  FiKey,
  FiAlertCircle,
  FiArrowRight,
  FiCreditCard,
  FiCheckCircle,
  FiCircle
} from 'react-icons/fi'
import { formatCurrency } from '../../utils/currency.js'

const TYPE_LABELS = { flat: 'Flats', pg: 'PGs', commercial: 'Commercial' }

const TYPE_COLORS = {
  flat: 'text-violet-700 bg-violet-100 dark:bg-violet-900/40 dark:text-violet-300',
  pg: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300',
  commercial: 'text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300'
}

const FRAME_BG = {
  flat: 'bg-cyan-800 text-white',
  pg: 'bg-slate-700 text-white',
  commercial: 'bg-stone-800 text-white'
}

const ACTIVE_SEGMENT = {
  flat: 'bg-cyan-400 dark:bg-cyan-500',
  pg: 'bg-slate-300 dark:bg-slate-400',
  commercial: 'bg-stone-600 dark:bg-stone-300'
}

const statCards = (stats) => [
  { label: 'Total Properties', value: stats?.total_properties || 0, icon: FiHome, iconBg: 'bg-slate-50 dark:bg-slate-800/50', iconColor: 'text-slate-600 dark:text-slate-400' },
  { label: 'Total Units', value: stats?.total_units || 0, icon: FiHash, iconBg: 'bg-slate-50 dark:bg-slate-800/50', iconColor: 'text-slate-600 dark:text-slate-400' },
  { label: 'Occupied', value: stats?.occupied_units || 0, icon: FiUsers, iconBg: 'bg-emerald-50 dark:bg-emerald-900/20', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Vacant', value: stats?.vacant_units || 0, icon: FiKey, iconBg: 'bg-amber-50 dark:bg-amber-900/20', iconColor: 'text-amber-600 dark:text-amber-400' },
  {
    label: 'Overdue Rent',
    value: stats?.overdue_count || 0,
    icon: FiAlertCircle,
    sub: stats?.overdue_count > 0 ? 'Action Required' : null,
    iconBg: stats?.overdue_count > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-slate-50 dark:bg-slate-800/50',
    iconColor: stats?.overdue_count > 0 ? 'text-crimson' : 'text-slate-400 dark:text-slate-500',
    textColor: stats?.overdue_count > 0 ? 'text-crimson' : 'text-slate-900 dark:text-white',
    isAlert: stats?.overdue_count > 0
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

  // Fallback while loading or if no data
  if (!loaderData) {
    return <div className="p-6 text-gray-500 dark:text-slate-400">Loading dashboard data...</div>
  }

  const isOnboardingComplete = stats?.total_properties > 0 && stats?.total_units > 0 && stats?.occupied_units > 0;

  return (
    <div className="flex flex-col gap-8 pb-6 w-full">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Here is what's happening with your properties today.</p>
      </div>

      {/* ONBOARDING WIZARD */}
      {!isOnboardingComplete && (
        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden transition-all border border-slate-700">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2 tracking-tight">Welcome! Let's get your portfolio set up.</h2>
            <p className="text-slate-300 text-sm mb-6 max-w-2xl font-medium leading-relaxed">
              Complete these three quick steps to get everything running so you can start managing properties and collecting rent effortlessly.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Step 1 */}
              <Link to="/properties" className={`flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl p-4 transition-all duration-300 ${stats?.total_properties > 0 ? 'opacity-50 border-emerald-500/50' : 'transform hover:-translate-y-1 shadow-lg border-slate-500'}`}>
                <div className="flex items-center gap-3 mb-2">
                  {stats?.total_properties > 0 ? <FiCheckCircle className="text-emerald-400 w-5 h-5 flex-shrink-0" /> : <FiCircle className="text-slate-400 w-5 h-5 flex-shrink-0" />}
                  <span className="font-bold tracking-wide">1. Add Property</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-8">Create your first building, PG, or residential flat.</p>
              </Link>

              {/* Step 2 */}
              <Link to="/properties" className={`flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl p-4 transition-all duration-300 ${stats?.total_units > 0 ? 'opacity-50 border-emerald-500/50' : stats?.total_properties === 0 ? 'opacity-30 cursor-not-allowed' : 'transform hover:-translate-y-1 shadow-lg border-slate-500'}`}>
                <div className="flex items-center gap-3 mb-2">
                  {stats?.total_units > 0 ? <FiCheckCircle className="text-emerald-400 w-5 h-5 flex-shrink-0" /> : <FiCircle className="text-slate-400 w-5 h-5 flex-shrink-0" />}
                  <span className="font-bold tracking-wide">2. Create Units</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-8">Define the individual rooms or flats inside your property.</p>
              </Link>

              {/* Step 3 */}
              <Link to="/properties" className={`flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl p-4 transition-all duration-300 ${stats?.occupied_units > 0 ? 'opacity-50 border-emerald-500/50' : stats?.total_units === 0 ? 'opacity-30 cursor-not-allowed' : 'transform hover:-translate-y-1 shadow-lg border-slate-500'}`}>
                <div className="flex items-center gap-3 mb-2">
                  {stats?.occupied_units > 0 ? <FiCheckCircle className="text-emerald-400 w-5 h-5 flex-shrink-0" /> : <FiCircle className="text-slate-400 w-5 h-5 flex-shrink-0" />}
                  <span className="font-bold tracking-wide">3. Add Tenants</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-8">Move people in, add deposits, and start tracking rent.</p>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TOP STATS GRID */}
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
        {statCards(stats).map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${card.iconBg} transition-colors`}>
                  <Icon className={`w-5 h-5 ${card.iconColor} transition-colors`} />
                </div>
                {card.sub && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${card.isAlert ? 'border-red-100 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'border-slate-100 bg-slate-50 text-slate-500'} transition-colors`}>
                    {card.sub}
                  </span>
                )}
              </div>
              <div>
                <p className={`text-2xl font-bold tracking-tight transition-colors ${card.textColor || 'text-slate-900 dark:text-white'}`}>{card.value}</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 transition-colors">{card.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* FINANCIAL SNAPSHOT */}
      <div className="w-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:p-6 flex flex-col transition-all">
        <div className="flex flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
              <FiCreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Collection Performance
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 ml-7">Target vs. Actual for this month</p>
          </div>
          <Link to="/payments" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-all">
            View Ledger
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6">
          <div className="flex flex-col">
            <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 transition-colors">Collected</p>
            <p className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors">{formatCurrency(financials.collected)}</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 transition-colors">Pending</p>
            <p className="text-xl md:text-2xl font-bold text-amber-500 dark:text-amber-400 transition-colors">{formatCurrency(financials.pending)}</p>
          </div>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2 transition-colors">
          <div
            className="h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-500"
            style={{ width: `${collectionRate}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs font-medium transition-colors text-slate-500 dark:text-slate-400">
          <span>Target: {formatCurrency(financials.total)}</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{collectionRate}% Achieved</span>
        </div>
      </div>

      {/* PROPERTIES OVERVIEW */}
      <div className="mt-6 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white transition-colors uppercase tracking-tight">Portfolio Analysis</h2>
          <Link to="/properties" className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-black uppercase tracking-widest transition-all group">
            All Properties <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {!stats?.properties?.length ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 p-8 text-center transition-colors">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white transition-colors">No properties yet</h3>
            <Link to="/properties" className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-2 inline-block hover:underline transition-colors">
              Add your first property
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {Object.entries(grouped).map(([type, list]) => (
              <div key={type}>
                <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 transition-colors">
                  {TYPE_LABELS[type] || type}
                  <div className="h-px bg-gray-200 dark:bg-slate-700 flex-1 transition-colors"></div>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                  {list.map((p) => {
                    const totalUnits = Number(p.total_units) || 0
                    const occupiedUnits = Number(p.occupied_units) || 0
                    const occupancyRate = totalUnits > 0
                      ? Math.round((occupiedUnits / totalUnits) * 100)
                      : 0

                    return (
                      <Link
                        key={p.id}
                        to={`/properties/${p.id}`}
                        className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
                      >
                        {/* DEEP MATURE COLOR HEAD */}
                        <div className={`p-5 border-b border-white/10 ${FRAME_BG[type]} flex-1 flex flex-col min-h-[140px]`}>
                          <div className="flex justify-between items-start w-full">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded border border-white/20 uppercase tracking-wide opacity-90 inline-block mb-3">
                              {type}
                            </span>
                          </div>
                          <h4 className="font-bold text-2xl leading-tight line-clamp-2 mt-auto mb-1" title={p.name}>
                            {p.name}
                          </h4>
                          <p className="text-xs font-medium opacity-75">
                            {totalUnits} Units Total
                          </p>
                        </div>

                        {/* SEGMENTED OCCUPANCY TRACKER */}
                        <div className="px-5 py-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/60">
                          <div className="flex justify-between items-center text-xs font-semibold mb-2.5 text-slate-500 dark:text-slate-400">
                            <span>Occupancy Rate</span>
                            <span className="text-slate-900 dark:text-white font-bold">{occupancyRate}%</span>
                          </div>
                          <div className="flex gap-1 h-2.5 w-full">
                            {Array.from({ length: 10 }).map((_, i) => {
                              const isActive = (i * 10) < occupancyRate
                              return (
                                <div
                                  key={i}
                                  className={`flex-1 rounded-sm transition-colors duration-300 ${isActive ? (ACTIVE_SEGMENT[type] || 'bg-slate-500') : 'bg-slate-100 dark:bg-slate-800'}`}
                                />
                              )
                            })}
                          </div>
                        </div>

                        {/* STATS FOOTER */}
                        <div className="grid grid-cols-2 pt-4 pb-5 px-5 bg-white dark:bg-slate-900 mt-auto">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">Active Tenants</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xl">{occupiedUnits}</span>
                          </div>
                          <div className="flex flex-col text-right border-l border-slate-100 dark:border-slate-800/60 pl-4">
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">Vacant Units</span>
                            <span className="font-bold text-amber-500 dark:text-amber-400 text-xl">{totalUnits - occupiedUnits}</span>
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