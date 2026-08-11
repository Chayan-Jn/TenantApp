import React, { useState } from 'react'
import { Link } from 'react-router'
import SEO from '../../components/seo/SEO.jsx'
import { MdTrendingUp, MdArrowForward } from 'react-icons/md'

export default function CapRateCalculator() {
  const [propertyValue, setPropertyValue] = useState(500000)
  const [grossIncome, setGrossIncome] = useState(48000)
  const [operatingExpenses, setOperatingExpenses] = useState(12000)

  const noi = grossIncome - operatingExpenses
  const capRate = propertyValue > 0 ? (noi / propertyValue) * 100 : 0

  return (
    <article className="relative w-full max-w-3xl mx-auto overflow-hidden">
      <SEO 
        title="Free Cap Rate Calculator | MyTenant Tools"
        description="Calculate Capitalization Rate (Cap Rate) for your real estate investments instantly. Determine property profitability with our free tool."
        keywords="Cap Rate Calculator, Real Estate ROI, NOI Calculator, Property Investment Return, Free Landlord Tools"
        canonical="/tools/cap-rate-calculator"
      />

      <div className="text-center mb-12 pt-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-500 mb-6">
          <MdTrendingUp size={32} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
          Cap Rate Calculator
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Determine the potential return on an investment property based on its income and value.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-10 shadow-xl mb-12">
        <div className="grid sm:grid-cols-1 gap-8 mb-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Property Value ($)</label>
            <input 
              type="number" 
              value={propertyValue}
              onChange={e => setPropertyValue(Number(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Gross Annual Income ($)</label>
            <input 
              type="number" 
              value={grossIncome}
              onChange={e => setGrossIncome(Number(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Annual Operating Expenses ($)</label>
            <input 
              type="number" 
              value={operatingExpenses}
              onChange={e => setOperatingExpenses(Number(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-sm text-slate-500 mb-2">Capitalization Rate (Cap Rate)</p>
          <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            {capRate.toFixed(2)}%
          </p>
          <p className="text-xs text-slate-400">
            Net Operating Income (NOI): ${(noi).toLocaleString()} / year
          </p>
        </div>
      </div>

      <div className="text-center bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl mb-16 mt-16">
        <h2 className="text-xl font-bold text-white mb-4">Want to increase your NOI?</h2>
        <p className="text-slate-400 text-sm mb-6">MyTenant helps landlords track expenses and collect rent faster, boosting your overall property profitability.</p>
        <Link 
          to="/register" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#0ea5e9]/25"
        >
          Maximize Returns <MdArrowForward />
        </Link>
      </div>

      {/* EEAT High-Value Content Section */}
      <section className="mt-16 bg-white dark:bg-slate-800/50 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4 mb-8">
            The Ultimate Guide to Cap Rates (2025-2026 Market Data)
          </h2>
          
          <h3 className="text-xl font-semibold mt-8 mb-4">What is a Capitalization Rate?</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            The Capitalization Rate, or "Cap Rate," is one of the most fundamental metrics used in commercial and residential real estate investing. It represents the natural rate of return on a real estate investment property based on the income that the property is expected to generate, assuming the property was purchased for cash without any debt.
          </p>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/30 mb-8">
            <p className="font-mono text-center font-bold text-indigo-700 dark:text-indigo-400 text-lg">
              Cap Rate = (Net Operating Income / Property Value) × 100
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-4">2025/2026 Cap Rate Market Averages</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            After a period of significant volatility and interest rate adjustments in 2023-2024, cap rates broadly stabilized by the end of 2025. According to institutional market research across the commercial real estate (CRE) sector, we observed a distinct market bifurcation:
          </p>
          <ul className="list-disc pl-6 space-y-4 text-slate-600 dark:text-slate-300 mb-8">
            <li><strong>Multifamily & Industrial:</strong> These highly favored asset classes anchored the low end of the spectrum, with stabilized prime assets typically trading in the <strong>5.0% – 5.75% range</strong>.</li>
            <li><strong>Retail:</strong> Grocery-anchored and essential retail assets remained incredibly resilient, commonly settling in the <strong>6.0% – 6.5% range</strong>.</li>
            <li><strong>Office Space:</strong> This sector remained the outlier. Prime office assets drifted toward <strong>8.0%</strong>, while Class B/C or distressed assets often traded with cap rates pushing into the low teens.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-4">How to Use Cap Rates as a Landlord</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Cap rates are best used as a comparative tool to evaluate the risk and potential return of different properties in the same local market. 
            A lower cap rate typically implies a safer, more stable investment (e.g., a Class A apartment building in a major metro), while a higher cap rate implies higher risk or a value-add opportunity.
          </p>

          <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
            <strong>Disclaimer for Educational Purposes:</strong> The cap rate calculator and market data provided on this page are for educational and estimation purposes only. Real estate markets are highly localized, and actual returns depend heavily on property-specific factors, local economic conditions, and specific tenant quality. This tool does not constitute financial, investment, or legal advice. Always consult with a licensed appraiser or financial professional before making investment decisions.
          </div>
        </div>
      </section>
    </article>
  )
}
