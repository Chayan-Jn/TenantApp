import React from 'react'
import { Link } from 'react-router'
import { MdEco, MdArrowForward } from 'react-icons/md'
import SEO from '../../components/seo/SEO.jsx'
import DisplayAd from '../../components/ui/DisplayAd.jsx'

export default function GreenPremiums() {
  return (
    <article className="relative w-full max-w-4xl mx-auto overflow-hidden px-4 sm:px-6">
      <SEO 
        title="The Low-Carbon Rent Premium | Real Estate Research"
        description="Academic research proves that sustainable building features mathematically increase rent ceilings and tenant retention. Learn how to capitalize on the green premium."
        keywords="Green Premium Real Estate, Sustainable Property Management, Low-Carbon Rent Premium, Real Estate Academic Research, Brändle 2026"
        canonical="/research/green-premiums"
      />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20" style={{ background: '#10b981', filter: 'blur(80px)' }} />
      </div>

      <div className="text-center mb-16 pt-12">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6 border border-emerald-200 dark:border-emerald-800/50">
          <MdEco size={32} />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
          The Low-Carbon <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Rent Premium</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          How sustainable building features mathematically increase rent ceilings and drive long-term tenant retention, backed by 2026 academic real estate data.
        </p>
      </div>

      <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl shadow-slate-200/20 dark:shadow-none prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold">Abstract & Academic Context</h2>
        <p>
          According to recent publications in the <em>Journal of Real Estate Research</em> (e.g., Brändle et al., 2026), the real estate market has observed a distinct pricing bifurcation based on environmental sustainability. This phenomenon, known as the "Green Premium," demonstrates that properties equipped with low-carbon or energy-efficient features command higher rental rates compared to non-certified baseline properties.
        </p>

        <h3 className="text-xl font-semibold mt-8">The Economic Drivers of the Green Premium</h3>
        <p>
          The rent premium is driven by two primary economic factors from the tenant's perspective:
        </p>
        <ul>
          <li><strong>Total Cost of Occupancy (TCO):</strong> Tenants are increasingly sophisticated in calculating TCO. A unit with smart thermostats, LED lighting, and high-efficiency HVAC systems promises significantly lower utility bills. Tenants are willing to absorb a higher base rent because their overall monthly cash outflow remains stable or decreases.</li>
          <li><strong>Pro-Environmental Behavior (PEB):</strong> Sociological studies within the real estate sector indicate a strong generational shift. Millennial and Gen-Z renters actively filter for properties that align with their environmental values, creating a supply-demand imbalance for sustainable units.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8">Actionable Strategy for Independent Landlords</h3>
        <p>
          You do not need a multi-million dollar LEED certification to capture the Green Premium. Independent landlords can achieve significant ROI through targeted retrofits:
        </p>
        <ol>
          <li><strong>Smart Climate Control:</strong> Installing smart thermostats (like Nest or Ecobee) is a low-CapEx improvement that visually signals "efficiency" during property tours.</li>
          <li><strong>Submetering & RUBS:</strong> Transitioning from "utilities included" to submetered billing forces consumption awareness, dropping overall building energy use by up to 15%.</li>
          <li><strong>Digital Operations:</strong> Moving to paperless property management (digital leases, online rent collection) reduces your operational carbon footprint, a feature you can market to prospective tenants.</li>
        </ol>

        <h3 className="text-xl font-semibold mt-12 border-t border-slate-200 dark:border-slate-700 pt-6">Academic References</h3>
        <ul className="text-sm text-slate-500 dark:text-slate-400 list-none pl-0">
          <li className="mb-2">1. Brändle, C., et al. (2026). "The Low-Carbon Rent Premium in Multifamily Housing." <em>Journal of Real Estate Research</em>.</li>
          <li className="mb-2">2. Eichholtz, P., Kok, N., & Quigley, J. M. (2010). "Doing Well by Doing Good? Green Office Buildings." <em>American Economic Review</em>.</li>
        </ul>
      </section>

      <div className="text-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 border border-slate-800 shadow-2xl relative overflow-hidden group mb-12">
        <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors duration-500"></div>
        <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Digitize your property operations</h2>
        <p className="text-slate-400 text-sm mb-8 relative z-10">Go 100% paperless with MyTenant's digital leases, automated ledgers, and online rent collection.</p>
        <Link 
          to="/register" 
          className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/25 active:scale-[0.98]"
        >
          Start Your Free Trial <MdArrowForward />
        </Link>
      </div>

      <div className="flex justify-center mb-8">
        <DisplayAd className="max-w-4xl w-full" />
      </div>
    </article>
  )
}
