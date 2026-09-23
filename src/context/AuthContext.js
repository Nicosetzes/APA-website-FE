import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import apiClient, {
  bindAuthRuntime,
  isAuthenticationError,
} from 'api/axiosConfig'
import {
  SESSION_STORAGE_KEY,
  clearStoredSession,
  getTokenExpiration,
  isTokenExpired,
  readStoredSession,
  writeStoredSession,
} from 'utils/auth'

export const AUTH_STATUS = Object.freeze({
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
})

const SESSION_VALIDATION_TIMEOUT_MS = 5000
const MAX_TIMER_DELAY_MS = 2147483647
const AuthContext = createContext(null)

const unauthenticatedState = {
  status: AUTH_STATUS.UNAUTHENTICATED,
  user: null,
  token: null,
  validation: null,
}

const createInitialState = () => {
  const session = readStoredSession()

  if (!session || isTokenExpired(session.token)) {
    return {
      status: AUTH_STATUS.LOADING,
      user: null,
      token: null,
      validation: null,
    }
  }

  return {
    status: AUTH_STATUS.LOADING,
    user: session.user,
    token: session.token,
    validation: 'pending',
  }
}

const canUseCachedSession = (error) => {
  const status = error.response?.status
  return !error.response || status >= 500
}

export const useAuth = () => {
  const auth = useContext(AuthContext)

  if (!auth) throw new Error('useAuth must be used within an AuthProvider')
  return auth
}

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(createInitialState)
  const tokenRef = useRef(authState.token)
  const generationRef = useRef(0)
  const mountedRef = useRef(false)

  const commitState = useCallback((nextState) => {
    tokenRef.current = nextState.token
    setAuthState(nextState)
  }, [])

  const endSession = useCallback(
    (options = {}) => {
      const hasExpectedToken = Object.prototype.hasOwnProperty.call(
        options,
        'expectedToken',
      )

      if (
        hasExpectedToken &&
        tokenRef.current !== (options.expectedToken ?? null)
      ) {
        return false
      }

      generationRef.current += 1
      const tokenToClear = tokenRef.current
      commitState(unauthenticatedState)

      if (options.persist !== false) {
        if (hasExpectedToken) {
          clearStoredSession({ expectedToken: options.expectedToken ?? null })
        } else if (tokenToClear) {
          clearStoredSession({ expectedToken: tokenToClear })
        } else {
          clearStoredSession()
        }
      }

      return true
    },
    [commitState],
  )

  const startSession = useCallback(
    ({ token, user, validation = 'server' }) => {
      if (!token || !user || isTokenExpired(token)) {
        throw new Error('startSession requires a valid token and user')
      }

      generationRef.current += 1
      writeStoredSession({ token, user })
      commitState({
        status: AUTH_STATUS.AUTHENTICATED,
        user,
        token,
        validation,
      })
    },
    [commitState],
  )

  const validateSession = useCallback(
    async ({ token, user }) => {
      const validationGeneration = generationRef.current + 1
      generationRef.current = validationGeneration
      tokenRef.current = token
      setAuthState({
        status: AUTH_STATUS.LOADING,
        user,
        token,
        validation: 'pending',
      })

      try {
        const { data } = await apiClient.get('/users/me', {
          timeout: SESSION_VALIDATION_TIMEOUT_MS,
        })

        if (
          !mountedRef.current ||
          generationRef.current !== validationGeneration ||
          tokenRef.current !== token
        ) {
          return
        }

        if (!data?.user) {
          endSession({ expectedToken: token })
          return
        }

        writeStoredSession({ token, user: data.user })
        commitState({
          status: AUTH_STATUS.AUTHENTICATED,
          user: data.user,
          token,
          validation: 'server',
        })
      } catch (error) {
        if (
          !mountedRef.current ||
          generationRef.current !== validationGeneration ||
          tokenRef.current !== token
        ) {
          return
        }

        if (
          isAuthenticationError(error) ||
          !canUseCachedSession(error) ||
          !user
        ) {
          endSession({ expectedToken: token })
          return
        }

        commitState({
          status: AUTH_STATUS.AUTHENTICATED,
          user,
          token,
          validation: 'cache',
        })
      }
    },
    [commitState, endSession],
  )

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      generationRef.current += 1
    }
  }, [])

  useLayoutEffect(
    () =>
      bindAuthRuntime({
        getToken: () => tokenRef.current,
        invalidate: endSession,
      }),
    [endSession],
  )

  useEffect(() => {
    const storedSession = readStoredSession()

    if (!storedSession || isTokenExpired(storedSession.token)) {
      clearStoredSession()
      endSession({ persist: false })
      return
    }

    validateSession(storedSession)
  }, [endSession, validateSession])

  useEffect(() => {
    const handleStorage = () => {
      const storedSession = readStoredSession()

      if (!storedSession || isTokenExpired(storedSession.token)) {
        endSession({ persist: false })
        return
      }

      const hasSameSession =
        tokenRef.current === storedSession.token &&
        authState.status === AUTH_STATUS.AUTHENTICATED &&
        JSON.stringify(authState.user) === JSON.stringify(storedSession.user)

      if (!hasSameSession) validateSession(storedSession)
    }

    const handleStorageEvent = (event) => {
      if (event.key === SESSION_STORAGE_KEY) handleStorage()
    }

    window.addEventListener('storage', handleStorageEvent)
    return () => window.removeEventListener('storage', handleStorageEvent)
  }, [authState.status, authState.user, endSession, validateSession])

  useEffect(() => {
    const token = authState.token
    if (!token) return undefined

    let expirationTimer
    let isActive = true

    const scheduleExpiration = () => {
      if (!isActive || tokenRef.current !== token) return

      const expiration = getTokenExpiration(token)
      if (!expiration) {
        endSession({ expectedToken: token })
        return
      }

      const remainingTime = expiration - Date.now()
      if (remainingTime <= 0) {
        endSession({ expectedToken: token })
        return
      }

      expirationTimer = setTimeout(
        scheduleExpiration,
        Math.min(remainingTime, MAX_TIMER_DELAY_MS),
      )
    }

    scheduleExpiration()

    return () => {
      isActive = false
      clearTimeout(expirationTimer)
    }
  }, [authState.token, endSession])

  const value = useMemo(
    () => ({
      ...authState,
      startSession,
      endSession,
      isLoading: authState.status === AUTH_STATUS.LOADING,
      isAuthenticated: authState.status === AUTH_STATUS.AUTHENTICATED,
      isUnauthenticated: authState.status === AUTH_STATUS.UNAUTHENTICATED,
    }),
    [authState, endSession, startSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
