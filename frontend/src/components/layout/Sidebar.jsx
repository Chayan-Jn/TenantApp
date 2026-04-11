import { NavLink } from 'react-router'
import { 
  MdOutlineSpaceDashboard, 
  MdOutlineDomain, 
  MdOutlineWarningAmber, 
  MdOutlineCreditCard, 
  MdOutlineSettings,
  MdDomain 
} from 'react-icons/md'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: MdOutlineSpaceDashboard },
  { to: '/properties', label: 'Properties', icon: MdOutlineDomain },
  { to: '/rent/overdue', label: 'Overdue Rent', icon: MdOutlineWarningAmber },
  { to: '/payments', label: 'Payments', icon: MdOutlineCreditCard },
  { to: '/settings', label: 'Settings', icon: MdOutlineSettings }
]

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#1e293b] flex flex-col text-white">
      
      <div className="h-20 px-6 flex items-center gap-3">
        <div className="bg-[#0ea5e9] p-2.5 rounded-lg flex items-center justify-center">
          <MdDomain className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-wide text-white">TenantApp</h1>
      </div>
      

      <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#0ea5e9] text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
            
              <Icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}