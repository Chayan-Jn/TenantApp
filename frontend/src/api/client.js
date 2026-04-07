const BASE_URL = import.meta.env.VITE_API_URL

export const api = async (endpoint, options = {}) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined
    })
  
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Something went wrong')
    return data
}