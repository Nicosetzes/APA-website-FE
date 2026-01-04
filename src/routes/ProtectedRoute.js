import { useEffect } from 'react'
import { useLogin } from 'context/LoginContext'
import { Navigate, useLocation } from 'react-router-dom'
import { getAuthToken, getUser, validateAuth } from 'utils/auth'

const ProtectedRoute = ({ children }) => {
  const { loginStatus, setLoginStatus } = useLogin()
  const location = useLocation()

  useEffect(() => {
    const isValid = validateAuth()

    if (!isValid && loginStatus?.token) {
      setLoginStatus({})
    }
  }, [loginStatus, setLoginStatus])

  const isAuthenticated = validateAuth()

  if (isAuthenticated && !loginStatus?.token) {
    const token = getAuthToken()
    const user = getUser()

    if (token && user) {
      setLoginStatus({
        status: true,
        token,
        user,
      })
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/users/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
