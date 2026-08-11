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

      <div className="text-center bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Want to increase your NOI?</h2>
        <p className="text-slate-400 text-sm mb-6">MyTenant helps landlords track expenses and collect rent faster, boosting your overall property profitability.</p>
        <Link 
          to="/register" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#0ea5e9]/25"
        >
          Maximize Returns <MdArrowForward />
        </Link>
      </div>
    </article>
  )
}
