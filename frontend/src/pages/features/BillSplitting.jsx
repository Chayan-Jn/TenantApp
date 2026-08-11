import React from 'react'
import { Link } from 'react-router'
import { MdOutlinePieChart, MdCheck, MdArrowForward } from 'react-icons/md'
import SEO from '../../components/seo/SEO.jsx'
import DisplayAd from '../../components/ui/DisplayAd'

export default function BillSplitting() {
  return (
    <article className="relative w-full max-w-4xl mx-auto overflow-hidden">
      <SEO 
        title="Utility Bill Splitting Software for Landlords"
        description="Easily split electricity, water, and maintenance bills among your tenants. Automate expense tracking and stop losing money on shared utilities."
        keywords="Utility Bill Splitting, Share Bills with Tenants, Landlord Expense Tracker, Automate Water Bill Split"
        canonical="/features/bill-splitting"
      />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20" style={{ background: '#ec4899', filter: 'blur(80px)' }} />
        <div className="absolute top-1/3 -right-20 w-72 h-72 rounded-full opacity-10" style={{ background: '#8b5cf6', filter: 'blur(70px)' }} />
      </div>

      <div className="text-center mb-16 pt-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-pink-100 dark:bg-pink-500/10 text-pink-500 mb-6">
          <MdOutlinePieChart size={32} />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
          Painless <span className="text-pink-500">Bill Splitting</span><br/> for Shared Utilities
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Stop calculating split utilities on a notepad. Log a master bill for a property and MyTenant automatically divides it among your tenants based on occupancy, usage, or custom percentages.
        </p>
      </div>

      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl shadow-slate-200/20 dark:shadow-none">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How our bill splitter saves you money</h2>
        
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs"><MdCheck /></span>
              Multiple Split Methods
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Split by fixed amounts, exact percentages, or equally among all active tenants in a property. Perfect for shared water meters or Wi-Fi.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs"><MdCheck /></span>
              Direct to Tenant Ledger
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Once you split a bill, the exact amounts are instantly added to the specific tenant's ledger alongside their rent.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs"><MdCheck /></span>
              Photo Attachments
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload photos of the physical utility bills. Keep everything documented so tenants can never dispute the charges.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs"><MdCheck /></span>
              Recover Lost Revenue
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Landlords lose thousands of dollars a year eating small utility costs. Automating the split ensures you get paid back for everything.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Start tracking expenses correctly</h2>
        <p className="text-slate-400 text-sm mb-8">Never lose money on a water bill again.</p>
        <Link 
          to="/register" 
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-500/25 active:scale-[0.98]"
        >
          Create Free Account <MdArrowForward />
        </Link>
      </div>
    </article>
  )
}
