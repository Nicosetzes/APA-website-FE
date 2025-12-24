import { useLogin } from 'context/LoginContext'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { loginStatus, setLoginStatus } = useLogin()
  const location = useLocation()

  const token = localStorage.getItem('authToken')
  const storedUser = localStorage.getItem('user')

  if (token && storedUser && !loginStatus?.token) {
    setLoginStatus({
      status: true,
      token,
      user: JSON.parse(storedUser),
    })
  }

  const isAuthenticated = !!token

  if (!isAuthenticated) {
    return <Navigate to="/users/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
