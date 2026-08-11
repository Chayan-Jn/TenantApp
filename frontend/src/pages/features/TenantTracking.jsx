import React from 'react'
import { Link } from 'react-router'
import { MdOutlineGroups, MdCheck, MdArrowForward } from 'react-icons/md'
import SEO from '../../components/seo/SEO.jsx'
import DisplayAd from '../../components/ui/DisplayAd'

export default function TenantTracking() {
  return (
    <article className="relative w-full max-w-4xl mx-auto overflow-hidden">
      <SEO 
        title="Tenant Tracking & Onboarding Software"
        description="Manage tenant profiles, track lease dates, store ID documents, and monitor payment history in one secure portal."
        keywords="Tenant Tracking Software, Tenant Management Portal, Lease Management Tool, Landlord Tenant App"
        canonical="/features/tenant-tracking"
      />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20" style={{ background: '#f59e0b', filter: 'blur(80px)' }} />
        <div className="absolute top-1/3 -right-20 w-72 h-72 rounded-full opacity-10" style={{ background: '#f97316', filter: 'blur(70px)' }} />
      </div>

      <div className="text-center mb-16 pt-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-500 mb-6">
          <MdOutlineGroups size={32} />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
          Complete <span className="text-amber-500">Tenant Tracking</span><br/> from Move-in to Move-out
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Keep a pulse on every renter in your portfolio. Store contact info, ID proofs, lease agreements, and payment history all in one centralized profile.
        </p>
      </div>

      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl shadow-slate-200/20 dark:shadow-none">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Built for professional landlords</h2>
        
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs"><MdCheck /></span>
              Rich Profiles
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              View a tenant's complete history at a glance. See their current balance, total paid to date, and every transaction they've ever made.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs"><MdCheck /></span>
              Document Storage
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload lease agreements, background checks, and ID cards directly to the tenant's profile. Access them from anywhere securely.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs"><MdCheck /></span>
              Move-in & Move-out
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Easily manage tenant lifecycle. Archive old tenants when they move out without losing their financial history.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs"><MdCheck /></span>
              Contact Directory
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              No more digging through your phone's contacts. Keep tenant phone numbers and emails organized and instantly accessible.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Get organized today</h2>
        <p className="text-slate-400 text-sm mb-8">Bring professional management to your portfolio.</p>
        <Link 
          to="/register" 
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25 active:scale-[0.98]"
        >
          Start Your Free Trial <MdArrowForward />
        </Link>
      </div>
    </article>
  )
}
