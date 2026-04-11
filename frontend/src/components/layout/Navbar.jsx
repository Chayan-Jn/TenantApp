import { useNavigate, useRouteLoaderData } from 'react-router'
import { logout } from '../../api/auth.api.js'
import { MdOutlineLogout } from 'react-icons/md'

export default function Navbar() {
  const navigate = useNavigate()
  const { data: owner } = useRouteLoaderData('root') || { data: {} }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch {
      navigate('/login')
    }
  }

  return (
    <header className="h-18 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
      

      <div className="flex items-center gap-1.5 select-none">
        <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">
          Management
        </h1>
        <span className="text-xl font-medium text-gray-400 tracking-tight uppercase">
          Portal
        </span>
      </div>


      <div className="flex items-center gap-6">

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-gray-900 leading-tight">
              {owner?.name || 'Admin'}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              @{owner?.username || 'user'}
            </span>
          </div>

          <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-base shadow-sm">
            {owner?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </div>

        <div className="h-8 w-px bg-gray-200"></div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:text-red-600 hover:border-red-200 hover:bg-red-50 hover:shadow-sm transition-all duration-200 hover:cursor-pointer"
        >
          <MdOutlineLogout className="w-5 h-5" />
          <span>Logout</span>
        </button>
        
      </div>
    </header>
  )
}