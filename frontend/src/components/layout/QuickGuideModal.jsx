import { useState } from 'react'
import { createPortal } from 'react-dom'
import { 
    MdClose, MdArrowForward, MdArrowBack, 
    MdOutlineDomain, MdOutlineMeetingRoom, MdOutlineGroups, 
    MdOutlineReceiptLong, MdOutlineBedroomParent, MdOutlinePayments,
    MdOutlinePieChart, MdOutlineWarningAmber, MdOutlineCreditCard,
    MdOutlineAssessment, MdOutlineFileDownload,
    MdOutlineCardMembership, MdAutoGraph
} from 'react-icons/md'

const GUIDE_STEPS = [
    {
        title: 'Welcome to TenantApp',
        description: 'Your central command for property management. Oversee your entire portfolio, track total assets, and monitor performance from a single intuitive dashboard.',
        icon: MdOutlineDomain,
        color: 'text-blue-500',
        buttonColor: 'bg-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        image: '/ScreenShots/1.PropertyPage.webp'
    },
    {
        title: 'Deep Property Insights',
        description: 'Dive into specific properties to analyze occupancy rates, unit distributions, and real-time tenant statistics at a glance.',
        icon: MdOutlineBedroomParent,
        color: 'text-indigo-500',
        buttonColor: 'bg-indigo-600',
        bg: 'bg-indigo-50 dark:bg-indigo-500/10',
        image: '/ScreenShots/2.PropertyDetail_Units.webp'
    },
    {
        title: 'Smart Unit Management',
        description: 'Seamlessly add, configure, and manage units across your properties. Set base rents and track availability with precision.',
        icon: MdOutlineMeetingRoom,
        color: 'text-emerald-500',
        buttonColor: 'bg-emerald-600',
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        image: '/ScreenShots/3.UnitDetail_AddBills.webp'
    },
    {
        title: 'Visual Asset Tracking',
        description: 'Maintain a visual record of your units. Upload layout photos and documentation to keep your property records comprehensive and organized.',
        icon: MdOutlineGroups,
        color: 'text-amber-500',
        buttonColor: 'bg-amber-600',
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        image: '/ScreenShots/4.UnitPhotos.webp'
    },
    {
        title: 'Seamless Tenant Onboarding',
        description: 'Full-lifecycle tenant management. From initial onboarding to lease tracking and individual payment profiles.',
        icon: MdOutlinePayments,
        color: 'text-green-500',
        buttonColor: 'bg-green-600',
        bg: 'bg-green-50 dark:bg-green-500/10',
        image: '/ScreenShots/5.TenantDetail.webp'
    },
    {
        title: 'Centralized Billing Hub',
        description: 'Manage utility bills and common expenses effortlessly. Track water, electricity, and maintenance costs across your entire operation.',
        icon: MdOutlineReceiptLong,
        color: 'text-purple-500',
        buttonColor: 'bg-purple-600',
        bg: 'bg-purple-50 dark:bg-purple-500/10',
        image: '/ScreenShots/6.ManageBills.webp'
    },
    {
        title: 'Intelligent Bill Splitting',
        description: 'Automate complex calculations. Split master bills among tenants based on occupancy or custom rules with just a few clicks.',
        icon: MdOutlinePieChart,
        color: 'text-pink-500',
        buttonColor: 'bg-pink-600',
        bg: 'bg-pink-50 dark:bg-pink-500/10',
        image: '/ScreenShots/6.5AddBillSplits.webp'
    },
    {
        title: 'Proactive Overdue Tracking',
        description: 'Stay ahead of collections. Our intelligent alert system highlights overdue rents and bills before they become a problem.',
        icon: MdOutlineWarningAmber,
        color: 'text-red-500',
        buttonColor: 'bg-red-600',
        bg: 'bg-red-50 dark:bg-red-500/10',
        image: '/ScreenShots/7.OverdueRent.webp'
    },
    {
        title: 'Unified Payments Feed',
        description: 'A transparent, searchable history of every transaction. Track rent payments and bill settlements in one synchronized real-time feed.',
        icon: MdOutlineCreditCard,
        color: 'text-teal-500',
        buttonColor: 'bg-teal-600',
        bg: 'bg-teal-50 dark:bg-teal-500/10',
        image: '/ScreenShots/8.TenantPayment.webp'
    },
    {
        title: 'Automated Rent Cycles',
        description: 'Say goodbye to manual entries. Generate rent invoices for your entire portfolio automatically at the start of every month.',
        icon: MdAutoGraph,
        color: 'text-orange-500',
        buttonColor: 'bg-orange-600',
        bg: 'bg-orange-50 dark:bg-orange-500/10',
        image: '/ScreenShots/9.GenerateRentForEveryTenantForThisMonth.webp'
    },
    {
        title: 'Advanced Analytics',
        description: 'Transform data into decisions. Generate comprehensive revenue reports, collection statements, and growth charts.',
        icon: MdOutlineAssessment,
        color: 'text-violet-500',
        buttonColor: 'bg-violet-600',
        bg: 'bg-violet-50 dark:bg-violet-500/10',
        image: '/ScreenShots/10.GenerateReceips_Statements_SeeCollections.webp'
    },
    {
        title: 'Branded Document Export',
        description: 'Professionalism in every detail. Export crystal-clear PDFs for receipts and financial statements to share with stakeholders.',
        icon: MdOutlineFileDownload,
        color: 'text-cyan-500',
        buttonColor: 'bg-cyan-600',
        bg: 'bg-cyan-50 dark:bg-cyan-500/10',
        image: '/ScreenShots/10.5DownloadReport_ReceiptsEasily.webp'
    },
    {
        title: 'Scale Without Limits',
        description: 'Grow your business with confidence. Monitor your usage and upgrade your plan seamlessly as your portfolio expands.',
        icon: MdOutlineCardMembership,
        color: 'text-slate-700 dark:text-slate-300',
        buttonColor: 'bg-slate-800 dark:bg-slate-700',
        bg: 'bg-slate-100 dark:bg-slate-800',
        image: '/ScreenShots/11.ExploreSubscription.webp'
    }
]

export default function QuickGuideModal({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState(0)

    if (!isOpen) return null

    const handleNext = () => {
        if (currentStep < GUIDE_STEPS.length - 1) setCurrentStep(c => c + 1)
        else {
            setCurrentStep(0)
            onClose()
        }
    }
    
    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(c => c - 1)
    }

    const step = GUIDE_STEPS[currentStep]
    const Icon = step.icon

    if (!document.body) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            ></div>
            
            <div className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[95vh] overflow-y-auto transform transition-all duration-500 ease-out sm:scale-100 scale-95 border border-slate-200 dark:border-slate-800">
                
                {/* Header / Image Area */}
                <div className={`relative w-full h-56 sm:h-[450px] shrink-0 ${step.bg} transition-colors duration-700 overflow-hidden flex flex-col`}>
                    {/* Decorative Blobs */}
                    <div className={`absolute -top-24 -left-24 w-64 h-64 rounded-full opacity-20 blur-3xl ${step.buttonColor} transition-colors duration-700`}></div>
                    <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full opacity-20 blur-3xl ${step.buttonColor} transition-colors duration-700`}></div>

                    <button 
                        onClick={onClose}
                        className="absolute z-20 top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/40 hover:bg-white/60 dark:bg-black/40 dark:hover:bg-black/60 backdrop-blur-md transition-all duration-200 text-slate-800 dark:text-white shadow-lg"
                    >
                        <MdClose size={20} className="sm:w-6 sm:h-6" />
                    </button>

                    {/* Screenshot Container */}
                    <div className="flex-1 w-full h-full p-4 sm:p-10 pb-0 flex justify-center items-end relative z-10">
                        <div className="relative w-full max-w-5xl transform group">
                            <div className="absolute -inset-1 bg-gradient-to-t from-black/20 to-transparent rounded-t-xl sm:rounded-t-2xl blur opacity-25"></div>
                            <img 
                                src={step.image} 
                                alt={step.title}
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2394a3b8">Image not found at '+step.image+'</text></svg>'
                                }}
                                className="object-contain sm:object-cover object-top w-full h-full aspect-video sm:aspect-auto sm:max-h-[380px] border-[4px] sm:border-[6px] border-b-0 border-white dark:border-slate-800 rounded-t-xl sm:rounded-t-3xl shadow-2xl bg-white dark:bg-slate-800 transition-transform duration-500 hover:scale-[1.01]"
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 sm:px-12 pt-6 sm:pt-8 pb-6 sm:pb-8 text-center flex-1">
                    <div className={`inline-flex p-2.5 sm:p-3 rounded-2xl ${step.bg} ${step.color} mb-3 sm:mb-4 transition-all duration-300 transform hover:scale-110`}>
                        <Icon size={28} className="sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 sm:mb-4 tracking-tight">
                        {step.title}
                    </h3>
                    <p className="text-sm sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                        {step.description}
                    </p>
                </div>

                {/* Footer Controls */}
                <div className="px-6 sm:px-12 pb-8 sm:pb-10 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
                    
                    {/* Dots indicator */}
                    <div className="flex gap-1.5 sm:gap-2 overflow-x-auto py-2 max-w-full no-scrollbar">
                        {GUIDE_STEPS.map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => setCurrentStep(i)}
                                className={`h-2 rounded-full transition-all duration-500 hover:opacity-100 ${
                                    i === currentStep 
                                        ? `w-10 ${step.buttonColor} shadow-lg opacity-100` 
                                        : 'w-2 bg-slate-300 dark:bg-slate-700 opacity-50 hover:bg-slate-400'
                                }`}
                                aria-label={`Go to step ${i + 1}`}
                            />
                        ))}
                    </div>

                    <div className="flex gap-3">
                        {currentStep > 0 && (
                            <button
                                onClick={handlePrev}
                                className="w-12 h-12 rounded-2xl border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 active:scale-95"
                            >
                                <MdArrowBack size={24} />
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className={`px-8 h-12 rounded-2xl font-black text-base text-white transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-95 flex items-center gap-3 ${step.buttonColor}`}
                        >
                            <span>{currentStep === GUIDE_STEPS.length - 1 ? 'Start Managing' : 'Next Step'}</span>
                            {currentStep !== GUIDE_STEPS.length - 1 && <MdArrowForward size={22} />}
                        </button>
                    </div>

                </div>

            </div>
        </div>,
        document.body
    )
}
