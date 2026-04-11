import { api } from './client.js'

export const getProperties = () => api('/properties')
export const createProperty = (body) => api('/properties', { method: 'POST', body })
export const deleteProperty = (id) => api(`/properties/${id}`, { method: 'DELETE' })
export const updateProperty = (id, body) => api(`/properties/${id}`, { method: 'PATCH', body })