import { api } from './client.js'

export const getTenants = (property_id) => api(`/tenants?property_id=${property_id}`)
export const createTenant = (body) => api('/tenants', { method: 'POST', body })
export const removeTenant = (id) => api(`/tenants/${id}`, { method: 'DELETE' })