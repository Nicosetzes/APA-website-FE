/* eslint-env jest */
jest.mock('api', () => ({
  api: 'http://api',
  cloudName: 'cloud',
  database: 'http://db',
}))
jest.mock('axios', () => ({ get: jest.fn(), isCancel: jest.fn(() => false) }))
jest.mock('cloudinary-react', () => ({ Image: () => null }))
jest.mock('views/components', () => ({ Loader: () => null }))

import axios from 'axios'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import Home from '.'

// Hora local para que el test no dependa de la zona horaria.
const local = (...args) => new Date(...args).toISOString()

const finalized = [
  {
    _id: 'older',
    name: 'Copa Vieja',
    closedAt: local(2024, 4, 1, 20, 0),
    closedAtPrecision: 'exact',
    // Editado después del cierre: no tiene que pesar.
    updatedAt: local(2025, 0, 1, 12, 0),
    outcome: { champion: { player: { name: 'Nico' }, team: { id: 1 } } },
  },
  {
    _id: 'latest',
    name: 'Copa Nueva',
    closedAt: local(2024, 7, 1, 20, 0),
    closedAtPrecision: 'exact',
    updatedAt: local(2024, 7, 1, 20, 0),
    outcome: { champion: { player: { name: 'Santi' }, team: { id: 2 } } },
  },
  {
    _id: 'no-closed-at',
    name: 'Copa Sin Cierre',
    updatedAt: local(2026, 0, 1, 12, 0),
    outcome: { champion: { player: { name: 'Lucho' }, team: { id: 3 } } },
  },
]

let container

beforeEach(() => {
  axios.get.mockImplementation((url, { params }) =>
    Promise.resolve({ data: params.status === 'finalized' ? finalized : [] }),
  )
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
  jest.clearAllMocks()
})

test('el campeón vigente sale del torneo con el closedAt más reciente, ignorando updatedAt', async () => {
  await act(async () => {
    ReactDOM.render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      container,
    )
  })

  expect(container.querySelector('.champion-tournament').textContent).toBe(
    'Copa Nueva',
  )
  expect(container.querySelector('.champion-player').textContent).toBe(
    'Santi - 01/08/2024',
  )
})
