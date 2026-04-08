import { api } from './client.js'

export const getTenants = (params) => {
    const query = new URLSearchParams(params).toString()
    return api(`/tenants?${query}`)
  }
export const createTenant = (body) => api('/tenants', { method: 'POST', body })
export const removeTenant = (id) => api(`/tenants/${id}`, { method: 'DELETE' })