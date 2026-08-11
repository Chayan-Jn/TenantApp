import React from 'react'
import { Link } from 'react-router'
import { MdOutlineGavel, MdArrowForward } from 'react-icons/md'
import SEO from '../../components/seo/SEO.jsx'
import DisplayAd from '../../components/ui/DisplayAd.jsx'

export default function EvictionCosts() {
  return (
    <article className="relative w-full max-w-4xl mx-auto overflow-hidden px-4 sm:px-6">
      <SEO 
        title="The Economic Cost of Eviction | Real Estate Research"
        description="Sociological and real estate economic research detailing the true ROI breakdown of going to eviction court versus utilizing 'Cash-for-Keys' strategies."
        keywords="Cost of Eviction, Eviction Court Economics, Cash for Keys Strategy, Real Estate Economic Research, Landlord Eviction Alternatives"
        canonical="/research/eviction-costs"
      />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20" style={{ background: '#dc2626', filter: 'blur(80px)' }} />
      </div>

      <div className="text-center mb-16 pt-12">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-6 border border-red-200 dark:border-red-800/50">
          <MdOutlineGavel size={32} />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
          The Economic Cost of <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">Eviction</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          An ROI breakdown of eviction court versus "Cash-for-Keys" strategies, based on real estate economic and sociological research.
        </p>
      </div>

      <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl shadow-slate-200/20 dark:shadow-none prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold">Abstract & Academic Context</h2>
        <p>
          Eviction is often viewed simply as a legal mechanism to remove a non-paying tenant. However, real estate economists and sociologists have extensively documented the devastating financial friction inherent in the eviction process. Research proves that for the independent landlord, going to eviction court is almost always a net-negative financial event.
        </p>

        <h3 className="text-xl font-semibold mt-8">The Hidden Financial Friction</h3>
        <p>
          The true cost of an eviction extends far beyond court filing fees. When calculating the Net Operating Income (NOI) impact of an eviction, landlords must account for:
        </p>
        <ul>
          <li><strong>Attorney Fees and Court Costs:</strong> Depending on the jurisdiction, formal legal fees often exceed $1,500.</li>
          <li><strong>Protracted Vacancy Loss:</strong> The legal process typically takes 4 to 12 weeks. During this time, the unit generates zero revenue.</li>
          <li><strong>Physical Damage Risk:</strong> Sociological research indicates that a hostile eviction significantly increases the probability of retaliatory property damage, which can instantly wipe out a year's worth of cash flow.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8">The "Cash-for-Keys" Strategy</h3>
        <p>
          To mitigate these severe losses, economic game theory strongly supports the "Cash-for-Keys" strategy. By offering a non-paying tenant a lump sum (e.g., $1,000) to vacate the property immediately and leave it in broom-swept condition, the landlord fundamentally alters the financial outcome:
        </p>
        <p>
          <strong>The Court Route ROI:</strong> -$3,500 (3 months lost rent + $1,500 legal fees + potential damage). <br/>
          <strong>The Cash-for-Keys ROI:</strong> -$1,000 payout + 1 week turnaround time, allowing the unit to immediately generate revenue with a new tenant.
        </p>
        <p>
          While emotionally counterintuitive to "reward" a non-paying tenant, the mathematics of property management dictate that minimizing vacancy friction is always the superior financial decision.
        </p>

        <h3 className="text-xl font-semibold mt-12 border-t border-slate-200 dark:border-slate-700 pt-6">Academic References</h3>
        <ul className="text-sm text-slate-500 dark:text-slate-400 list-none pl-0">
          <li className="mb-2">1. Desmond, M. (2012). "Eviction and the Reproduction of Urban Poverty." <em>American Journal of Sociology</em>.</li>
          <li className="mb-2">2. Collinson, R., & Reed, D. (2018). "The Effects of Evictions on Low-Income Households." <em>New York University Law and Economics Research Paper</em>.</li>
        </ul>
      </section>

      <div className="text-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 border border-slate-800 shadow-2xl relative overflow-hidden group mb-12">
        <div className="absolute inset-0 bg-red-500/10 group-hover:bg-red-500/20 transition-colors duration-500"></div>
        <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Avoid evictions with better screening</h2>
        <p className="text-slate-400 text-sm mb-8 relative z-10">The best eviction is the one that never happens. Use MyTenant to meticulously track tenant payment history and intervene before a crisis occurs.</p>
        <Link 
          to="/register" 
          className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/25 active:scale-[0.98]"
        >
          Track Your Tenants <MdArrowForward />
        </Link>
      </div>

      <div className="flex justify-center mb-8">
        <DisplayAd className="max-w-4xl w-full" />
      </div>
    </article>
  )
}
