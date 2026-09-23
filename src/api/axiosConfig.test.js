/* eslint-env jest */
import {
  authErrorInterceptor,
  authRequestInterceptor,
  bindAuthRuntime,
  databaseClient,
  getApiErrorMessage,
  isAuthenticationError,
} from './axiosConfig'

describe('authentication Axios bridge', () => {
  afterEach(() => {
    bindAuthRuntime(null)()
  })

  test('classifies only invalid credential responses', () => {
    expect(isAuthenticationError({ response: { status: 401 } })).toBe(true)
    expect(
      isAuthenticationError({
        response: { status: 403, data: { auth: false } },
      }),
    ).toBe(false)
    expect(
      isAuthenticationError({
        response: { status: 403, data: { auth: true } },
      }),
    ).toBe(false)
    expect(isAuthenticationError({ response: { status: 500 } })).toBe(false)
    expect(isAuthenticationError({})).toBe(false)
  })

  test('attaches the provider token and records the expected token', () => {
    const cleanup = bindAuthRuntime({
      getToken: () => 'provider-token',
      invalidate: jest.fn(),
    })

    const config = authRequestInterceptor({ headers: {} })

    expect(config.headers.Authorization).toBe('Bearer provider-token')
    expect(config.__apaExpectedAuthToken).toBe('provider-token')
    cleanup()
  })

  test('keeps the database client free of authentication interceptors', () => {
    expect(databaseClient.interceptors.request.handlers).toHaveLength(0)
    expect(databaseClient.interceptors.response.handlers).toHaveLength(0)
  })

  test('invalidates with the token used by the failed request', async () => {
    const invalidate = jest.fn()
    const cleanup = bindAuthRuntime({
      getToken: () => 'new-token',
      invalidate,
    })
    const error = {
      config: { __apaExpectedAuthToken: 'old-token' },
      response: { status: 401 },
    }

    await expect(authErrorInterceptor(error)).rejects.toBe(error)
    expect(invalidate).toHaveBeenCalledWith({ expectedToken: 'old-token' })
    cleanup()
  })

  test('does not invalidate server or network errors', async () => {
    const invalidate = jest.fn()
    const cleanup = bindAuthRuntime({
      getToken: () => 'token',
      invalidate,
    })
    const error = { response: { status: 500 } }

    await expect(authErrorInterceptor(error)).rejects.toBe(error)
    expect(invalidate).not.toHaveBeenCalled()
    cleanup()
  })
})

describe('API error messages', () => {
  test('prefers the canonical error message over the legacy message', () => {
    const error = {
      response: {
        data: {
          error: { message: 'Canonical message' },
          message: 'Legacy message',
        },
      },
    }

    expect(getApiErrorMessage(error, 'Local fallback')).toBe(
      'Canonical message',
    )
  })

  test('uses the legacy controller or login message as a fallback', () => {
    const error = {
      response: { data: { message: 'Legacy message' } },
    }

    expect(getApiErrorMessage(error, 'Local fallback')).toBe('Legacy message')
  })

  test('uses the local fallback for network errors', () => {
    expect(
      getApiErrorMessage(new Error('Network error'), 'Local fallback'),
    ).toBe('Local fallback')
  })
})
