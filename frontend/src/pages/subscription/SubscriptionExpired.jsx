import { Link } from 'react-router'
import { MdLockOutline, MdArrowForward } from 'react-icons/md'

export default function SubscriptionExpired() {
  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-[#0f172a] flex flex-col items-center justify-center p-4">

      {/* Card — matches the two-page book spread style */}
      <div className="w-full max-w-sm bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Top accent strip */}
        <div className="h-1 w-full bg-[#0ea5e9]" />

        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6">
            <MdLockOutline size={28} className="text-slate-500 dark:text-slate-400" />
          </div>

          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
            Trial Expired
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
            Your 7-day free trial has ended. Choose a plan to continue managing your properties without interruption.
          </p>

          <Link
            to="/pricing"
            className="w-full flex items-center justify-center gap-2 bg-[#0ea5e9] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#0284c7] active:scale-95 transition-all"
          >
            View Plans
            <MdArrowForward size={16} />
          </Link>
        </div>
      </div>

      <p className="mt-6 text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest font-medium text-center">
        Powered by Razorpay &nbsp;·&nbsp; Secure &nbsp;·&nbsp; No Refunds
      </p>
    </div>
  )
}
