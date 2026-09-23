/* eslint-env jest */
import { TextDecoder } from 'util'
import {
  SESSION_STORAGE_KEY,
  clearStoredSession,
  getTokenExpiration,
  isTokenExpired,
  parseStoredSession,
  readStoredSession,
  writeStoredSession,
} from './auth'

global.TextDecoder = TextDecoder

const createToken = (payload) => {
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  return `header.${encodedPayload}.signature`
}

describe('atomic session persistence', () => {
  beforeEach(() => localStorage.clear())

  test('stores and reads token and user in one versioned key', () => {
    const session = { token: 'token', user: { id: 'user-id' } }

    writeStoredSession(session)

    expect(readStoredSession()).toEqual(session)
    expect(Object.keys(localStorage)).toEqual([SESSION_STORAGE_KEY])
    expect(JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY)).version).toBe(
      1,
    )
  })

  test('rejects malformed or unsupported sessions', () => {
    expect(parseStoredSession('{invalid')).toBeNull()
    expect(
      parseStoredSession(
        JSON.stringify({ version: 2, token: 'token', user: { id: 'id' } }),
      ),
    ).toBeNull()
  })

  test('only clears the token that was expected', () => {
    writeStoredSession({ token: 'new-token', user: { id: 'user-id' } })

    expect(clearStoredSession({ expectedToken: 'old-token' })).toBe(false)
    expect(readStoredSession().token).toBe('new-token')
    expect(clearStoredSession({ expectedToken: 'new-token' })).toBe(true)
    expect(readStoredSession()).toBeNull()
  })
})

describe('JWT expiration helpers', () => {
  test('reads a valid base64url expiration', () => {
    const expiration = Math.floor(Date.now() / 1000) + 60
    const token = createToken({ exp: expiration })

    expect(getTokenExpiration(token)).toBe(expiration * 1000)
    expect(isTokenExpired(token)).toBe(false)
  })

  test('rejects expired, malformed, or expiration-less tokens', () => {
    const expired = createToken({ exp: Math.floor(Date.now() / 1000) - 1 })
    const withoutExpiration = createToken({ sub: 'user' })

    expect(isTokenExpired(expired)).toBe(true)
    expect(isTokenExpired(withoutExpiration)).toBe(true)
    expect(isTokenExpired('invalid')).toBe(true)
  })
})
