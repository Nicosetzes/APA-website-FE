/* eslint-env jest */
jest.mock('api/axiosConfig', () => ({ apiClient: { get: jest.fn() } }))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { apiClient } from 'api/axiosConfig'
import useRatingHistory, { RATING_HISTORY_ERROR } from './useRatingHistory'

let container
let latest

const Probe = (props) => {
  latest = useRatingHistory(props)
  return null
}

const deferred = () => {
  const result = {}
  result.promise = new Promise((resolve, reject) => {
    result.resolve = resolve
    result.reject = reject
  })
  return result
}

const body = (matchesInPeriod) => ({
  data: { success: true, data: { matchesInPeriod, players: [] } },
})

const render = (props) =>
  act(async () => {
    ReactDOM.render(<Probe {...props} />, container)
  })

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  jest.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
  jest.restoreAllMocks()
  apiClient.get.mockReset()
})

test('requests the period and exposes the data', async () => {
  apiClient.get.mockResolvedValue(body(3))
  await render({ dateFrom: '2026-01-01', dateTo: '2026-12-31' })
  expect(apiClient.get).toHaveBeenCalledWith(
    '/ratings/history',
    expect.objectContaining({
      params: { dateFrom: '2026-01-01', dateTo: '2026-12-31' },
      signal: expect.anything(),
    }),
  )
  expect(latest.loading).toBe(false)
  expect(latest.error).toBeNull()
  expect(latest.data).toMatchObject({
    matchesInPeriod: 3,
    dateFrom: '2026-01-01',
    dateTo: '2026-12-31',
  })
})

test('is loading while the request is pending', async () => {
  const request = deferred()
  apiClient.get.mockReturnValue(request.promise)
  await render({ dateFrom: '2026-01-01', dateTo: '2026-12-31' })
  expect(latest.loading).toBe(true)
  expect(latest.data).toBeNull()
  await act(async () => request.resolve(body(1)))
  expect(latest.loading).toBe(false)
})

test('reports a Spanish error and retry asks again', async () => {
  apiClient.get.mockRejectedValueOnce(new Error('boom'))
  await render({ dateFrom: '2026-01-01', dateTo: '2026-12-31' })
  expect(latest.error).toBe(RATING_HISTORY_ERROR)
  expect(latest.data).toBeNull()

  apiClient.get.mockResolvedValueOnce(body(2))
  await act(async () => latest.retry())
  expect(apiClient.get).toHaveBeenCalledTimes(2)
  expect(latest.error).toBeNull()
  expect(latest.data.matchesInPeriod).toBe(2)
})

test('changing the period aborts the previous request and ignores its response', async () => {
  const first = deferred()
  const second = deferred()
  apiClient.get
    .mockReturnValueOnce(first.promise)
    .mockReturnValueOnce(second.promise)

  await render({ dateFrom: '2026-01-01', dateTo: '2026-01-31' })
  const firstSignal = apiClient.get.mock.calls[0][1].signal
  await render({ dateFrom: '2026-02-01', dateTo: '2026-02-28' })
  expect(firstSignal.aborted).toBe(true)

  await act(async () => second.resolve(body(2)))
  await act(async () => first.resolve(body(99)))
  expect(latest.data.matchesInPeriod).toBe(2)
  expect(latest.data.dateFrom).toBe('2026-02-01')
})

test('ignores cancellation errors', async () => {
  const request = deferred()
  apiClient.get.mockReturnValue(request.promise)
  await render({ dateFrom: '2026-01-01', dateTo: '2026-01-31' })
  await act(async () => {
    const error = new Error('canceled')
    error.name = 'CanceledError'
    request.reject(error)
  })
  expect(latest.error).toBeNull()
  expect(console.error).not.toHaveBeenCalled()
})

test('keeps the previous data while the next period loads', async () => {
  apiClient.get.mockResolvedValueOnce(body(5))
  await render({ dateFrom: '2026-01-01', dateTo: '2026-01-31' })
  const pending = deferred()
  apiClient.get.mockReturnValueOnce(pending.promise)
  await render({ dateFrom: '2026-02-01', dateTo: '2026-02-28' })
  expect(latest.loading).toBe(true)
  expect(latest.data.matchesInPeriod).toBe(5)
})

test('exposes the scope of the response', async () => {
  apiClient.get.mockResolvedValue({
    data: {
      success: true,
      scope: { type: 'period', tournament: null },
      data: { matchesInPeriod: 1, players: [] },
    },
  })
  await render({ dateFrom: '2026-01-01', dateTo: '2026-12-31' })
  expect(latest.data.scope).toEqual({ type: 'period', tournament: null })
})

test('with a tournament it asks only for tournamentId and takes the range from the response', async () => {
  apiClient.get.mockResolvedValue({
    data: {
      success: true,
      dateFrom: '2026-10-07',
      dateTo: '2026-10-15',
      scope: { type: 'tournament', tournament: { id: 't1', name: 'Liga' } },
      data: { matchesInPeriod: 4, players: [] },
    },
  })
  await render({ dateFrom: '', dateTo: '', tournamentId: 't1' })
  expect(apiClient.get).toHaveBeenCalledWith(
    '/ratings/history',
    expect.objectContaining({
      params: { tournamentId: 't1' },
      signal: expect.anything(),
    }),
  )
  expect(latest.data).toMatchObject({
    matchesInPeriod: 4,
    dateFrom: '2026-10-07',
    dateTo: '2026-10-15',
    scope: { type: 'tournament', tournament: { id: 't1', name: 'Liga' } },
  })
})

test('a tournament without matches comes back with null dates', async () => {
  apiClient.get.mockResolvedValue({
    data: {
      success: true,
      dateFrom: null,
      dateTo: null,
      scope: { type: 'tournament', tournament: { id: 't1', name: null } },
      data: { matchesInPeriod: 0, players: [] },
    },
  })
  await render({ dateFrom: '', dateTo: '', tournamentId: 't1' })
  expect(latest.data.dateFrom).toBeFalsy()
  expect(latest.data.dateTo).toBeFalsy()
  expect(latest.data.matchesInPeriod).toBe(0)
})

test('changing the tournament asks again; ignores the dates while a tournament is set', async () => {
  apiClient.get.mockResolvedValue(body(1))
  await render({ dateFrom: '', dateTo: '', tournamentId: 't1' })
  await render({ dateFrom: '', dateTo: '', tournamentId: 't2' })
  expect(apiClient.get.mock.calls.map(([, config]) => config.params)).toEqual([
    { tournamentId: 't1' },
    { tournamentId: 't2' },
  ])
})

test('does not call the API without both dates', async () => {
  await render({ dateFrom: '2026-01-01', dateTo: '' })
  await render({ dateFrom: '', dateTo: '' })
  expect(apiClient.get).not.toHaveBeenCalled()
  expect(latest).toMatchObject({ data: null, loading: false, error: null })
})

test('unmounting aborts the request', async () => {
  const request = deferred()
  apiClient.get.mockReturnValue(request.promise)
  await render({ dateFrom: '2026-01-01', dateTo: '2026-01-31' })
  const { signal } = apiClient.get.mock.calls[0][1]
  ReactDOM.unmountComponentAtNode(container)
  expect(signal.aborted).toBe(true)
})
