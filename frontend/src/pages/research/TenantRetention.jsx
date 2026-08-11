import React from 'react'
import { Link } from 'react-router'
import { MdOutlineTrendingDown, MdArrowForward } from 'react-icons/md'
import SEO from '../../components/seo/SEO.jsx'
import DisplayAd from '../../components/ui/DisplayAd.jsx'

export default function TenantRetention() {
  return (
    <article className="relative w-full max-w-4xl mx-auto overflow-hidden px-4 sm:px-6">
      <SEO 
        title="The Vacancy Rate-Rent Paradox | Property Management Research"
        description="Explore NBER research on information frictions, tenant search behavior, and the true economic cost of vacancy versus rent stabilization."
        keywords="Vacancy Rate Rent Paradox, Tenant Retention Economics, Real Estate Information Friction, Landlord Economic Models, NBER Real Estate"
        canonical="/research/tenant-retention"
      />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20" style={{ background: '#f59e0b', filter: 'blur(80px)' }} />
      </div>

      <div className="text-center mb-16 pt-12">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-6 border border-amber-200 dark:border-amber-800/50">
          <MdOutlineTrendingDown size={32} />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
          The Vacancy Rate-Rent <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Paradox</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          An economic analysis of information friction, tenant search behavior, and why optimizing for retention usually beats optimizing for maximum market rent.
        </p>
      </div>

      <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl shadow-slate-200/20 dark:shadow-none prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold">Abstract & Academic Context</h2>
        <p>
          Research published by the National Bureau of Economic Research (NBER) frequently highlights a structural puzzle in real estate economics: the "Vacancy Rate-Rent Paradox." Traditional supply-and-demand models suggest rents should fall immediately when vacancies rise. However, landlords often exhibit "sticky" pricing behavior, preferring to hold units vacant rather than drop rents, driven by search frictions and asymmetric information.
        </p>

        <h3 className="text-xl font-semibold mt-8">The True Economic Cost of Turnover</h3>
        <p>
          Academic models demonstrate that landlords frequently underestimate the total economic loss associated with tenant turnover. The costs are not merely lost rent during the vacancy period, but include:
        </p>
        <ul>
          <li><strong>Turnover CapEx:</strong> Painting, deep cleaning, and minor repairs required to bring a lived-in unit back to "market ready" status.</li>
          <li><strong>Search and Frictional Costs:</strong> Marketing expenses, agent commissions, and the sheer time cost of conducting showings.</li>
          <li><strong>Risk Premiums:</strong> A known, paying tenant represents a known risk profile. A new tenant introduces adverse selection risk (the possibility of placing a problematic tenant).</li>
        </ul>
        <p>
          Mathematical models show that a 5% rent increase that causes a tenant to leave often results in a net negative Cash-on-Cash return for that specific unit over a 24-month horizon, compared to offering a 0% or 2% increase to retain a known, good tenant.
        </p>

        <h3 className="text-xl font-semibold mt-8">Mitigating Search Frictions</h3>
        <p>
          To mitigate these losses, institutional landlords rely heavily on <strong>predictive retention tracking</strong>. By tracking maintenance response times, payment promptness, and lease expiration dates in a centralized system, landlords can intervene 60-90 days before lease expiration to negotiate retention, effectively bypassing the expensive "search friction" phase altogether.
        </p>

        <h3 className="text-xl font-semibold mt-12 border-t border-slate-200 dark:border-slate-700 pt-6">Academic References</h3>
        <ul className="text-sm text-slate-500 dark:text-slate-400 list-none pl-0">
          <li className="mb-2">1. Genesove, D., & Han, L. (2012). "Search and Matching in the Housing Market." <em>National Bureau of Economic Research (NBER)</em>, Working Paper.</li>
          <li className="mb-2">2. Read, C. (1997). "The Vacancy-Rent Paradox in the Real Estate Market." <em>Journal of Real Estate Finance and Economics</em>.</li>
        </ul>
      </section>

      <div className="text-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 border border-slate-800 shadow-2xl relative overflow-hidden group mb-12">
        <div className="absolute inset-0 bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors duration-500"></div>
        <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Track leases & retain tenants</h2>
        <p className="text-slate-400 text-sm mb-8 relative z-10">Use MyTenant to automate lease expiration reminders and track tenant satisfaction so you never lose a good renter to an oversight.</p>
        <Link 
          to="/register" 
          className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25 active:scale-[0.98]"
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
