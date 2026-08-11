import React from 'react'
import { Link } from 'react-router'
import { MdOutlineWaterDrop, MdArrowForward } from 'react-icons/md'
import SEO from '../../components/seo/SEO.jsx'
import DisplayAd from '../../components/ui/DisplayAd.jsx'

export default function UtilityBilling() {
  return (
    <article className="relative w-full max-w-4xl mx-auto overflow-hidden px-4 sm:px-6">
      <SEO 
        title="RUBS vs Submetering: The Split Incentive Problem | Research"
        description="Explore the academic debate between Ratio Utility Billing Systems (RUBS) and direct submetering, and how landlords solve the energy split incentive problem."
        keywords="Ratio Utility Billing System RUBS, Split Incentive Problem Real Estate, Submetering vs RUBS, Property Management Energy Conservation"
        canonical="/research/utility-billing"
      />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20" style={{ background: '#06b6d4', filter: 'blur(80px)' }} />
      </div>

      <div className="text-center mb-16 pt-12">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 mb-6 border border-cyan-200 dark:border-cyan-800/50">
          <MdOutlineWaterDrop size={32} />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
          RUBS, Submetering, and the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Split Incentive</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          How property managers solve the "split incentive" problem to drive building conservation, recover utility costs, and increase Net Operating Income.
        </p>
      </div>

      <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl shadow-slate-200/20 dark:shadow-none prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold">Abstract & Academic Context</h2>
        <p>
          In multi-tenant residential real estate, the "Split Incentive Problem" occurs when the landlord pays the utility bills but the tenant controls the thermostat and water usage. Because the tenant experiences no financial consequence for overuse, building energy consumption skyrockets. Academic energy conservation research focuses heavily on two billing interventions used to solve this: Direct Submetering and the Ratio Utility Billing System (RUBS).
        </p>

        <h3 className="text-xl font-semibold mt-8">Direct Submetering: The Conservation Gold Standard</h3>
        <p>
          Research consistently highlights that individual submetering is the most effective way to drive conservation. When tenants are billed strictly on measured consumption, they have a direct, mathematical incentive to change their behavior. Submetering typically drops overall building consumption by 15% to 25%. However, the capital expenditure (CapEx) required to retrofit an older building with submeters is often prohibitive (averaging $1,500 to $2,000 per unit).
        </p>

        <h3 className="text-xl font-semibold mt-8">RUBS and the Intention-Action Gap</h3>
        <p>
          When submetering is impossible, landlords turn to RUBS, allocating the master bill across units based on square footage or occupancy. While RUBS effectively achieves the landlord's goal of cost recovery (drastically improving NOI), its effect on conservation is highly debated in behavioral economics.
        </p>
        <p>
          Because RUBS relies on a shared formula rather than direct usage, an individual tenant who actively conserves energy will only see a marginal decrease in their bill, as their savings are diluted by wasteful neighbors. This creates an "intention-action gap."
        </p>
        <p>
          To counteract this, researchers recommend pairing RUBS with heavy "behavioral nudges," strict transparency in the billing formula, and automated tenant ledgers so residents can clearly anticipate and track their monthly utility burdens alongside rent.
        </p>

        <h3 className="text-xl font-semibold mt-12 border-t border-slate-200 dark:border-slate-700 pt-6">Academic References</h3>
        <ul className="text-sm text-slate-500 dark:text-slate-400 list-none pl-0">
          <li className="mb-2">1. Maruejols, L., & Young, D. (2011). "Split Incentives and Energy Efficiency in Canadian Multi-Family Dwellings." <em>Energy Policy</em>.</li>
          <li className="mb-2">2. Bird, S., & Hernández, D. (2012). "Policy Options for the Split Incentive: Increasing Energy Efficiency for Low-Income Renters." <em>Energy Policy</em>.</li>
        </ul>
      </section>

      <div className="text-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 border border-slate-800 shadow-2xl relative overflow-hidden group mb-12">
        <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors duration-500"></div>
        <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Simplify Utility Bill Splitting</h2>
        <p className="text-slate-400 text-sm mb-8 relative z-10">Whether you use RUBS or direct submetering, use MyTenant to automatically split utility bills and add them directly to the tenant's ledger.</p>
        <Link 
          to="/register" 
          className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-600/25 active:scale-[0.98]"
        >
          Automate Utility Billing <MdArrowForward />
        </Link>
      </div>

      <div className="flex justify-center mb-8">
        <DisplayAd className="max-w-4xl w-full" />
      </div>
    </article>
  )
}
