const LAST_UPDATED = 'April 22, 2025'

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{title}</h2>
    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">{children}</div>
  </section>
)

export default function PrivacyPolicy() {
  return (
    <article>
      {/* Hero */}
      <div className="mb-10">
        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#0ea5e9] bg-[#e0f2fe] dark:bg-[#0ea5e9]/10 px-3 py-1 rounded-full mb-3">
          Legal
        </span>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-400">Last updated: {LAST_UPDATED}</p>
      </div>

      <Section title="1. Who We Are">
        <p>
          MyTenant ("we", "our", "us") is a property and tenant management SaaS platform operated by an
          individual developer. Our platform is accessible at{' '}
          <a href="https://mytenant.me" className="text-[#0ea5e9] hover:underline">https://mytenant.me</a>.
          We are committed to protecting the personal information you share with us.
        </p>
        <p>
          If you have any questions about this policy, contact us at{' '}
          <a href="mailto:support@mytenant.me" className="text-[#0ea5e9] hover:underline">support@mytenant.me</a>.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <p>We collect the following categories of information when you use MyTenant:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Account information:</strong> name, email address, and password (hashed).</li>
          <li><strong>Property &amp; tenant data:</strong> property addresses, unit details, tenant names, rent amounts, and lease dates that you enter into the platform.</li>
          <li><strong>Unit photos:</strong> images you upload for property units, stored securely on Backblaze B2 cloud storage.</li>
          <li><strong>Payment information:</strong> order IDs and payment verification tokens processed via Razorpay. We do <em>not</em> store card numbers or bank account details.</li>
          <li><strong>Usage data:</strong> pages visited, features used, browser type, and IP address for security and analytics purposes.</li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Information">
        <ul className="list-disc pl-5 space-y-1">
          <li>To create and manage your account and subscription.</li>
          <li>To process payments securely via Razorpay.</li>
          <li>To send transactional emails (receipts, renewal reminders).</li>
          <li>To improve the platform and troubleshoot bugs.</li>
          <li>To comply with legal obligations.</li>
        </ul>
        <p>We do <strong>not</strong> sell your data to third parties.</p>
      </Section>

      <Section title="4. Data Sharing">
        <p>We share data only with trusted service providers necessary to operate the platform:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Razorpay</strong> — payment processing (subject to Razorpay's Privacy Policy).</li>
          <li><strong>Vercel</strong> — frontend hosting and CDN.</li>
          <li><strong>DigitalOcean</strong> — backend server and database hosting.</li>
          <li><strong>Backblaze B2</strong> — cloud storage for unit photos and documents.</li>
        </ul>
        <p>All third parties are contractually bound to handle your data securely and only as instructed.</p>
      </Section>

      <Section title="5. User-Uploaded Content">
        <p>
          You may upload photos and documents as part of using the platform (e.g. unit photos). By uploading
          content, you confirm that:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>You own or have the right to upload the content.</li>
          <li>The content does not include sensitive personal data (e.g. Aadhaar, PAN, passport scans, financial account numbers) unless absolutely necessary for your own records.</li>
          <li>We are <strong>not responsible</strong> for the nature or sensitivity of content you choose to upload. You upload at your own discretion and risk.</li>
        </ul>
        <p>
          Uploaded files are stored on Backblaze B2 and accessible only to your account.
          Do <strong>not</strong> upload confidential documents that you are not authorised to store digitally.
        </p>
      </Section>

      <Section title="6. Cookies">
        <p>
          We use a single authentication cookie (HTTP-only, secure) to keep you signed in. We do not use
          third-party advertising cookies or tracking pixels.
        </p>
      </Section>

      <Section title="7. Data Retention">
        <p>
          We retain your account data for as long as your account is active. On account deletion, personal data is
          purged within 30 days, except where retention is required by law.
        </p>
      </Section>

      <Section title="8. Security">
        <p>
          All data is transmitted over HTTPS. Passwords are stored using bcrypt hashing. Payments are handled
          entirely by Razorpay's PCI-DSS compliant infrastructure — we never touch raw card data.
        </p>
      </Section>

      <Section title="9. Your Rights">
        <p>You may at any time:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access or export the data we hold about you.</li>
          <li>Correct inaccurate information via your account settings.</li>
          <li>Request deletion of your account and associated data.</li>
        </ul>
        <p>
          To exercise any of these rights, email us at{' '}
          <a href="mailto:support@mytenant.me" className="text-[#0ea5e9] hover:underline">support@mytenant.me</a>.
        </p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>
          We may update this policy periodically. Material changes will be communicated via email or an in-app
          notice. Continued use of the platform after changes constitutes acceptance.
        </p>
      </Section>
    </article>
  )
}
