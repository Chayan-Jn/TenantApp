import React from 'react'
import { Link } from 'react-router'
import { MdCheck, MdClose, MdArrowForward, MdOutlineSpeed, MdOutlineAttachMoney, MdOutlineGroup } from 'react-icons/md'
import SEO from '../../components/seo/SEO.jsx'
import DisplayAd from '../../components/ui/DisplayAd.jsx'

export default function Alternatives() {
  return (
    <article className="relative w-full max-w-6xl mx-auto overflow-hidden px-4 sm:px-6">
      <SEO 
        title="Best Property Management Software Alternatives | MyTenant vs The Market"
        description="Comparing property management software? See why independent landlords are switching from Legacy systems (Buildium, AppFolio) and DIY tools (TurboTenant, Avail) to MyTenant for simpler pricing and instant onboarding."
        keywords="Property Management Software Alternatives, Buildium alternative, AppFolio alternative, TurboTenant alternative, MyTenant comparison"
        canonical="/compare/alternatives"
      />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-20 w-96 h-96 rounded-full opacity-20" style={{ background: '#3b82f6', filter: 'blur(100px)' }} />
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: '#10b981', filter: 'blur(80px)' }} />
      </div>

      <div className="text-center mb-16 pt-12">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-6 border border-blue-100 dark:border-blue-800">
          Software Comparison Guide
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
          MyTenant vs. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">The Market</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          The property management software industry is split into two extremes: complex "legacy" systems built for massive corporations, and basic "DIY" tools that lack serious accounting features. We built MyTenant to be the perfect middle ground.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-sm">
          <MdOutlineSpeed className="w-10 h-10 text-blue-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Instant Onboarding</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">No mandatory training calls, no setup fees, and no waiting days to get your account approved. Start adding properties in seconds.</p>
        </div>
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-sm">
          <MdOutlineAttachMoney className="w-10 h-10 text-emerald-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Hidden Fees</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Forget monthly minimums and unpredictable pricing tiers. MyTenant uses a simple flat-rate model that actually scales with you.</p>
        </div>
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-sm">
          <MdOutlineGroup className="w-10 h-10 text-purple-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Automated Ledgers</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Smart rent ledgers and automatic utility bill splitting that rivals enterprise software, packaged in a beautifully modern interface.</p>
        </div>
      </div>

      {/* Comprehensive Comparison Table */}
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">How We Stack Up</h2>
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden mb-16 shadow-xl shadow-slate-200/20 dark:shadow-none overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/80">
            <div className="p-5 font-semibold text-slate-500 dark:text-slate-400">Feature Focus</div>
            <div className="p-5 font-extrabold text-blue-600 dark:text-blue-400 text-center border-l border-slate-200 dark:border-slate-700 bg-blue-50/30 dark:bg-blue-900/10">MyTenant</div>
            <div className="p-5 font-bold text-slate-600 dark:text-slate-300 text-center border-l border-slate-200 dark:border-slate-700">Legacy Systems<br/><span className="text-xs font-normal text-slate-400">(Buildium, AppFolio, Yardi)</span></div>
            <div className="p-5 font-bold text-slate-600 dark:text-slate-300 text-center border-l border-slate-200 dark:border-slate-700">DIY Tools<br/><span className="text-xs font-normal text-slate-400">(TurboTenant, Avail, RentRedi)</span></div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {[
              { name: 'Target Audience', myt: 'Independent Portfolios', leg: 'Massive Corporations', diy: 'Hobbyist Landlords' },
              { name: 'Pricing Model', myt: 'Simple Flat Rate', leg: 'High Monthly Minimums + Setup', diy: 'Hidden "Per Feature" Fees' },
              { name: 'Onboarding Time', myt: 'Instant (Under 5 mins)', leg: 'Weeks of Training Required', diy: 'Instant' },
              { name: 'Utility Bill Splitting', myt: true, leg: 'Often requires paid add-on', diy: false },
              { name: 'Global Rent Ledger', myt: true, leg: true, diy: 'Basic transaction lists only' },
              { name: 'User Interface', myt: 'Modern React App', leg: 'Clunky / Outdated', diy: 'Modern but basic' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-4 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                <div className="p-5 text-sm font-medium text-slate-700 dark:text-slate-300">{row.name}</div>
                <div className="p-5 flex items-center justify-center border-l border-slate-200 dark:border-slate-700 bg-blue-50/10 dark:bg-blue-900/5">
                  {typeof row.myt === 'boolean' ? (
                    row.myt ? <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center"><MdCheck size={16} /></span> : <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"><MdClose size={16} /></span>
                  ) : (
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 text-center">{row.myt}</span>
                  )}
                </div>
                <div className="p-5 flex items-center justify-center border-l border-slate-200 dark:border-slate-700">
                  {typeof row.leg === 'boolean' ? (
                     row.leg ? <span className="text-slate-400"><MdCheck size={20} /></span> : <span className="text-slate-400"><MdClose size={20} /></span>
                  ) : (
                    <span className="text-sm text-slate-500 text-center">{row.leg}</span>
                  )}
                </div>
                <div className="p-5 flex items-center justify-center border-l border-slate-200 dark:border-slate-700">
                  {typeof row.diy === 'boolean' ? (
                     row.diy ? <span className="text-slate-400"><MdCheck size={20} /></span> : <span className="text-slate-400"><MdClose size={20} /></span>
                  ) : (
                    <span className="text-sm text-slate-500 text-center">{row.diy}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl mb-12 relative overflow-hidden group">
        <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-500"></div>
        <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Stop compromising on your software</h2>
        <p className="text-slate-300 text-base max-w-2xl mx-auto mb-8 relative z-10">
          You don't need a massive enterprise system to get professional features, and you shouldn't have to settle for basic hobbyist tools.
        </p>
        <Link 
          to="/register" 
          className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] text-lg"
        >
          Start Your Free Trial <MdArrowForward />
        </Link>
      </div>
      
      <div className="mt-8 mb-4 flex justify-center">
        <DisplayAd className="max-w-4xl w-full" />
      </div>

      <p className="text-xs text-slate-400 text-center mt-8 pb-12 opacity-60">
        All trademarks, logos and brand names are the property of their respective owners. All company, product and service names used in this website are for identification purposes only. Use of these names, trademarks and brands does not imply endorsement.
      </p>
    </article>
  )
}
