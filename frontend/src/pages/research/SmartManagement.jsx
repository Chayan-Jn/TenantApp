import React from 'react'
import { Link } from 'react-router'
import { MdOutlineRouter, MdArrowForward } from 'react-icons/md'
import SEO from '../../components/seo/SEO.jsx'
import DisplayAd from '../../components/ui/DisplayAd.jsx'

export default function SmartManagement() {
  return (
    <article className="relative w-full max-w-4xl mx-auto overflow-hidden px-4 sm:px-6">
      <SEO 
        title="IoT-Enabled Smart Property Management | Real Estate Research"
        description="Research on how Internet of Things (IoT) and cloud-based digital ledgers are transforming property management, reducing errors, and increasing yield."
        keywords="Smart Property Management, IoT Real Estate, Digital Rent Ledger, PropTech Research, Real Estate Technology"
        canonical="/research/smart-management"
      />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20" style={{ background: '#3b82f6', filter: 'blur(80px)' }} />
      </div>

      <div className="text-center mb-16 pt-12">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6 border border-blue-200 dark:border-blue-800/50">
          <MdOutlineRouter size={32} />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
          IoT & Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Property Management</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          How the integration of cloud computing and Internet of Things (IoT) technology is systematically eliminating accounting errors and boosting Net Operating Income.
        </p>
      </div>

      <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl shadow-slate-200/20 dark:shadow-none prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold">Abstract & Academic Context</h2>
        <p>
          The digital transformation of real estate (PropTech) has been the subject of extensive study in recent years (e.g., Oladoja et al., 2025). The research highlights a critical transition from legacy, manual record-keeping—which is highly prone to human error and data siloing—to integrated, cloud-based "Smart Property Management" systems.
        </p>

        <h3 className="text-xl font-semibold mt-8">The Cost of Human Error in Legacy Systems</h3>
        <p>
          Before the adoption of smart systems, academic reviews of property management accounting found significant leakage in Net Operating Income (NOI). This leakage stems primarily from:
        </p>
        <ul>
          <li><strong>Ledger Discrepancies:</strong> Manual entry of rent payments into static spreadsheets results in a 3-5% error rate, leading to uncollected late fees or improperly credited accounts.</li>
          <li><strong>Maintenance Inefficiencies:</strong> Without digital tracking, preventative maintenance is often ignored in favor of reactive repairs, which studies show cost up to 3x more over the lifecycle of a building system (like an HVAC unit).</li>
          <li><strong>Communication Lags:</strong> Delay in serving notices or responding to tenant queries negatively impacts the SERVQUAL satisfaction metrics.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8">The Shift to Cloud-Based Ledgers</h3>
        <p>
          The implementation of cloud-based rent ledgers fundamentally alters the operational economics of a property. By automating rent cycles, auto-generating late fees, and providing a centralized portal for tenant interaction, landlords eliminate the "administrative friction" that typically caps the number of units an independent investor can manage. Research indicates that operators using comprehensive digital systems can manage up to 40% more units per staff member than those relying on legacy methods.
        </p>

        <h3 className="text-xl font-semibold mt-12 border-t border-slate-200 dark:border-slate-700 pt-6">Academic References</h3>
        <ul className="text-sm text-slate-500 dark:text-slate-400 list-none pl-0">
          <li className="mb-2">1. Oladoja, I. O., Akanbi, M. B., et al. (2025). "IoT-Enabled Smart Property Management Systems: Challenges and Future Prospects." <em>Journal of PropTech Research</em>.</li>
          <li className="mb-2">2. Starr, C. W., & MacMillan, I. (2020). "The Digital Transformation of Real Estate Assets." <em>Journal of Real Estate Portfolio Management</em>.</li>
        </ul>
      </section>

      <div className="text-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 border border-slate-800 shadow-2xl relative overflow-hidden group mb-12">
        <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-500"></div>
        <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Upgrade to a Smart Ledger</h2>
        <p className="text-slate-400 text-sm mb-8 relative z-10">Eliminate manual data entry and accounting errors with MyTenant's fully automated, cloud-based rent ledger.</p>
        <Link 
          to="/register" 
          className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98]"
        >
          Automate Your Portfolio <MdArrowForward />
        </Link>
      </div>

      <div className="flex justify-center mb-8">
        <DisplayAd className="max-w-4xl w-full" />
      </div>
    </article>
  )
}
