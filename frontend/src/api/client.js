const BASE_URL = import.meta.env.VITE_API_URL

export const api = async (endpoint, options = {}) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined
    })
  
    const data = await res.json()
    if (!res.ok) {
        let errorMsg = 'Something went wrong';
        if (data.message) errorMsg = data.message;
        else if (data.messages && Array.isArray(data.messages)) errorMsg = data.messages.join(' • ');
        
        const err = new Error(errorMsg);
        err.fieldErrors = data.fieldErrors || {};
        throw err;
    }
    return data
}