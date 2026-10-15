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

const eloCell = (container, row = 0) =>
  container.querySelectorAll('tbody tr')[row].querySelectorAll('td')[4]
const eloLines = (container, row = 0) =>
  Array.from(eloCell(container, row).querySelectorAll('[data-side]'))
const withChange = (overrides = {}) => ({
  ...match,
  playerP1: { id: 'p1', name: 'Camilo' },
  ratingChange: { p1: 6.67, p2: -6.67, ratingVersion: '2.0' },
  ...overrides,
})
const renderFocused = (matches, focusPlayerId) => {
  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(
      <MatchesTable matches={matches} focusPlayerId={focusPlayerId} />,
      container,
    )
  })
  return container
}

test('has the Elo column as the fifth and last one', () => {
  const container = renderTable([match])
  const headers = Array.from(container.querySelectorAll('thead th')).map(
    (th) => th.textContent,
  )
  expect(headers).toEqual(['Fecha', 'Torneo', 'Tipo', 'Partido', 'Elo'])
  expect(container.querySelectorAll('tbody tr')[0].children).toHaveLength(5)
  ReactDOM.unmountComponentAtNode(container)
})

test('shows one line per player in the Elo cell: tag and signed points', () => {
  const container = renderTable([withChange()])
  const lines = eloLines(container)
  expect(lines.map((line) => line.textContent)).toEqual([
    'CAM +6.7',
    'SAN -6.7',
  ])
  expect(lines.map((line) => line.dataset.side)).toEqual(['p1', 'p2'])
  // Cada línea lleva su color: verde si sumó y rojo si restó.
  expect(lines.map((line) => line.dataset.trend)).toEqual(['up', 'down'])
  ReactDOM.unmountComponentAtNode(container)
})

test('the Elo tooltip only says Rating APA 2.0 and the cell has an accessible label', () => {
  const container = renderTable([withChange()])
  const change = eloCell(container).querySelector('[role="img"]')
  expect(change.getAttribute('title')).toBe('Rating APA 2.0')
  expect(change.getAttribute('aria-label')).toBe(
    'Variación de Elo: Camilo +6.7, Santi -6.7',
  )
  ReactDOM.unmountComponentAtNode(container)
})

test('with a filtered player shows only his line, green when he gained', () => {
  const container = renderFocused([withChange()], 'p1')
  const lines = eloLines(container)
  expect(lines.map((line) => line.textContent)).toEqual(['CAM +6.7'])
  expect(lines[0].dataset.trend).toBe('up')
  expect(
    eloCell(container).querySelector('[role="img"]').getAttribute('aria-label'),
  ).toBe('Variación de Elo: Camilo +6.7')
  ReactDOM.unmountComponentAtNode(container)
})

test('with a filtered player shows only his line, red when he lost', () => {
  const container = renderFocused([withChange()], 'p2')
  const lines = eloLines(container)
  expect(lines.map((line) => line.textContent)).toEqual(['SAN -6.7'])
  expect(lines[0].dataset.trend).toBe('down')
  ReactDOM.unmountComponentAtNode(container)
})

test('the filtered player line follows him when he plays on either side', () => {
  const swapped = withChange({
    playerP1: { id: 'p2', name: 'Nico' },
    playerP2: { id: 'p1', name: 'Camilo' },
    ratingChange: { p1: -3.24, p2: 3.24, ratingVersion: '2.0' },
  })
  const container = renderFocused([swapped], 'p2')
  const lines = eloLines(container)
  expect(lines.map((line) => line.textContent)).toEqual(['NIC -3.2'])
  expect(lines[0].dataset.side).toBe('p1')
  expect(lines[0].dataset.trend).toBe('down')
  ReactDOM.unmountComponentAtNode(container)
})

test('a filtered player that is not in the match falls back to both lines', () => {
  const container = renderFocused([withChange()], 'someone-else')
  expect(eloLines(container)).toHaveLength(2)
  ReactDOM.unmountComponentAtNode(container)
})

test('shows 0.0 without color when the change rounds to zero', () => {
  const container = renderFocused(
    [withChange({ ratingChange: { p1: 0, p2: 0, ratingVersion: '2.0' } })],
    'p1',
  )
  const lines = eloLines(container)
  expect(lines.map((line) => line.textContent)).toEqual(['CAM 0.0'])
  expect(lines[0].dataset.trend).toBe('flat')
  ReactDOM.unmountComponentAtNode(container)
})

test('shows a dash when there is no rating change or it is malformed', () => {
  for (const ratingChange of [
    undefined,
    null,
    {},
    { p1: 'x', p2: 1 },
    { p1: NaN, p2: NaN },
    'x',
  ]) {
    const container = renderFocused([{ ...match, ratingChange }], 'p1')
    const cell = eloCell(container)
    expect(cell.textContent).toBe('-')
    expect(cell.querySelector('[role="img"]')).toBeNull()
    ReactDOM.unmountComponentAtNode(container)
  }
})

test('keeps the first four columns identical with or without a rating change', () => {
  const without = renderTable([match])
  const changed = renderFocused(
    [withChange({ playerP1: match.playerP1 })],
    'p1',
  )
  const firstFour = (container) =>
    Array.from(container.querySelectorAll('tbody tr')[0].children)
      .slice(0, 4)
      .map((cell) => cell.innerHTML)
  expect(firstFour(changed)).toEqual(firstFour(without))
  ReactDOM.unmountComponentAtNode(without)
  ReactDOM.unmountComponentAtNode(changed)
})
