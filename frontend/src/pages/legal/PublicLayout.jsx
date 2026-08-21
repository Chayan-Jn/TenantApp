import { Link, Outlet, ScrollRestoration } from 'react-router'
import MegaFooter from '../../components/layout/MegaFooter.jsx'
import DirectoryLinks from '../../components/layout/DirectoryLinks.jsx'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f172a] flex flex-col" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Top nav bar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 min-h-[3.5rem] flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              My<span className="text-[#0ea5e9]">Tenant</span><span className="text-slate-400 font-normal">.me</span>
            </span>
          </Link>
          <nav className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link to="/features/rent-ledger" className="hover:text-slate-900 dark:hover:text-white transition-colors">Rent Ledger</Link>
            <Link to="/features/bill-splitting" className="hover:text-slate-900 dark:hover:text-white transition-colors">Bill Splitting</Link>
            <Link to="/features/tenant-tracking" className="hover:text-slate-900 dark:hover:text-white transition-colors">Tenants</Link>
            <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
            <Link to="/pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</Link>
            <Link to="/dashboard" className="px-4 py-1.5 bg-[#0ea5e9] text-white rounded-full hover:bg-[#0284c7] transition-colors">Open Live Demo</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
        <Outlet />
      </main>

      <DirectoryLinks />
      <MegaFooter />
      <ScrollRestoration />
    </div>
  )
}
