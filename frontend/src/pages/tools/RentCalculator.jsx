import React, { useState } from 'react'
import { Link } from 'react-router'
import SEO from '../../components/seo/SEO.jsx'
import { MdCalculate, MdArrowForward } from 'react-icons/md'

export default function RentCalculator() {
  const [monthlyRent, setMonthlyRent] = useState(1500)
  const [daysInMonth, setDaysInMonth] = useState(30)
  const [daysOccupied, setDaysOccupied] = useState(15)

  const dailyRate = monthlyRent / daysInMonth
  const proratedRent = dailyRate * daysOccupied

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
              onChange={e => setMonthlyRent(Number(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Total Days in Month</label>
            <select 
              value={daysInMonth}
              onChange={e => setDaysInMonth(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
            >
              <option value={28}>28 Days (February)</option>
              <option value={29}>29 Days (Leap Year)</option>
              <option value={30}>30 Days</option>
              <option value={31}>31 Days</option>
              <option value={365}>Banker's Year (365/12)</option>
            </select>
          </div>
        </div>

        <div className="mb-10">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Days Occupied</label>
          <input 
            type="range" 
            min="1" max={daysInMonth} 
            value={daysOccupied}
            onChange={e => setDaysOccupied(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="text-center mt-3 font-bold text-emerald-500">{daysOccupied} Days</div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-sm text-slate-500 mb-2">Prorated Rent Due</p>
          <p className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
            ${proratedRent.toFixed(2)}
          </p>
          <p className="text-xs text-slate-400">
            Daily rate: ${(dailyRate).toFixed(2)} / day
          </p>
        </div>
      </div>

      <div className="text-center bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-4">Tired of manual calculations?</h2>
        <p className="text-slate-400 text-sm mb-6">MyTenant automates prorated rent, late fees, and split utility bills effortlessly.</p>
        <Link 
          to="/register" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#0ea5e9]/25"
        >
          Automate Your Ledgers <MdArrowForward />
        </Link>
      </div>
    </article>
  )
}
