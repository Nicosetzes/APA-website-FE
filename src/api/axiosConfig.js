import axios from 'axios'
import { api, database } from './index'

export const serializeRepeatedParams = (params) => {
  const search = new URLSearchParams()

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === undefined || item === null) return
        search.append(key, item)
      })
      return
    }

    search.append(key, value)
  })

  return search.toString()
}

export const apiClient = axios.create({
  baseURL: api,
  paramsSerializer: serializeRepeatedParams,
})

export const databaseClient = axios.create({
  baseURL: database,
})

export const getApiErrorMessage = (error, fallback) =>
  error?.response?.data?.error?.message ||
  error?.response?.data?.message ||
  fallback

let authRuntime = null

export const bindAuthRuntime = (runtime) => {
  authRuntime = runtime

  return () => {
    if (authRuntime === runtime) authRuntime = null
  }
}

export const isAuthenticationError = (error) => error.response?.status === 401

export const authRequestInterceptor = (config) => {
  const token = authRuntime?.getToken() ?? null
  const nextConfig = config

  nextConfig.__apaExpectedAuthToken = token
  if (token) {
    nextConfig.headers = nextConfig.headers || {}
    nextConfig.headers.Authorization = `Bearer ${token}`
  }

  return nextConfig
}

export const authErrorInterceptor = (error) => {
  if (isAuthenticationError(error)) {
    authRuntime?.invalidate({
      expectedToken: error.config?.__apaExpectedAuthToken,
    })
  }

  return Promise.reject(error)
}

apiClient.interceptors.request.use(authRequestInterceptor)
apiClient.interceptors.response.use(
  (response) => response,
  authErrorInterceptor,
)

export default apiClient
