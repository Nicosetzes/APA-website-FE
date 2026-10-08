/* eslint-env jest */
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import MatchesTable from '.'

const match = {
  _id: '507f1f77bcf86cd799439011',
  playedAt: '2025-01-01T12:00:00.000Z',
  playedAtPrecision: 'exact',
  tournament: { id: 't', name: 'Copa' },
  type: 'playoff',
  playoff_id: 1,
  leg: 2,
  playerP1: { id: 'p1', name: 'Nico' },
  teamP1: { id: 10, name: 'Boca' },
  scoreP1: 1,
  playerP2: { id: 'p2', name: 'Santi' },
  teamP2: { id: 11, name: 'River' },
  scoreP2: 0,
  outcome: { teamThatWon: { id: 10 } },
}

const renderTable = (matches) => {
  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(<MatchesTable matches={matches} />, container)
  })
  return container
}

const teamBlocks = (container) =>
  container.querySelectorAll('tbody td')[3].firstChild.children

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

test('shows exact dates as DD/MM/YYYY and the time in 24h without seconds', () => {
  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(
      <MatchesTable
        matches={[
          {
            ...match,
            // Hora local: el test no depende de la zona horaria.
            playedAt: new Date(2024, 6, 8, 21, 15, 42).toISOString(),
            playedAtPrecision: 'exact',
          },
        ]}
      />,
      container,
    )
  })
  const cell = container.querySelector('tbody td')
  expect(cell.textContent).toBe('08/07/202421:15 hs')
  expect(cell.querySelector('span').textContent).toBe('21:15 hs')
  expect(cell.textContent).not.toMatch(/AM|PM|:42/)
  ReactDOM.unmountComponentAtNode(container)
})

test('shows date and time from playedAt and ignores updatedAt', () => {
  const container = renderTable([
    {
      ...match,
      playedAt: new Date(2024, 6, 8, 21, 15).toISOString(),
      updatedAt: new Date(2025, 0, 2, 10, 30).toISOString(),
    },
  ])
  expect(container.querySelector('tbody td').textContent).toBe(
    '08/07/202421:15 hs',
  )
  ReactDOM.unmountComponentAtNode(container)
})

test('shows "-" without time when the match has no playedAt', () => {
  const container = renderTable([
    {
      ...match,
      playedAt: undefined,
      playedAtPrecision: undefined,
      updatedAt: '2025-01-01T12:00:00.000Z',
    },
  ])
  const cell = container.querySelector('tbody td')
  expect(cell.textContent).toBe('-')
  expect(cell.querySelector('span')).toBeNull()
  ReactDOM.unmountComponentAtNode(container)
})

test('shows "-" when playedAt cannot be parsed', () => {
  const container = renderTable([{ ...match, playedAt: 'not-a-date' }])
  expect(container.querySelector('tbody td').textContent).toBe('-')
  ReactDOM.unmountComponentAtNode(container)
})

test('highlights the winner comparing numeric team ids', () => {
  const container = renderTable([match])
  const [p1Block, , p2Block] = teamBlocks(container)
  expect(window.getComputedStyle(p1Block).fontWeight).toBe('700')
  expect(window.getComputedStyle(p2Block).fontWeight).toBe('400')
  ReactDOM.unmountComponentAtNode(container)
})

test('does not highlight a side without team id', () => {
  const container = renderTable([
    {
      ...match,
      teamP1: { name: 'Boca' },
      outcome: { teamThatWon: {} },
    },
  ])
  const [p1Block, , p2Block] = teamBlocks(container)
  expect(window.getComputedStyle(p1Block).fontWeight).toBe('400')
  expect(window.getComputedStyle(p2Block).fontWeight).toBe('400')
  ReactDOM.unmountComponentAtNode(container)
})

test('orders the penalty scores by the numeric winner id', () => {
  const container = renderTable([
    {
      ...match,
      scoreP1: 1,
      scoreP2: 1,
      outcome: {
        penalties: true,
        teamThatWon: { id: 11 },
        scoreFromTeamThatWon: 5,
        scoreFromTeamThatLost: 4,
      },
    },
  ])
  const badge = teamBlocks(container)[1]
  expect(badge.getAttribute('title')).toBe('Penales: 4 - 5')
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
