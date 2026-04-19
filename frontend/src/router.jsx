import { createBrowserRouter, redirect } from 'react-router'
import { getMe } from './api/owner.api.js'
import Layout from './components/layout/Layout.jsx'
import GlobalError from './components/ui/GlobalError.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import Properties from './pages/properties/Properties.jsx'
import PropertyDetail from './pages/properties/PropertyDetail.jsx'
import UnitDetail from './pages/units/UnitDetail.jsx'
import TenantDetail from './pages/tenants/TenantDetail.jsx'
import Overdue from './pages/rent/Overdue.jsx'
import Settings from './pages/settings/Settings.jsx'
import Payments from './pages/payments/Payments.jsx'
import PropertyTenants from './pages/properties/PropertyTenants.jsx'
import Bills from './pages/bills/Bills.jsx'
import Reports from './pages/reports/Reports.jsx'



const authLoader = async () => {
  try {
    const data = await getMe()
    return data
  } catch {
    return redirect('/login')
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
  {
    path: '/login',
    Component: Login,
    errorElement: <GlobalError />,
    loader: guestLoader
  },
  {
    path: '/register',
    Component: Register,
    errorElement: <GlobalError />,
    loader: guestLoader
  },
  {
    path: '/',
    id: 'root',
    Component: Layout,
    errorElement: <GlobalError />,
    loader: authLoader,
    children: [
      { index: true, loader: () => redirect('/dashboard') },
      {
        path: 'dashboard',
        Component: Dashboard,
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
        Component: Properties,
        loader: authLoader
      },
      {
        path: 'properties/:id',
        Component: PropertyDetail,
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
        Component: UnitDetail,
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
        Component: TenantDetail,
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
        Component: Overdue,
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
        Component: Settings,
        loader: authLoader
      },
      {
        path: 'payments',
        Component: Payments,
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
        Component: PropertyTenants,
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
        Component: Bills,
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
        Component: Reports,
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
      }

      
    ]
  }
])

export default router