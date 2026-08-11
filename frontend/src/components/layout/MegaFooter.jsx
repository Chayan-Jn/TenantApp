import { Link } from 'react-router'

export default function MegaFooter() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 w-full pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        {/* Column 1 */}
        <div>
          <h3 className="text-white font-bold mb-4 tracking-tight">Features</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link prefetch="intent" to="/features/rent-ledger" className="hover:text-[#0ea5e9] transition-colors">Automated Rent Ledger</Link></li>
            <li><Link prefetch="intent" to="/features/bill-splitting" className="hover:text-[#0ea5e9] transition-colors">Utility Bill Splitting</Link></li>
            <li><Link prefetch="intent" to="/features/tenant-tracking" className="hover:text-[#0ea5e9] transition-colors">Tenant Tracking Portal</Link></li>
            <li><Link prefetch="intent" to="/features/auto-signatures" className="hover:text-[#0ea5e9] transition-colors">Auto-Sign Documents</Link></li>
            <li><Link prefetch="intent" to="/tools/rent-calculator" className="hover:text-[#0ea5e9] transition-colors">Prorated Rent Calculator</Link></li>
            <li><Link prefetch="intent" to="/pricing" className="hover:text-[#0ea5e9] transition-colors">Pricing & Plans</Link></li>
          </ul>
        </div>
        
        {/* Column 2 */}
        <div>
          <h3 className="text-white font-bold mb-4 tracking-tight">Compare Alternatives</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link prefetch="intent" to="/compare/alternatives" className="hover:text-[#0ea5e9] transition-colors font-semibold">MyTenant vs Competitors</Link></li>
          </ul>
        </div>
        
        {/* Column 3: Research & Data */}
        <div>
          <h3 className="text-white font-bold mb-4 tracking-tight">Research Hub</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link prefetch="intent" to="/research/green-premiums" className="hover:text-[#0ea5e9] transition-colors">Low-Carbon Rent Premium</Link></li>
            <li><Link prefetch="intent" to="/research/tenant-retention" className="hover:text-[#0ea5e9] transition-colors">Vacancy Rate Paradox</Link></li>
            <li><Link prefetch="intent" to="/research/smart-management" className="hover:text-[#0ea5e9] transition-colors">IoT Property Management</Link></li>
            <li><Link prefetch="intent" to="/research/behavioral-rent" className="hover:text-[#0ea5e9] transition-colors">Behavioral Rent Collection</Link></li>
            <li><Link prefetch="intent" to="/research/maintenance-roi" className="hover:text-[#0ea5e9] transition-colors">Maintenance & Renewals</Link></li>
            <li><Link prefetch="intent" to="/research/utility-billing" className="hover:text-[#0ea5e9] transition-colors">RUBS vs Submetering</Link></li>
            <li><Link prefetch="intent" to="/research/rent-determinants" className="hover:text-[#0ea5e9] transition-colors">Hedonic Pricing Models</Link></li>
            <li><Link prefetch="intent" to="/research/landlord-economics" className="hover:text-[#0ea5e9] transition-colors">Institutional vs Independent</Link></li>
            <li><Link prefetch="intent" to="/research/eviction-costs" className="hover:text-[#0ea5e9] transition-colors">The Cost of Eviction</Link></li>
            <li><Link prefetch="intent" to="/research/digital-transformation" className="hover:text-[#0ea5e9] transition-colors">Digital Audit Liabilities</Link></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-white font-bold mb-4 tracking-tight">Legal</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link prefetch="intent" to="/privacy-policy" className="hover:text-[#0ea5e9] transition-colors">Privacy Policy</Link></li>
            <li><Link prefetch="intent" to="/terms" className="hover:text-[#0ea5e9] transition-colors">Terms of Service</Link></li>
            <li><Link prefetch="intent" to="/refund-policy" className="hover:text-[#0ea5e9] transition-colors">Refund & Cancellation</Link></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-white font-bold mb-4 tracking-tight">Company</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link prefetch="intent" to="/contact" className="hover:text-[#0ea5e9] transition-colors">Contact Support</Link></li>
            <li><a href="mailto:support@mytenant.me" className="hover:text-[#0ea5e9] transition-colors">support@mytenant.me</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white tracking-tight">
            My<span className="text-[#0ea5e9]">Tenant</span>
          </span>
        </div>
        <p className="text-xs text-slate-500 text-center">© {new Date().getFullYear()} MyTenant Property Management Software. All rights reserved.</p>
      </div>
    </footer>
  )
}
