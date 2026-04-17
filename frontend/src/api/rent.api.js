import { api } from './client.js'

export const createRent = (body) => api('/rent', { method: 'POST', body })
export const getRentByTenant = (tenant_id) => api(`/rent?tenant_id=${tenant_id}`)
export const markRentPaid = (id) => api(`/rent/${id}/pay`, { method: 'PATCH' })
export const getOverdueRents = (property_id) => api(`/rent/overdue?property_id=${property_id}`)
export const markRentUnpaid = (id) => api(`/rent/${id}/unpay`, { method: 'PATCH' })
export const generateMonthlyRent = (body) => api('/rent/generate', { method: 'POST', body })

export const updateRent = (id, payload) => api(`/rent/${id}`, { method: 'PUT', body: payload })
export const deleteRent = (id) => api(`/rent/${id}`, { method: 'DELETE' })