import { useEffect, useState } from 'react'
import api from '../utils/api'
import { AuthContext } from './auth'

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
      // The failed session request must clear stale auth state.
      // eslint-disable-next-line react/set-state-in-effect
      setUser(null)
      localStorage.removeItem('eden-flora-user')
      return null
    } finally {
      // The session request has completed, so release the startup loading state.
      // eslint-disable-next-line react/set-state-in-effect
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Bootstrap auth from the external session API when the provider mounts.
    // eslint-disable-next-line react/set-state-in-effect
    refreshSession()

    const handleAuthChange = () => refreshSession()
    const handleExpiredSession = () => {
      // This event synchronizes auth state after the API reports an expired session.
      // eslint-disable-next-line react/set-state-in-effect
      setUser(null)
      // eslint-disable-next-line react/set-state-in-effect
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
