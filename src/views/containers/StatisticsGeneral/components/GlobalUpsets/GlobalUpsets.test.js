/* eslint-env jest */
jest.mock('api', () => ({ cloudName: 'cloud', database: 'http://db' }))
jest.mock('api/axiosConfig', () => ({
  apiClient: { get: jest.fn() },
  getApiErrorMessage: (_error, fallback) => fallback,
}))
jest.mock('cloudinary-react', () => ({
  Image: ({ publicId, alt, onError }) => (
    <img data-public-id={publicId} alt={alt} onError={onError} />
  ),
}))
jest.mock('views/components', () => ({ Loader: () => <div>loader</div> }))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { apiClient } from 'api/axiosConfig'
import GlobalUpsets from '.'

const TOURNAMENT_ID = '0123456789abcdef01234567'

const upset = (overrides = {}) => ({
  matchId: 'm1',
  playedAt: '2026-10-11T02:00:00.000Z',
  playedAtPrecision: 'exact',
  tournamentId: TOURNAMENT_ID,
  tournament: { id: TOURNAMENT_ID, name: 'Liga APA' },
  type: 'playoff',
  winner: { id: 'p1', name: 'Nico' },
  loser: { id: 'p2', name: 'Santi' },
  teams: {
    winner: { id: 1, name: 'Real Madrid' },
    loser: { id: 2, name: 'Peñarol' },
  },
  score: { winner: 1, loser: 1 },
  penalties: { winner: 5, loser: 4 },
  probability: 0.167,
  kind: 'advance',
  ratingChange: 7.45,
  ...overrides,
})

const payload = (upsets = [upset()]) => ({
  success: true,
  data: {
    total: upsets.length,
    players: [
      { id: 'p1', name: 'Nico' },
      { id: 'p2', name: 'Santi' },
    ],
    tournaments: [{ id: TOURNAMENT_ID, name: 'Liga APA' }],
    upsets,
  },
})

const catalog = [
  {
    _id: TOURNAMENT_ID,
    name: 'Liga APA',
    cloudinary_id: 'tournaments/liga-apa',
  },
]

let container
let location
const LocationProbe = () => {
  location = useLocation()
  return null
}

const flush = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)))

const mockSuccess = (response = payload(), tournaments = catalog) => {
  apiClient.get.mockImplementation((url) => {
    if (url === '/ratings/upsets') return Promise.resolve({ data: response })
    if (url === '/tournaments') return Promise.resolve({ data: tournaments })
    return Promise.reject(new Error(`unexpected ${url}`))
  })
}

const render = async (url = '/statistics?tab=surprises') => {
  await act(async () => {
    ReactDOM.render(
      <MemoryRouter initialEntries={[url]}>
        <GlobalUpsets />
        <LocationProbe />
      </MemoryRouter>,
      container,
    )
  })
  await flush()
}

const field = (name) =>
  [...container.querySelectorAll('label')]
    .find((label) => label.textContent.startsWith(name))
    .querySelector('input, select')

const change = async (node, value) => {
  await act(async () => {
    const prototype =
      node.tagName === 'INPUT'
        ? window.HTMLInputElement.prototype
        : window.HTMLSelectElement.prototype
    const setter = Object.getOwnPropertyDescriptor(prototype, 'value').set
    setter.call(node, value)
    node.dispatchEvent(new Event('change', { bubbles: true }))
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
  apiClient.get.mockReset()
  jest.restoreAllMocks()
})

test('loads both bulk resources and renders an accessible leaderboard table', async () => {
  mockSuccess()

  await render()

  expect(apiClient.get).toHaveBeenCalledWith('/ratings/upsets', {
    params: {
      dateFrom: undefined,
      dateTo: undefined,
      tournamentId: undefined,
      playerId: undefined,
      perspective: 'for',
      type: undefined,
      penalties: 'all',
    },
    signal: expect.anything(),
  })
  expect(apiClient.get).toHaveBeenCalledWith('/tournaments', {
    signal: expect.anything(),
  })
  expect(apiClient.get).toHaveBeenCalledTimes(2)

  const table = container.querySelector('table[aria-label]')
  expect(table).not.toBeNull()
  expect([...table.querySelectorAll('th')].map((node) => node.scope)).toEqual([
    'col',
    'col',
    'col',
    'col',
    'col',
    'col',
  ])
  expect(table.querySelectorAll('tbody tr')).toHaveLength(1)
  expect(table.textContent).toContain('Nico')
  expect(table.textContent).toContain('Santi')
  expect(table.textContent).toContain('1-1')
  expect(table.textContent).toContain('pen. 5-4')
  expect(table.textContent).toContain('16,7% de chances de avanzar')
  expect(table.textContent).toContain('+7.5')

  expect(
    [...table.querySelectorAll('img')].map((image) =>
      image.getAttribute('src'),
    ),
  ).toEqual(expect.arrayContaining(['http://db/logos/1', 'http://db/logos/2']))
  expect(
    table.querySelector('img[data-public-id="tournaments/liga-apa"]'),
  ).not.toBeNull()
})

test('keeps API order and renders at most ten rows', async () => {
  const rows = Array.from({ length: 12 }, (_, index) =>
    upset({
      matchId: `m${index}`,
      probability: (index + 1) / 100,
      winner: { id: `p${index}`, name: `Ganador ${index}` },
    }),
  )
  mockSuccess(payload(rows))

  await render()

  const rendered = [...container.querySelectorAll('tbody tr')]
  expect(rendered).toHaveLength(10)
  expect(rendered[0].textContent).toContain('Ganador 0')
  expect(rendered[9].textContent).toContain('Ganador 9')
  expect(container.textContent).not.toContain('Ganador 10')
})

test('uses accessible fallbacks when ids or images are unavailable or broken', async () => {
  mockSuccess(
    payload([
      upset({
        tournamentId: null,
        teams: {
          winner: { id: null, name: 'Equipo A' },
          loser: { id: 2, name: 'Equipo B' },
        },
      }),
    ]),
  )

  await render()

  expect(
    container.querySelector('[aria-label="Escudo no disponible de Equipo A"]'),
  ).not.toBeNull()
  expect(
    container.querySelector('[aria-label="Imagen no disponible de Liga APA"]'),
  ).not.toBeNull()

  const teamImage = container.querySelector('img[alt="Escudo de Equipo B"]')
  await act(async () => {
    teamImage.dispatchEvent(new Event('error'))
  })
  expect(
    container.querySelector('[aria-label="Escudo no disponible de Equipo B"]'),
  ).not.toBeNull()
})

test('a catalog failure preserves the ranking and tournament fallback', async () => {
  apiClient.get.mockImplementation((url) => {
    if (url === '/ratings/upsets') return Promise.resolve({ data: payload() })
    return Promise.reject(new Error('catalog failed'))
  })

  await render()

  expect(container.querySelectorAll('tbody tr')).toHaveLength(1)
  expect(container.textContent).toContain('Liga APA')
  expect(
    container.querySelector('[aria-label="Imagen no disponible de Liga APA"]'),
  ).not.toBeNull()
  expect(container.querySelector('[role="alert"]')).toBeNull()
})

test('navigates to the existing match listing with known context', async () => {
  mockSuccess()

  await render()

  const link = container.querySelector(
    'a[aria-label="Ver el partido entre Nico y Santi"]',
  )
  expect(link.getAttribute('href')).toBe(
    `/matches?player1=p1&player1Team=Real+Madrid&player2=p2&opponentTeam=Pe%C3%B1arol&tournamentId=${TOURNAMENT_ID}&type=playoff&dateFrom=2026-10-10&dateTo=2026-10-10`,
  )
})

test('writes only supported filters and never sends or preserves limit', async () => {
  mockSuccess()
  await render('/statistics?tab=surprises&upsetsLimit=25&other=1')

  expect(
    [...container.querySelectorAll('label')].some((label) =>
      label.textContent.startsWith('Cantidad'),
    ),
  ).toBe(false)
  expect(field('Perspectiva').disabled).toBe(true)
  await change(field('Torneo'), TOURNAMENT_ID)
  await change(field('Jugador involucrado'), 'p1')
  expect(field('Perspectiva').disabled).toBe(false)
  await change(field('Perspectiva'), 'against')
  await change(field('Fase'), 'playoff')
  await change(field('Penales'), 'only')
  await change(field('Desde'), '2026-01-01')
  await change(field('Hasta'), '2026-12-31')

  expect(location.search).toContain('tab=surprises')
  expect(location.search).toContain('other=1')
  expect(location.search).not.toContain('upsetsLimit')
  expect(location.search).toContain(`upsetsTournamentId=${TOURNAMENT_ID}`)
  expect(location.search).toContain('upsetsPlayerId=p1')
  expect(location.search).toContain('upsetsPerspective=against')
  expect(location.search).toContain('upsetsType=playoff')
  expect(location.search).toContain('upsetsPenalties=only')
  expect(location.search).toContain('upsetsDateFrom=2026-01-01')
  expect(location.search).toContain('upsetsDateTo=2026-12-31')

  const upsetCalls = apiClient.get.mock.calls.filter(
    ([url]) => url === '/ratings/upsets',
  )
  expect(upsetCalls[upsetCalls.length - 1][1].params).toEqual({
    dateFrom: '2026-01-01',
    dateTo: '2026-12-31',
    tournamentId: TOURNAMENT_ID,
    playerId: 'p1',
    perspective: 'against',
    type: 'playoff',
    penalties: 'only',
  })
  expect(
    apiClient.get.mock.calls.filter(([url]) => url === '/tournaments'),
  ).toHaveLength(1)

  await change(field('Jugador involucrado'), '')
  expect(field('Perspectiva').disabled).toBe(true)
  expect(field('Perspectiva').value).toBe('for')
  expect(location.search).not.toContain('upsetsPlayerId')
  expect(location.search).not.toContain('upsetsPerspective')

  const callsAfterClear = apiClient.get.mock.calls.filter(
    ([url]) => url === '/ratings/upsets',
  )
  expect(callsAfterClear[callsAfterClear.length - 1][1].params).toEqual({
    dateFrom: '2026-01-01',
    dateTo: '2026-12-31',
    tournamentId: TOURNAMENT_ID,
    playerId: undefined,
    perspective: 'for',
    type: 'playoff',
    penalties: 'only',
  })
})

test('normalizes an against deep link without a selected player', async () => {
  mockSuccess()

  await render('/statistics?tab=surprises&upsetsPerspective=against&other=1')
  await flush()

  expect(field('Perspectiva').disabled).toBe(true)
  expect(field('Perspectiva').value).toBe('for')
  expect(location.search).toContain('other=1')
  expect(location.search).not.toContain('upsetsPerspective')
})

test('renders the API row oriented for and against the selected player', async () => {
  apiClient.get.mockImplementation((url, config) => {
    if (url === '/tournaments') return Promise.resolve({ data: catalog })
    const against = config.params.perspective === 'against'
    return Promise.resolve({
      data: payload([
        upset({
          matchId: against ? 'against' : 'for',
          winner: against
            ? { id: 'p2', name: 'Rival ganador' }
            : { id: 'p1', name: 'Jugador ganador' },
          loser: against
            ? { id: 'p1', name: 'Jugador perdedor' }
            : { id: 'p2', name: 'Rival perdedor' },
        }),
      ]),
    })
  })

  await render('/statistics?tab=surprises&upsetsPlayerId=p1')
  expect(container.querySelector('tbody').textContent).toContain(
    'Jugador ganador',
  )

  await change(field('Perspectiva'), 'against')
  expect(container.querySelector('tbody').textContent).toContain(
    'Rival ganador',
  )
  expect(container.querySelector('tbody').textContent).toContain(
    'Jugador perdedor',
  )
  expect(container.querySelector('tbody').textContent).toContain(
    '16,7% de chances de quedar eliminado',
  )
})

test('shows loading status and aborts both requests on unmount', async () => {
  const signals = []
  apiClient.get.mockImplementation((_url, config) => {
    signals.push(config.signal)
    return new Promise(() => {})
  })

  await render()

  expect(
    container.querySelector('[role="status"]').getAttribute('aria-label'),
  ).toBe('Cargando mayores sorpresas')
  act(() => ReactDOM.unmountComponentAtNode(container))
  expect(signals).toHaveLength(2)
  expect(signals.every((signal) => signal.aborted)).toBe(true)
})

test('retries only the ranking request after a local error', async () => {
  let upsetCalls = 0
  apiClient.get.mockImplementation((url) => {
    if (url === '/tournaments') return Promise.resolve({ data: catalog })
    upsetCalls += 1
    return upsetCalls === 1
      ? Promise.reject(new Error('boom'))
      : Promise.resolve({ data: payload() })
  })

  await render()

  expect(container.querySelector('[role="alert"]')).not.toBeNull()
  const retry = [...container.querySelectorAll('button')].find(
    (button) => button.textContent === 'Reintentar',
  )
  await act(async () => {
    retry.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  await flush()

  expect(upsetCalls).toBe(2)
  expect(
    apiClient.get.mock.calls.filter(([url]) => url === '/tournaments'),
  ).toHaveLength(1)
  expect(container.querySelector('table')).not.toBeNull()
})

test('shows an empty state without rendering a table', async () => {
  mockSuccess(payload([]))

  await render()

  expect(container.querySelector('table')).toBeNull()
  expect(container.querySelector('[role="alert"]')).toBeNull()
  expect(container.querySelector('[role="status"]')).toBeNull()
})
