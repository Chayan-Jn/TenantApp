import { useNavigate, useRouteLoaderData } from 'react-router'
import { logout } from '../../api/auth.api.js'

export default function Navbar() {
  const navigate = useNavigate()
  // useRouteLoaderData('root') gets data from the parent layout loader
  const { data: owner } = useRouteLoaderData('root')

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch {
      navigate('/login')
    }
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="font-medium text-gray-500 uppercase tracking-wider text-xs">
        Management Portal
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-gray-900">{owner?.name}</span>
          <span className="text-xs text-gray-500">@{owner?.username}</span>
        </div>
        <button 
          onClick={handleLogout}
          className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  )
}