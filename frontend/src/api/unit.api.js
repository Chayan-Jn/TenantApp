import { api } from './client.js'

export const getUnits = (property_id) => api(`/units?property_id=${property_id}`)
export const createUnit = (body) => api('/units', { method: 'POST', body })
export const deleteUnit = (id) => api(`/units/${id}`, { method: 'DELETE' })