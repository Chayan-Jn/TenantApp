import { createBrowserRouter, redirect } from 'react-router'
import { getMe } from './api/owner.api.js'
import Layout from './components/layout/Layout.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import Properties from './pages/properties/Properties.jsx'
import PropertyDetail from './pages/properties/PropertyDetail.jsx'
import UnitDetail from './pages/units/UnitDetail.jsx'
import TenantDetail from './pages/tenants/TenantDetail.jsx'
import Overdue from './pages/rent/Overdue.jsx'
import Settings from './pages/settings/Settings.jsx'

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
    loader: guestLoader
  },
  {
    path: '/register',
    Component: Register,
    loader: guestLoader
  },
  {
    path: '/',
    id: 'root',
    Component: Layout,
    loader: authLoader,
    children: [
      { index: true, loader: () => redirect('/dashboard') },
      {
        path: 'dashboard',
        Component: Dashboard,
        loader: authLoader
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
          try {
            const units = await getUnits(params.id)
            return { units: units.data, property_id: params.id }
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
          try {
            const tenants = await getTenants({ unit_id: params.id })
            return { tenants: tenants.data, unit_id: params.id }
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
          try {
            const rents = await getRentByTenant(params.id)
            return { rents: rents.data, tenant_id: params.id }
          } catch {
            return redirect('/properties')
          }
        }
      },
      {
        path: 'rent/overdue',
        Component: Overdue,
        loader: authLoader
      },
      {
        path: 'settings',
        Component: Settings,
        loader: authLoader
      }
    ]
  }
])

export default router