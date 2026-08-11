import { useState } from 'react'
import { Outlet, Link } from 'react-router'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import TrialBanner from '../subscription/TrialBanner.jsx'
import { useRouteLoaderData } from 'react-router'

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { data: owner } = useRouteLoaderData('root') || { data: {} }
    const demoId = owner?.id || owner?.data?.id
    const isDemoAccount = demoId === 99999 || owner?.isDemo || owner?.data?.isDemo

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
                    <Outlet />
                    
                    {/* Persistent Create Account Button for Demo Mode */}
                    {isDemoAccount && (
                        <Link 
                            to="/register"
                            className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all hover:-translate-y-1 animate-bounce"
                            style={{ animationDuration: '3s' }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                            Create Free Account
                        </Link>
                    )}
                </main>
            </div>
        </div>
    )
}