/* eslint-env jest */
jest.mock('api', () => ({ database: 'http://db' }))
jest.mock('api/axiosConfig', () => ({ apiClient: { get: jest.fn() } }))
jest.mock('framer-motion', () => ({
  motion: { div: ({ children }) => <div>{children}</div> },
}))
// Sólo se muestra la pestaña activa; los botones permiten cambiarla.
jest.mock('views/components', () => ({
  Loader: () => <div>cargando</div>,
  PageLoader: () => <div>cargando</div>,
  Tooltip: ({ children }) => children,
  Tabs: ({ tabs, defaultTab, activeTab, onChange }) => (
    <div>
      {tabs.map(({ id, label }) => (
        <button key={id} type="button" onClick={() => onChange(id)}>
          {`tab:${label}`}
        </button>
      ))}
      <div data-testid="default-tab">{defaultTab}</div>
      <div data-testid="active-tab">{activeTab}</div>
      {tabs.find(({ id }) => id === (activeTab ?? defaultTab)).content}
    </div>
  ),
}))
jest.mock('./components', () => ({
  ...jest.requireActual('./components'),
  RatingTab: ({ ratings }) => (
    <div data-testid="rating-tab">
      {ratings === null ? 'ratings:null' : `ratings:${ratings.length}`}
    </div>
  ),
  RecordsTab: () => null,
}))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter, useLocation } from 'react-router-dom'
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

let location
const LocationProbe = () => {
  location = useLocation()
  return null
}
// Los tests de tarjetas miran la pestaña "Jugadores".
const render = async (url = '/statistics?tab=players') => {
  await act(async () => {
    ReactDOM.render(
      <MemoryRouter initialEntries={[url]}>
        <StatisticsGeneral />
        <LocationProbe />
      </MemoryRouter>,
      container,
    )
  })
  await flush()
}
const clickTab = (label) => {
  const button = [...container.querySelectorAll('button')].find(
    (node) => node.textContent === `tab:${label}`,
  )
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
}
const activeTab = () =>
  container.querySelector('[data-testid="active-tab"]').textContent

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

test('players tab orders the cards by Elo and no longer shows the Elo table', async () => {
  mockApi({ ratings: () => Promise.resolve({ data: ratingsResponse }) })

  await render()

  expect(apiClient.get).toHaveBeenCalledWith(
    '/ratings',
    expect.objectContaining({ signal: expect.anything() }),
  )
  // La tabla "Rating APA 2.0" pasó a la pestaña "Rating APA".
  expect(container.querySelector('table')).toBeNull()
  expect(container.textContent).not.toContain('Rating APA 2.0')

  // Las tarjetas siguen el ranking, no el orden de /statistics.
  expect(cardNames()).toEqual(['Nico', 'Santi'])
  expect(container.textContent).toContain('Elo1632')
  expect(container.textContent).toContain('Elo1446')
})

test('players tab still works when the Elo ranking fails to load', async () => {
  mockApi({ ratings: () => Promise.reject(new Error('boom')) })

  await render()

  expect(container.querySelector('table')).toBeNull()
  // Sin ranking se conserva el orden original y no se muestra el Elo.
  expect(cardNames()).toEqual(['Santi', 'Nico'])
  expect(container.textContent).not.toContain('Elo1')
  expect(container.textContent).not.toContain('No se pudieron cargar')
})

test('players tab shows no Elo when nobody is rated yet', async () => {
  mockApi({
    ratings: () => Promise.resolve({ data: { success: true, data: [] } }),
  })

  await render()

  expect(container.querySelector('table')).toBeNull()
  expect(cardNames()).toEqual(['Santi', 'Nico'])
  expect(container.textContent).not.toContain('Elo1')
})

test('opens on the Rating APA tab by default and passes it the ratings', async () => {
  mockApi({ ratings: () => Promise.resolve({ data: ratingsResponse }) })

  await render('/statistics')

  expect(
    container.querySelector('[data-testid="default-tab"]').textContent,
  ).toBe('rating')
  expect(activeTab()).toBe('rating')
  expect(
    container.querySelector('[data-testid="rating-tab"]').textContent,
  ).toBe('ratings:2')
  expect(cardNames()).toEqual([])
  // "Rating APA" es la primera pestaña.
  expect(container.querySelector('button').textContent).toBe('tab:Rating APA')
})

test('the Rating APA tab gets null ratings when /ratings fails', async () => {
  mockApi({ ratings: () => Promise.reject(new Error('boom')) })

  await render('/statistics')

  expect(
    container.querySelector('[data-testid="rating-tab"]').textContent,
  ).toBe('ratings:null')
})

test('tab=players shows the player cards', async () => {
  mockApi({ ratings: () => Promise.resolve({ data: ratingsResponse }) })

  await render('/statistics?tab=players')

  expect(activeTab()).toBe('players')
  expect(cardNames()).toEqual(['Nico', 'Santi'])
})

test('an invalid tab falls back to Rating APA', async () => {
  mockApi({ ratings: () => Promise.resolve({ data: ratingsResponse }) })

  await render('/statistics?tab=nope')

  expect(activeTab()).toBe('rating')
})

test('changing tab writes tab and clears the Rating APA params', async () => {
  mockApi({ ratings: () => Promise.resolve({ data: ratingsResponse }) })
  await render(
    '/statistics?dateFrom=2025-01-01&dateTo=2025-02-01&players=n&other=1',
  )

  clickTab('Jugadores')
  expect(location.search).toBe('?other=1&tab=players')
  expect(activeTab()).toBe('players')

  clickTab('Rating APA')
  expect(location.search).toBe('?other=1')
  expect(activeTab()).toBe('rating')
})

test('a failure loading the statistics still shows the page error', async () => {
  apiClient.get.mockImplementation((url) =>
    url === '/ratings'
      ? Promise.resolve({ data: ratingsResponse })
      : Promise.reject(new Error('boom')),
  )

  await render()

  expect(container.textContent).toContain(
    'No se pudieron cargar las estadísticas',
  )
})
