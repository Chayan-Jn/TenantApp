import { useState } from 'react'
import { MdCheck, MdArrowForward } from 'react-icons/md'
import { createSubscription, verifyPayment } from '../../api/subscription.api.js'
import { loadRazorpay } from '../../utils/razorpay.js'

const features = [
  'Unlimited Properties & Units',
  'Automated Rent Ledgers',
  'Bill & Document Management',
  'Export PDF Reports',
]

export default function PricingPage() {
  const [billing, setBilling] = useState('annual')
  const [processingPlan, setProcessingPlan] = useState(null)

  const handleSubscribe = async (planId, e) => {
    e.stopPropagation()
    try {
      setProcessingPlan(planId)
      const isLoaded = await loadRazorpay()
      if (!isLoaded) return alert('Failed to load payment gateway.')
      const res = await createSubscription(planId)
      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: (billing === 'monthly' ? 199 : 1199) * 100,
        currency: 'INR',
        name: 'MyTenant',
        description: 'App Subscription',
        order_id: res.data.id,
        handler: async (response) => {
          try {
            setProcessingPlan(planId);
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: planId
            });
            window.location.reload();
          } catch (err) {
            alert('Verification failed. Contact support.');
            setProcessingPlan(null);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessingPlan(null);
          }
        },
        theme: { color: '#F5A623' },
      })
      rzp.on('payment.failed', function (response) {
        alert(response.error.description || 'Payment failed');
        setProcessingPlan(null);
      });
      rzp.open()
    } catch (err) {
      alert(err.message || 'Something went wrong.')
    } finally {
      // Don't reset processingPlan here because the modal is open, we do it ondismiss or verified
    }
  }

  return (
    <div
      className="relative flex flex-col items-center px-4 py-8 w-full max-w-4xl mx-auto overflow-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Gradient blobs behind everything so glassmorphism has something to catch */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-30" style={{ background: '#F5A623', filter: 'blur(80px)' }} />
        <div className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full opacity-20" style={{ background: '#FADF63', filter: 'blur(70px)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 rounded-full opacity-10" style={{ background: '#F5A623', filter: 'blur(60px)' }} />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Pricing</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-7">Simple, honest pricing. No hidden fees.</p>

      {/* Toggle */}
      <div className="flex items-center rounded-full p-1 mb-10 gap-1" style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.6)' }}>
        {['monthly', 'annual'].map(b => (
          <button
            key={b}
            onClick={() => setBilling(b)}
            className="px-5 py-1.5 rounded-full text-xs font-bold transition-all capitalize"
            style={billing === b
              ? { background: '#000', color: '#fff', cursor: 'pointer' }
              : { background: 'transparent', color: '#64748b', cursor: 'pointer' }
            }
          >
            {b === 'annual' ? 'Annual' : 'Monthly'}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl items-end">

        {/* ── Monthly — Light Glass ── */}
        <div
          onClick={() => setBilling('monthly')}
          className="relative rounded-3xl p-7 flex flex-col cursor-pointer transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: billing === 'monthly' ? '3px solid #111' : '3px solid rgba(0,0,0,0.10)',
            boxShadow: billing === 'monthly'
              ? '0 12px 40px -8px rgba(0,0,0,0.2)'
              : '0 4px 16px rgba(0,0,0,0.06)',
          }}
        >
          {billing === 'monthly' && (
            <div className="absolute -top-3.5 left-5">
              <span className="bg-black text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Selected
              </span>
            </div>
          )}

          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-5">Monthly</p>

          <div className="mb-1 flex items-baseline gap-1">
            <span className="text-5xl font-bold text-slate-900 tracking-tight">₹199</span>
            <span className="text-sm text-slate-400 ml-1">/ month</span>
          </div>
          <p className="text-[11px] text-slate-400 italic mb-7">Billed every 30 days</p>

          <ul className="space-y-3 mb-8 flex-1">
            {features.map(f => (
              <li key={f} className="flex items-center gap-3 text-[13px] text-slate-700">
                <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                  <MdCheck size={12} className="text-white" />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <button
            disabled={!!processingPlan}
            onClick={e => handleSubscribe('plan_monthly', e)}
            className="w-full py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-95"
            style={{ border: '2.5px solid #111', color: '#111', background: 'transparent', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {processingPlan === 'plan_monthly' ? 'Please wait…' : 'Choose Monthly'}
          </button>
        </div>

        {/* ── Annual — Dark Glass ── */}
        <div
          onClick={() => setBilling('annual')}
          className="relative rounded-3xl p-7 flex flex-col cursor-pointer transition-all duration-300 sm:-translate-y-2.5"
          style={{
            background: 'rgba(0,0,0,0.78)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: billing === 'annual' ? '3px solid rgba(255,255,255,0.55)' : '3px solid rgba(255,255,255,0.12)',
            boxShadow: billing === 'annual'
              ? '0 24px 60px -12px rgba(0,0,0,0.55)'
              : '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          {/* Gloss top shimmer */}
          <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />

          <div className="absolute -top-3.5 right-5">
            <span className="text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wide" style={{ background: '#F5A623', color: '#000' }}>
              Best Value
            </span>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: '#F5A623' }}>Annual</p>

          <div className="mb-1 flex items-baseline gap-1">
            <span className="text-5xl font-bold text-white tracking-tight">₹1,199</span>
            <span className="text-sm text-slate-400 ml-1">/ year</span>
          </div>
          <p className="text-[11px] italic mb-7 text-slate-400">
            Just &nbsp; <strong className="not-italic text-white">₹99/mo</strong> - half the monthly rate
          </p>

          <ul className="space-y-3 mb-8 flex-1">
            {features.map(f => (
              <li key={f} className="flex items-center gap-3 text-[13px] text-slate-200">
                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F5A623' }}>
                  <MdCheck size={12} style={{ color: '#000' }} />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <button
            disabled={!!processingPlan}
            onClick={e => handleSubscribe('plan_annual', e)}
            className="w-full py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ background: '#fff', color: '#000', border: '2.5px solid rgba(255,255,255,0.4)', cursor: 'pointer' }}
          >
            {processingPlan === 'plan_annual' ? 'Please wait…' : 'Choose Annual'}
            <MdArrowForward size={15} />
          </button>
        </div>
      </div>

      {/* Legal links — required by Razorpay near payment */}
      <div className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-1.5">
        {[['Terms of Service', '/terms'], ['Refund Policy', '/refund-policy'], ['Privacy Policy', '/privacy-policy'], ['Contact', '/contact']].map(([label, to]) => (
          <a key={to} href={to} className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors underline-offset-2 hover:underline">{label}</a>
        ))}
      </div>
      <p className="mt-4 text-[9px] uppercase tracking-widest text-slate-400 italic">
        Powered by Razorpay &nbsp;·&nbsp; Secure &nbsp;·&nbsp; No Refunds
      </p>
    </div>
  )
}
