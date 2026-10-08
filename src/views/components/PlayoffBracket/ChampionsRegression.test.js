/* eslint-env jest */
jest.mock('views/components', () => ({ Loader: () => null }))
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import PlayoffBracket, { buildRounds } from '.'

const ref = (id, name) => ({ id, name })
const championsMatches = [1, 2].map((playoffId) => ({
  _id: `m${playoffId}`,
  playoff_id: playoffId,
  playerP1: ref('p1', 'Nico'),
  teamP1: ref(10, 'Boca'),
  seedP1: 'A',
  playerP2: ref('p2', 'Santi'),
  teamP2: ref(9, 'River'),
  seedP2: 'B',
  played: false,
}))

test('champions keeps historical grouping without managed labels', () => {
  const rounds = buildRounds('champions_league', championsMatches)
  const physicalMatches = rounds
    .flatMap(({ ties }) => ties)
    .flatMap(({ matches }) => matches)
    .filter(({ _id }) => championsMatches.some((match) => match._id === _id))
  const physicalTieGroups = rounds
    .flatMap(({ ties }) => ties)
    .filter(({ matches }) =>
      matches.some(({ _id }) =>
        championsMatches.some((match) => match._id === _id),
      ),
    )

  expect(physicalMatches).toHaveLength(2)
  expect(physicalTieGroups).toHaveLength(1)
  expect(physicalTieGroups[0].matches.map(({ _id }) => _id)).toEqual([
    'm1',
    'm2',
  ])

  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(
      <MemoryRouter>
        <PlayoffBracket
          format="champions_league"
          matches={championsMatches}
          getData={jest.fn()}
        />
      </MemoryRouter>,
      container,
    )
  })
  expect(container.textContent).not.toContain('Ida')
  expect(container.textContent).toContain('Boca')
  ReactDOM.unmountComponentAtNode(container)
})
