import { api } from './client.js'

export const getTenants = (params) => {
    const query = new URLSearchParams(params).toString()
    return api(`/tenants?${query}`)
  }
export const createTenant = (body) => api('/tenants', { method: 'POST', body })
export const removeTenant = (id, body = {}) => api(`/tenants/${id}`, { method: 'DELETE', body })
export const updateTenant = (id, body) => api(`/tenants/${id}`, { method: 'PATCH', body })
export const giveNotice = (id, body = {}) => api(`/tenants/${id}/notice`, { method: 'PATCH', body })