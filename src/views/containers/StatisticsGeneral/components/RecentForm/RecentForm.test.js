/* eslint-env jest */
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import RecentForm from '.'

const colors = new Map([
  ['n', '#0072B2'],
  ['s', '#D55E00'],
])

const metric = ({
  matches = 5,
  wins = 3,
  draws = 1,
  losses = 1,
  actual = 70,
  expected = 55,
  difference = 15,
  ratingChange = 18.25,
} = {}) => ({
  matches,
  record: { wins, draws, losses },
  actualPercentage: actual,
  expectedPercentage: expected,
  differencePercentagePoints: difference,
  ratingChange,
})

const player = (id, name, overrides = {}) => ({
  player: { id, name },
  recentForm: {
    5: metric(overrides),
    10: metric({ ...overrides, matches: 10 }),
    25: metric({ ...overrides, matches: 25 }),
  },
})

const NICO = player('n', 'Nico')
const SANTI = player('s', 'Santi', {
  wins: 1,
  draws: 2,
  losses: 2,
  actual: 40,
  expected: 52,
  difference: -12,
  ratingChange: -9,
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

const render = (players = [NICO, SANTI]) => {
  act(() => {
    ReactDOM.render(<RecentForm players={players} colors={colors} />, container)
  })
}

const rows = () =>
  [...container.querySelectorAll('tbody tr')].map((row) =>
    [...row.children].map((cell) => cell.textContent),
  )

const click = (node) => {
  act(() => {
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
}

test('renders the approved metrics in an accessible table without a matches column', () => {
  render()

  const table = container.querySelector(
    'table[aria-label="Forma reciente de los jugadores"]',
  )
  expect(table).not.toBeNull()
  expect(table.querySelectorAll('th[scope="col"]')).toHaveLength(6)
  expect(table.querySelectorAll('th[scope="row"]')).toHaveLength(2)
  expect(
    [...table.querySelectorAll('th[scope="col"]')].map(
      (header) => header.textContent,
    ),
  ).not.toContain('Partidos')
  expect(rows()[0]).toEqual([
    'Nico',
    '3/1/1',
    '70,0%',
    '55,0%',
    '+15,0 pp',
    '+18,3',
  ])
  expect(
    container.querySelector(
      '[role="group"][aria-label="Ventana de forma reciente"]',
    ),
  ).not.toBeNull()
})

test('switches between each player-specific global window', () => {
  render()

  const buttons = [...container.querySelectorAll('button')]
  const ten = buttons.find((button) => button.textContent === '10 partidos')
  click(ten)

  expect(ten.getAttribute('aria-pressed')).toBe('true')
  expect(rows()).toHaveLength(2)
  expect(rows()[0]).toHaveLength(6)

  click(buttons.find((button) => button.textContent === '25 partidos'))
  expect(rows()).toHaveLength(2)
})

test('reports partial samples outside the table and preserves null metrics', () => {
  const empty = metric({
    matches: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    actual: null,
    expected: null,
    difference: null,
    ratingChange: null,
  })
  const partial = {
    player: { id: 'n', name: 'Nico' },
    recentForm: { 5: empty, 10: empty, 25: empty },
  }
  render([partial])

  expect(rows()).toEqual([['Nico', '0/0/0', '—', '—', '—', '—']])
  expect(container.querySelectorAll('[data-trend]')).toHaveLength(0)
  expect(container.querySelector('[role="status"]')).not.toBeNull()
})

test('keeps the selector usable when a window is absent', () => {
  render([{ player: NICO.player, recentForm: { 5: NICO.recentForm[5] } }])
  click(
    [...container.querySelectorAll('button')].find(
      (button) => button.textContent === '10 partidos',
    ),
  )

  expect(container.querySelector('table')).toBeNull()
  expect(container.querySelector('[role="group"]')).not.toBeNull()
})
