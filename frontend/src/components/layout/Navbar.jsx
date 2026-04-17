import { useNavigate, useRouteLoaderData } from 'react-router'
import { logout } from '../../api/auth.api.js'
import { MdOutlineLogout, MdDarkMode, MdLightMode } from 'react-icons/md'
import { useTheme } from '../../context/ThemeContext.jsx'

export default function Navbar() {
  const navigate = useNavigate()
  const { data: owner } = useRouteLoaderData('root') || { data: {} }
  const { isDark, toggleTheme } = useTheme()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch {
      navigate('/login')
    }
  }

  return (
    <header className="h-18 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-8 sticky top-0 z-30 transition-colors duration-200">

      <div className="flex items-center gap-1.5 select-none">
        <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase transition-colors">
          Management
        </h1>
        <span className="text-xl font-medium text-gray-400 dark:text-slate-500 tracking-tight uppercase transition-colors">
          Portal
        </span>
      </div>

      <div className="flex items-center gap-4">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600 transition-all duration-200 cursor-pointer flex items-center justify-center group shadow-sm"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark
            ? <MdLightMode size={19} className="text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
            : <MdDarkMode size={19} className="text-blue-600 group-hover:-rotate-12 transition-transform duration-300" />
          }
        </button>

        <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 transition-colors" />

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right max-w-[120px]">
            <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight transition-colors truncate" title={owner?.name || 'Admin'}>
              {owner?.name || 'Admin'}
            </span>
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors truncate">
              @{owner?.username || 'user'}
            </span>
          </div>

          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-base shadow-sm transition-colors">
            {owner?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </div>

        <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 transition-colors" />

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-sm transition-all duration-200 hover:cursor-pointer"
        >
          <MdOutlineLogout className="w-5 h-5" />
          <span>Logout</span>
        </button>
        
      </div>
    </header>
  )
}