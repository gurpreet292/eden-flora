import { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = async () => {
    try {
      const response = await api.get('/api/auth/me')
      setUser(response.data.user)
      localStorage.setItem('eden-flora-user', JSON.stringify(response.data.user))
      return response.data.user
    } catch {
      setUser(null)
      localStorage.removeItem('eden-flora-user')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshSession()

    const handleAuthChange = () => refreshSession()
    const handleExpiredSession = () => {
      setUser(null)
      setIsLoading(false)
    }
    window.addEventListener('auth:updated', handleAuthChange)
    window.addEventListener('auth:expired', handleExpiredSession)
    return () => {
      window.removeEventListener('auth:updated', handleAuthChange)
      window.removeEventListener('auth:expired', handleExpiredSession)
    }
  }, [])

  const logout = async () => {
    try {
      await api.post('/api/auth/logout')
    } finally {
      setUser(null)
      localStorage.removeItem('eden-flora-user')
      window.dispatchEvent(new Event('auth:updated'))
    }
  }

  return <AuthContext.Provider value={{ user, setUser, isLoading, refreshSession, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
