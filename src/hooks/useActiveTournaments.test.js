/* eslint-env jest */
jest.mock('api/axiosConfig', () => ({ apiClient: { get: jest.fn() } }))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { apiClient } from 'api/axiosConfig'
import useActiveTournaments from './useActiveTournaments'

let container
let latest

const Probe = () => {
  latest = useActiveTournaments()
  return null
}

const render = () =>
  act(async () => {
    ReactDOM.render(<Probe />, container)
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

test('asks once for the non-legacy tournaments and exposes them', async () => {
  const tournaments = [{ _id: 't1', name: 'Liga APA' }]
  apiClient.get.mockResolvedValue({ data: tournaments })
  await render()
  await render()
  expect(apiClient.get).toHaveBeenCalledTimes(1)
  expect(apiClient.get).toHaveBeenCalledWith(
    '/tournaments',
    expect.objectContaining({
      params: { legacy: false },
      signal: expect.anything(),
    }),
  )
  expect(latest).toEqual({ status: 'ok', tournaments })
})

test('is loading while the request is pending', async () => {
  apiClient.get.mockReturnValue(new Promise(() => {}))
  await render()
  expect(latest).toEqual({ status: 'loading', tournaments: [] })
})

test('reports an error when the request fails', async () => {
  apiClient.get.mockRejectedValue(new Error('boom'))
  await render()
  expect(latest).toEqual({ status: 'error', tournaments: [] })
})

test('reports an error when the response is not a list', async () => {
  apiClient.get.mockResolvedValue({ data: { message: 'hola' } })
  await render()
  expect(latest).toEqual({ status: 'error', tournaments: [] })
})

test('an empty list is ok (the screen decides what to do with it)', async () => {
  apiClient.get.mockResolvedValue({ data: [] })
  await render()
  expect(latest).toEqual({ status: 'ok', tournaments: [] })
})

test('unmounting aborts the request and ignores cancellation errors', async () => {
  let rejectRequest
  apiClient.get.mockReturnValue(
    new Promise((resolve, reject) => {
      rejectRequest = reject
    }),
  )
  await render()
  const { signal } = apiClient.get.mock.calls[0][1]
  ReactDOM.unmountComponentAtNode(container)
  expect(signal.aborted).toBe(true)
  await act(async () => {
    const error = new Error('canceled')
    error.name = 'CanceledError'
    rejectRequest(error)
  })
  expect(console.error).not.toHaveBeenCalled()
})
