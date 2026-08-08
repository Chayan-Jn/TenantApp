import React from 'react'
import SEO from '../../components/seo/SEO.jsx'

const LAST_UPDATED = 'April 22, 2025'

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{title}</h2>
    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">{children}</div>
  </section>
)

const AlertBox = ({ children }) => (
  <div className="rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 px-5 py-4 text-sm text-amber-800 dark:text-amber-300">
    {children}
  </div>
)

export default function RefundPolicy() {
  return (
    <article>
      <SEO 
        title="Refund Policy"
        description="Refund and Cancellation Policy for MyTenant property management platform."
        keywords="Refund Policy, Cancellation, MyTenant Subscriptions"
        canonical="/refund-policy"
      />
      {/* Hero */}
      <div className="mb-10">
        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#0ea5e9] bg-[#e0f2fe] dark:bg-[#0ea5e9]/10 px-3 py-1 rounded-full mb-3">
          Legal
        </span>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="text-sm text-slate-400">Last updated: {LAST_UPDATED}</p>
      </div>

      <AlertBox>
        <strong>Please read carefully:</strong> All subscription payments made on MyTenant are
        final and non-refundable. We encourage you to use the free trial fully before subscribing.
      </AlertBox>

      <div className="mt-8">
        <Section title="1. Free Trial">
          <p>
            Every new account on MyTenant receives a <strong>7-day free trial</strong> with full
            access to all features. This gives you ample opportunity to evaluate the platform before
            making any payment. No credit card is required during the trial.
          </p>
        </Section>

        <Section title="2. No Refund Policy">
          <p>
            All payments made for MyTenant subscription plans are <strong>strictly non-refundable</strong>.
            Once a payment is processed, we do not issue refunds, partial refunds, or credits for:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Unused days in a billing period after cancellation.</li>
            <li>Downgrades from a higher plan to a lower plan.</li>
            <li>Forgetting to cancel before a renewal date.</li>
            <li>Change of mind after purchase.</li>
          </ul>
        </Section>

        <Section title="3. Cancellation">
          <p>
            MyTenant does not currently offer a self-serve cancellation option within the app.
            If you wish to cancel your subscription, you must email us at{' '}
            <a href="mailto:support@mytenant.me" className="text-[#0ea5e9] hover:underline">support@mytenant.me</a>{' '}
            with the subject line <strong>"Cancellation Request"</strong> and include your registered email address.
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Your subscription will remain active until the end of the current billing period.</li>
            <li>You will not be charged again after the period ends.</li>
            <li>No refund will be issued for the remaining days of the current period.</li>
          </ul>
        </Section>

        <Section title="4. Exceptions">
          <p>
            Refunds will only be considered in the following exceptional circumstances, entirely at
            our discretion:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>
              <strong>Duplicate charge:</strong> If you were charged more than once for the same
              billing period due to a technical error, the duplicate amount will be refunded.
            </li>
            <li>
              <strong>Razorpay error:</strong> If a payment failure was incorrectly recorded as
              successful, the charge will be reversed or refunded.
            </li>
          </ul>
          <p>
            To report such an issue, email{' '}
            <a href="mailto:support@mytenant.me" className="text-[#0ea5e9] hover:underline">
              support@mytenant.me
            </a>{' '}
            with your Razorpay Order ID within 7 days of the charge.
          </p>
        </Section>

        <Section title="5. Payment Processing">
          <p>
            All payments are securely processed by <strong>Razorpay</strong>. MyTenant does not
            store card or bank details. Disputes related to payment gateway errors should also be
            reported to us so we can coordinate with Razorpay on your behalf.
          </p>
        </Section>

        <Section title="6. Contact">
          <p>
            For billing queries, contact us at{' '}
            <a href="mailto:support@mytenant.me" className="text-[#0ea5e9] hover:underline">
              support@mytenant.me
            </a>{' '}
            or visit our{' '}
            <a href="/contact" className="text-[#0ea5e9] hover:underline">Contact page</a>.
          </p>
        </Section>
      </div>
    </article>
  )
}
