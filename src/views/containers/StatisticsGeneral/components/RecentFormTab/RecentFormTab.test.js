/* eslint-env jest */
jest.mock('api/axiosConfig', () => ({ apiClient: { get: jest.fn() } }))
jest.mock('views/components', () => ({ Loader: () => <div data-testid="loader" /> }))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { apiClient } from 'api/axiosConfig'
import RecentFormTab from '.'

const metric = {
  matches: 2,
  record: { wins: 1, draws: 0, losses: 1 },
  actualPercentage: 50,
  expectedPercentage: 55,
  differencePercentagePoints: -5,
  ratingChange: -2,
}
const response = {
  success: true,
  data: {
    players: [
      {
        player: { id: 'n', name: 'Nico' },
        recentForm: { 5: metric, 10: metric, 25: metric },
      },
    ],
  },
}

let container
const flush = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)))

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

test('loads the global aggregate without rating filters', async () => {
  apiClient.get.mockResolvedValue({ data: response })
  act(() => {
    ReactDOM.render(<RecentFormTab />, container)
  })
  await flush()

  expect(apiClient.get).toHaveBeenCalledWith(
    '/ratings/recent-form',
    expect.objectContaining({ signal: expect.anything() }),
  )
  expect(apiClient.get.mock.calls[0][1]).not.toHaveProperty('params')
  expect(
    container.querySelector('table[aria-label="Forma reciente de los jugadores"]'),
  ).not.toBeNull()
})

test('offers a retry after a failed request', async () => {
  apiClient.get
    .mockRejectedValueOnce(new Error('boom'))
    .mockResolvedValueOnce({ data: response })
  act(() => {
    ReactDOM.render(<RecentFormTab />, container)
  })
  await flush()

  expect(container.querySelector('[role="alert"]')).not.toBeNull()
  await act(async () => {
    container
      .querySelector('button')
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  await flush()

  expect(apiClient.get).toHaveBeenCalledTimes(2)
  expect(container.querySelector('table')).not.toBeNull()
})
