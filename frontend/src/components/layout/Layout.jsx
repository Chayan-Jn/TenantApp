import { useEffect, useState } from 'react'
import { Outlet, Link, ScrollRestoration } from 'react-router'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import TrialBanner from '../subscription/TrialBanner.jsx'
import { useRouteLoaderData } from 'react-router'

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [showDemoBanner, setShowDemoBanner] = useState(true)
    const { data: owner } = useRouteLoaderData('root') || { data: {} }
    const demoId = owner?.id || owner?.data?.id
    const isDemoAccount = demoId === 99999 || owner?.isDemo || owner?.data?.isDemo

    useEffect(() => {
        if (!isDemoAccount) return
        const dismissed = localStorage.getItem('tenantapp_demo_banner_dismissed') === '1'
        if (dismissed) {
            setShowDemoBanner(false)
        }
    }, [isDemoAccount])

    const dismissDemoBanner = () => {
        setShowDemoBanner(false)
        localStorage.setItem('tenantapp_demo_banner_dismissed', '1')
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                {/* 
                   Assumes owner data will eventually contain subscription info.
                   If backend isn't ready, it defaults to hidden.
                */}
                <TrialBanner 
                  status={owner?.subscription_status} 
                  daysLeft={owner?.trial_days_left} 
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-slate-900 transition-colors duration-200 w-full relative">
                    {isDemoAccount && showDemoBanner && (
                        <div className="mb-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm text-blue-900 dark:text-blue-200">
                                You are viewing the live demo workspace. Changes here are for evaluation only.
                            </p>
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                >
                                    Create Free Account
                                </Link>
                                <button
                                    onClick={dismissDemoBanner}
                                    className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    )}
                    <Outlet />
                </main>
            </div>
            <ScrollRestoration />
        </div>
    )
}