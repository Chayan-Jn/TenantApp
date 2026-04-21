import { Link } from 'react-router'
import { MdOutlineTimer, MdArrowForward } from 'react-icons/md'

/**
 * Trial/expired status banner shown at the top of the layout.
 * @param {string} status - 'trial' | 'expired'
 * @param {number} daysLeft - Days remaining in trial
 */
export default function TrialBanner({ status, daysLeft }) {
  if (status !== 'trial' && status !== 'expired') return null

  const isExpired = status === 'expired' || daysLeft <= 0

  return (
    <div className={`w-full flex items-center justify-between gap-4 px-4 sm:px-6 py-2 text-xs font-medium ${
      isExpired
        ? 'bg-red-600 text-white'
        : 'bg-[#1e293b] text-slate-300 border-b border-slate-700'
    }`}>
      <div className="flex items-center gap-2">
        <MdOutlineTimer size={16} className={isExpired ? 'animate-pulse text-white' : 'text-[#0ea5e9]'} />
        <span>
          {isExpired
            ? 'Your free trial has expired. Subscribe to keep access to your properties.'
            : `Free trial — ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} remaining.`}
        </span>
      </div>
      <Link
        to="/pricing"
        className={`flex items-center gap-1.5 whitespace-nowrap font-bold px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider transition-all ${
          isExpired
            ? 'bg-white text-red-600 hover:bg-red-50'
            : 'bg-[#0ea5e9] text-white hover:bg-[#0284c7]'
        }`}
      >
        {isExpired ? 'Choose a Plan' : 'Upgrade'}
        <MdArrowForward size={12} />
      </Link>
    </div>
  )
}
