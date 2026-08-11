import React from 'react'
import { Link } from 'react-router'
import { MdCheck, MdClose, MdArrowForward } from 'react-icons/md'
import SEO from '../../components/seo/SEO.jsx'
import DisplayAd from '../../components/ads/DisplayAd.jsx'

export default function CompareTemplate({ 
  competitor, 
  title, 
  description, 
  keywords, 
  canonical,
  competitorWeakness,
  ourStrength,
  pricingComparison,
  disclaimer
}) {
  return (
    <article className="relative w-full max-w-5xl mx-auto overflow-hidden">
      <SEO 
        title={title}
        description={description}
        keywords={keywords}
        canonical={canonical}
      />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20" style={{ background: '#ef4444', filter: 'blur(80px)' }} />
        <div className="absolute top-1/3 -right-20 w-72 h-72 rounded-full opacity-10" style={{ background: '#0ea5e9', filter: 'blur(70px)' }} />
      </div>

      <div className="text-center mb-16 pt-8">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300 mb-6 border border-slate-200 dark:border-slate-700">
          Comparing Software Alternatives
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
          MyTenant vs. <span className="text-red-500">{competitor}</span>
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden mb-12 shadow-xl shadow-slate-200/20 dark:shadow-none">
        <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="p-4 sm:p-6 font-semibold text-slate-500 dark:text-slate-400">Feature</div>
          <div className="p-4 sm:p-6 font-bold text-slate-900 dark:text-white text-center border-l border-slate-200 dark:border-slate-700">MyTenant</div>
          <div className="p-4 sm:p-6 font-bold text-slate-500 dark:text-slate-400 text-center border-l border-slate-200 dark:border-slate-700">{competitor}</div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {[
            { name: 'Pricing Model', myt: 'Simple Flat Rate', comp: pricingComparison },
            { name: 'Onboarding Complexity', myt: 'Instant (Under 5 mins)', comp: competitorWeakness },
            { name: 'Modern Interface', myt: 'React-based (Instant)', comp: 'Legacy/Clunky' },
            { name: 'Automated Rent Ledgers', myt: true, comp: true },
            { name: 'Utility Bill Splitting', myt: true, comp: 'Often requires add-ons' },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-3 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
              <div className="p-4 sm:p-6 text-sm text-slate-700 dark:text-slate-300">{row.name}</div>
              <div className="p-4 sm:p-6 flex items-center justify-center border-l border-slate-200 dark:border-slate-700">
                {typeof row.myt === 'boolean' ? (
                  row.myt ? <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center"><MdCheck /></span> : <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"><MdClose /></span>
                ) : (
                  <span className="text-sm font-semibold text-[#0ea5e9] text-center">{row.myt}</span>
                )}
              </div>
              <div className="p-4 sm:p-6 flex items-center justify-center border-l border-slate-200 dark:border-slate-700">
                {typeof row.comp === 'boolean' ? (
                   row.comp ? <span className="text-slate-400"><MdCheck size={24} /></span> : <span className="text-slate-400"><MdClose size={24} /></span>
                ) : (
                  <span className="text-sm text-slate-500 text-center">{row.comp}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Switch to modern property management</h2>
        <p className="text-slate-400 text-sm mb-8">{ourStrength}</p>
        <Link 
          to="/register" 
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#0ea5e9]/25 active:scale-[0.98]"
        >
          Start Your Free Trial <MdArrowForward />
        </Link>
      </div>
      
      <div className="mt-8 mb-4">
        <DisplayAd className="max-w-4xl mx-auto" />
      </div>

      <p className="text-xs text-slate-400 text-center mt-8 pb-8 opacity-60">
        {disclaimer}
      </p>
    </article>
  )
}
