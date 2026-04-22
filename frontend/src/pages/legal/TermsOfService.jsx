const LAST_UPDATED = 'April 22, 2025'

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{title}</h2>
    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">{children}</div>
  </section>
)

export default function TermsOfService() {
  return (
    <article>
      {/* Hero */}
      <div className="mb-10">
        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#0ea5e9] bg-[#e0f2fe] dark:bg-[#0ea5e9]/10 px-3 py-1 rounded-full mb-3">
          Legal
        </span>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-400">Last updated: {LAST_UPDATED}</p>
      </div>

      <Section title="1. Acceptance of Terms">
        <p>
          By registering for or using MyTenant ("Service"), you agree to be bound by these Terms of Service. If you
          do not agree, please do not use the Service.
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p>
          MyTenant is a SaaS platform that helps property owners and managers track properties, units, tenants,
          rent payments, bills, and documents. The Service is provided on a subscription basis after a free trial period.
        </p>
      </Section>

      <Section title="3. Eligibility">
        <p>
          You must be at least 18 years old and capable of entering a legally binding agreement to use this Service.
          By using MyTenant, you represent that you meet these requirements.
        </p>
      </Section>

      <Section title="4. Accounts">
        <ul className="list-disc pl-5 space-y-1">
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You must notify us immediately of any unauthorised use of your account.</li>
          <li>Each account is for a single user or business entity; sharing credentials is not permitted.</li>
        </ul>
      </Section>

      <Section title="5. Free Trial">
        <p>
          New accounts receive a 7-day free trial with full access to all features. No payment is required to start
          the trial. After the trial ends, access to protected features requires an active paid subscription.
        </p>
      </Section>

      <Section title="6. Subscriptions & Payment">
        <ul className="list-disc pl-5 space-y-1">
          <li>Subscription plans are available on a monthly (₹199/month) or annual (₹1,199/year) basis.</li>
          <li>Payments are processed securely by Razorpay. We do not store payment credentials.</li>
          <li>Subscriptions do not auto-renew. You must manually renew your subscription at the end of each billing cycle to maintain access to paid features.</li>
          <li>Prices are inclusive of applicable taxes unless stated otherwise.</li>
        </ul>
      </Section>

      <Section title="7. Cancellation">
        <p>
          MyTenant does not currently offer a self-serve cancellation option within the app.
          If you wish to cancel your subscription, you must email us at{' '}
          <a href="mailto:support@mytenant.me" className="text-[#0ea5e9] hover:underline">support@mytenant.me</a>{' '}
          with the subject line <strong>"Cancellation Request"</strong> and include your registered email address.
        </p>
        <p>
          Cancellation requests are reviewed manually and will be processed within 3–5 business days. Since all
          payments are non-refundable, cancellation stops future billing only — you will not receive a refund
          for the current or any past billing period. Cancellations are only actioned in special circumstances
          at our sole discretion.
        </p>
      </Section>

      <Section title="8. Refunds">
        <p>
          Please refer to our{' '}
          <a href="/refund-policy" className="text-[#0ea5e9] hover:underline">Refund & Cancellation Policy</a>{' '}
          for details on refund eligibility.
        </p>
      </Section>

      <Section title="9. Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use the Service for any unlawful purpose or in violation of any applicable law.</li>
          <li>Attempt to reverse-engineer, scrape, or hack the platform.</li>
          <li>Upload content that is false, defamatory, or infringes third-party rights.</li>
          <li>Use the Service to harass or harm tenants or third parties.</li>
          <li>Upload sensitive personal documents (e.g. Aadhaar, PAN, bank statements) that you are not authorised to store digitally. You are solely responsible for content you upload.</li>
        </ul>
      </Section>

      <Section title="10. Intellectual Property">
        <p>
          All content, trademarks, and software that form part of MyTenant are the exclusive property of MyTenant
          and its licensors. You are granted a limited, non-exclusive, non-transferable licence to use the Service
          for its intended purpose.
        </p>
      </Section>

      <Section title="11. Data Ownership">
        <p>
          You retain full ownership of all data you enter into MyTenant (property details, tenant records, etc.).
          You grant us a limited licence to process this data solely to provide the Service.
        </p>
      </Section>

      <Section title="12. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, MyTenant shall not be liable for any indirect, incidental, special,
          or consequential damages arising from your use of (or inability to use) the Service. Our total liability
          shall not exceed the amount paid by you in the 3 months preceding the claim.
        </p>
      </Section>

      <Section title="13. Disclaimer of Warranties">
        <p>
          The Service is provided "as is" and "as available" without warranties of any kind. We do not warrant
          that the Service will be error-free, uninterrupted, or free of viruses.
        </p>
      </Section>

      <Section title="14. Governing Law">
        <p>
          These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction
          of the courts located in India.
        </p>
      </Section>

      <Section title="15. Changes to Terms">
        <p>
          We reserve the right to modify these Terms at any time. We will provide at least 14 days' notice of
          material changes via email. Continued use of the Service after that period constitutes acceptance.
        </p>
      </Section>

      <Section title="16. Contact">
        <p>
          For questions about these Terms, contact us at{' '}
          <a href="mailto:support@mytenant.me" className="text-[#0ea5e9] hover:underline">support@mytenant.me</a>{' '}
          or visit our{' '}
          <a href="/contact" className="text-[#0ea5e9] hover:underline">Contact page</a>.
        </p>
      </Section>
    </article>
  )
}
