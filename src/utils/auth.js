export const SESSION_STORAGE_KEY = 'apa.session.v1'

const SESSION_VERSION = 1
const LEGACY_STORAGE_KEYS = ['authToken', 'user']

const clearLegacySession = () => {
  LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
}

export const parseStoredSession = (serializedSession) => {
  if (!serializedSession) return null

  try {
    const session = JSON.parse(serializedSession)

    if (
      session?.version !== SESSION_VERSION ||
      typeof session.token !== 'string' ||
      !session.token ||
      !session.user ||
      typeof session.user !== 'object'
    ) {
      return null
    }

    return { token: session.token, user: session.user }
  } catch (error) {
    return null
  }
}

export const readStoredSession = () =>
  parseStoredSession(localStorage.getItem(SESSION_STORAGE_KEY))

export const writeStoredSession = ({ token, user }) => {
  const serializedSession = JSON.stringify({
    version: SESSION_VERSION,
    token,
    user,
  })

  clearLegacySession()
  localStorage.setItem(SESSION_STORAGE_KEY, serializedSession)
  return serializedSession
}

export const clearStoredSession = (options = {}) => {
  const hasExpectedToken = Object.prototype.hasOwnProperty.call(
    options,
    'expectedToken',
  )

  if (hasExpectedToken) {
    const storedSession = readStoredSession()
    const storedToken = storedSession?.token ?? null

    if (storedToken !== options.expectedToken) return false
  }

  localStorage.removeItem(SESSION_STORAGE_KEY)
  clearLegacySession()
  return true
}

const decodeJwtPayload = (token) => {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT')

  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  const json = new TextDecoder().decode(bytes)

  return JSON.parse(json)
}

export const getTokenExpiration = (token) => {
  try {
    const { exp } = decodeJwtPayload(token)
    return Number.isFinite(exp) ? exp * 1000 : null
  } catch (error) {
    return null
  }
}

export const isTokenExpired = (token) => {
  const expiration = getTokenExpiration(token)
  return expiration === null || expiration <= Date.now()
}
