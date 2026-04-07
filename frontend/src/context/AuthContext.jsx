import { createContext, useState, useEffect } from 'react'
import { getMe } from '../api/owner.api.js'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [owner, setOwner] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then((data) => setOwner(data.data))
      .catch(() => setOwner(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ owner, setOwner, loading }}>
      {children}
    </AuthContext.Provider>
  )
}