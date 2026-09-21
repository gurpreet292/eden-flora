import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (user) localStorage.setItem('eden-flora-user', JSON.stringify(user))
    else if (!isLoading) localStorage.removeItem('eden-flora-user')
  }, [isLoading, user])

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center bg-ivory text-sm text-forest/60">Checking your session...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
