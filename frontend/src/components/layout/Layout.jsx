import { useState } from 'react'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import TrialBanner from '../subscription/TrialBanner.jsx'
import { useRouteLoaderData } from 'react-router'

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { data: owner } = useRouteLoaderData('root') || { data: {} }

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
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-slate-900 transition-colors duration-200 w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}