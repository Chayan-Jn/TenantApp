import { NavLink } from 'react-router'

import {
    MdOutlineSpaceDashboard,
    MdOutlineDomain,
    MdOutlineWarningAmber,
    MdOutlineCreditCard,
    MdOutlineSettings,
    MdDomain,
    MdOutlineReceiptLong,
    MdOutlineDescription,
    MdClose
} from 'react-icons/md'

const links = [
    { to: '/dashboard', label: 'Dashboard', icon: MdOutlineSpaceDashboard },
    { to: '/properties', label: 'Properties', icon: MdOutlineDomain },
    { to: '/bills', label: 'Bills', icon: MdOutlineReceiptLong },
    { to: '/rent/overdue', label: 'Overdue Rent', icon: MdOutlineWarningAmber },
    { to: '/payments', label: 'Payments', icon: MdOutlineCreditCard },
    { to: '/reports', label: 'Reports', icon: MdOutlineDescription },
    { to: '/settings', label: 'Settings', icon: MdOutlineSettings }
]

export default function Sidebar({ isOpen, setIsOpen }) {
    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 h-full bg-[#1e293b] flex flex-col text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            <div className="h-20 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-[#0ea5e9] p-2.5 rounded-lg flex items-center justify-center">
                        <MdDomain className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-wide text-white">TenantApp</h1>
                </div>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    <MdClose size={24} />
                </button>
            </div>


            <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
                {links.map((link) => {
                    const Icon = link.icon
                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-[#0ea5e9] text-white shadow-md'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`
                            }
                        >

                            <Icon className="w-5 h-5" />
                            {link.label}
                        </NavLink>
                    )
                })}
            </nav>
        </aside>
    )
}