export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token)
}

export const getAuthToken = () => {
  return localStorage.getItem('authToken')
}

export const removeAuthToken = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
}

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const isAuthenticated = () => {
  return !!getAuthToken()
}

export const logout = () => {
  removeAuthToken()
  window.location.href = '/users/login'
}

export const isTokenExpired = (token) => {
  if (!token) return true

  try {
    const parts = token.split('.')
    if (parts.length !== 3) return true

    const payload = JSON.parse(atob(parts[1]))

    if (!payload.exp) return false // If no exp claim, consider it valid

    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  } catch (error) {
    return true // If there's any error, consider token invalid
  }
}

export const validateAuth = () => {
  const token = getAuthToken()

  if (!token) return false

  if (isTokenExpired(token)) {
    removeAuthToken()
    return false
  }

  return true
}
