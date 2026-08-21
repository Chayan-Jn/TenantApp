import { Link } from 'react-router'

export default function MegaFooter() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 w-full pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        {/* Column 1 */}
        <div>
          <h3 className="text-white font-bold mb-4 tracking-tight">Features</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link prefetch="intent" to="/features/rent-ledger" className="hover:text-[#0ea5e9] transition-colors py-1 block">Automated Rent Ledger</Link></li>
            <li><Link prefetch="intent" to="/features/bill-splitting" className="hover:text-[#0ea5e9] transition-colors py-1 block">Utility Bill Splitting</Link></li>
            <li><Link prefetch="intent" to="/features/tenant-tracking" className="hover:text-[#0ea5e9] transition-colors py-1 block">Tenant Tracking Portal</Link></li>
            <li><Link prefetch="intent" to="/features/auto-signatures" className="hover:text-[#0ea5e9] transition-colors py-1 block">Auto-Sign Documents</Link></li>
            <li><Link prefetch="intent" to="/tools/rent-calculator" className="hover:text-[#0ea5e9] transition-colors py-1 block">Prorated Rent Calculator</Link></li>
            <li><Link prefetch="intent" to="/pricing" className="hover:text-[#0ea5e9] transition-colors py-1 block">Pricing & Plans</Link></li>
            <li><Link prefetch="intent" to="/tools/cap-rate-calculator" className="hover:text-[#0ea5e9] transition-colors py-1 block">Cap Rate Calculator</Link></li>
            <li><Link prefetch="intent" to="/tools/roi-calculator" className="hover:text-[#0ea5e9] transition-colors py-1 block">ROI Calculator</Link></li>
            <li><Link prefetch="intent" to="/tools/cost-segregation" className="hover:text-[#0ea5e9] transition-colors py-1 block">Cost Segregation Estimator</Link></li>
            <li><Link prefetch="intent" to="/tools/1031-exchange" className="hover:text-[#0ea5e9] transition-colors py-1 block">1031 Exchange Tax Shield</Link></li>
          </ul>
        </div>
        
        {/* Column 2 */}
        <div>
          <h3 className="text-white font-bold mb-4 tracking-tight">Compare Alternatives</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link prefetch="intent" to="/compare/alternatives" className="hover:text-[#0ea5e9] transition-colors font-semibold py-1 block">MyTenant vs Competitors</Link></li>
          </ul>
        </div>
        
        {/* Column 3: Research & Data */}
        <div>
          <h3 className="text-white font-bold mb-4 tracking-tight">Research Hub</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link prefetch="intent" to="/research/green-premiums" className="hover:text-[#0ea5e9] transition-colors py-1 block">Low-Carbon Rent Premium</Link></li>
            <li><Link prefetch="intent" to="/research/tenant-retention" className="hover:text-[#0ea5e9] transition-colors py-1 block">Vacancy Rate Paradox</Link></li>
            <li><Link prefetch="intent" to="/research/smart-management" className="hover:text-[#0ea5e9] transition-colors py-1 block">IoT Property Management</Link></li>
            <li><Link prefetch="intent" to="/research/behavioral-rent" className="hover:text-[#0ea5e9] transition-colors py-1 block">Behavioral Rent Collection</Link></li>
            <li><Link prefetch="intent" to="/research/maintenance-roi" className="hover:text-[#0ea5e9] transition-colors py-1 block">Maintenance & Renewals</Link></li>
            <li><Link prefetch="intent" to="/research/utility-billing" className="hover:text-[#0ea5e9] transition-colors py-1 block">RUBS vs Submetering</Link></li>
            <li><Link prefetch="intent" to="/research/rent-determinants" className="hover:text-[#0ea5e9] transition-colors py-1 block">Hedonic Pricing Models</Link></li>
            <li><Link prefetch="intent" to="/research/landlord-economics" className="hover:text-[#0ea5e9] transition-colors py-1 block">Institutional vs Independent</Link></li>
            <li><Link prefetch="intent" to="/research/eviction-costs" className="hover:text-[#0ea5e9] transition-colors py-1 block">The Cost of Eviction</Link></li>
            <li><Link prefetch="intent" to="/research/digital-transformation" className="hover:text-[#0ea5e9] transition-colors py-1 block">Digital Audit Liabilities</Link></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-white font-bold mb-4 tracking-tight">Legal</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link prefetch="intent" to="/about" className="hover:text-[#0ea5e9] transition-colors py-1 block">About & Editorial Standards</Link></li>
            <li><Link prefetch="intent" to="/privacy-policy" className="hover:text-[#0ea5e9] transition-colors py-1 block">Privacy Policy</Link></li>
            <li><Link prefetch="intent" to="/terms" className="hover:text-[#0ea5e9] transition-colors py-1 block">Terms of Service</Link></li>
            <li><Link prefetch="intent" to="/refund-policy" className="hover:text-[#0ea5e9] transition-colors py-1 block">Refund & Cancellation</Link></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-white font-bold mb-4 tracking-tight">Resources & Company</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link prefetch="intent" to="/insights" className="hover:text-[#0ea5e9] transition-colors py-1 block">Daily Insights</Link></li>
            <li><Link prefetch="intent" to="/contact" className="hover:text-[#0ea5e9] transition-colors py-1 block">Contact Support</Link></li>
            <li><a href="mailto:support@mytenant.me" className="hover:text-[#0ea5e9] transition-colors py-1 block">support@mytenant.me</a></li>
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
