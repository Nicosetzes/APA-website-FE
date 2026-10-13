/* eslint-env jest */
jest.mock('views/components', () => ({
  Tooltip: ({ children }) => children,
}))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import RatingsTable from '.'

const row = (overrides) => ({
  position: 1,
  player: { id: 'n', name: 'Nico' },
  rating: 1631.7,
  matches: 700,
  wins: 419,
  draws: 104,
  losses: 177,
  peak: 1664.4,
  provisional: false,
  lastPlayedAt: '2026-10-10T21:59:38.427Z',
  lastChange: 1.4,
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

const render = (ratings) => {
  act(() => {
    ReactDOM.render(<RatingsTable ratings={ratings} />, container)
  })
}

const bodyRows = () => [...container.querySelectorAll('tbody tr')]
const cells = (tr) => [...tr.children].map((cell) => cell.textContent)

test('shows rating, peak and last change for each player in ranking order', () => {
  render([
    row(),
    row({
      position: 2,
      player: { id: 's', name: 'Santi' },
      rating: 1446.2,
      matches: 516,
      peak: 1500,
      lastChange: -3.24,
    }),
  ])

  const [first, second] = bodyRows().map(cells)

  expect(first[0]).toBe('1')
  expect(first[1]).toContain('Nico')
  expect(first[1]).toContain('700 partidos')
  expect(first.slice(2)).toEqual(['1632', '1664', '+1.4'])

  expect(second[0]).toBe('2')
  expect(second[1]).toContain('Santi')
  expect(second.slice(2)).toEqual(['1446', '1500', '-3.2'])
})

test('has an accessible table with its column headers', () => {
  render([row()])

  expect(container.querySelector('table').getAttribute('aria-label')).toBe(
    'Rating APA 2.0 de los jugadores',
  )
  expect(
    [...container.querySelectorAll('thead th')].map((th) => th.textContent),
  ).toEqual(['#', 'Jugador', 'Elo', 'Máx.', 'Último cambio'])
  expect(container.querySelector('tbody th').getAttribute('scope')).toBe('row')
})

test('draws an arrow only when the rating moved', () => {
  render([
    row({ lastChange: 2.5 }),
    row({ position: 2, player: { id: 'a', name: 'A' }, lastChange: -2.5 }),
    row({ position: 3, player: { id: 'b', name: 'B' }, lastChange: 0 }),
  ])

  const [up, down, flat] = bodyRows()

  expect(up.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(1)
  expect(down.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(1)
  expect(flat.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(0)
  expect(cells(flat)[4]).toBe('0.0')
})

test('marks provisional ratings and pluralizes the match count', () => {
  render([
    row({ provisional: true, matches: 1 }),
    row({ position: 2, player: { id: 'a', name: 'A' }, matches: 12 }),
  ])

  const [provisional, settled] = bodyRows()

  expect(provisional.textContent).toContain('Provisorio')
  expect(provisional.textContent).toContain('1 partido')
  expect(provisional.textContent).not.toContain('1 partidos')
  expect(settled.textContent).not.toContain('Provisorio')
  expect(settled.textContent).toContain('12 partidos')
})

test('renders nothing without ratings', () => {
  render([])
  expect(container.innerHTML).toBe('')

  render(undefined)
  expect(container.innerHTML).toBe('')
})
