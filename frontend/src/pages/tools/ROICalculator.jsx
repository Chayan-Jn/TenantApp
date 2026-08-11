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

      <div className="text-center bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Track ROI automatically</h2>
        <p className="text-slate-400 text-sm mb-6">Connect your bank and let MyTenant automatically calculate cash flow and ROI across your entire portfolio in real-time.</p>
        <Link 
          to="/register" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#0ea5e9]/25"
        >
          Start Free Trial <MdArrowForward />
        </Link>
      </div>
    </article>
  )
}
