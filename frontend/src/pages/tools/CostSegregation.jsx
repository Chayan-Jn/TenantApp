import React, { useState } from 'react'
import { Link } from 'react-router'
import SEO from '../../components/seo/SEO.jsx'
import { MdOutlineAccountBalance, MdArrowForward } from 'react-icons/md'

export default function CostSegregation() {
  const [purchasePrice, setPurchasePrice] = useState('1000000')
  const [landValuePercentage, setLandValuePercentage] = useState('20')
  const [results, setResults] = useState(null)

  const handleCalculate = () => {
    const pPrice = parseFloat(purchasePrice) || 0
    const landPct = parseFloat(landValuePercentage) || 0

    // Math logic based on standard Cost Segregation estimates
    const buildingValue = pPrice * (1 - (landPct / 100))
    
    // Standard Straight Line (27.5 years)
    const straightLineDepreciation = buildingValue / 27.5

    // Estimated Cost Segregation Reallocation (Averages)
    // Roughly 20% of building value can typically be moved to 5-year and 15-year property
    const acceleratedBasis = buildingValue * 0.20
    const remainingBasis = buildingValue * 0.80

    // Year 1 Accelerated (Assuming 100% bonus depreciation for illustration, though it phases down to 60% in 2024/2025. We will use a blended aggressive model for the calculator to show potential).
    // For educational purposes, let's assume they take 60% bonus depreciation on the accelerated basis.
    const bonusDepreciation = acceleratedBasis * 0.60
    const standardAccelerated = (acceleratedBasis * 0.40) / 5 // the rest over 5 years
    
    const year1AcceleratedDepreciation = bonusDepreciation + standardAccelerated + (remainingBasis / 27.5)
    
    const taxSavings = (year1AcceleratedDepreciation - straightLineDepreciation) * 0.37 // Assuming top tax bracket 37%

    setResults({
      straightLine: straightLineDepreciation,
      accelerated: year1AcceleratedDepreciation,
      savings: taxSavings
    })
  }

  return (
    <article className="relative w-full max-w-3xl mx-auto overflow-hidden">
      <SEO 
        title="Cost Segregation & Accelerated Depreciation Calculator | MyTenant Tools"
        description="Estimate your Year 1 tax savings by using a cost segregation study to accelerate real estate depreciation via MACRS."
        keywords="Cost Segregation Calculator, Real Estate Accelerated Depreciation, MACRS Tax Calculator, Real Estate Tax Savings, Landlord Tax Tools"
        canonical="/tools/cost-segregation"
      />

      <div className="text-center mb-12 pt-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 mb-6 border border-sky-200 dark:border-sky-800/50">
          <MdOutlineAccountBalance size={32} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
          Cost Segregation Estimator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Calculate how much you can legally wipe out your Year 1 tax liability by accelerating property depreciation.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-10 shadow-xl mb-12 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="grid sm:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Property Purchase Price ($)</label>
            <input 
              type="number" 
              value={purchasePrice}
              onChange={e => setPurchasePrice(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-sky-500 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Estimated Land Value (%)</label>
            <div className="relative">
              <input 
                type="number" 
                value={landValuePercentage}
                onChange={e => setLandValuePercentage(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-sky-500 text-slate-900 dark:text-white pr-8"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Land cannot be depreciated. Typically 20% - 30% of purchase price.</p>
          </div>
        </div>

        <button 
          onClick={handleCalculate}
          className="w-full mb-8 py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-sky-600/25 active:scale-[0.98]"
        >
          Estimate Tax Savings
        </button>

        {results && (
          <div className="grid sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Standard Straight-Line (Yr 1)</p>
              <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">
                ${results.straightLine.toLocaleString(undefined, {maximumFractionDigits: 0})}
              </p>
            </div>
            <div className="p-6 bg-sky-50 dark:bg-sky-900/20 rounded-2xl border border-sky-200 dark:border-sky-800/30 text-center ring-1 ring-sky-500/50">
              <p className="text-xs text-sky-600 dark:text-sky-400 mb-2 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
                <MdOutlineAccountBalance /> Cost Segregation (Yr 1)
              </p>
              <p className="text-4xl font-bold text-sky-600 dark:text-sky-400">
                ${results.accelerated.toLocaleString(undefined, {maximumFractionDigits: 0})}
              </p>
            </div>
            <div className="sm:col-span-2 p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-800 text-center shadow-xl">
              <p className="text-sm text-slate-400 mb-1">Estimated Tax Liability Shielded</p>
              <p className="text-4xl font-bold text-white mb-2">
                +${results.savings.toLocaleString(undefined, {maximumFractionDigits: 0})}
              </p>
              <p className="text-xs text-slate-500">
                Assumes a 37% top marginal tax bracket.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="text-center bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl mb-16">
        <h2 className="text-xl font-bold text-white mb-4">Want pristine ledgers for your CPA?</h2>
        <p className="text-slate-400 text-sm mb-6">A cost segregation study requires meticulous financial records. Use MyTenant to automate your rent rolls and expense ledgers instantly.</p>
        <Link 
          to="/register" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#0ea5e9]/25"
        >
          Automate Accounting <MdArrowForward />
        </Link>
      </div>

      <section className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700 shadow-sm mb-16">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4 mb-8">
            Advanced Tax Strategy: Understanding Cost Segregation
          </h2>
          
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Most independent landlords rely on standard <strong>straight-line depreciation</strong>, which writes off the value of a residential property evenly over 27.5 years. While this provides a steady tax shield, it ignores the physical reality that components of the building degrade much faster than the structure itself.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white">What is MACRS?</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            The IRS established the <strong>Modified Accelerated Cost Recovery System (MACRS)</strong> to allow taxpayers to recover the capitalized cost of tangible property over shorter, specified lifespans. 
          </p>
          <ul className="list-disc pl-6 space-y-3 text-slate-600 dark:text-slate-300 mb-8">
            <li><strong>5-Year Property:</strong> Carpeting, specialized lighting, appliances, window treatments.</li>
            <li><strong>15-Year Property:</strong> Land improvements, fencing, dedicated parking lots.</li>
            <li><strong>27.5-Year Property:</strong> The core structural building (roof, framing, foundation).</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white">The Cost Segregation Study</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            A Cost Segregation Study is an engineering and accounting analysis that reclassifies elements of your property from the 27.5-year bucket into the 5-year and 15-year buckets. When combined with <strong>Bonus Depreciation</strong> (which allows you to take massive upfront deductions on 5- and 15-year property), landlords can generate massive "paper losses" in Year 1. 
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            These paper losses can often completely wipe out the tax liability generated by the property's cash flow, and in many cases (if you qualify as a Real Estate Professional), can offset your W2 income.
          </p>

          <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
            <strong>Strict CPA Disclaimer:</strong> The estimates provided by this calculator are highly generalized. A true Cost Segregation Study requires an accredited engineer to physically inspect the property. Furthermore, Bonus Depreciation percentages are subject to phase-outs under the Tax Cuts and Jobs Act (TCJA). MyTenant is a software company, not a CPA firm. You must consult a licensed tax advisor or CPA before filing taxes using accelerated depreciation methods to avoid IRS audit penalties.
          </div>
        </div>
      </section>
    </article>
  )
}
