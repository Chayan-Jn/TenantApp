import { createBrowserRouter, redirect } from 'react-router'
import { getMe } from './api/owner.api.js'
import Layout from './components/layout/Layout.jsx'
import GlobalError from './components/ui/GlobalError.jsx'
import PublicLayout from './pages/legal/PublicLayout.jsx'



const authLoader = async () => {
  try {
    const data = await getMe()
    return data
  } catch {
    return redirect('/')
  }
}

const guestLoader = async () => {
  try {
    await getMe()
    return redirect('/dashboard')
  } catch {
    return null
  }
}

const router = createBrowserRouter([
  // ── Homepage at root — no auth required, no redirect ──
  {
    path: '/',
    lazy: () => import('./pages/home/Home.jsx').then(m => ({ Component: m.default })),
    errorElement: <GlobalError />,
  },
  // ── Redirect old /home bookmarks to root ──
  {
    path: '/home',
    loader: () => redirect('/'),
  },
  {
    path: '/login',
    lazy: () => import('./pages/auth/Login.jsx').then(m => ({ Component: m.default })),
    errorElement: <GlobalError />,
    loader: guestLoader
  },
  {
    path: '/register',
    lazy: () => import('./pages/auth/Register.jsx').then(m => ({ Component: m.default })),
    errorElement: <GlobalError />,
    loader: guestLoader
  },
  // ── Auth-protected app routes ──
  {
    path: '/',
    id: 'root',
    Component: Layout,
    errorElement: <GlobalError />,
    loader: authLoader,
    children: [
      {
        path: 'dashboard',
        lazy: () => import('./pages/dashboard/Dashboard.jsx').then(m => ({ Component: m.default })),
        loader: async () => {
          const { api } = await import('./api/client.js')
          try {
            const stats = await api('/dashboard/stats')
            return { stats: stats.data }
          } catch {
            return { stats: null }
          }
        }
      },
      {
        path: 'properties',
        lazy: () => import('./pages/properties/Properties.jsx').then(m => ({ Component: m.default })),
        loader: authLoader
      },
      {
        path: 'properties/:id',
        lazy: () => import('./pages/properties/PropertyDetail.jsx').then(m => ({ Component: m.default })),
        loader: async ({ params }) => {
          const { getUnits } = await import('./api/unit.api.js')
          const { api } = await import('./api/client.js')
          try {
            const [units, property] = await Promise.all([
              getUnits(params.id),
              api(`/properties/${params.id}`)
            ])
            return { units: units.data, property_id: params.id, property: property.data }
          } catch {
            return redirect('/properties')
          }
        }
      },
      {
        path: 'units/:id',
        lazy: () => import('./pages/units/UnitDetail.jsx').then(m => ({ Component: m.default })),
        loader: async ({ params }) => {
          const { getTenants } = await import('./api/tenant.api.js')
          const { api } = await import('./api/client.js')
          const { getBills } = await import('./api/bills.api.js')
          try {
            const unitRes = await api(`/units/${params.id}`)
            const unitData = unitRes.data
            
            const [tenants, bills, property] = await Promise.all([
              getTenants({ unit_id: params.id }),
              getBills({ unit_id: params.id }),
              api(`/properties/${unitData.property_id}`) 
            ])
            
            return {
              tenants: tenants.data,
              unit_id: params.id,
              property_id: unitData.property_id,
              unit: unitData,
              unit_name: unitData.label,
              property_name: property.data.name,
              bills: bills.data
            }
          } catch {
            return redirect('/properties')
          }
        }
      },
      {
        path: 'tenants/:id',
        lazy: () => import('./pages/tenants/TenantDetail.jsx').then(m => ({ Component: m.default })),
        loader: async ({ params }) => {
          const { getRentByTenant } = await import('./api/rent.api.js')
          const { api } = await import('./api/client.js')
          try {
            const [tenant, rents] = await Promise.all([
              api(`/tenants/${params.id}`),
              getRentByTenant(params.id)
            ])
            return { tenant: tenant.data, rents: rents.data, tenant_id: params.id }
          } catch {
            return redirect('/properties')
          }
        }
      },
      {
        path: 'rent/overdue',
        lazy: () => import('./pages/rent/Overdue.jsx').then(m => ({ Component: m.default })),
        loader: async () => {
          const { getProperties } = await import('./api/property.api.js')
          try {
            const properties = await getProperties()
            return { properties: properties.data }
          } catch {
            return { properties: [] }
          }
        }
      },
      {
        path: 'settings',
        lazy: () => import('./pages/settings/Settings.jsx').then(m => ({ Component: m.default })),
        loader: authLoader
      },
      {
        path: 'payments',
        lazy: () => import('./pages/payments/Payments.jsx').then(m => ({ Component: m.default })),
        loader: async () => {
          const { getProperties } = await import('./api/property.api.js')
          try {
            const properties = await getProperties()
            return { properties: properties.data }
          } catch {
            return { properties: [] }
          }
        }
      },
      {
        path: 'properties/:id/tenants',
        lazy: () => import('./pages/properties/PropertyTenants.jsx').then(m => ({ Component: m.default })),
        loader: async ({ params }) => {
          const { getTenants } = await import('./api/tenant.api.js')

          const { api } = await import('./api/client.js') 
          try {

            const [tenants, property] = await Promise.all([
              getTenants({ property_id: params.id }),
              api(`/properties/${params.id}`)
            ])
            

            return { 
              tenants: tenants.data, 
              property_id: params.id,
              property_name: property.data.name
            }
          } catch {
            return redirect('/properties')
          }
        }
      },
      {
        path: 'bills',
        lazy: () => import('./pages/bills/Bills.jsx').then(m => ({ Component: m.default })),
        loader: async () => {
          const { getProperties } = await import('./api/property.api.js')
          try {
            const properties = await getProperties()
            return { properties: properties.data }
          } catch {
            return { properties: [] }
          }
        }
      },
      {
        path: 'reports',
        lazy: () => import('./pages/reports/Reports.jsx').then(m => ({ Component: m.default })),
        loader: async () => {
          const { getProperties } = await import('./api/property.api.js')
          const { getMe } = await import('./api/owner.api.js')
          const { api } = await import('./api/client.js')
          try {
            const [properties, owner, stats] = await Promise.all([
              getProperties(),
              getMe(),
              api('/dashboard/stats')
            ])
            // Merge unit count data from dashboard stats into properties
            const dashProps = stats.data?.properties || []
            const merged = (properties.data || []).map(p => {
              const dp = dashProps.find(d => d.id === p.id)
              return { ...p, total_units: dp?.total_units || 0, occupied_units: dp?.occupied_units || 0 }
            })
            return { properties: merged, owner: owner.data || owner }
          } catch {
            return { properties: [], owner: {} }
          }
        }
      },
      {
        path: 'subscription',
        lazy: () => import('./pages/subscription/SubscriptionPage.jsx').then(m => ({ Component: m.default })),
        loader: authLoader
      },
      {
        path: 'pricing',
        lazy: () => import('./pages/subscription/PricingPage.jsx').then(m => ({ Component: m.default })),
        loader: authLoader
      },
      {
        path: 'subscription/expired',
        lazy: () => import('./pages/subscription/SubscriptionExpired.jsx').then(m => ({ Component: m.default })),
        loader: authLoader
      }

      
    ]
  },
  // ── Public legal pages (no auth required) ──
  {
    path: '/',
    Component: PublicLayout,
    errorElement: <GlobalError />,
    children: [
      { path: 'privacy-policy', lazy: () => import('./pages/legal/PrivacyPolicy.jsx').then(m => ({ Component: m.default })) },
      { path: 'terms', lazy: () => import('./pages/legal/TermsOfService.jsx').then(m => ({ Component: m.default })) },
      { path: 'refund-policy', lazy: () => import('./pages/legal/RefundPolicy.jsx').then(m => ({ Component: m.default })) },
      { path: 'contact', lazy: () => import('./pages/legal/ContactPage.jsx').then(m => ({ Component: m.default })) },
      { path: 'features/rent-ledger', lazy: () => import('./pages/features/RentLedger.jsx').then(m => ({ Component: m.default })) },
      { path: 'features/bill-splitting', lazy: () => import('./pages/features/BillSplitting.jsx').then(m => ({ Component: m.default })) },
      { path: 'features/tenant-tracking', lazy: () => import('./pages/features/TenantTracking.jsx').then(m => ({ Component: m.default })) },
      { path: 'compare/mytenant-vs-buildium', lazy: () => import('./pages/compare/VsBuildium.jsx').then(m => ({ Component: m.default })) },
      { path: 'compare/mytenant-vs-appfolio', lazy: () => import('./pages/compare/VsAppFolio.jsx').then(m => ({ Component: m.default })) },
      { path: 'compare/mytenant-vs-turbotenant', lazy: () => import('./pages/compare/VsTurboTenant.jsx').then(m => ({ Component: m.default })) },
      { path: 'compare/mytenant-vs-doorloop', lazy: () => import('./pages/compare/VsDoorLoop.jsx').then(m => ({ Component: m.default })) },
      { path: 'tools/rent-calculator', lazy: () => import('./pages/tools/RentCalculator.jsx').then(m => ({ Component: m.default })) },
    ]
  }
])

export default router