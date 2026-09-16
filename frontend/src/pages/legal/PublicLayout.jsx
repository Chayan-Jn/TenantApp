import { Link, Outlet, ScrollRestoration } from 'react-router'
import MegaFooter from '../../components/layout/MegaFooter.jsx'
import DirectoryLinks from '../../components/layout/DirectoryLinks.jsx'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f172a] flex flex-col" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Top Navigation Bar - Fulfills Google AdSense Clear Navigation Requirement */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 min-h-[4rem] flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0" aria-label="MyTenant Home">
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              My<span className="text-[#0ea5e9]">Tenant</span><span className="text-slate-400 font-normal">.me</span>
            </span>
          </Link>
          
          <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Link to="/features/rent-ledger" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
            <Link to="/tools/1031-exchange" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">1031 Calculator</Link>
            <Link to="/tools/cap-rate-calculator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cap Rate Tool</Link>
            <Link to="/insights" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <span>Insights & Research</span>
              <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>
            </Link>
            <Link to="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link>
            <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-1.5">
              Log In
            </Link>
            <Link to="/dashboard" className="px-4 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-blue-500/20 active:scale-95">
              Open Live Demo
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <DirectoryLinks />
      <MegaFooter />
      <ScrollRestoration />
    </div>
  )
}
