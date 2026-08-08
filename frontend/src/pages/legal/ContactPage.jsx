import React from 'react'
import { MdOutlineEmail, MdOutlineAccessTime, MdArrowForward, MdOutlineLocationOn } from 'react-icons/md'
import SEO from '../../components/seo/SEO.jsx'

const Card = ({ icon, label, value, link }) => (
  <a
    href={link}
    target={link?.startsWith('http') ? '_blank' : undefined}
    rel="noopener noreferrer"
    className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#0ea5e9]/40 transition-all group"
  >
    <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] dark:bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0 text-[#0ea5e9]">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-900 dark:text-white break-all">{value}</p>
    </div>
    {link && (
      <MdArrowForward size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-[#0ea5e9] transition-colors flex-shrink-0 mt-1" />
    )}
  </a>
)

export default function ContactPage() {
  return (
    <article>
      <SEO 
        title="Contact Us"
        description="Get in touch with MyTenant support for billing, platform assistance, and technical questions."
        keywords="Contact MyTenant, Support, Help Desk, Property Management Support"
        canonical="/contact"
      />
      {/* Hero */}
      <div className="mb-10">
        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#0ea5e9] bg-[#e0f2fe] dark:bg-[#0ea5e9]/10 px-3 py-1 rounded-full mb-3">
          Support
        </span>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Contact Us</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Have a question, a billing concern, or need help with the platform? We're here to help.
          Reach out and we'll get back to you within one business day.
        </p>
      </div>

      {/* Contact cards */}
      <div className="space-y-3 mb-12">
        <Card
          icon={<MdOutlineEmail size={20} />}
          label="Email Support"
          value="support@mytenant.me"
          link="mailto:support@mytenant.me"
        />
        <Card
          icon={<MdOutlineAccessTime size={20} />}
          label="Support Hours"
          value="Monday – Friday, 10 AM – 6 PM IST"
        />
        <Card
          icon={<MdOutlineLocationOn size={20} />}
          label="Operating Address"
          value="Suraj Vihar, Dwarka, Delhi 110078, India"
        />
      </div>

      {/* What to include */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 mb-10">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          When emailing about a billing issue, please include:
        </h2>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          {[
            'Your registered email address',
            'The Razorpay Order ID or Payment ID (from your email receipt)',
            'A brief description of the issue',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#e0f2fe] dark:bg-[#0ea5e9]/10 text-[#0ea5e9] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-px">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Policy links */}
      <div className="rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40 p-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Helpful links</h2>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Privacy Policy', to: '/privacy-policy' },
            { label: 'Terms of Service', to: '/terms' },
            { label: 'Refund & Cancellation Policy', to: '/refund-policy' },
          ].map(({ label, to }) => (
            <a
              key={to}
              href={to}
              className="flex items-center gap-2 text-sm text-[#0ea5e9] hover:underline font-medium"
            >
              <MdArrowForward size={14} />
              {label}
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}
