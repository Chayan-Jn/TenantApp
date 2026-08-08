import React from 'react'
import { Link } from 'react-router'
import { MdOutlineAssessment, MdCheck, MdArrowForward } from 'react-icons/md'
import SEO from '../../components/seo/SEO.jsx'

export default function RentLedger() {
  return (
    <article className="relative w-full max-w-4xl mx-auto overflow-hidden">
      <SEO 
        title="Automated Rent Ledger Software"
        description="Replace your messy spreadsheet with a beautiful, automated rent ledger. Track payments, late fees, and overdue rent for all your properties in one place."
        keywords="Automated Rent Ledger Software, Rent Tracking App, Landlord Ledger Sheet Alternative, Digital Rent Roll, Property Management Ledger"
        canonical="/features/rent-ledger"
      />

      {/* Gradient blobs for aesthetic */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20" style={{ background: '#0ea5e9', filter: 'blur(80px)' }} />
        <div className="absolute top-1/3 -right-20 w-72 h-72 rounded-full opacity-10" style={{ background: '#3b82f6', filter: 'blur(70px)' }} />
      </div>

      {/* Hero */}
      <div className="text-center mb-16 pt-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#e0f2fe] dark:bg-[#0ea5e9]/10 text-[#0ea5e9] mb-6">
          <MdOutlineAssessment size={32} />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
          The Ultimate Automated <br/><span className="text-[#0ea5e9]">Rent Ledger</span>
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Say goodbye to messy spreadsheets and manual calculations. MyTenant provides a crystal-clear, automated rent roll that tracks every payment, balance, and overdue rent across your entire portfolio.
        </p>
      </div>

      {/* Content Section */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl shadow-slate-200/20 dark:shadow-none">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Why upgrade your rent ledger?</h2>
        
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center text-xs"><MdCheck /></span>
              Zero Data Entry Errors
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              When rent is recorded, it instantly updates the tenant's balance, the property's total revenue, and your global dashboard. No formulas to break.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center text-xs"><MdCheck /></span>
              Automated Rent Cycles
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Generate monthly rent for every tenant in one click. MyTenant automatically calculates the correct base rent and adds it to their ledger.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center text-xs"><MdCheck /></span>
              Overdue Alerts
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Instantly see who is behind on rent. Our dashboard flags overdue accounts so you can follow up before it becomes a problem.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center text-xs"><MdCheck /></span>
              PDF Exports
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Need to show your records to an accountant or investor? Export beautiful, professional PDF reports of your entire ledger in seconds.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to automate your rent tracking?</h2>
        <p className="text-slate-400 text-sm mb-8">Join thousands of landlords who have ditched their spreadsheets.</p>
        <Link 
          to="/register" 
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#0ea5e9]/25 active:scale-[0.98]"
        >
          Start Your Free Trial <MdArrowForward />
        </Link>
      </div>
    </article>
  )
}
