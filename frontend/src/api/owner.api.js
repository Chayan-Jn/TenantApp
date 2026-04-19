import { api } from './client.js'

export const getMe = () => api('/owner/me')
export const updateMe = (body) => api('/owner/me', { method: 'PATCH', body })
export const updatePassword = (body) => api('/owner/me/password', { method: 'PATCH', body })
export const deleteAccount = () => api('/owner/me', { method: 'DELETE' })