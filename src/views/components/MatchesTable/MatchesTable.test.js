/* eslint-env jest */
jest.mock('date-fns', () => ({
  format: () => '01 ene 2025',
  parseISO: (value) => new Date(value),
}))
jest.mock('date-fns/locale', () => ({ es: {} }))
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import MatchesTable from '.'

const match = {
  _id: '507f1f77bcf86cd799439011',
  updatedAt: '2025-01-01T12:00:00.000Z',
  tournament: { id: 't', name: 'Copa' },
  type: 'playoff',
  playoff_id: 1,
  leg: 2,
  playerP1: { id: 'p1', name: 'Nico' },
  teamP1: { id: 'a', name: 'Boca' },
  scoreP1: 1,
  playerP2: { id: 'p2', name: 'Santi' },
  teamP2: { id: 'b', name: 'River' },
  scoreP2: 0,
  outcome: { teamThatWon: { id: 'a' } },
}

test('shows one physical row without a leg label', () => {
  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(<MatchesTable matches={[match]} />, container)
  })
  expect(container.textContent).not.toContain('Vuelta')
  expect(container.querySelectorAll('tbody tr')).toHaveLength(1)
  ReactDOM.unmountComponentAtNode(container)
})

test('shows an approximate playedAt label without time', () => {
  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(
      <MatchesTable
        matches={[
          {
            ...match,
            playedAt: '2022-11-15T15:00:00.000Z',
            playedAtPrecision: 'approx',
          },
        ]}
      />,
      container,
    )
  })
  const cell = container.querySelector('tbody td')
  expect(cell.textContent).toBe('aprox. nov. 2022')
  expect(cell.textContent).not.toContain('hs')
  ReactDOM.unmountComponentAtNode(container)
})

test('keeps date and time for exact matches', () => {
  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(<MatchesTable matches={[match]} />, container)
  })
  const cell = container.querySelector('tbody td')
  expect(cell.textContent).toContain('hs')
  ReactDOM.unmountComponentAtNode(container)
})

test('renders matches without tournament as "-" without a link', () => {
  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(
      <MatchesTable matches={[{ ...match, tournament: null }]} />,
      container,
    )
  })
  const cell = container.querySelectorAll('tbody td')[1]
  expect(cell.textContent).toBe('-')
  expect(cell.querySelector('a')).toBeNull()
  ReactDOM.unmountComponentAtNode(container)
})

test('keeps linking matches that belong to a tournament', () => {
  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(<MatchesTable matches={[match]} />, container)
  })
  const link = container.querySelectorAll('tbody td')[1].querySelector('a')
  expect(link.getAttribute('href')).toBe('/tournaments/t')
  expect(link.textContent).toBe('Copa')
  ReactDOM.unmountComponentAtNode(container)
})
