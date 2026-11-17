/* eslint-env jest */
jest.mock('api', () => ({ database: 'http://db' }))
jest.mock('api/axiosConfig', () => ({
  apiClient: { get: jest.fn() },
  getApiErrorMessage: (_error, fallback) => fallback,
}))
jest.mock('views/components', () => ({ Loader: () => <div>Cargando</div> }))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { apiClient } from 'api/axiosConfig'
import TeamsTab from '.'

let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  apiClient.get.mockResolvedValue({
    data: {
      completeStatsByTotalPoints: [
        { team: { id: 1, name: 'Racing' }, points: 30, played: 12 },
      ],
      completeStatsByEffectiveness: [
        {
          team: { id: 2, name: 'Boca' },
          player: { id: 'p', name: 'Nico' },
          tournament: { id: 't', name: 'Liga' },
          effectiveness: 80,
          played: 10,
        },
      ],
    },
  })
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
  apiClient.get.mockReset()
})

test('renders historical teams and campaigns from its own endpoint', async () => {
  await act(async () => {
    ReactDOM.render(<TeamsTab />, container)
  })

  expect(apiClient.get).toHaveBeenCalledWith(
    '/statistics/teams',
    expect.objectContaining({ signal: expect.anything() }),
  )
  expect(container.textContent).toContain('Equipos históricos')
  expect(container.textContent).toContain('Racing')
  expect(container.textContent).toContain('Mejores campañas')
  expect(container.textContent).toContain('Nico · Liga')
})
