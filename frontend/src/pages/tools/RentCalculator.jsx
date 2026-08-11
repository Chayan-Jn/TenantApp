import React, { useState } from 'react'
import { Link } from 'react-router'
import SEO from '../../components/seo/SEO.jsx'
import { MdCalculate, MdArrowForward } from 'react-icons/md'

export default function RentCalculator() {
  const [monthlyRent, setMonthlyRent] = useState('1500')
  const [daysInMonth, setDaysInMonth] = useState('30')
  const [daysOccupied, setDaysOccupied] = useState('15')
  const [results, setResults] = useState(null)

  const handleCalculate = () => {
    const mRent = parseFloat(monthlyRent) || 0
    const dMonth = parseFloat(daysInMonth) || 30
    const dOccupied = parseFloat(daysOccupied) || 0

    const dailyRate = mRent / dMonth
    const proratedRent = dailyRate * dOccupied

    setResults({ dailyRate, proratedRent })
  }

  return (
    <article className="relative w-full max-w-3xl mx-auto overflow-hidden">
      <SEO 
        title="Free Prorated Rent Calculator | MyTenant Tools"
        description="Quickly calculate prorated rent for move-ins and move-outs with our free landlord rent calculator tool."
        keywords="Prorated Rent Calculator, Rent Proration Tool, Calculate Partial Month Rent, Landlord Free Tools"
        canonical="/tools/rent-calculator"
      />

      <div className="text-center mb-12 pt-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500 mb-6">
          <MdCalculate size={32} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
          Prorated Rent Calculator
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Calculate exactly how much a tenant owes for a partial month when moving in or out.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-10 shadow-xl mb-12">
        <div className="grid sm:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Monthly Rent ($)</label>
            <input 
              type="number" 
              value={monthlyRent}
              onChange={e => setMonthlyRent(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Total Days in Month</label>
            <select 
              value={daysInMonth}
              onChange={e => setDaysInMonth(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
            >
              <option value="28">28 Days (February)</option>
              <option value="29">29 Days (Leap Year)</option>
              <option value="30">30 Days</option>
              <option value="31">31 Days</option>
              <option value="30.416">Banker's Year (365/12)</option>
            </select>
          </div>
        </div>

        <div className="mb-10">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Days Occupied</label>
          <input 
            type="range" 
            min="1" max={Math.floor(Number(daysInMonth))} 
            value={daysOccupied}
            onChange={e => setDaysOccupied(e.target.value)}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="text-center mt-3 font-bold text-emerald-500">{daysOccupied} Days</div>
        </div>

        <button 
          onClick={handleCalculate}
          className="w-full mb-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.98]"
        >
          Calculate Prorated Rent
        </button>

        {results && (
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-sm text-slate-500 mb-2">Prorated Rent Due</p>
            <p className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
              ${results.proratedRent.toFixed(2)}
            </p>
            <p className="text-xs text-slate-400">
              Daily rate: ${(results.dailyRate).toFixed(2)} / day
            </p>
          </div>
        )}
      </div>

      <div className="text-center bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl mb-16 mt-16">
        <h2 className="text-xl font-bold text-white mb-4">Tired of manual calculations?</h2>
        <p className="text-slate-400 text-sm mb-6">MyTenant automates prorated rent, late fees, and split utility bills effortlessly.</p>
        <Link 
          to="/register" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#0ea5e9]/25"
        >
          Automate Your Ledgers <MdArrowForward />
        </Link>
      </div>

      {/* EEAT High-Value Content Section */}
      <section className="mt-16 bg-white dark:bg-slate-800/50 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4 mb-8">
            The Landlord's Guide to Prorating Rent
          </h2>
          
          <h3 className="text-xl font-semibold mt-8 mb-4">What is Prorated Rent?</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Prorated rent is the exact, proportionate amount of rent a tenant owes when they occupy a property for only a fraction of a rental cycle (usually a month). Whether a tenant moves in on the 12th or moves out on the 23rd, landlords use proration to ensure the tenant is only billed for the exact days they had possession of the unit.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4">The Math: 30-Day vs. Exact Days Method</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            There are two primary methods landlords and property managers use to calculate daily rent rates:
          </p>
          <ul className="list-disc pl-6 space-y-4 text-slate-600 dark:text-slate-300 mb-8">
            <li><strong>The "Banker's" or 30-Day Method:</strong> This method assumes every month has exactly 30 days, or that a year has 360 days. This makes calculations incredibly consistent, but it slightly overcharges tenants in 31-day months, and undercharges them in February. Some state jurisdictions legally mandate this method for consistency.</li>
            <li><strong>The Exact Days Method (Recommended):</strong> You divide the monthly rent by the <em>actual</em> number of days in that specific month (e.g., 31 for August, 28 for February). This is generally considered the most fair and legally defensible approach for precise daily accounting.</li>
            <li><strong>The 365-Day Method:</strong> Multiply monthly rent by 12, then divide by 365 to get an exact daily rate that applies year-round regardless of the month.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-4">When Should You Prorate?</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Always detail your proration rules in the lease agreement. Standard industry practice is to charge a full month's rent upfront at move-in (regardless of the day), and then apply the <em>prorated amount to the second month</em>. This ensures you collect substantial funds upfront to cover potential early damages or flight risks.
          </p>

          <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
            <strong>Disclaimer for Educational Purposes:</strong> This prorated rent calculator and guide are designed for estimation and educational purposes. State and local landlord-tenant laws vary significantly regarding exactly how rent must be prorated and collected. MyTenant is not a law firm and this content does not constitute legal advice. Always refer to your signed lease agreement and consult with a local real estate attorney to ensure compliance with your jurisdiction's laws.
          </div>
        </div>
      </section>
    </article>
  )
}
