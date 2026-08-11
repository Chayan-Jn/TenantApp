import React from 'react'
import { Link } from 'react-router'
import { MdOutlineMap, MdArrowForward } from 'react-icons/md'
import SEO from '../../components/seo/SEO.jsx'
import DisplayAd from '../../components/ui/DisplayAd.jsx'

export default function RentDeterminants() {
  return (
    <article className="relative w-full max-w-4xl mx-auto overflow-hidden px-4 sm:px-6">
      <SEO 
        title="Hedonic Pricing Models for Apartment Rents | Research"
        description="Explore spatial and hedonic pricing models from the Journal of Real Estate Research to understand the exact determinants of multifamily apartment rents."
        keywords="Hedonic Pricing Real Estate, Rent Determinants, Spatial Modeling Property Management, Real Estate Economic Factors, Journal of Real Estate Research"
        canonical="/research/rent-determinants"
      />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20" style={{ background: '#8b5cf6', filter: 'blur(80px)' }} />
      </div>

      <div className="text-center mb-16 pt-12">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-200 dark:border-indigo-800/50">
          <MdOutlineMap size={32} />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
          Hedonic Pricing & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Rent Determinants</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          How academic spatial modeling and hedonic pricing regressions isolate the exact monetary value of amenities and location features on rent ceilings.
        </p>
      </div>

      <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl shadow-slate-200/20 dark:shadow-none prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold">Abstract & Academic Context</h2>
        <p>
          A foundational pillar of property valuation in the <em>Journal of Real Estate Research</em> (dating back to Sirmans et al.) is the application of Hedonic Pricing Models. These models deconstruct a property into its constituent characteristics—both internal amenities and external location factors—to statistically determine the exact premium a tenant is willing to pay for each individual feature.
        </p>

        <h3 className="text-xl font-semibold mt-8">Internal vs. External Determinants</h3>
        <p>
          Hedonic regression allows landlords to look past simple "comparables" and understand exactly where to deploy capital for the highest ROI:
        </p>
        <ul>
          <li><strong>Internal Amenities (The CapEx Factors):</strong> In-unit washers/dryers consistently rank as the highest-yielding internal upgrade, often generating enough rent premium to pay for the appliance installation within 12-14 months. Hardwood floors and modernized kitchens also provide high statistical significance in raising the rent ceiling.</li>
          <li><strong>External Factors (The Spatial Premium):</strong> Spatial modeling proves that proximity to public transit nodes, walkability to grocery anchors, and low local traffic density generate massive rent premiums. A unit situated exactly 0.25 miles from a transit hub commands statistically higher rent than an identical unit 0.75 miles away.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8">Applying the Data to Portfolio Strategy</h3>
        <p>
          For the independent landlord, understanding these determinants is crucial for underwriting new acquisitions. If a target property lacks an internal amenity that local spatial models deem highly valuable (like covered parking in a cold climate), the landlord can accurately underwrite the cost of adding that amenity against the statistically guaranteed increase in Net Operating Income (NOI).
        </p>
        <p>
          Furthermore, once the property is optimized and the rent ceiling achieved, maintaining that premium requires tight, professional digital management to prevent the "Vacancy Paradox" from wiping out the newly created yield.
        </p>

        <h3 className="text-xl font-semibold mt-12 border-t border-slate-200 dark:border-slate-700 pt-6">Academic References</h3>
        <ul className="text-sm text-slate-500 dark:text-slate-400 list-none pl-0">
          <li className="mb-2">1. Sirmans, G. S., Macpherson, D. A., & Zietz, E. N. (2005). "The Composition of Hedonic Pricing Models." <em>Journal of Real Estate Literature</em>.</li>
          <li className="mb-2">2. Frew, J., & Jud, G. D. (2003). "Estimating the Value of Apartment Buildings." <em>Journal of Real Estate Research</em>.</li>
        </ul>
      </section>

      <div className="text-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 border border-slate-800 shadow-2xl relative overflow-hidden group mb-12">
        <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors duration-500"></div>
        <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Manage your premium units like a pro</h2>
        <p className="text-slate-400 text-sm mb-8 relative z-10">If you're pushing market rents based on premium amenities, you need professional management tools to match. Use MyTenant's digital infrastructure.</p>
        <Link 
          to="/register" 
          className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/25 active:scale-[0.98]"
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
