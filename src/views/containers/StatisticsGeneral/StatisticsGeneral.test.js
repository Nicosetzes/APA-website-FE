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
  HeadToHeadTab: () => <div data-testid="head-to-head-tab" />,
  RatingTab: ({ ratings }) => (
    <div data-testid="rating-tab">
      {ratings === null ? 'ratings:null' : `ratings:${ratings.length}`}
    </div>
  ),
  RecentFormTab: () => <div data-testid="recent-form-tab" />,
  RecordsTab: () => <div data-testid="records-tab" />,
  SurprisesTab: () => <div data-testid="surprises-tab" />,
  TeamsTab: () => <div data-testid="teams-tab" />,
  TournamentsTab: () => <div data-testid="tournaments-tab" />,
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
    if (url === '/statistics/players') return Promise.resolve({ data: stats })
    if (url === '/statistics/records') return Promise.resolve({ data: stats })
    if (url === '/ratings/reigns') {
      return Promise.resolve({ data: { success: true, data: null } })
    }
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
  expect(
    [...container.querySelectorAll('button')].map((button) =>
      button.textContent.replace('tab:', ''),
    ),
  ).toEqual([
    'Rating APA',
    'Torneos',
    'Forma reciente',
    'Mano a mano',
    'Sorpresas',
    'Récords',
    'Jugadores',
    'Equipos',
    'Clasificaciones',
  ])
  expect(apiClient.get).not.toHaveBeenCalledWith(
    expect.stringMatching(/^\/statistics\//),
    expect.anything(),
  )
})

test('opens Torneos from the URL without loading unrelated endpoints', async () => {
  mockApi({ ratings: () => Promise.resolve({ data: ratingsResponse }) })

  await render(
    '/statistics?tab=tournaments&dateFrom=2025-01-01&tournamentId=0123456789abcdef01234567',
  )

  expect(activeTab()).toBe('tournaments')
  expect(
    container.querySelector('[data-testid="tournaments-tab"]'),
  ).not.toBeNull()
  expect(apiClient.get).not.toHaveBeenCalled()
})

test('opens Forma reciente as a principal tab without loading rating filters', async () => {
  mockApi({ ratings: () => Promise.resolve({ data: ratingsResponse }) })

  await render(
    '/statistics?tab=recent-form&dateFrom=2025-01-01&tournamentId=0123456789abcdef01234567',
  )

  expect(activeTab()).toBe('recent-form')
  expect(
    container.querySelector('[data-testid="recent-form-tab"]'),
  ).not.toBeNull()
  expect(apiClient.get).not.toHaveBeenCalled()
})

test('the Rating APA tab gets null ratings when /ratings fails', async () => {
  mockApi({ ratings: () => Promise.reject(new Error('boom')) })

  await render('/statistics')

  expect(
    container.querySelector('[data-testid="rating-tab"]').textContent,
  ).toBe('ratings:null')
})

test('tab=players combines general and elimination statistics', async () => {
  mockApi({ ratings: () => Promise.resolve({ data: ratingsResponse }) })

  await render('/statistics?tab=players')

  expect(activeTab()).toBe('players')
  expect(cardNames()).toEqual(['Nico', 'Santi'])
  expect(container.textContent).toContain('Partidos de eliminación')
  expect(container.textContent).not.toContain('tab:Partidos de eliminación')
  expect(container.textContent).toContain('tab:Mano a mano')
  expect(container.textContent).toContain('tab:Equipos')
  expect(apiClient.get).toHaveBeenCalledWith(
    '/statistics/players',
    expect.objectContaining({ signal: expect.anything() }),
  )
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

  clickTab('Forma reciente')
  expect(location.search).toBe('?other=1&tab=recent-form')
  expect(activeTab()).toBe('recent-form')

  clickTab('Rating APA')
  expect(location.search).toBe('?other=1')
  expect(activeTab()).toBe('rating')
})

test('changing to Torneos clears Rating APA params and preserves unrelated ones', async () => {
  mockApi({ ratings: () => Promise.resolve({ data: ratingsResponse }) })
  await render(
    '/statistics?dateFrom=2025-01-01&dateTo=2025-02-01&tournamentId=0123456789abcdef01234567&players=n&other=1',
  )

  clickTab('Torneos')
  expect(location.search).toBe('?other=1&tab=tournaments')
  expect(activeTab()).toBe('tournaments')
})

test('changing tab also clears tournamentId', async () => {
  mockApi({ ratings: () => Promise.resolve({ data: ratingsResponse }) })
  await render(
    '/statistics?tournamentId=0123456789abcdef01234567&players=n&other=1',
  )

  clickTab('Jugadores')
  expect(location.search).toBe('?other=1&tab=players')
  expect(activeTab()).toBe('players')
})

test('changing away from Mano a mano clears its URL parameters', async () => {
  mockApi({ ratings: () => Promise.resolve({ data: ratingsResponse }) })
  await render(
    '/statistics?tab=head-to-head&playerA=1&playerB=2&h2hStage=playoff&h2hTournamentId=0123456789abcdef01234567&h2hPeriod=2026&h2hDateFrom=2026-01-01&h2hDateTo=2026-12-31&other=1',
  )

  clickTab('Jugadores')
  await flush()

  expect(location.search).toBe('?tab=players&other=1')
})

test('opens Sorpresas from its own URL without loading unrelated endpoints', async () => {
  mockApi({ ratings: () => Promise.resolve({ data: ratingsResponse }) })

  await render(
    '/statistics?tab=surprises&upsetsDateFrom=2026-01-01&upsetsPenalties=only',
  )

  expect(activeTab()).toBe('surprises')
  expect(
    container.querySelector('[data-testid="surprises-tab"]'),
  ).not.toBeNull()
  expect(container.querySelector('[data-testid="records-tab"]')).toBeNull()
  expect(apiClient.get).not.toHaveBeenCalled()
})

test('keeps the upset filters while Sorpresas remains active and cleans legacy limit', async () => {
  mockApi({ ratings: () => Promise.resolve({ data: ratingsResponse }) })
  await render(
    '/statistics?tab=surprises&upsetsDateFrom=2026-01-01&upsetsDateTo=2026-12-31&upsetsTournamentId=0123456789abcdef01234567&upsetsPlayerId=n&upsetsType=playoff&upsetsPenalties=only&upsetsLimit=25&other=1',
  )

  clickTab('Sorpresas')

  expect(location.search).toContain('upsetsDateFrom=2026-01-01')
  expect(location.search).toContain('upsetsPenalties=only')
  expect(location.search).not.toContain('upsetsLimit')
  expect(location.search).toContain('other=1')
})

test('leaving Sorpresas clears only its filters', async () => {
  mockApi({ ratings: () => Promise.resolve({ data: ratingsResponse }) })
  await render(
    '/statistics?tab=surprises&upsetsDateFrom=2026-01-01&upsetsDateTo=2026-12-31&upsetsTournamentId=0123456789abcdef01234567&upsetsPlayerId=n&upsetsType=playoff&upsetsPenalties=only&upsetsLimit=25&other=1',
  )

  clickTab('Jugadores')
  await flush()

  expect(location.search).toBe('?tab=players&other=1')
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
