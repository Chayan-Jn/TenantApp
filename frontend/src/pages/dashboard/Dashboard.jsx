import { useLoaderData, Link } from 'react-router'
import { 
  MdOutlineDomain, 
  MdOutlineMeetingRoom, 
  MdOutlinePeopleAlt, 
  MdOutlineKey, 
  MdOutlineWarningAmber,
  MdArrowRightAlt
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
  { label: 'Total Properties', value: stats?.total_properties, icon: MdOutlineDomain, iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
  { label: 'Total Units', value: stats?.total_units, icon: MdOutlineMeetingRoom, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-100' },
  { label: 'Occupied', value: stats?.occupied_units, icon: MdOutlinePeopleAlt, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100' },
  { label: 'Vacant', value: stats?.vacant_units, icon: MdOutlineKey, iconColor: 'text-amber-600', iconBg: 'bg-amber-100' },
  { 
    label: 'Overdue Rent', 
    value: stats?.overdue_count, 
    icon: MdOutlineWarningAmber, 
    sub: stats?.overdue_count > 0 ? 'Needs Attention' : null,
    iconColor: stats?.overdue_count > 0 ? 'text-red-600' : 'text-gray-400',
    iconBg: stats?.overdue_count > 0 ? 'bg-red-100' : 'bg-gray-100',
    textColor: stats?.overdue_count > 0 ? 'text-red-600' : 'text-gray-900'
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
    <div className="flex flex-col gap-6 pb-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Here is what's happening with your properties today.</p>
      </div>

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
                <p className={`text-2xl font-extrabold ${card.textColor || 'text-gray-900'}`}>{card.value ?? '-'}</p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">{card.label}</p>
              </div>
            </div>
          )
        })}
      </div>

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
                  {TYPE_LABELS[type]}
                  <div className="h-px bg-gray-200 flex-1"></div>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {list.map((p) => {
                    const occupancyRate = p.total_units > 0 
                      ? Math.round((p.occupied_units / p.total_units) * 100) 
                      : 0

                    return (
                      <Link
                        key={p.id}
                        to={`/properties/${p.id}`}
                        className="group bg-white p-4 pb-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                      >
                        <div className={`rounded-xl border p-5 mb-4 ${FRAME_BG[type]} transition-colors flex-1`}>
                          <div className="flex items-start justify-between mb-5">
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{p.name}</h4>
                              <p className="text-sm text-gray-500 font-medium mt-1">{p.total_units} total units</p>
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1.5 rounded-md uppercase tracking-wider ${TYPE_COLORS[type]}`}>
                              {type}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-semibold text-gray-600">Occupancy</span>
                            <span className="font-bold text-gray-900">{occupancyRate}%</span>
                          </div>
                          <div className="w-full bg-black/5 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ease-out ${PROGRESS_COLORS[type]}`}
                              style={{ width: `${occupancyRate}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center px-2">
                          <div className="flex flex-col">
                            <span className="text-xs uppercase font-bold text-gray-400 mb-1">Occupied</span>
                            <span className="font-bold text-emerald-600 text-lg">{p.occupied_units}</span>
                          </div>
                          <div className="h-8 w-px bg-gray-200"></div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs uppercase font-bold text-gray-400 mb-1">Vacant</span>
                            <span className="font-bold text-amber-500 text-lg">
                              {parseInt(p.total_units) - parseInt(p.occupied_units)}
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