import React from 'react'
import { Link } from 'react-router'

const states = [] // Removed for AdSense compliance

export default function DirectoryLinks() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 border-t border-slate-200 dark:border-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="md:col-span-1">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Free Landlord Tools</h3>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link to="/tools/rent-calculator" className="hover:text-blue-500">Prorated Rent Calculator</Link></li>
            <li><Link to="/tools/cap-rate-calculator" className="hover:text-blue-500">Cap Rate Calculator</Link></li>
            <li><Link to="/tools/roi-calculator" className="hover:text-blue-500">Rental ROI Calculator</Link></li>
          </ul>
          
          <h3 className="font-bold text-slate-900 dark:text-white mt-8 mb-4">Compare Alternatives</h3>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link to="/compare/mytenant-vs-buildium" className="hover:text-blue-500">Buildium Alternative</Link></li>
            <li><Link to="/compare/mytenant-vs-appfolio" className="hover:text-blue-500">AppFolio Alternative</Link></li>
            <li><Link to="/compare/mytenant-vs-turbotenant" className="hover:text-blue-500">TurboTenant Alternative</Link></li>
            <li><Link to="/compare/mytenant-vs-doorloop" className="hover:text-blue-500">DoorLoop Alternative</Link></li>
            <li><Link to="/compare/mytenant-vs-avail" className="hover:text-blue-500">Avail Alternative</Link></li>
            <li><Link to="/compare/mytenant-vs-rentredi" className="hover:text-blue-500">RentRedi Alternative</Link></li>
            <li><Link to="/compare/mytenant-vs-stessa" className="hover:text-blue-500">Stessa Alternative</Link></li>
            <li><Link to="/compare/mytenant-vs-yardi" className="hover:text-blue-500">Yardi Alternative</Link></li>
          </ul>
        </div>

      </div>
    </div>
  )
}
