import { useAuth } from 'context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (isLoading) return null

  if (!isAuthenticated) {
    return <Navigate to="/users/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
