/* eslint-env jest */
jest.mock('api/axiosConfig', () => ({ apiClient: { get: jest.fn() } }))
jest.mock('views/components', () => ({
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
  default: ({ data, selectedIds }) => (
    <div data-testid="chart">
      {`${data.dateFrom}..${data.dateTo}|${selectedIds.join(',')}`}
    </div>
  ),
}))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { apiClient } from 'api/axiosConfig'
import { historyResponse } from 'utils/testing/ratingHistoryFixtures'
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
const requests = () =>
  apiClient.get.mock.calls.map(([, config]) => config.params)
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
  apiClient.get.mockImplementation(() =>
    Promise.resolve({ data: historyResponse() }),
  )
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

test('shows a loading message while the history loads', async () => {
  apiClient.get.mockReturnValue(new Promise(() => {}))
  await render()
  expect(container.textContent).toContain('Cargando evolución del rating…')
  expect(container.querySelector('[data-testid="chart"]')).toBeNull()
})

test('a shortcut writes period to the URL and asks for the new range', async () => {
  await render('/statistics?dateFrom=2026-01-01&dateTo=2026-02-01')
  expect(requests()).toEqual([{ dateFrom: '2026-01-01', dateTo: '2026-02-01' }])

  await click(buttonByText('Último mes'))
  expect(location.search).toBe('?period=ultimo-mes')
  expect(requests()[1]).toEqual({
    dateFrom: '2026-09-27',
    dateTo: '2026-10-27',
  })
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
  const select = container.querySelector('select')
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLSelectElement.prototype,
    'value',
  ).set
  await act(async () => {
    setter.call(select, '2024')
    select.dispatchEvent(new Event('change', { bubbles: true }))
  })
  await settle()
  expect(location.search).toBe('?period=2024')
  expect(requests()[1]).toEqual({
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31',
  })
})

test('editing a date switches to a free range and drops period', async () => {
  await render('/statistics?period=2025')
  expect(requests()).toEqual([{ dateFrom: '2025-01-01', dateTo: '2025-12-31' }])

  await type('#rating-dateFrom', '2025-03-01')
  const params = new URLSearchParams(location.search)
  expect(params.has('period')).toBe(false)
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
  expect(apiClient.get).not.toHaveBeenCalled()
  expect(container.textContent).toContain(
    'La fecha de inicio no puede ser posterior a la de fin.',
  )
  expect(container.querySelector('[data-testid="chart"]')).toBeNull()
})

test('a single date warns and clearing one date does not call the API', async () => {
  await render('/statistics?dateFrom=2026-05-01&dateTo=2026-06-01')
  expect(apiClient.get).toHaveBeenCalledTimes(1)
  await type('#rating-dateTo', '')
  expect(apiClient.get).toHaveBeenCalledTimes(1)
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
  expect(apiClient.get).toHaveBeenCalledTimes(1)
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
  apiClient.get.mockRejectedValueOnce(new Error('boom'))
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
  apiClient.get.mockResolvedValue({
    data: historyResponse({
      matchesInPeriod: 0,
      players: [],
      matchesTimeline: [],
    }),
  })
  await render('/statistics?period=hoy')
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
