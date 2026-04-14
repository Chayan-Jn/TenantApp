import { api } from './client.js'

export const register = (body) => api('/auth/register', { method: 'POST', body })
export const login = (body) => api('/auth/login', { method: 'POST', body })
export const logout = () => api('/auth/logout', { method: 'POST' })

// Sends Google's token to your backend; backend sets the auth cookie
export const googleLogin = (googleToken) => api('/auth/google', { 
  method: 'POST', 
  body: { token: googleToken } 
})