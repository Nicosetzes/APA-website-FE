/* eslint-env jest */
jest.mock('views/components', () => ({ Loader: () => null }))
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import PlayoffBracket, { buildRounds, getFinalResult } from '.'

const reference = (id, name) => ({ id, name })
const series = {
  key: 't:1',
  revision: 1,
  status: 'awaiting_leg2',
  aggregate: [
    { teamId: 1, score: 1 },
    { teamId: 2, score: 0 },
  ],
  winnerTeamId: null,
}
const matches = [
  {
    _id: 'first',
    playoff_id: 1,
    leg: 1,
    playerP1: reference('p1', 'Nico'),
    teamP1: reference(1, 'Boca'),
    seedP1: '1A',
    playerP2: reference('p2', 'Santi'),
    teamP2: reference(2, 'River'),
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
    teamP1: reference(2, 'River'),
    seedP1: '1B',
    playerP2: reference('p1', 'Nico'),
    teamP2: reference(1, 'Boca'),
    seedP2: '1A',
    played: false,
    series,
  },
]

test('marks the series winner without rendering leg or aggregate labels', () => {
  const container = document.createElement('div')
  const decidedSeries = { ...series, status: 'decided', winnerTeamId: 1 }
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

const finalLeg = (leg, played, finalSeries, outcome) => ({
  _id: `final-${leg}`,
  playoff_id: 31,
  leg,
  playerP1: reference(leg === 2 ? 'p2' : 'p1', leg === 2 ? 'Santi' : 'Nico'),
  teamP1: leg === 2 ? reference(2, 'River') : reference(1, 'Boca'),
  seedP1: 'A',
  playerP2: reference(leg === 2 ? 'p1' : 'p2', leg === 2 ? 'Nico' : 'Santi'),
  teamP2: leg === 2 ? reference(1, 'Boca') : reference(2, 'River'),
  seedP2: 'B',
  played,
  outcome,
  series: { ...series, key: 't:31', ...finalSeries },
})

const renderFinal = (finalMatches) => {
  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(
      <MemoryRouter>
        <PlayoffBracket
          format="playoff"
          playoffMode="two_legged"
          tournamentId="t"
          matches={finalMatches}
          getData={jest.fn()}
        />
      </MemoryRouter>,
      container,
    )
  })
  return container
}

test('two-legged final shows no champion or finalist after the first leg', () => {
  const container = renderFinal([
    finalLeg(
      1,
      true,
      { status: 'awaiting_leg2' },
      {
        teamThatWon: reference(1, 'Boca'),
        playerThatWon: reference('p1', 'Nico'),
        teamThatLost: reference(2, 'River'),
        playerThatLost: reference('p2', 'Santi'),
      },
    ),
    finalLeg(2, false, { status: 'awaiting_leg2' }),
  ])
  expect(container.textContent).not.toContain('Campeón')
  expect(container.textContent).not.toContain('Finalista')
  ReactDOM.unmountComponentAtNode(container)
})

test('two-legged final shows champion and finalist from the series winner', () => {
  const decided = { status: 'decided', winnerTeamId: 2 }
  const container = renderFinal([
    finalLeg(1, true, decided),
    finalLeg(2, true, decided),
  ])
  expect(container.textContent).toContain('Campeón')
  expect(container.textContent).toContain('Finalista')
  ReactDOM.unmountComponentAtNode(container)

  const result = getFinalResult({
    matches: [finalLeg(1, true, decided), finalLeg(2, true, decided)],
  })
  expect(result.winner.team.name).toBe('River')
  expect(result.winner.player.name).toBe('Santi')
  expect(result.loser.team.name).toBe('Boca')
  expect(result.loser.player.name).toBe('Nico')
})

test('groups both legs of a tie by their numeric team ids', () => {
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
    leg('ida', 1, reference(10, 'Boca'), reference(9, 'River')),
    leg('vuelta', 2, reference(9, 'River'), reference(10, 'Boca')),
    leg('otra-ida', 3, reference(30, 'Racing'), reference(40, 'Lanus')),
    leg('otra-vuelta', 4, reference(40, 'Lanus'), reference(30, 'Racing')),
  ])

  const [first, second] = firstRound.ties
  expect(first.matches.map(({ _id }) => _id)).toEqual(['ida', 'vuelta'])
  expect(second.matches.map(({ _id }) => _id)).toEqual([
    'otra-ida',
    'otra-vuelta',
  ])
})
