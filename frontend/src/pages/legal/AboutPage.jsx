import React from 'react'
import SEO from '../../components/seo/SEO.jsx'

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{title}</h2>
    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">{children}</div>
  </section>
)

export default function AboutPage() {
  return (
    <article className="space-y-8 text-slate-700 dark:text-slate-300">
      <SEO
        title="About MyTenant"
        description="Learn who runs MyTenant, who we build for, and how we create practical landlord guides, tools, and research content."
        keywords="About MyTenant, Editorial standards, Property management software"
        canonical="/about"
      />

      <div className="mb-10">
        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#0ea5e9] bg-[#e0f2fe] dark:bg-[#0ea5e9]/10 px-3 py-1 rounded-full mb-3">
          Company
        </span>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">About MyTenant</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-3xl">
          MyTenant is a practical property management platform built for independent landlords and small teams.
          Alongside the software, we publish calculators, guides, and research summaries that help property owners
          make better operational decisions.
        </p>
      </div>

      <Section title="1. Who We Serve">
        <p>
          We build MyTenant for landlords who manage residential or mixed portfolios and need an efficient system for
          properties, units, tenants, rent tracking, bills, and reporting.
        </p>
        <p>
          The goal is simple: reduce spreadsheet chaos, improve record quality, and make day-to-day management faster.
        </p>
      </Section>

      <Section title="2. What We Publish">
        <p>
          Public pages on this website include three types of content:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Feature pages</strong> that explain product workflows and use cases.</li>
          <li><strong>Calculator tools</strong> for common landlord math such as prorated rent, cap rate, ROI, and tax scenarios.</li>
          <li><strong>Research and insights</strong> that summarize market behavior, operations, and portfolio decision frameworks.</li>
        </ul>
      </Section>

      <Section title="3. Editorial Standards">
        <p>
          We are committed to publishing original, useful content for real operators, not placeholder SEO pages.
          Every page should provide actionable takeaways, clear assumptions, and practical examples.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>We prioritize hands-on landlord operations and product-backed workflows.</li>
          <li>We revise pages when assumptions, pricing, or product behavior change.</li>
          <li>Educational content is not legal, tax, or investment advice.</li>
          <li>Where relevant, we include references and plain-language context.</li>
        </ul>
      </Section>

      <Section title="4. Corrections and Feedback">
        <p>
          If you spot an error, outdated claim, or unclear explanation, email us at{' '}
          <a href="mailto:support@mytenant.me" className="text-[#0ea5e9] hover:underline">support@mytenant.me</a>.
          We review feedback and update pages as needed.
        </p>
      </Section>

      <Section title="5. Contact and Ownership">
        <p>
          MyTenant is operated by an independent developer from Delhi, India. For support, billing questions, or
          content issues, use the contact details on our{' '}
          <a href="/contact" className="text-[#0ea5e9] hover:underline">Contact page</a>.
        </p>
      </Section>
    </article>
  )
}
