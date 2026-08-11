import React from 'react'
import { Link } from 'react-router'
import { MdOutlineDraw, MdCheck, MdArrowForward } from 'react-icons/md'
import SEO from '../../components/seo/SEO.jsx'
import DisplayAd from '../../components/ui/DisplayAd.jsx'

export default function AutoSignatures() {
  return (
    <article className="relative w-full max-w-4xl mx-auto overflow-hidden">
      <SEO 
        title="Automated Document Signing for Landlords | Auto-Signatures"
        description="Upload your signature once and automatically sign leases, notices, and legal documents. Save hours of administrative work with MyTenant's auto-signature feature."
        keywords="Automated Document Signing, Landlord Auto Signature, E-Sign Leases Automatically, Real Estate Document Automation, Digital Signature for Landlords"
        canonical="/features/auto-signatures"
      />

      {/* Gradient blobs for aesthetic */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20" style={{ background: '#8b5cf6', filter: 'blur(80px)' }} />
        <div className="absolute top-1/3 -right-20 w-72 h-72 rounded-full opacity-10" style={{ background: '#ec4899', filter: 'blur(70px)' }} />
      </div>

      {/* Hero */}
      <div className="text-center mb-16 pt-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6 border border-purple-200 dark:border-purple-800/50">
          <MdOutlineDraw size={32} />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
          Set Up Once. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Auto-Sign Everything.</span>
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Stop manually signing every single lease, addendum, and notice. With MyTenant, simply upload your signature into your account settings once, and our system will automatically apply it to all outgoing official documents. No headache required.
        </p>
      </div>

      {/* Content Section */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl shadow-slate-200/20 dark:shadow-none">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How Auto-Signatures Work</h2>
        
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs"><MdCheck /></span>
              One-Time Upload
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Navigate to your account settings, draw or upload a transparent PNG of your signature, and save it. You never have to do this again.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs"><MdCheck /></span>
              Instant Lease Generation
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              When you generate a new lease agreement or renewal, your saved signature is automatically appended to the "Landlord Signature" line before it's even sent to the tenant.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs"><MdCheck /></span>
              Legally Binding
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Our e-signature implementation is compliant with the ESIGN Act and UETA. Your auto-applied signature carries the exact same legal weight as a wet-ink signature.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs"><MdCheck /></span>
              Mass Notices
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Need to send a rent increase notice to 50 tenants? Generate them all at once. Your signature is instantly applied to every single document automatically.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 border border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-500"></div>
        <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Stop wasting time signing paperwork</h2>
        <p className="text-slate-400 text-sm mb-8 relative z-10">Upload your signature today and put your property management on autopilot.</p>
        <Link 
          to="/register" 
          className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/25 active:scale-[0.98]"
        >
          Try Auto-Signatures Free <MdArrowForward />
        </Link>
      </div>

      <div className="mt-8 mb-4 flex justify-center">
        <DisplayAd className="max-w-4xl w-full" />
      </div>
    </article>
  )
}
