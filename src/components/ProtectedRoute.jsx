import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const getStoredAuth = () => {
  try {
    const user = localStorage.getItem('eden-flora-user')
    return Boolean(user)
  } catch {
    return false
  }
}

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(getStoredAuth)

  useEffect(() => {
    const syncAuthState = () => setIsAuthenticated(getStoredAuth())
    window.addEventListener('auth:updated', syncAuthState)
    window.addEventListener('storage', syncAuthState)
    return () => {
      window.removeEventListener('auth:updated', syncAuthState)
      window.removeEventListener('storage', syncAuthState)
    }
  }, [])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
