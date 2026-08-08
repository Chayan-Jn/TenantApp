import { useRouteError, useNavigate, Link } from 'react-router'
import { FiHome, FiAlertTriangle } from 'react-icons/fi'

export default function GlobalError() {
  const error = useRouteError()
  const navigate = useNavigate()

  // Catch generic 404s
  const is404 = error?.status === 404 || error?.message?.includes('Not Found')

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 text-center flex flex-col items-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${is404 ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-red-100 dark:bg-red-900/30 text-red-500'}`}>
          <FiAlertTriangle className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          {is404 ? 'Page Not Found' : 'Something went wrong'}
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
          {is404 
            ? "We couldn't track down the page you were looking for. It might have been moved or deleted."
            : "An unexpected error occurred in the application. Our team has been notified."}
        </p>

        {/* If in dev mode and it's a real crash, show a snippet of the error to developers safely */}
        {!is404 && error?.message && import.meta.env.MODE !== 'production' && (
           <div className="w-full bg-slate-100 dark:bg-slate-950 rounded bg-opacity-50 p-3 text-left mb-6 overflow-x-auto text-xs font-mono text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
             {error.message}
           </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 rounded-lg transition-all"
          >
            Go Back
          </button>
          
          <Link
            to="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-lg transition-all"
          >
            <FiHome /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
