import { Link, Outlet } from 'react-router'

export default function LegalLayout() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f172a]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Top nav bar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 min-h-[3.5rem] flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link to="/login" className="flex items-center gap-2 group flex-shrink-0">
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              My<span className="text-[#0ea5e9]">Tenant</span><span className="text-slate-400 font-normal">.me</span>
            </span>
          </Link>
          <nav className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link to="/privacy-policy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</Link>
            <Link to="/refund-policy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Refunds</Link>
            <Link to="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-xs text-slate-400 text-center sm:text-left">© {new Date().getFullYear()} MyTenant. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
            <Link to="/privacy-policy" className="hover:text-slate-700 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-700 dark:hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/refund-policy" className="hover:text-slate-700 dark:hover:text-white transition-colors">Refund Policy</Link>
            <Link to="/contact" className="hover:text-slate-700 dark:hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
