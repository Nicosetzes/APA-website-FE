/* eslint-env jest */
jest.mock('api', () => ({ api: 'http://api', database: 'http://db' }))
jest.mock('api/axiosConfig', () => ({ apiClient: { put: jest.fn() } }))
jest.mock('utils/notifications', () => ({
  confirmDialog: jest.fn(),
  toast: { error: jest.fn(), success: jest.fn() },
}))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import Match from '.'

// Hora local para que el test no dependa de la zona horaria.
const local = (...args) => new Date(...args).toISOString()

const match = (overrides) => ({
  _id: 'm1',
  createdAt: local(2024, 6, 1, 10, 0),
  updatedAt: local(2024, 6, 8, 21, 15, 42),
  group: 'A',
  played: true,
  playerP1: { id: 'p1', name: 'Nico' },
  playerP2: { id: 'p2', name: 'Santi' },
  teamP1: { id: 'a', name: 'Boca' },
  teamP2: { id: 'b', name: 'River' },
  scoreP1: 1,
  scoreP2: 0,
  ...overrides,
})

let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
})

const render = (props) => {
  act(() => {
    ReactDOM.render(
      <MemoryRouter>
        <Match canMutate={false} getFixtureData={jest.fn()} {...props} />
      </MemoryRouter>,
      container,
    )
  })
}

test('muestra la fecha del partido como DD/MM/YYYY HH:mm (24h, sin segundos)', () => {
  render({ match: match() })

  expect(container.textContent).toContain('08/07/2024 21:15')
  expect(container.textContent).not.toMatch(/\b(AM|PM)\b|21:15:42/)
})

test('partido sin jugar: mensaje en lugar de la fecha', () => {
  render({ match: match({ played: false }) })

  expect(container.textContent).toContain('El partido aún no se ha jugado')
})

test('muestra playedAt y no la última edición (updatedAt)', () => {
  render({
    match: match({
      playedAt: local(2024, 6, 8, 21, 15),
      playedAtPrecision: 'exact',
      updatedAt: local(2024, 9, 3, 18, 40),
    }),
  })

  expect(container.textContent).toContain('08/07/2024 21:15')
  expect(container.textContent).not.toContain('03/10/2024')
})

test('fecha aproximada: sin hora', () => {
  render({
    match: match({
      playedAt: local(2019, 6, 9, 7, 0),
      playedAtPrecision: 'year',
    }),
  })

  expect(container.textContent).toContain('2019')
  expect(container.textContent).not.toContain('07:00')
})
