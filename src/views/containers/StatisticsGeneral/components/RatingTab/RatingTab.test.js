/* eslint-env jest */
jest.mock('api/axiosConfig', () => ({ apiClient: { get: jest.fn() } }))
jest.mock('views/components', () => ({
  Loader: () => <div data-testid="loader" />,
  Tooltip: ({ children }) => children,
}))
// Los campos de fecha reales se prueban en PeriodFilter.test.js.
jest.mock('views/containers/MatchListing/DateFilter', () => ({
  __esModule: true,
  default: ({ id, label, value, onChange }) => (
    <input
      id={id}
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
  DateFilterProvider: ({ children }) => children,
}))
// Recharts no se carga en este test: solo importa qué le llega al gráfico.
jest.mock('../RatingHistoryChart', () => ({
  __esModule: true,
  default: ({ data, selectedIds, marks, mode }) => (
    <div
      data-testid="chart"
      data-mode={mode}
      data-marks={marks.map((mark) => mark.name).join(',')}
    >
      {`${data.dateFrom}..${data.dateTo}|${selectedIds.join(',')}`}
    </div>
  ),
}))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { apiClient } from 'api/axiosConfig'
import {
  ACTIVE_TOURNAMENTS,
  COPA_ID,
  LIGA_ID,
  VIEJO_ID,
  historyResponse,
  tournamentResponse,
} from 'utils/testing/ratingHistoryFixtures'
import RatingTab from '.'

const ratings = [
  {
    position: 1,
    player: { id: 'n', name: 'Nico' },
    rating: 1503,
    matches: 12,
    peak: 1510,
    provisional: false,
    lastChange: -7,
  },
  {
    position: 2,
    player: { id: 's', name: 'Santi' },
    rating: 1497,
    matches: 10,
    peak: 1500,
    provisional: false,
    lastChange: 7,
  },
]

let container
let location
const LocationProbe = () => {
  location = useLocation()
  return null
}

const settle = async () => {
  await act(async () => {})
  await act(async () => {})
}
const render = async (url = '/statistics', props = {}) => {
  await act(async () => {
    ReactDOM.render(
      <MemoryRouter initialEntries={[url]}>
        <RatingTab ratings={ratings} {...props} />
        <LocationProbe />
      </MemoryRouter>,
      container,
    )
  })
  await settle()
}
const HISTORY_URL = '/ratings/history'
const TOURNAMENTS_URL = '/tournaments'
// Solo los pedidos del historial (la lista de torneos se cuenta aparte).
const requests = () =>
  apiClient.get.mock.calls
    .filter(([url]) => url === HISTORY_URL)
    .map(([, config]) => config.params)
const tournamentRequests = () =>
  apiClient.get.mock.calls.filter(([url]) => url === TOURNAMENTS_URL)
// Rutea el mock por URL: cada parte se puede reemplazar por separado.
const routeApi = ({
  history = (params) =>
    Promise.resolve({
      data: params.tournamentId ? tournamentResponse() : historyResponse(),
    }),
  tournaments = () => Promise.resolve({ data: ACTIVE_TOURNAMENTS }),
} = {}) =>
  apiClient.get.mockImplementation((url, config) =>
    url === TOURNAMENTS_URL ? tournaments(config) : history(config.params),
  )
const click = async (node) => {
  await act(async () => {
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  await settle()
}
const buttonByText = (text) =>
  [...container.querySelectorAll('button')].find(
    (node) => node.textContent === text,
  )
const type = async (selector, value) => {
  const input = container.querySelector(selector)
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  ).set
  await act(async () => {
    setter.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
  await settle()
}
const chartText = () =>
  container.querySelector('[data-testid="chart"]')?.textContent

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date('2026-10-27T15:00:00.000Z'))
  container = document.createElement('div')
  document.body.appendChild(container)
  jest.spyOn(console, 'error').mockImplementation(() => {})
  routeApi()
})
afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
  jest.useRealTimers()
  jest.restoreAllMocks()
  apiClient.get.mockReset()
})

test('without params it asks for the last year counted from today (Argentina)', async () => {
  await render()
  expect(requests()).toEqual([{ dateFrom: '2025-10-27', dateTo: '2026-10-27' }])
  expect(apiClient.get).toHaveBeenCalledWith(
    '/ratings/history',
    expect.objectContaining({ signal: expect.anything() }),
  )
  expect(
    container.querySelector('button[aria-pressed="true"]').textContent,
  ).toBe('Último año')
})

test('renders the Elo table, the picker, the chart and the period summary', async () => {
  await render()
  expect(container.textContent).toContain('Rating APA 2.0')
  expect(
    container.querySelector(
      'table[aria-label="Rating APA 2.0 de los jugadores"]',
    ),
  ).not.toBeNull()
  expect(container.textContent).toContain('Jugadores en el gráfico')
  expect(chartText()).toBe('2025-10-27..2026-10-27|n,s')
  expect(container.textContent).toContain('Ranking del período')
  expect(container.textContent).toContain('Upsets del período')
})

test('shows the Elo ranking error when ratings could not be loaded', async () => {
  await render('/statistics', { ratings: null })
  expect(container.textContent).toContain('No se pudo cargar el ranking Elo.')
  expect(chartText()).toBe('2025-10-27..2026-10-27|n,s')
})

test('shows the platform loader while the history loads', async () => {
  routeApi({ history: () => new Promise(() => {}) })
  await render()
  expect(
    container.querySelector('[role="status"] [data-testid="loader"]'),
  ).not.toBeNull()
  expect(container.textContent).not.toContain('Cargando evolución')
  expect(container.querySelector('[data-testid="chart"]')).toBeNull()
})

const pressedButtons = () =>
  [...container.querySelectorAll('button[aria-pressed="true"]')].map(
    (node) => node.textContent,
  )
const selectYear = async (year) => {
  const select = container.querySelector('select')
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLSelectElement.prototype,
    'value',
  ).set
  await act(async () => {
    setter.call(select, year)
    select.dispatchEvent(new Event('change', { bubbles: true }))
  })
  await settle()
}

test('a shortcut writes dateFrom/dateTo and asks for the new range', async () => {
  await render('/statistics?dateFrom=2026-01-01&dateTo=2026-02-01')
  expect(requests()).toEqual([{ dateFrom: '2026-01-01', dateTo: '2026-02-01' }])
  expect(pressedButtons()).toEqual([])

  await click(buttonByText('Último mes'))
  expect(location.search).toBe('?dateFrom=2026-09-27&dateTo=2026-10-27')
  expect(requests()[1]).toEqual({
    dateFrom: '2026-09-27',
    dateTo: '2026-10-27',
  })
  expect(pressedButtons()).toEqual(['Último mes'])
})

test('the default range is applied without writing it to the URL', async () => {
  await render()
  expect(location.search).toBe('')
  expect(pressedButtons()).toEqual(['Último año'])
})

test('the active shortcut is detected from the dates in the URL', async () => {
  await render('/statistics?dateFrom=2026-07-27&dateTo=2026-10-27')
  expect(pressedButtons()).toEqual(['Últimos 3 meses'])
})

test('a rolling range from another day is shown as a free range', async () => {
  await render('/statistics?dateFrom=2026-07-26&dateTo=2026-10-26')
  expect(pressedButtons()).toEqual([])
  expect(requests()).toEqual([{ dateFrom: '2026-07-26', dateTo: '2026-10-26' }])
  expect(container.textContent).toContain(
    'Mostrando del 26/07/2026 al 26/10/2026.',
  )
})

test('a ?period= param without dates is ignored: default period, URL untouched', async () => {
  await render('/statistics?players=s&period=ultimos-3-meses')
  expect(location.search).toBe('?players=s&period=ultimos-3-meses')
  expect(requests()).toEqual([{ dateFrom: '2025-10-27', dateTo: '2026-10-27' }])
  expect(pressedButtons()).toEqual(['Último año'])
  expect(chartText().endsWith('|s')).toBe(true)
})

test('every shortcut asks for its own range', async () => {
  await render()
  const expected = {
    Hoy: ['2026-10-27', '2026-10-27'],
    'Última semana': ['2026-10-21', '2026-10-27'],
    'Últimos 3 meses': ['2026-07-27', '2026-10-27'],
    'Últimos 6 meses': ['2026-04-27', '2026-10-27'],
    'Todo el historial': ['2019-01-01', '2026-10-27'],
  }
  for (const [label, [dateFrom, dateTo]] of Object.entries(expected)) {
    await click(buttonByText(label))
    expect(requests()[requests().length - 1]).toEqual({ dateFrom, dateTo })
  }
})

test('the year select asks for the whole calendar year', async () => {
  await render()
  await selectYear('2024')
  expect(location.search).toBe('?dateFrom=2024-01-01&dateTo=2024-12-31')
  expect(requests()[1]).toEqual({
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31',
  })
  expect(container.querySelector('select').value).toBe('2024')
})

test('the year select reaches 2019, the first year with matches', async () => {
  await render()
  await selectYear('2019')
  expect(location.search).toBe('?dateFrom=2019-01-01&dateTo=2019-12-31')
  expect(requests()[1]).toEqual({
    dateFrom: '2019-01-01',
    dateTo: '2019-12-31',
  })
  expect(container.querySelector('select').value).toBe('2019')
})

test('editing a date from a year keeps a free range', async () => {
  await render('/statistics?dateFrom=2025-01-01&dateTo=2025-12-31')
  expect(requests()).toEqual([{ dateFrom: '2025-01-01', dateTo: '2025-12-31' }])

  await type('#rating-dateFrom', '2025-03-01')
  const params = new URLSearchParams(location.search)
  // La otra fecha se completa con la del período que se estaba viendo.
  expect(params.get('dateFrom')).toBe('2025-03-01')
  expect(params.get('dateTo')).toBe('2025-12-31')
  expect(requests()[1]).toEqual({
    dateFrom: '2025-03-01',
    dateTo: '2025-12-31',
  })
})

test('an inverted range warns and does not call the API', async () => {
  await render('/statistics?dateFrom=2026-05-01&dateTo=2026-04-01')
  expect(requests()).toEqual([])
  expect(container.textContent).toContain(
    'La fecha de inicio no puede ser posterior a la de fin.',
  )
  expect(container.querySelector('[data-testid="chart"]')).toBeNull()
})

test('a single date warns and clearing one date does not call the API', async () => {
  await render('/statistics?dateFrom=2026-05-01&dateTo=2026-06-01')
  expect(requests()).toHaveLength(1)
  await type('#rating-dateTo', '')
  expect(requests()).toHaveLength(1)
  expect(container.textContent).toContain(
    'Elegí la fecha de inicio y la de fin',
  )
  expect(location.search).toBe('?dateFrom=2026-05-01')
})

test('unchecking a player edits players without asking again', async () => {
  await render()
  const checkboxes = () => [
    ...container.querySelectorAll('input[type="checkbox"]'),
  ]
  expect(checkboxes()).toHaveLength(2)

  await click(checkboxes()[0])
  expect(location.search).toBe('?players=s')
  expect(chartText()).toContain('|s')
  expect(requests()).toHaveLength(1)
})

test('Ninguno writes players=none and Todos selects everyone again', async () => {
  await render()
  await click(buttonByText('Ninguno'))
  expect(location.search).toBe('?players=none')
  expect(chartText()).toContain('|')
  expect(chartText().endsWith('|')).toBe(true)

  await click(buttonByText('Todos'))
  expect(new URLSearchParams(location.search).getAll('players')).toEqual([
    'n',
    's',
  ])
  expect(chartText().endsWith('|n,s')).toBe(true)
})

test('loads the selection from players= in the URL', async () => {
  await render('/statistics?players=s')
  expect(chartText().endsWith('|s')).toBe(true)
  const checked = [...container.querySelectorAll('input[type="checkbox"]')].map(
    (input) => input.checked,
  )
  expect(checked).toEqual([false, true])
})

test('ignores players that are not in the period', async () => {
  await render('/statistics?players=zzz')
  expect(chartText().endsWith('|n,s')).toBe(true)
})

test('the selection survives a period change', async () => {
  await render('/statistics?players=s')
  await click(buttonByText('Hoy'))
  expect(new URLSearchParams(location.search).getAll('players')).toEqual(['s'])
  expect(chartText().endsWith('|s')).toBe(true)
})

test('shows an error and retries the same range', async () => {
  let failNext = true
  routeApi({
    history: () => {
      if (!failNext) return Promise.resolve({ data: historyResponse() })
      failNext = false
      return Promise.reject(new Error('boom'))
    },
  })
  await render()
  expect(container.textContent).toContain(
    'No se pudo cargar la evolución del rating.',
  )
  expect(container.querySelector('[data-testid="chart"]')).toBeNull()

  await click(buttonByText('Reintentar'))
  expect(requests()).toHaveLength(2)
  expect(requests()[1]).toEqual(requests()[0])
  expect(chartText()).toBeDefined()
  expect(container.textContent).not.toContain('No se pudo cargar la evolución')
})

test('shows an empty state when the period has no matches', async () => {
  routeApi({
    history: () =>
      Promise.resolve({
        data: historyResponse({
          matchesInPeriod: 0,
          players: [],
          matchesTimeline: [],
        }),
      }),
  })
  await render('/statistics?dateFrom=2026-10-27&dateTo=2026-10-27')
  expect(container.textContent).toContain('No hay partidos en este período.')
  expect(container.querySelector('[data-testid="chart"]')).toBeNull()
  // El filtro sigue disponible para cambiar de período.
  expect(buttonByText('Último año')).toBeDefined()
})

test('changing the URL does not remount the tab', async () => {
  await render()
  const table = container.querySelector('table')
  await click(buttonByText('Última semana'))
  await click(container.querySelectorAll('input[type="checkbox"]')[0])
  expect(container.querySelector('table')).toBe(table)
})

describe('tournament filter and marks', () => {
  const tournamentSelect = () => container.querySelector('#rating-tournament')
  const optionsOf = (select) =>
    [...select.options].map((option) => [
      option.value,
      option.textContent,
      option.disabled,
    ])
  const chooseTournament = async (value) => {
    const select = tournamentSelect()
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLSelectElement.prototype,
      'value',
    ).set
    await act(async () => {
      setter.call(select, value)
      select.dispatchEvent(new Event('change', { bubbles: true }))
    })
    await settle()
  }
  const chartAttr = (name) =>
    container.querySelector('[data-testid="chart"]')?.getAttribute(name)
  const DIMMED_NOTE =
    'El período no aplica mientras hay un torneo elegido. Elegí un período para volver.'
  const LIST_ERROR =
    'No se pudo cargar la lista de torneos; el filtro por torneo no está disponible.'

  test('asks for /tournaments?legacy=false once, even if the URL changes', async () => {
    await render()
    expect(tournamentRequests()).toHaveLength(1)
    expect(tournamentRequests()[0][1].params).toEqual({ legacy: false })
    await click(buttonByText('Última semana'))
    await chooseTournament(LIGA_ID)
    await click(buttonByText('Hoy'))
    expect(tournamentRequests()).toHaveLength(1)
  })

  test('offers "Todos los torneos" and the active tournaments in the BE order', async () => {
    await render()
    expect(
      container.querySelector('label[for="rating-tournament"]').textContent,
    ).toBe('Torneo')
    expect(optionsOf(tournamentSelect())).toEqual([
      ['all', 'Todos los torneos', false],
      [COPA_ID, 'Copa APA', false],
      [LIGA_ID, 'Liga APA', false],
    ])
    expect(tournamentSelect().value).toBe('all')
  })

  test('choosing a tournament writes tournamentId, removes the dates and asks only for the tournament', async () => {
    await render(
      '/statistics?dateFrom=2026-01-01&dateTo=2026-02-01&players=s&other=1',
    )
    await chooseTournament(LIGA_ID)
    const params = new URLSearchParams(location.search)
    expect(params.get('tournamentId')).toBe(LIGA_ID)
    expect(params.has('dateFrom')).toBe(false)
    expect(params.has('dateTo')).toBe(false)
    expect(params.getAll('players')).toEqual(['s'])
    expect(params.get('other')).toBe('1')
    expect(requests()[requests().length - 1]).toEqual({ tournamentId: LIGA_ID })
    expect(tournamentSelect().value).toBe(LIGA_ID)
    expect(chartAttr('data-mode')).toBe('tournament')
  })

  test('"Todos los torneos" removes tournamentId and goes back to the default period', async () => {
    await render(`/statistics?tournamentId=${LIGA_ID}&players=s`)
    expect(requests()).toEqual([{ tournamentId: LIGA_ID }])
    await chooseTournament('all')
    expect(location.search).toBe('?players=s')
    expect(requests()[1]).toEqual({
      dateFrom: '2025-10-27',
      dateTo: '2026-10-27',
    })
    expect(chartAttr('data-mode')).toBe('period')
  })

  test('a shortcut and a year remove tournamentId', async () => {
    await render(`/statistics?tournamentId=${LIGA_ID}`)
    await click(buttonByText('Último mes'))
    expect(location.search).toBe('?dateFrom=2026-09-27&dateTo=2026-10-27')
    expect(requests()[1]).toEqual({
      dateFrom: '2026-09-27',
      dateTo: '2026-10-27',
    })

    await chooseTournament(LIGA_ID)
    await selectYear('2024')
    expect(location.search).toBe('?dateFrom=2024-01-01&dateTo=2024-12-31')
  })

  test('editing a date removes tournamentId and fills the other date with the default range', async () => {
    await render(`/statistics?tournamentId=${LIGA_ID}`)
    await type('#rating-dateFrom', '2026-03-01')
    const params = new URLSearchParams(location.search)
    expect(params.has('tournamentId')).toBe(false)
    expect(params.get('dateFrom')).toBe('2026-03-01')
    expect(params.get('dateTo')).toBe('2026-10-27')
    expect(requests()[1]).toEqual({
      dateFrom: '2026-03-01',
      dateTo: '2026-10-27',
    })
  })

  test('a tournamentId in the URL wins over the dates, which are ignored and not rewritten', async () => {
    const url = `/statistics?tournamentId=${LIGA_ID}&dateFrom=2026-01-01&dateTo=2026-02-01`
    await render(url)
    expect(requests()).toEqual([{ tournamentId: LIGA_ID }])
    expect(location.search).toBe(url.replace('/statistics', ''))
    expect(pressedButtons()).toEqual([])
    expect(container.querySelector('#rating-dateFrom').value).toBe('')
    expect(container.querySelector('#rating-dateTo').value).toBe('')
  })

  test('an uppercase tournamentId is read in lowercase', async () => {
    await render(`/statistics?tournamentId=${LIGA_ID.toUpperCase()}`)
    expect(requests()).toEqual([{ tournamentId: LIGA_ID }])
  })

  test.each([['all'], ['abc'], [''], ['0123456789abcdef0123456']])(
    'an invalid tournamentId (%p) is treated as period mode',
    async (value) => {
      await render(`/statistics?tournamentId=${value}`)
      expect(requests()).toEqual([
        { dateFrom: '2025-10-27', dateTo: '2026-10-27' },
      ])
      expect(chartAttr('data-mode')).toBe('period')
      expect(container.textContent).not.toContain(DIMMED_NOTE)
    },
  )

  test('in tournament mode the title shows the name, the range and the number of matches', async () => {
    await render(`/statistics?tournamentId=${LIGA_ID}`)
    expect(container.textContent).toContain('Torneo: Liga APA')
    expect(container.textContent).toContain(
      'Del 10/10/2026 al 11/10/2026 · 3 partidos',
    )
    expect(chartText()).toBe('2026-10-10..2026-10-11|n,s')
    expect(container.textContent).toContain('Ranking del torneo')
    expect(container.textContent).toContain('Upsets del torneo')
    expect(container.textContent).not.toContain('null')
    const headers = [...container.querySelectorAll('thead th')].map(
      (th) => th.textContent,
    )
    expect(headers).not.toContain('Posición')
  })

  test('period mode keeps the period titles and the Posición column', async () => {
    await render()
    expect(container.textContent).not.toContain('Torneo: ')
    expect(container.textContent).toContain('Ranking del período')
    const headers = [...container.querySelectorAll('thead th')].map(
      (th) => th.textContent,
    )
    expect(headers).toContain('Posición')
  })

  test('in tournament mode the period filter is dimmed with a note but still works', async () => {
    await render(`/statistics?tournamentId=${LIGA_ID}`)
    expect(container.textContent).toContain(DIMMED_NOTE)
    expect(container.textContent).not.toContain('Mostrando del')
    await click(buttonByText('Hoy'))
    expect(container.textContent).not.toContain(DIMMED_NOTE)
    expect(pressedButtons()).toEqual(['Hoy'])
  })

  test('a tournament without matches shows the title and an empty state', async () => {
    routeApi({
      history: () =>
        Promise.resolve({
          data: {
            ...tournamentResponse({
              matchesInPeriod: 0,
              players: [],
              matchesTimeline: [],
              tournaments: [],
            }),
            dateFrom: null,
            dateTo: null,
          },
        }),
    })
    await render(`/statistics?tournamentId=${LIGA_ID}`)
    expect(container.textContent).toContain('Torneo: Liga APA')
    expect(container.textContent).toContain('No hay partidos de este torneo.')
    expect(container.textContent).not.toContain(
      'No hay partidos en este período.',
    )
    expect(container.querySelector('[data-testid="chart"]')).toBeNull()
  })

  test('a tournament that is not in the list shows its data and a disabled selected option', async () => {
    routeApi({
      history: () =>
        Promise.resolve({
          data: {
            ...tournamentResponse(),
            scope: {
              type: 'tournament',
              tournament: { id: VIEJO_ID, name: 'Torneo viejo' },
            },
          },
        }),
    })
    await render(`/statistics?tournamentId=${VIEJO_ID}`)
    expect(chartText()).toBe('2026-10-10..2026-10-11|n,s')
    expect(container.textContent).toContain('Torneo: Torneo viejo')
    expect(optionsOf(tournamentSelect())).toEqual([
      ['all', 'Todos los torneos', false],
      [VIEJO_ID, 'Torneo viejo (fuera de la lista)', true],
      [COPA_ID, 'Copa APA', false],
      [LIGA_ID, 'Liga APA', false],
    ])
    expect(tournamentSelect().value).toBe(VIEJO_ID)
    expect(chartAttr('data-marks')).toBe('')
  })

  test('a tournament that is not in the list and has no name says it is not available', async () => {
    routeApi({
      history: () =>
        Promise.resolve({
          data: {
            ...tournamentResponse(),
            scope: {
              type: 'tournament',
              tournament: { id: VIEJO_ID, name: null },
            },
          },
        }),
    })
    await render(`/statistics?tournamentId=${VIEJO_ID}`)
    expect(optionsOf(tournamentSelect())[1]).toEqual([
      VIEJO_ID,
      'Torneo no disponible',
      true,
    ])
    expect(container.textContent).toContain('Torneo: Torneo')
  })

  test('with /tournaments down there is no selector, a note and the chart still works', async () => {
    routeApi({ tournaments: () => Promise.reject(new Error('boom')) })
    await render()
    expect(tournamentSelect()).toBeNull()
    expect(container.textContent).toContain(LIST_ERROR)
    expect(chartText()).toBe('2025-10-27..2026-10-27|n,s')
    expect(chartAttr('data-marks')).toBe('')
    expect(container.textContent).toContain('Ranking del período')
  })

  test('with /tournaments down a tournamentId in the URL still loads and the period filter is the way out', async () => {
    routeApi({ tournaments: () => Promise.reject(new Error('boom')) })
    await render(`/statistics?tournamentId=${LIGA_ID}`)
    expect(tournamentSelect()).toBeNull()
    expect(chartText()).toBe('2026-10-10..2026-10-11|n,s')
    expect(container.textContent).toContain('Torneo: Liga APA')
    await click(buttonByText('Último año'))
    expect(chartAttr('data-mode')).toBe('period')
  })

  test('an empty tournament list hides the selector without a note', async () => {
    routeApi({ tournaments: () => Promise.resolve({ data: [] }) })
    await render()
    expect(tournamentSelect()).toBeNull()
    expect(container.textContent).not.toContain(LIST_ERROR)
    expect(chartAttr('data-marks')).toBe('')
  })

  test('a BE without data.tournaments shows no selector and no marks', async () => {
    routeApi({
      history: () =>
        Promise.resolve({ data: historyResponse({ tournaments: undefined }) }),
    })
    await render()
    expect(chartText()).toBe('2025-10-27..2026-10-27|n,s')
    expect(tournamentSelect()).toBeNull()
    expect(chartAttr('data-marks')).toBe('')
    expect(container.textContent).not.toContain(LIST_ERROR)
  })

  test('the selector is shown while the first history is loading', async () => {
    routeApi({ history: () => new Promise(() => {}) })
    await render()
    expect(tournamentSelect()).not.toBeNull()
  })

  test('draws marks only for the tournaments in the active list', async () => {
    await render()
    // La respuesta trae la Liga (activa) y un torneo viejo (no activo).
    expect(chartAttr('data-marks')).toBe('Liga APA')
  })

  test('uses the name of the active list for the marks and none when there are no active ones', async () => {
    routeApi({
      tournaments: () =>
        Promise.resolve({ data: [{ _id: LIGA_ID, name: 'Liga APA 2026' }] }),
    })
    await render()
    expect(chartAttr('data-marks')).toBe('Liga APA 2026')
  })

  test('tournament mode draws no marks', async () => {
    await render(`/statistics?tournamentId=${LIGA_ID}`)
    expect(chartAttr('data-mode')).toBe('tournament')
    expect(chartAttr('data-marks')).toBe('')
  })

  test('a failing tournament request keeps the retry working', async () => {
    let failNext = true
    routeApi({
      history: () => {
        if (!failNext) return Promise.resolve({ data: tournamentResponse() })
        failNext = false
        return Promise.reject(new Error('400'))
      },
    })
    await render(`/statistics?tournamentId=${LIGA_ID}`)
    expect(container.textContent).toContain(
      'No se pudo cargar la evolución del rating.',
    )
    // El selector sigue ahí para salir del modo torneo.
    expect(tournamentSelect()).not.toBeNull()
    await click(buttonByText('Reintentar'))
    expect(requests()).toEqual([
      { tournamentId: LIGA_ID },
      { tournamentId: LIGA_ID },
    ])
    expect(container.textContent).toContain('Torneo: Liga APA')
  })
})
