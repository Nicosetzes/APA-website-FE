import axios from 'axios'
import { api, database } from './index'

// Create axios instance for API requests
export const apiClient = axios.create({
  baseURL: api,
})

// Create axios instance for database requests
export const databaseClient = axios.create({
  baseURL: database,
})

// Request interceptor to add auth token
const authInterceptor = (config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

// Response interceptor to handle 403 errors
const errorInterceptor = (error) => {
  if (error.response?.status === 403) {
    // Token is invalid or expired
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    // Redirect to login
    window.location.href = '/users/login'
  }
  return Promise.reject(error)
}

// Apply interceptors to both clients
apiClient.interceptors.request.use(authInterceptor)
apiClient.interceptors.response.use((response) => response, errorInterceptor)

databaseClient.interceptors.request.use(authInterceptor)
databaseClient.interceptors.response.use(
  (response) => response,
  errorInterceptor,
)

export default apiClient
