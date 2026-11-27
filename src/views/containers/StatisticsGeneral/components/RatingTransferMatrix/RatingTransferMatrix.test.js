/* eslint-env jest */
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import {
  NICO,
  RATING_TRANSFERS,
  SANTI,
} from 'utils/testing/ratingHistoryFixtures'
import RatingTransferMatrix from '.'

const colors = new Map([
  ['n', '#0072B2'],
  ['s', '#D55E00'],
])

let container

const render = (props = {}) => {
  act(() => {
    ReactDOM.render(
      <RatingTransferMatrix
        players={[NICO, SANTI]}
        transfers={RATING_TRANSFERS}
        selectedIds={['n', 's']}
        colors={colors}
        {...props}
      />,
      container,
    )
  })
}

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
})

test('renders a directed accessible matrix with signed balances and counts', () => {
  render()

  const table = container.querySelector('table')
  expect(table).not.toBeNull()
  expect(table.querySelector('caption').textContent).toContain('período')
  expect(
    [...table.querySelectorAll('thead th')].map((header) => header.scope),
  ).toEqual(['col', 'col', 'col'])
  expect(
    [...table.querySelectorAll('tbody th')].map((header) => header.scope),
  ).toEqual(['row', 'row'])

  const transferCells = [
    ...table.querySelectorAll('tbody td[aria-label*="saldo"]'),
  ]
  const positive = transferCells.find((cell) =>
    cell.getAttribute('aria-label').includes('saldo +3.0'),
  )
  const negative = transferCells.find((cell) =>
    cell.getAttribute('aria-label').includes('saldo -3.0'),
  )
  expect(positive.getAttribute('aria-label')).toContain('Nico')
  expect(positive.getAttribute('aria-label')).toContain('Santi')
  expect(positive.textContent).toContain('+3.0')
  expect(positive.textContent).toContain('2 partidos')
  expect(negative.textContent).toContain('-3.0')
  expect(negative.textContent).toContain('2 partidos')
  expect(positive.textContent).not.toMatch(/Ganó|Perdió|Neutral/)
  expect(negative.textContent).not.toMatch(/Ganó|Perdió|Neutral/)
  expect(table.querySelectorAll('[aria-label="No aplica"]')).toHaveLength(2)
})

test('shows neutral balances without redundant labels and preserves counts', () => {
  render({
    transfers: [
      { fromPlayerId: 'n', toPlayerId: 's', points: 0, matches: 1 },
      { fromPlayerId: 's', toPlayerId: 'n', points: 0, matches: 1 },
    ],
  })

  const cells = [...container.querySelectorAll('tbody td[aria-label*="saldo"]')]
  expect(cells).toHaveLength(2)
  expect(cells.every((cell) => cell.textContent.includes('0.0'))).toBe(true)
  expect(
    cells.every((cell) => !/Ganó|Perdió|Neutral/.test(cell.textContent)),
  ).toBe(true)
  expect(cells.every((cell) => cell.textContent.includes('1 partido'))).toBe(
    true,
  )
})

test('uses only selected players and explains insufficient selection', () => {
  render({ selectedIds: ['s'] })

  expect(container.querySelector('table')).toBeNull()
  expect(container.querySelector('[role="status"]')).not.toBeNull()
  expect(container.textContent).toContain('dos jugadores')
})

test('shows an empty state when selected players have no crossings', () => {
  render({ transfers: [] })

  expect(container.querySelector('table')).toBeNull()
  expect(container.querySelector('[role="status"]')).not.toBeNull()
  expect(container.textContent).toContain('No hay cruces rateables')
})

test('omits only the matrix for a backend without the aggregate', () => {
  render({ transfers: undefined })

  expect(container.innerHTML).toBe('')
})

test('contains horizontal scrolling in a keyboard-accessible region', () => {
  render({ mode: 'tournament' })

  const region = container.querySelector(
    '[role="region"][aria-label="Matriz de transferencia de rating desplazable"]',
  )
  expect(region).not.toBeNull()
  expect(region.tabIndex).toBe(0)
  expect(region.getAttribute('data-testid')).toBe('rating-transfer-scroll')
  expect(container.querySelector('caption').textContent).toContain('torneo')
})
