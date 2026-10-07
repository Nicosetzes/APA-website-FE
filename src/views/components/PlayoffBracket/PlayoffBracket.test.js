/* eslint-env jest */
jest.mock('views/components', () => ({ Loader: () => null }))
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import PlayoffBracket, { buildRounds } from '.'

const reference = (id, name) => ({ id, name })
const series = {
  key: 't:1',
  revision: 1,
  status: 'awaiting_leg2',
  aggregate: [
    { teamId: 'a', score: 1 },
    { teamId: 'b', score: 0 },
  ],
  winnerTeamId: null,
}
const matches = [
  {
    _id: 'first',
    playoff_id: 1,
    leg: 1,
    playerP1: reference('p1', 'Nico'),
    teamP1: reference('a', 'Boca'),
    seedP1: '1A',
    playerP2: reference('p2', 'Santi'),
    teamP2: reference('b', 'River'),
    seedP2: '1B',
    played: true,
    scoreP1: 1,
    scoreP2: 0,
    series,
  },
  {
    _id: 'second',
    playoff_id: 1,
    leg: 2,
    playerP1: reference('p2', 'Santi'),
    teamP1: reference('b', 'River'),
    seedP1: '1B',
    playerP2: reference('p1', 'Nico'),
    teamP2: reference('a', 'Boca'),
    seedP2: '1A',
    played: false,
    series,
  },
]

test('marks the series winner without rendering leg or aggregate labels', () => {
  const container = document.createElement('div')
  const decidedSeries = { ...series, status: 'decided', winnerTeamId: 'a' }
  act(() => {
    ReactDOM.render(
      <MemoryRouter>
        <PlayoffBracket
          format="playoff"
          playoffMode="two_legged"
          tournamentId="t"
          matches={matches.map((match) => ({
            ...match,
            series: decidedSeries,
          }))}
          getData={jest.fn()}
        />
      </MemoryRouter>,
      container,
    )
  })
  const winnerRows = container.querySelectorAll('[data-series-winner="true"]')
  expect(winnerRows).toHaveLength(2)
  winnerRows.forEach((row) => expect(row.textContent).toContain('Boca'))
  expect(container.textContent).not.toContain('Ida')
  expect(container.textContent).not.toContain('Vuelta')
  expect(container.textContent).not.toContain('Global')
  expect(container.textContent).not.toContain('Ganador de la serie')
  ReactDOM.unmountComponentAtNode(container)
})

test('does not render aggregate labels before either leg is played', () => {
  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(
      <MemoryRouter>
        <PlayoffBracket
          format="playoff"
          playoffMode="two_legged"
          tournamentId="t"
          matches={matches.map((match) => ({
            ...match,
            played: false,
            series: { ...series, status: 'awaiting_leg1' },
          }))}
          getData={jest.fn()}
        />
      </MemoryRouter>,
      container,
    )
  })
  expect(container.textContent).not.toContain('Global')
  ReactDOM.unmountComponentAtNode(container)
})

test('groups both legs of a tie when team ids mix strings and numbers', () => {
  const leg = (id, playoffId, teamP1, teamP2) => ({
    _id: id,
    playoff_id: playoffId,
    playerP1: reference('p1', 'Nico'),
    teamP1,
    playerP2: reference('p2', 'Santi'),
    teamP2,
    played: false,
  })
  const [firstRound] = buildRounds('champions_league', [
    leg('ida', 1, reference('10', 'Boca'), reference(9, 'River')),
    leg('vuelta', 2, reference(9, 'River'), reference(10, 'Boca')),
    leg('otra-ida', 3, reference(30, 'Racing'), reference('40', 'Lanus')),
    leg('otra-vuelta', 4, reference('40', 'Lanus'), reference('30', 'Racing')),
  ])

  const [first, second] = firstRound.ties
  expect(first.matches.map(({ _id }) => _id)).toEqual(['ida', 'vuelta'])
  expect(second.matches.map(({ _id }) => _id)).toEqual([
    'otra-ida',
    'otra-vuelta',
  ])
})