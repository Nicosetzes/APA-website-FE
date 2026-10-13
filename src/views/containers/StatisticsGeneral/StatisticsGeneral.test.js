/* eslint-env jest */
jest.mock('api', () => ({ database: 'http://db' }))
jest.mock('api/axiosConfig', () => ({ apiClient: { get: jest.fn() } }))
jest.mock('framer-motion', () => ({
  motion: { div: ({ children }) => <div>{children}</div> },
}))
// Sólo se muestra la pestaña por defecto ("Jugadores"), que es la que se prueba.
jest.mock('views/components', () => ({
  Loader: () => <div>cargando</div>,
  PageLoader: () => <div>cargando</div>,
  Tooltip: ({ children }) => children,
  Tabs: ({ tabs, defaultTab }) => (
    <div>{tabs.find(({ id }) => id === defaultTab).content}</div>
  ),
}))
jest.mock('./components', () => ({
  ...jest.requireActual('./components'),
  RecordsTab: () => null,
}))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { apiClient } from 'api/axiosConfig'
import StatisticsGeneral from '.'

const playerStats = (id, name, totalMatches) => ({
  player: { id, name },
  totalMatches,
  wins: 1,
  draws: 0,
  losses: 0,
  goalsFor: 2,
  goalsAgainst: 1,
  scoringDifference: 1,
  effectiveness: 100,
  cleanSheets: 0,
  recent: [],
})

// Santi llega primero en las estadísticas, pero Nico lidera el ranking Elo.
const stats = {
  players: [playerStats('s', 'Santi', 516), playerStats('n', 'Nico', 700)],
  decisiveMatchesStats: [],
  leaderboards: {},
  records: {},
  activeStreaks: {},
}

const ratingsResponse = {
  success: true,
  data: [
    {
      position: 1,
      player: { id: 'n', name: 'Nico' },
      rating: 1631.7,
      matches: 700,
      peak: 1664.4,
      provisional: false,
      lastChange: 1.4,
    },
    {
      position: 2,
      player: { id: 's', name: 'Santi' },
      rating: 1446.2,
      matches: 516,
      peak: 1500,
      provisional: false,
      lastChange: -3.2,
    },
  ],
}

let container

const mockApi = ({ ratings }) => {
  apiClient.get.mockImplementation((url) => {
    if (url === '/statistics') return Promise.resolve({ data: stats })
    if (url === '/ratings') return ratings()
    return Promise.reject(new Error(`unexpected ${url}`))
  })
}

const flush = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)))

const render = async () => {
  await act(async () => {
    ReactDOM.render(<StatisticsGeneral />, container)
  })
  await flush()
}

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

const cardNames = () =>
  [...container.querySelectorAll('h3')]
    .map((heading) => heading.textContent)
    .filter((text) => text === 'Nico' || text === 'Santi')

test('players tab shows the Elo ranking and orders the cards by it', async () => {
  mockApi({ ratings: () => Promise.resolve({ data: ratingsResponse }) })

  await render()

  expect(apiClient.get).toHaveBeenCalledWith(
    '/ratings',
    expect.objectContaining({ signal: expect.anything() }),
  )
  expect(container.textContent).toContain('Rating APA 2.0')
  expect(container.querySelectorAll('tbody tr')).toHaveLength(2)
  expect(container.querySelector('tbody').textContent).toContain('1632')

  // Las tarjetas siguen el ranking, no el orden de /statistics.
  expect(cardNames()).toEqual(['Nico', 'Santi'])
  expect(container.textContent).toContain('Elo1632')
  expect(container.textContent).toContain('Elo1446')
})

test('players tab still works when the Elo ranking fails to load', async () => {
  mockApi({ ratings: () => Promise.reject(new Error('boom')) })

  await render()

  expect(container.textContent).toContain('No se pudo cargar el ranking Elo.')
  expect(container.querySelector('table')).toBeNull()
  // Sin ranking se conserva el orden original y no se muestra el Elo.
  expect(cardNames()).toEqual(['Santi', 'Nico'])
  expect(container.textContent).not.toContain('Elo1')
  expect(container.textContent).not.toContain('No se pudieron cargar')
})

test('players tab shows no Elo section when nobody is rated yet', async () => {
  mockApi({
    ratings: () => Promise.resolve({ data: { success: true, data: [] } }),
  })

  await render()

  expect(container.querySelector('table')).toBeNull()
  expect(container.textContent).not.toContain('No se pudo cargar el ranking Elo')
  expect(cardNames()).toEqual(['Santi', 'Nico'])
})

test('a failure loading the statistics still shows the page error', async () => {
  apiClient.get.mockImplementation((url) =>
    url === '/ratings'
      ? Promise.resolve({ data: ratingsResponse })
      : Promise.reject(new Error('boom')),
  )

  await render()

  expect(container.textContent).toContain('No se pudieron cargar las estadísticas')
})
