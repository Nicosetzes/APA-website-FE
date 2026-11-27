/* eslint-env jest */
jest.mock('api/axiosConfig', () => ({ apiClient: { get: jest.fn() } }))
jest.mock('views/components', () => ({
  Loader: () => <div data-testid="loader" />,
}))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { apiClient } from 'api/axiosConfig'
import TournamentsTab from '.'

const T1 = '111111111111111111111111'
const T2 = '222222222222222222222222'
const T3 = '333333333333333333333333'

const performance = ({
  tournamentId,
  playerId = 'n',
  matches = 6,
  ratingChange,
  difference = 5,
  adjustment = 0,
  comparable = true,
}) => ({
  tournamentId,
  playerId,
  matches,
  record: { wins: 3, draws: 1, losses: 2 },
  ratingChange,
  actualPercentage: 60,
  expectedPercentage: 55,
  differencePercentagePoints: difference,
  teamAdjustmentPercentagePoints: adjustment,
  comparable,
})

const response = {
  success: true,
  data: {
    players: [
      { id: 'n', name: 'Nico' },
      { id: 's', name: 'Santi' },
      { id: 'm', name: 'Mati' },
    ],
    tournaments: [
      {
        id: T1,
        name: 'Copa Uno',
        firstPlayedAt: '2024-01-01T12:00:00.000Z',
        firstPlayedAtPrecision: 'day',
        lastPlayedAt: '2024-01-10T12:00:00.000Z',
        lastPlayedAtPrecision: 'day',
      },
      { id: T2, name: 'Copa Dos' },
      { id: T3, name: 'Copa Breve' },
    ],
    performances: [
      performance({
        tournamentId: T1,
        ratingChange: 8,
        difference: 5,
        adjustment: null,
      }),
      performance({
        tournamentId: T2,
        ratingChange: -3,
        difference: -4,
      }),
      performance({
        tournamentId: T3,
        matches: 2,
        ratingChange: 100,
        comparable: false,
      }),
      performance({
        tournamentId: T1,
        playerId: 's',
        ratingChange: -8,
        difference: -7,
      }),
    ],
  },
}

let container
let location
const flush = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)))

const LocationProbe = () => {
  location = useLocation()
  return null
}

const render = () => {
  act(() => {
    ReactDOM.render(
      <MemoryRouter initialEntries={['/statistics?tab=tournaments']}>
        <TournamentsTab />
        <LocationProbe />
      </MemoryRouter>,
      container,
    )
  })
}

const changeSelect = (selector, value) => {
  const select = container.querySelector(selector)
  act(() => {
    select.value = value
    select.dispatchEvent(new Event('change', { bubbles: true }))
  })
}

const changeMode = (value) => {
  const radio = container.querySelector(`input[type="radio"][value="${value}"]`)
  act(() => {
    radio.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
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

test('shows independent multi-metric cards for every eligible player', async () => {
  apiClient.get.mockResolvedValue({ data: response })
  render()
  await flush()

  const cards = [...container.querySelectorAll('article')]
  expect(cards).toHaveLength(3)
  expect(cards.map((card) => card.textContent)).toEqual(
    expect.arrayContaining([
      expect.stringContaining('Nico'),
      expect.stringContaining('Santi'),
      expect.stringContaining('Mati'),
    ]),
  )
  expect(cards[0].textContent).toContain('Variación de rating')
  expect(cards[0].textContent).toContain('Obtenido')
  expect(cards[0].textContent).toContain('Ajuste de equipos')
  expect(cards[0].textContent).not.toContain('Copa Breve')
  expect(cards[2].textContent).toContain('Sin datos comparables')
  expect(container.querySelector('#tournaments-metric')).toBeNull()

  const cardContent = cards.map((card) => card.textContent)
  changeSelect('#tournaments-primary-player', 's')
  changeMode('tournament')
  changeSelect('#tournaments-tournament', T2)
  expect(
    [...container.querySelectorAll('article')].map((card) => card.textContent),
  ).toEqual(cardContent)
})

test('pairs an optional comparison in each primary-player row and marks absence', async () => {
  apiClient.get.mockResolvedValue({ data: response })
  render()
  await flush()

  const primary = container.querySelector('#tournaments-primary-player')
  expect(primary.required).toBe(true)
  expect(container.querySelectorAll('tbody tr')).toHaveLength(3)
  expect(
    container.querySelector(
      'tr[data-comparable="false"] [data-sample-status="not-comparable"]',
    ),
  ).not.toBeNull()

  changeSelect('#tournaments-comparison-player', 's')
  expect(container.querySelectorAll('tbody tr')).toHaveLength(3)
  const copaUno = [...container.querySelectorAll('tbody tr')].find((row) =>
    row.textContent.includes('Copa Uno'),
  )
  const copaDos = [...container.querySelectorAll('tbody tr')].find((row) =>
    row.textContent.includes('Copa Dos'),
  )
  expect(copaUno.textContent).toContain('Nico')
  expect(copaUno.textContent).toContain('Santi')
  expect(copaDos.textContent).toContain('Sin actuación')

  changeSelect('#tournaments-primary-player', 's')
  expect(container.querySelector('#tournaments-comparison-player').value).toBe(
    '',
  )
  expect(container.querySelectorAll('tbody tr')).toHaveLength(1)
})

test('switches to one participant row per selected tournament', async () => {
  apiClient.get.mockResolvedValue({ data: response })
  render()
  await flush()

  changeMode('tournament')
  const tournament = container.querySelector('#tournaments-tournament')
  expect(tournament.required).toBe(true)
  expect(container.querySelector('#tournaments-primary-player')).toBeNull()
  expect(container.querySelectorAll('tbody tr')).toHaveLength(2)
  expect(container.querySelector('tbody').textContent).toContain('Nico')
  expect(container.querySelector('tbody').textContent).toContain('Santi')

  changeSelect('#tournaments-tournament', T2)
  expect(container.querySelectorAll('tbody tr')).toHaveLength(1)
  expect(container.querySelector('tbody').textContent).toContain('Nico')
})

test('keeps sortable header structure stable and provides mobile data labels', async () => {
  apiClient.get.mockResolvedValue({ data: response })
  render()
  await flush()

  const headersBefore = [...container.querySelectorAll('thead th')]
  const indicatorsBefore = container.querySelectorAll('[data-sort-indicator]')
  expect(headersBefore).toHaveLength(8)
  expect(indicatorsBefore).toHaveLength(headersBefore.length)
  expect(
    headersBefore.every((header) => header.hasAttribute('aria-sort')),
  ).toBe(true)
  expect(container.querySelectorAll('tbody td[data-label]')).toHaveLength(21)
  expect(container.querySelector('tbody th[scope="row"]')).not.toBeNull()

  const mobileSort = container.querySelector('[data-mobile-sort-controls]')
  const mobileSortSelect = mobileSort.querySelector('select')
  const mobileDirection = mobileSort.querySelector('button')
  expect(mobileSortSelect.value).toBe('ratingChange')
  expect(mobileDirection.dataset.sortDirection).toBe('desc')

  changeSelect('#tournaments-mobile-sort', 'tournamentName')
  expect(mobileSortSelect.value).toBe('tournamentName')
  expect(mobileDirection.dataset.sortDirection).toBe('asc')
  act(() => {
    mobileDirection.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  expect(mobileDirection.dataset.sortDirection).toBe('desc')
  expect(container.querySelector('[data-mobile-sort-controls]')).toBe(
    mobileSort,
  )
  expect(mobileSort.querySelectorAll('select, button')).toHaveLength(2)

  const tournamentSort = container.querySelector(
    'button[aria-label="Ordenar por Torneo"]',
  )
  act(() => {
    tournamentSort.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  expect(tournamentSort.closest('th').getAttribute('aria-sort')).toBe(
    'ascending',
  )
  expect(container.querySelectorAll('thead th')).toHaveLength(
    headersBefore.length,
  )
  expect(container.querySelectorAll('[data-sort-indicator]')).toHaveLength(
    indicatorsBefore.length,
  )
})

test('uses semantic trends, preserves null and zero, and links to Rating APA', async () => {
  apiClient.get.mockResolvedValue({ data: response })
  render()
  await flush()

  expect(container.querySelector('[data-trend="positive"]')).not.toBeNull()
  expect(container.querySelector('[data-trend="negative"]')).not.toBeNull()
  expect(container.querySelector('[data-trend="neutral"]')).not.toBeNull()
  const adjustments = [
    ...container.querySelectorAll(
      'tbody [data-metric="teamAdjustmentPercentagePoints"]',
    ),
  ].map((cell) => cell.textContent)
  expect(adjustments).toContain('—')
  expect(adjustments).toContain('0,0 pp')

  const link = [...container.querySelectorAll('tbody a')].find(
    (node) => node.textContent === 'Copa Uno',
  )
  act(() => {
    link.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  expect(location.pathname).toBe('/statistics')
  expect(location.search).toBe(`?tournamentId=${T1}`)

  changeMode('tournament')
  changeSelect('#tournaments-tournament', T2)
  const detailLink = [...container.querySelectorAll('a')].find(
    (node) => node.textContent === 'Ver detalle en Rating APA',
  )
  expect(container.querySelectorAll('a')).toHaveLength(1)
  act(() => {
    detailLink.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  expect(location.pathname).toBe('/statistics')
  expect(location.search).toBe(`?tournamentId=${T2}`)
  expect(location.search).not.toContain('tab=tournaments')
})

test('offers retry and an accessible empty state', async () => {
  apiClient.get
    .mockRejectedValueOnce(new Error('boom'))
    .mockResolvedValueOnce({ data: response })
  render()
  await flush()

  expect(container.querySelector('[role="alert"]')).not.toBeNull()
  await act(async () => {
    container
      .querySelector('[role="alert"] button')
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  await flush()
  expect(apiClient.get).toHaveBeenCalledTimes(2)
  expect(container.querySelector('table')).not.toBeNull()

  ReactDOM.unmountComponentAtNode(container)
  apiClient.get.mockReset()
  apiClient.get.mockResolvedValue({
    data: {
      success: true,
      data: { players: [], tournaments: [], performances: [] },
    },
  })
  render()
  await flush()
  expect(container.querySelector('[role="status"]')).not.toBeNull()
  expect(container.querySelector('table')).toBeNull()
})
