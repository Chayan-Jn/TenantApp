import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  MdOutlineCardMembership,
  MdArrowForward,
  MdOutlineErrorOutline,
  MdCheck,
  MdOutlineCalendarToday,
  MdOutlineAutorenew,
  MdOutlineRocketLaunch,
} from 'react-icons/md'
import { getSubscriptionStatus } from '../../api/subscription.api.js'

const PLAN_FEATURES = [
  'Unlimited Properties & Units',
  'Automated Rent Ledgers',
  'Bill & Document Management',
  'Export PDF Reports',
]

export default function SubscriptionPage() {
  const { data: res, isLoading, isError } = useQuery({
    queryKey: ['subscriptionStatus'],
    queryFn: getSubscriptionStatus,
  })

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin h-9 w-9 border-[3px] border-slate-300 border-t-slate-800 dark:border-slate-600 dark:border-t-white rounded-full" />
      </div>
    )
  }

  if (isError || !res?.data) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-5">
          <MdOutlineErrorOutline size={28} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Could not load subscription</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">There was a problem fetching your billing details.</p>
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-full hover:opacity-80 transition-all"
        >
          View Pricing <MdArrowForward size={15} />
        </Link>
      </div>
    )
  }

  const { plan, status, endDate } = res.data

  const isTrial   = status === 'trial'
  const isExpired = status === 'expired' || status === 'cancelled' || (isTrial && !endDate)
  const isActive  = status === 'active' || (isTrial && !!endDate)

  const planLabel = plan ? plan.replace('plan_', '') : 'Free'
  const displayStatus = isTrial && !endDate ? 'expired' : status

  const endLine = endDate
    ? new Date(endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  // Derived message under plan name
  let statusMessage
  if (isActive) {
    statusMessage = endLine
      ? { text: `Active until ${endLine}`, color: 'text-emerald-600 dark:text-emerald-400' }
      : { text: 'No expiry · Lifetime access', color: 'text-emerald-600 dark:text-emerald-400' }
  } else if (isTrial && !endDate) {
    statusMessage = { text: 'Your free trial has expired. Upgrade to keep full access.', color: 'text-red-500 dark:text-red-400' }
  } else if (endLine) {
    statusMessage = { text: `Expired on ${endLine}`, color: 'text-red-500 dark:text-red-400' }
  } else {
    statusMessage = { text: 'No active subscription', color: 'text-slate-400 dark:text-slate-500' }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Subscription</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your plan and billing.</p>
      </div>

      {/* ── Hero status card ── */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: isActive
            ? 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)'
            : 'linear-gradient(135deg, #1a1a1a 0%, #2d1515 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-20 pointer-events-none"
          style={{ background: isActive ? '#38bdf8' : '#f87171', filter: 'blur(60px)' }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10 pointer-events-none"
          style={{ background: isActive ? '#818cf8' : '#fb923c', filter: 'blur(50px)' }}
        />
        {/* Top shimmer line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: isActive
            ? 'linear-gradient(90deg, transparent, rgba(56,189,248,0.5), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(248,113,113,0.4), transparent)'
          }}
        />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: isActive ? 'rgba(56,189,248,0.15)' : 'rgba(248,113,113,0.12)',
              border: isActive ? '1px solid rgba(56,189,248,0.25)' : '1px solid rgba(248,113,113,0.2)',
            }}
          >
            <MdOutlineCardMembership size={32} style={{ color: isActive ? '#38bdf8' : '#f87171' }} />
          </div>

          {/* Plan info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Current Plan</p>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                style={{
                  background: isActive ? 'rgba(52,211,153,0.18)' : 'rgba(248,113,113,0.18)',
                  color: isActive ? '#6ee7b7' : '#fca5a5',
                  border: isActive ? '1px solid rgba(52,211,153,0.25)' : '1px solid rgba(248,113,113,0.2)',
                }}
              >
                {displayStatus}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white capitalize tracking-tight leading-tight">
              {planLabel} Plan
            </h2>
            <p className={`text-sm mt-1.5 font-medium ${statusMessage.color}`}>{statusMessage.text}</p>
          </div>
        </div>

        {/* ── CTA strip inside card ── */}
        <div
          className="relative z-10 px-6 sm:px-8 pb-6 sm:pb-8"
        >
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all active:scale-95"
            style={
              isExpired
                ? { background: '#f87171', color: '#fff' }
                : { background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.18)' }
            }
            onMouseEnter={e => {
              if (!isExpired) e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
            }}
            onMouseLeave={e => {
              if (!isExpired) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
            }}
          >
            {isExpired ? (
              <><MdOutlineRocketLaunch size={16} /> Upgrade Now</>
            ) : (
              <><MdOutlineAutorenew size={16} /> Explore Plans</>
            )}
            <MdArrowForward size={15} />
          </Link>
        </div>
      </div>

      {/* ── What's included ── */}
      <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-7">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">What's included</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PLAN_FEATURES.map(f => (
            <li key={f} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                <MdCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Renewal / Expiry detail row ── */}
      {endLine && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
          <MdOutlineCalendarToday size={18} className="text-slate-400 flex-shrink-0" />
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {isActive ? 'Renews / Expires' : 'Expired on'}
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{endLine}</p>
          </div>
        </div>
      )}

      {/* Footer note */}
      <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest pt-1">
        Powered by Razorpay &nbsp;·&nbsp; Secure &nbsp;·&nbsp; Cancel Anytime
      </p>

    </div>
  )
}
