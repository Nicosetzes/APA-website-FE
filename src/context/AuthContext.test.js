/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { TextDecoder } from 'util'
import apiClient, { bindAuthRuntime } from 'api/axiosConfig'
import { clearStoredSession, writeStoredSession } from 'utils/auth'
import { AuthProvider, useAuth } from './AuthContext'

let mockAuthRuntime

global.TextDecoder = TextDecoder

jest.mock('api/axiosConfig', () => ({
  __esModule: true,
  default: { get: jest.fn() },
  bindAuthRuntime: jest.fn((runtime) => {
    mockAuthRuntime = runtime
    return () => {
      if (mockAuthRuntime === runtime) mockAuthRuntime = null
    }
  }),
  isAuthenticationError: (error) => error.response?.status === 401,
}))

const createToken = (expiration, subject = 'user-id') => {
  const encodedPayload = btoa(JSON.stringify({ exp: expiration, sub: subject }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  return `header.${encodedPayload}.signature`
}

const Harness = ({ firstToken, secondToken }) => {
  const auth = useAuth()
  const firstUser = { id: 'first-user', nickname: 'First' }
  const secondUser = { id: 'second-user', nickname: 'Second' }

  return (
    <div>
      <span data-testid="session-state">
        {[
          auth.status,
          auth.validation,
          auth.token,
          auth.user?.nickname,
          auth.isLoading,
          auth.isAuthenticated,
          auth.isUnauthenticated,
        ]
          .map((value) => String(value))
          .join(':')}
      </span>
      <button
        type="button"
        data-testid="start-first"
        onClick={() =>
          auth.startSession({
            token: firstToken,
            user: firstUser,
            validation: 'server',
          })
        }
      >
        Start first
      </button>
      <button
        type="button"
        data-testid="start-second"
        onClick={() =>
          auth.startSession({
            token: secondToken,
            user: secondUser,
            validation: 'server',
          })
        }
      >
        Start second
      </button>
      <button type="button" data-testid="end" onClick={() => auth.endSession()}>
        End
      </button>
    </div>
  )
}

const click = (container, testId) => {
  container
    .querySelector(`[data-testid="${testId}"]`)
    .dispatchEvent(new MouseEvent('click', { bubbles: true }))
}

const getAuthRuntime = () => {
  const calls = bindAuthRuntime.mock.calls
  return calls[calls.length - 1][0]
}

const flushPromises = async () => {
  await Promise.resolve()
  await Promise.resolve()
}

describe('AuthProvider session state machine', () => {
  let container
  let firstToken
  let secondToken

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    localStorage.clear()
    apiClient.get.mockReset()
    firstToken = createToken(Math.floor(Date.now() / 1000) + 60, 'first')
    secondToken = createToken(Math.floor(Date.now() / 1000) + 120, 'second')
  })

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container)
    container.remove()
    jest.useRealTimers()
  })

  const renderProvider = async () => {
    await act(async () => {
      ReactDOM.render(
        <AuthProvider>
          <Harness firstToken={firstToken} secondToken={secondToken} />
        </AuthProvider>,
        container,
      )
      await flushPromises()
    })
  }

  test('becomes unauthenticated when no stored session exists', async () => {
    await renderProvider()

    expect(apiClient.get).not.toHaveBeenCalled()
    expect(
      container.querySelector('[data-testid="session-state"]').textContent,
    ).toBe('unauthenticated:null:null:undefined:false:false:true')
  })

  test('shows pending while bootstrapping and refreshes the user from /users/me', async () => {
    writeStoredSession({
      token: firstToken,
      user: { id: 'first-user', nickname: 'Cached' },
    })
    let resolveRequest
    apiClient.get.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve
        }),
    )

    act(() => {
      ReactDOM.render(
        <AuthProvider>
          <Harness firstToken={firstToken} secondToken={secondToken} />
        </AuthProvider>,
        container,
      )
    })

    expect(
      container.querySelector('[data-testid="session-state"]').textContent,
    ).toBe(`loading:pending:${firstToken}:Cached:true:false:false`)

    await act(async () => {
      resolveRequest({
        data: { user: { id: 'first-user', nickname: 'Server' } },
      })
      await flushPromises()
    })

    expect(apiClient.get).toHaveBeenCalledWith('/users/me', { timeout: 5000 })
    expect(
      container.querySelector('[data-testid="session-state"]').textContent,
    ).toBe(`authenticated:server:${firstToken}:Server:false:true:false`)
  })

  test.each([
    ['network', new Error('Network unavailable')],
    ['server', { response: { status: 503 } }],
  ])('falls back to the cached user after a %s error', async (name, error) => {
    writeStoredSession({
      token: firstToken,
      user: { id: 'first-user', nickname: 'Cached' },
    })
    apiClient.get.mockRejectedValue(error)

    await renderProvider()

    expect(
      container.querySelector('[data-testid="session-state"]').textContent,
    ).toBe(`authenticated:cache:${firstToken}:Cached:false:true:false`)
  })

  test('ends the session when /users/me rejects the credentials', async () => {
    writeStoredSession({
      token: firstToken,
      user: { id: 'first-user', nickname: 'Cached' },
    })
    apiClient.get.mockRejectedValue({ response: { status: 401 } })

    await renderProvider()

    expect(
      container.querySelector('[data-testid="session-state"]').textContent,
    ).toBe('unauthenticated:null:null:undefined:false:false:true')
    expect(localStorage.length).toBe(0)
  })

  test('starts and ends an interactive session atomically', async () => {
    await renderProvider()

    act(() => click(container, 'start-first'))

    expect(
      container.querySelector('[data-testid="session-state"]').textContent,
    ).toBe(`authenticated:server:${firstToken}:First:false:true:false`)
    expect(localStorage.length).toBe(1)

    act(() => click(container, 'end'))

    expect(
      container.querySelector('[data-testid="session-state"]').textContent,
    ).toBe('unauthenticated:null:null:undefined:false:false:true')
    expect(localStorage.length).toBe(0)
  })

  test('expires a token started by interactive login', async () => {
    jest.useFakeTimers()
    firstToken = createToken(Math.floor(Date.now() / 1000) + 2)
    await renderProvider()

    act(() => click(container, 'start-first'))
    expect(getAuthRuntime().getToken()).toBe(firstToken)

    act(() => jest.advanceTimersByTime(3000))

    expect(
      container.querySelector('[data-testid="session-state"]').textContent,
    ).toBe('unauthenticated:null:null:undefined:false:false:true')
    expect(localStorage.length).toBe(0)
  })

  test('chunks expiration timers that exceed the browser timeout limit', async () => {
    jest.useFakeTimers()
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')
    firstToken = createToken(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 60)
    await renderProvider()

    act(() => click(container, 'start-first'))

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 2147483647)
    setTimeoutSpy.mockRestore()
  })

  test('ignores invalidation from a request made with an old token', async () => {
    await renderProvider()
    act(() => click(container, 'start-first'))
    act(() => click(container, 'start-second'))

    act(() => {
      getAuthRuntime().invalidate({ expectedToken: firstToken })
    })

    expect(
      container.querySelector('[data-testid="session-state"]').textContent,
    ).toBe(`authenticated:server:${secondToken}:Second:false:true:false`)
  })

  test('synchronizes session creation, replacement, and removal from storage', async () => {
    await renderProvider()
    apiClient.get
      .mockResolvedValueOnce({
        data: { user: { id: 'first-user', nickname: 'First server' } },
      })
      .mockResolvedValueOnce({
        data: { user: { id: 'second-user', nickname: 'Second server' } },
      })

    await act(async () => {
      writeStoredSession({
        token: firstToken,
        user: { id: 'first-user', nickname: 'First cached' },
      })
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'apa.session.v1' }),
      )
      await flushPromises()
    })

    expect(
      container.querySelector('[data-testid="session-state"]').textContent,
    ).toBe(`authenticated:server:${firstToken}:First server:false:true:false`)

    await act(async () => {
      writeStoredSession({
        token: secondToken,
        user: { id: 'second-user', nickname: 'Second cached' },
      })
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'apa.session.v1' }),
      )
      await flushPromises()
    })

    expect(
      container.querySelector('[data-testid="session-state"]').textContent,
    ).toBe(`authenticated:server:${secondToken}:Second server:false:true:false`)

    act(() => {
      clearStoredSession()
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'apa.session.v1' }),
      )
    })

    expect(
      container.querySelector('[data-testid="session-state"]').textContent,
    ).toBe('unauthenticated:null:null:undefined:false:false:true')
  })
})
