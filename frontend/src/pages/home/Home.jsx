import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import Logo from '../../components/ui/Logo.jsx'
import {
    MdArrowForward, MdArrowBack, MdOutlineDomain,
    MdOutlineBedroomParent, MdOutlineMeetingRoom, MdOutlineGroups,
    MdOutlineReceiptLong, MdOutlinePayments, MdOutlinePieChart,
    MdOutlineWarningAmber, MdOutlineCreditCard, MdAutoGraph,
    MdOutlineAssessment, MdOutlineFileDownload, MdOutlineCardMembership,
    MdLogin, MdPersonAdd, MdAutoAwesome
} from 'react-icons/md'
import SEO from '../../components/seo/SEO.jsx'
import MegaFooter from '../../components/layout/MegaFooter.jsx'

const FEATURES = [
    {
        title: 'Property Portfolio',
        description: 'Oversee your entire portfolio from a single intuitive dashboard. Track total assets, occupancy, and performance.',
        icon: MdOutlineDomain,
        color: 'from-blue-500 to-blue-600',
        image: '/ScreenShots/1.PropertyPage.webp'
    },
    {
        title: 'Deep Property Insights',
        description: 'Analyze occupancy rates, unit distributions, and real-time tenant statistics at a glance.',
        icon: MdOutlineBedroomParent,
        color: 'from-indigo-500 to-indigo-600',
        image: '/ScreenShots/2.PropertyDetail_Units.webp'
    },
    {
        title: 'Smart Unit Management',
        description: 'Add, configure, and manage units across properties. Set base rents and track availability.',
        icon: MdOutlineMeetingRoom,
        color: 'from-emerald-500 to-emerald-600',
        image: '/ScreenShots/3.UnitDetail_AddBills.webp'
    },
    {
        title: 'Tenant Onboarding',
        description: 'Full-lifecycle tenant management — onboarding to lease tracking and payment profiles.',
        icon: MdOutlineGroups,
        color: 'from-amber-500 to-amber-600',
        image: '/ScreenShots/5.TenantDetail.webp'
    },
    {
        title: 'Centralized Billing',
        description: 'Manage utility bills and expenses. Track water, electricity, and maintenance costs effortlessly.',
        icon: MdOutlineReceiptLong,
        color: 'from-purple-500 to-purple-600',
        image: '/ScreenShots/6.ManageBills.webp'
    },
    {
        title: 'Intelligent Bill Splitting',
        description: 'Automate complex calculations. Split master bills among tenants based on occupancy or custom rules.',
        icon: MdOutlinePieChart,
        color: 'from-pink-500 to-pink-600',
        image: '/ScreenShots/6.5AddBillSplits.webp'
    },
    {
        title: 'Overdue Tracking',
        description: 'Intelligent alerts highlight overdue rents and bills before they become a problem.',
        icon: MdOutlineWarningAmber,
        color: 'from-red-500 to-red-600',
        image: '/ScreenShots/7.OverdueRent.webp'
    },
    {
        title: 'Payments Feed',
        description: 'A transparent, searchable history of every transaction in one synchronized real-time feed.',
        icon: MdOutlineCreditCard,
        color: 'from-teal-500 to-teal-600',
        image: '/ScreenShots/8.TenantPayment.webp'
    },
    {
        title: 'Automated Rent Cycles',
        description: 'Generate rent invoices for your entire portfolio automatically every month.',
        icon: MdAutoGraph,
        color: 'from-orange-500 to-orange-600',
        image: '/ScreenShots/9.GenerateRentForEveryTenantForThisMonth.webp'
    },
    {
        title: 'Advanced Analytics',
        description: 'Generate comprehensive revenue reports, collection statements, and growth charts.',
        icon: MdOutlineAssessment,
        color: 'from-violet-500 to-violet-600',
        image: '/ScreenShots/10.GenerateReceips_Statements_SeeCollections.webp'
    },
    {
        title: 'PDF Exports',
        description: 'Export crystal-clear PDFs for receipts and statements to share with stakeholders.',
        icon: MdOutlineFileDownload,
        color: 'from-cyan-500 to-cyan-600',
        image: '/ScreenShots/10.5DownloadReport_ReceiptsEasily.webp'
    },
    {
        title: 'Scale Without Limits',
        description: 'Grow with confidence. Upgrade your plan seamlessly as your portfolio expands.',
        icon: MdOutlineCardMembership,
        color: 'from-slate-600 to-slate-700',
        image: '/ScreenShots/11.ExploreSubscription.webp'
    }
]

export default function Home() {
    const navigate = useNavigate()
    const [current, setCurrent] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [imageLoaded, setImageLoaded] = useState({})
    const [dashboardLoading, setDashboardLoading] = useState(false)

    const handleGoToDashboard = () => {
        setDashboardLoading(true)
        setTimeout(() => {
            navigate('/dashboard')
        }, 800)
    }



    const handleImageLoad = useCallback((idx) => {
        setImageLoaded(prev => ({ ...prev, [idx]: true }))
    }, [])

    const goTo = useCallback((idx) => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrent(idx)
        setTimeout(() => setIsTransitioning(false), 500)
    }, [isTransitioning])

    const next = useCallback(() => goTo((current + 1) % FEATURES.length), [current, goTo])
    const prev = useCallback(() => goTo((current - 1 + FEATURES.length) % FEATURES.length), [current, goTo])

    // Auto-advance every 5 seconds
    useEffect(() => {
        const timer = setInterval(next, 5000)
        return () => clearInterval(timer)
    }, [next])

    const feature = FEATURES[current]
    const Icon = feature.icon

    const faqs = [
        {
            question: "How does the rent ledger work?",
            answer: "Our automated rent ledger tracks all payments, overdue rents, and balances across your entire portfolio. When a tenant makes a payment, it instantly updates their balance and your global revenue dashboard."
        },
        {
            question: "Can I split utility bills among tenants?",
            answer: "Yes! You can log a master utility bill (like water or electricity) and our software will automatically divide it among your tenants equally, by custom percentage, or by fixed amounts."
        },
        {
            question: "Is this suitable for commercial real estate?",
            answer: "Absolutely. MyTenant handles unlimited properties and units, making it perfect for both residential apartments and commercial real estate portfolios."
        }
    ]

    return (
        <div className="flex flex-col bg-white dark:bg-slate-950 transition-colors">
            <main className="min-h-screen flex flex-col lg:flex-row w-full">
            <SEO 
                title="Property & Tenant Management Platform"
                description="MyTenant is a modern real estate property and tenant management platform offering automated rent ledgers, bill management, document storage, and easy PDF reporting."
                keywords="Property Management Software, Tenant Management Platform, Automated Rent Ledger, Real Estate, Bill Management, Rental Software, Apartment Management"
                canonical="/"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "MyTenant",
                    "applicationCategory": "BusinessApplication",
                    "operatingSystem": "Web",
                    "offers": {
                        "@type": "Offer",
                        "price": "9.99",
                        "priceCurrency": "USD"
                    }
                }}
            />
            
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": faqs.map(faq => ({
                        "@type": "Question",
                        "name": faq.question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": faq.answer
                        }
                    }))
                })}
            </script>

            {/* ═══ LEFT PANEL — Branding + CTAs ═══ */}
            <section className="relative lg:w-[45%] xl:w-[40%] overflow-hidden bg-slate-900 flex flex-col">
                {/* Geometric BG */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <svg className="w-full h-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="homeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.2 }} />
                                <stop offset="100%" style={{ stopColor: '#1e40af', stopOpacity: 0.5 }} />
                            </linearGradient>
                        </defs>
                        <path d="M0,0 L800,0 L800,800 L0,800 Z" fill="#0f172a" />
                        <polygon points="0,0 400,0 200,800 0,800" fill="url(#homeGrad)" />
                        <circle cx="600" cy="200" r="300" fill="#3b82f6" opacity="0.1" />
                        <path d="M400,0 Q600,400 300,800" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.2" />
                        <polygon points="500,100 700,300 600,600" fill="#1e40af" opacity="0.2" />
                    </svg>
                </div>

                <div className="relative z-10 flex flex-col justify-between p-8 sm:p-12 lg:p-16 w-full text-white flex-1">
                    {/* Logo */}
                    <div className="flex items-center select-none">
                        <Logo size="lg" />
                    </div>

                    {/* Headline */}
                    <header className="my-8 lg:my-0">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 leading-tight">
                            Manage your<br/>
                            <span className="text-blue-500">properties</span> with<br/>
                            absolute ease.
                        </h1>
                        <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-md mb-8 lg:mb-10">
                            Everything you need to track tenants, payments, and maintenance in one professional portal.
                        </p>

                        {/* CTA Buttons - Temporary Demo Mode */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <button
                                onClick={handleGoToDashboard}
                                disabled={dashboardLoading}
                                className="group flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] text-base disabled:opacity-75 disabled:cursor-wait"
                            >
                                {dashboardLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <MdOutlineCardMembership size={20} />
                                )}
                                {dashboardLoading ? 'Loading Dashboard...' : 'Go to Dashboard'}
                                {!dashboardLoading && <MdArrowForward size={18} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />}
                            </button>
                        </div>
                    </header>

                    {/* Footer */}
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-8 lg:mt-0">
                        <span>© 2026 MyTenant Platform</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                        <span>Premium Property Management</span>
                    </div>
                </div>
            </section>

            {/* ═══ RIGHT PANEL — Feature Carousel ═══ */}
            <section className="flex-1 flex flex-col bg-gray-50 dark:bg-slate-900 relative overflow-hidden">
                {/* Title bar */}
                <div className="px-6 sm:px-10 pt-6 sm:pt-8 pb-3 flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${feature.color} text-white transition-all duration-500`}>
                        <MdAutoAwesome size={20} />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
                        Quick Tour
                    </h2>
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                        {current + 1} / {FEATURES.length}
                    </span>
                </div>

                {/* Screenshot area */}
                <div className="flex-1 px-4 sm:px-8 pb-2 flex flex-col min-h-0">
                    <div className="flex-1 relative rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
                        {/* Gradient accent */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transition-all duration-500`}></div>

                        <div className="w-full h-full p-3 sm:p-5 flex flex-col">
                            <div className="relative w-full aspect-video lg:aspect-auto lg:flex-1" style={{ maxHeight: 'calc(100% - 80px)' }}>
                                {/* Shimmer skeleton — visible until image loads */}
                                {!imageLoaded[current] && (
                                    <div className="absolute inset-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                                        <div className="absolute inset-0 shimmer-bg"></div>
                                        {/* Skeleton layout lines */}
                                        <div className="absolute inset-4 flex flex-col gap-3">
                                            <div className="h-4 w-2/5 rounded-md bg-slate-300/60 dark:bg-slate-600/60"></div>
                                            <div className="flex-1 rounded-lg bg-slate-300/40 dark:bg-slate-600/40"></div>
                                            <div className="flex gap-3">
                                                <div className="h-3 flex-1 rounded bg-slate-300/50 dark:bg-slate-600/50"></div>
                                                <div className="h-3 w-1/4 rounded bg-slate-300/50 dark:bg-slate-600/50"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <img
                                    key={current}
                                    src={feature.image}
                                    alt={feature.title}
                                    onLoad={() => handleImageLoad(current)}
                                    onError={(e) => {
                                        e.target.onerror = null
                                        e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2394a3b8">Preview</text></svg>`
                                        handleImageLoad(current)
                                    }}
                                    className={`w-full h-full object-contain object-top rounded-lg transition-opacity duration-500 ${imageLoaded[current] ? 'opacity-100' : 'opacity-0'}`}
                                    style={{ animation: imageLoaded[current] ? 'homeSlideIn 0.5s ease-out' : 'none' }}
                                />
                            </div>

                            {/* Feature info */}
                            <article className="mt-3 sm:mt-4 flex items-start gap-3">
                                <div className={`shrink-0 p-2 rounded-xl bg-gradient-to-br ${feature.color} text-white transition-all duration-500`}>
                                    <Icon size={22} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                        {feature.description}
                                    </p>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="px-6 sm:px-10 py-4 sm:py-5 flex items-center justify-between">
                    {/* Dots */}
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                        {FEATURES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                                    i === current
                                        ? `w-8 bg-gradient-to-r ${feature.color} shadow-md`
                                        : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                                }`}
                                aria-label={`Feature ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Arrows */}
                    <div className="flex gap-2">
                        <button
                            onClick={prev}
                            aria-label="Previous feature"
                            className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
                        >
                            <MdArrowBack size={20} />
                        </button>
                        <button
                            onClick={next}
                            aria-label="Next feature"
                            className={`w-10 h-10 rounded-xl bg-gradient-to-r ${feature.color} text-white flex items-center justify-center hover:shadow-lg transition-all active:scale-95 cursor-pointer`}
                        >
                            <MdArrowForward size={20} />
                        </button>
                    </div>
                </div>

                {/* Mobile-only CTA strip */}
                <div className="lg:hidden px-6 pb-6 flex gap-3">
                    <Link
                        to="/login"
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] text-sm"
                    >
                        <MdLogin size={18} /> Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-xl transition-all active:scale-[0.98] text-sm"
                    >
                        <MdPersonAdd size={18} /> Register
                    </Link>
                </div>

                {/* Legal links - Mobile only */}
                <div className="lg:hidden pb-4 flex flex-wrap justify-center gap-x-4 gap-y-1">
                    {[['Privacy Policy', '/privacy-policy'], ['Terms', '/terms'], ['Refund Policy', '/refund-policy'], ['Contact', '/contact']].map(([label, to]) => (
                        <a key={to} href={to} className="text-[11px] text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">{label}</a>
                    ))}
                </div>
            </section>
            </main>

            {/* ═══ FAQ SECTION ═══ */}
            <section className="w-full max-w-4xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <details key={idx} className="group bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer">
                            <summary className="flex items-center justify-between p-6 font-semibold text-slate-800 dark:text-slate-200 list-none">
                                {faq.question}
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="px-6 pb-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </section>

            <MegaFooter />

            {/* Keyframe animation */}
            <style>{`
                @keyframes homeSlideIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .shimmer-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    animation: shimmer 1.5s infinite;
                }
                .dark .shimmer-bg::after {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
                }
                details > summary::-webkit-details-marker {
                    display: none;
                }
            `}</style>
        </div>
    )
}
