import React, { useState } from 'react'
import { Link } from 'react-router'
import SEO from '../../components/seo/SEO.jsx'
import { MdOutlineSwapHoriz, MdArrowForward } from 'react-icons/md'

export default function Exchange1031() {
  const [purchasePrice, setPurchasePrice] = useState('500000')
  const [salePrice, setSalePrice] = useState('850000')
  const [accumulatedDepreciation, setAccumulatedDepreciation] = useState('150000')
  const [results, setResults] = useState(null)

  const handleCalculate = () => {
    const pPrice = parseFloat(purchasePrice) || 0
    const sPrice = parseFloat(salePrice) || 0
    const depreciation = parseFloat(accumulatedDepreciation) || 0

    // Math Logic for Real Estate Sale
    // 1. Depreciation Recapture (Strict 25% tax on all depreciation taken)
    const depreciationRecaptureTax = depreciation * 0.25

    // 2. Capital Gains (Sale Price - Purchase Price)
    // Assuming holding longer than 1 year (Long Term Capital Gains at roughly 15% for illustration, though it can be 20%)
    const rawGain = sPrice - pPrice
    const capitalGainsTax = rawGain > 0 ? (rawGain * 0.15) : 0

    // 3. Net Investment Income Tax (NIIT) - 3.8% on gains (Assuming high income earner)
    const niitTax = rawGain > 0 ? (rawGain * 0.038) : 0

    const totalTaxLiability = depreciationRecaptureTax + capitalGainsTax + niitTax

    setResults({
      recapture: depreciationRecaptureTax,
      capitalGains: capitalGainsTax,
      niit: niitTax,
      totalTax: totalTaxLiability,
      netProceedsWithout1031: (sPrice - totalTaxLiability),
      netProceedsWith1031: sPrice
    })
  }

  return (
    <article className="relative w-full max-w-3xl mx-auto overflow-hidden">
      <SEO 
        title="1031 Exchange Tax Calculator | MyTenant Tools"
        description="Calculate exact capital gains, depreciation recapture, and NIIT taxes you will shield by executing a Section 1031 Like-Kind Exchange."
        keywords="1031 Exchange Calculator, Capital Gains Tax Calculator Real Estate, Depreciation Recapture Tax, Like Kind Exchange"
        canonical="/tools/1031-exchange"
      />

      <div className="text-center mb-12 pt-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 mb-6 border border-fuchsia-200 dark:border-fuchsia-800/50">
          <MdOutlineSwapHoriz size={32} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
          1031 Exchange Tax Shield
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Calculate the exact massive tax liability you will incur upon sale, and how much equity you protect by utilizing an IRS Section 1031 Exchange.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-10 shadow-xl mb-12 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="grid sm:grid-cols-1 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Original Purchase Price ($)</label>
            <input 
              type="number" 
              value={purchasePrice}
              onChange={e => setPurchasePrice(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-fuchsia-500 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Estimated Sale Price ($)</label>
            <input 
              type="number" 
              value={salePrice}
              onChange={e => setSalePrice(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-fuchsia-500 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Accumulated Depreciation Taken ($)</label>
            <input 
              type="number" 
              value={accumulatedDepreciation}
              onChange={e => setAccumulatedDepreciation(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-fuchsia-500 text-slate-900 dark:text-white"
            />
            <p className="text-xs text-slate-400 mt-2">The total amount of straight-line or accelerated depreciation you've claimed on taxes over the years.</p>
          </div>
        </div>

        <button 
          onClick={handleCalculate}
          className="w-full mb-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-fuchsia-600/25 active:scale-[0.98]"
        >
          Calculate Tax Liability
        </button>

        {results && (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase">Depreciation Recapture (25%)</p>
                <p className="text-xl font-bold text-red-500">
                  ${results.recapture.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase">Federal Capital Gains (15%)</p>
                <p className="text-xl font-bold text-red-500">
                  ${results.capitalGains.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase">NIIT Surcharge (3.8%)</p>
                <p className="text-xl font-bold text-red-500">
                  ${results.niit.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-center opacity-70">
                <p className="text-xs text-slate-500 mb-2 font-semibold uppercase">Buying Power (Standard Sale)</p>
                <p className="text-3xl font-bold text-slate-700 dark:text-slate-400">
                  ${results.netProceedsWithout1031.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </p>
                <p className="text-[10px] text-red-500 mt-2">Loses ${results.totalTax.toLocaleString(undefined, {maximumFractionDigits: 0})} to taxes</p>
              </div>
              
              <div className="p-6 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-2xl border border-fuchsia-200 dark:border-fuchsia-800/30 text-center ring-1 ring-fuchsia-500/50">
                <p className="text-xs text-fuchsia-600 dark:text-fuchsia-400 mb-2 font-semibold uppercase flex items-center justify-center gap-1">
                  <MdOutlineSwapHoriz /> Buying Power (1031 Exchange)
                </p>
                <p className="text-4xl font-bold text-fuchsia-600 dark:text-fuchsia-400">
                  ${results.netProceedsWith1031.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </p>
                <p className="text-[10px] text-fuchsia-500 mt-2">100% Tax Deferral</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl mb-16">
        <h2 className="text-xl font-bold text-white mb-4">Manage the New Asset with Ease</h2>
        <p className="text-slate-400 text-sm mb-6">When you trade up via a 1031 exchange, the management gets harder. Use MyTenant to automate rent collection for your newly acquired properties.</p>
        <Link 
          to="/register" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#0ea5e9]/25"
        >
          Automate Property Management <MdArrowForward />
        </Link>
      </div>

      <section className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700 shadow-sm mb-16">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4 mb-8">
            The Wealth Engine: IRS Section 1031
          </h2>
          
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            When an independent landlord decides to sell a highly appreciated property, they are often shocked to discover that up to <strong>40% of their equity</strong> can be immediately wiped out by a combination of state and federal taxes. 
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white">The "Phantom" Tax: Depreciation Recapture</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Throughout the years you owned the property, you took a depreciation deduction against your income. The IRS views this as a loan. When you sell the property, the IRS forces you to "recapture" all of that depreciation and taxes it at a strict <strong>25% rate</strong>, regardless of your standard income bracket. This often results in a massive unexpected tax bill.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white">The 1031 Solution</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Under Section 1031 of the United States Internal Revenue Code, a taxpayer may defer recognition of capital gains and related federal income tax liability on the exchange of certain types of property. In short: if you take the proceeds from the sale and roll them entirely into a "Like-Kind" investment property (e.g., selling a duplex to buy a 4-plex), you pay <strong>zero taxes at the time of sale.</strong>
          </p>
          <ul className="list-disc pl-6 space-y-3 text-slate-600 dark:text-slate-300 mb-8">
            <li><strong>Strict Timelines:</strong> You have exactly 45 days from the sale to identify a replacement property, and 180 days to close on it.</li>
            <li><strong>Qualified Intermediary:</strong> You cannot touch the money. The funds must be held by a third-party Qualified Intermediary (QI) during the transition.</li>
            <li><strong>Equal or Greater Value:</strong> To defer 100% of the tax, the new property must be of equal or greater value, and you must reinvest all cash proceeds.</li>
          </ul>

          <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
            <strong>Strict Legal & Tax Disclaimer:</strong> A 1031 Like-Kind Exchange is one of the most heavily audited processes in real estate. Failing to meet the 45-day identification window by even a single minute will result in immediate disqualification and full tax liability. This calculator provides simplified estimations and does not account for state-level capital gains taxes (which vary widely). You MUST use a Qualified Intermediary and consult a licensed tax professional before initiating a sale. MyTenant is not a financial advisor.
          </div>
        </div>
      </section>
    </article>
  )
}
