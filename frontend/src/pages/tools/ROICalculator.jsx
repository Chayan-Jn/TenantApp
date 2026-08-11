import React, { useState } from 'react'
import { Link } from 'react-router'
import SEO from '../../components/seo/SEO.jsx'
import { MdAttachMoney, MdArrowForward } from 'react-icons/md'

export default function ROICalculator() {
  const [purchasePrice, setPurchasePrice] = useState(300000)
  const [downPayment, setDownPayment] = useState(60000)
  const [annualRentalIncome, setAnnualRentalIncome] = useState(36000)
  const [annualExpenses, setAnnualExpenses] = useState(15000)

  const totalInvestment = downPayment
  const annualCashFlow = annualRentalIncome - annualExpenses
  const roi = totalInvestment > 0 ? (annualCashFlow / totalInvestment) * 100 : 0

  return (
    <article className="relative w-full max-w-3xl mx-auto overflow-hidden">
      <SEO 
        title="Free ROI Calculator for Real Estate | MyTenant Tools"
        description="Calculate the Return on Investment (ROI) for your rental properties. Factor in down payments, income, and expenses with our free landlord tool."
        keywords="ROI Calculator, Cash on Cash Return, Real Estate Investment ROI, Rental Property ROI, Landlord Tools"
        canonical="/tools/roi-calculator"
      />

      <div className="text-center mb-12 pt-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-500 mb-6">
          <MdAttachMoney size={32} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
          Rental ROI Calculator
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Calculate your cash-on-cash return and overall profitability for your rental properties.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-10 shadow-xl mb-12">
        <div className="grid sm:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Purchase Price ($)</label>
            <input 
              type="number" 
              value={purchasePrice}
              onChange={e => setPurchasePrice(Number(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Down Payment ($)</label>
            <input 
              type="number" 
              value={downPayment}
              onChange={e => setDownPayment(Number(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Annual Rental Income ($)</label>
            <input 
              type="number" 
              value={annualRentalIncome}
              onChange={e => setAnnualRentalIncome(Number(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Annual Expenses & Mortgage ($)</label>
            <input 
              type="number" 
              value={annualExpenses}
              onChange={e => setAnnualExpenses(Number(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-sm text-slate-500 mb-2">Cash on Cash Return (ROI)</p>
          <p className="text-5xl font-bold text-amber-500 dark:text-amber-400 mb-2">
            {roi.toFixed(2)}%
          </p>
          <p className="text-xs text-slate-400">
            Annual Cash Flow: ${(annualCashFlow).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="text-center bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl mb-16 mt-16">
        <h2 className="text-xl font-bold text-white mb-4">Track ROI automatically</h2>
        <p className="text-slate-400 text-sm mb-6">Connect your bank and let MyTenant automatically calculate cash flow and ROI across your entire portfolio in real-time.</p>
        <Link 
          to="/register" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#0ea5e9]/25"
        >
          Start Free Trial <MdArrowForward />
        </Link>
      </div>

      {/* EEAT High-Value Content Section */}
      <section className="mt-16 bg-white dark:bg-slate-800/50 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4 mb-8">
            The Complete Guide to Rental ROI & Cash-on-Cash Return
          </h2>
          
          <h3 className="text-xl font-semibold mt-8 mb-4">Cash-on-Cash Return vs Overall ROI</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            When real estate investors talk about "ROI," they are usually referring specifically to <strong>Cash-on-Cash (CoC) Return</strong>. This metric measures the annual pre-tax cash flow produced by a property relative to the actual amount of cash invested out-of-pocket (your down payment, closing costs, and rehab costs).
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Overall ROI, conversely, also includes factors like loan paydown (principal reduction), property appreciation over time, and tax benefits (like depreciation). While Overall ROI gives a holistic picture of wealth generation, Cash-on-Cash Return is the absolute best metric for understanding your day-to-day liquidity and cash generation.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4">Hidden Expenses Amateur Landlords Forget</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            A common mistake when using basic ROI calculators is underestimating <strong>Annual Expenses</strong>. To get an accurate, professional calculation, ensure your expense figure includes:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-slate-600 dark:text-slate-300 mb-8">
            <li><strong>Vacancy Rate:</strong> Always assume the property will sit empty for at least 5-8% of the year.</li>
            <li><strong>Capital Expenditures (CapEx):</strong> Setting aside money for major future repairs (roofs, HVAC replacements).</li>
            <li><strong>Property Management:</strong> Even if you self-manage using software like MyTenant, your time has value. Typically 8-10% of gross rents.</li>
            <li><strong>Property Taxes & Insurance:</strong> These fluctuate annually and can severely impact cash flow.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-4">What is a "Good" ROI?</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            While it varies heavily by market, a standard benchmark for a strong Cash-on-Cash return on a long-term rental property ranges between <strong>8% and 12%</strong>. Returns above 12% are often found in higher-risk or turn-around neighborhoods, while safer, Class-A neighborhoods might yield closer to 5-7%.
          </p>

          <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
            <strong>Disclaimer for Educational Purposes:</strong> This calculator and the accompanying guide are provided for illustrative and educational purposes only. Return on Investment (ROI) and Cash Flow calculations rely on numerous assumptions, including tax rates, exact loan terms, and unforeseen maintenance variables that cannot be fully predicted. This tool does not constitute financial, investment, accounting, or tax advice. We highly recommend consulting with a licensed CPA and financial advisor regarding your specific real estate investments.
          </div>
        </div>
      </section>
    </article>
  )
}
