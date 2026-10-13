/* eslint-env jest */
jest.mock('views/components', () => ({ Loader: () => null }))
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import PlayinBracket from '.'

const reference = (id, name) => ({ id, name })
const playinMatch = (prediction) => ({
  _id: 'playin-1',
  playoff_id: 1,
  playerP1: reference('p1', 'Nico'),
  teamP1: reference(1, 'Boca'),
  seedP1: '1A',
  playerP2: reference('p2', 'Santi'),
  teamP2: reference(2, 'River'),
  seedP2: '1B',
  played: false,
  prediction,
})

const renderBracket = (matches) => {
  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(
      <MemoryRouter>
        <PlayinBracket matches={matches} getData={jest.fn()} />
      </MemoryRouter>,
      container,
    )
  })
  return container
}

test('shows the prediction chips of a play-in match', () => {
  const container = renderBracket([
    playinMatch({
      p1: 0.58,
      p2: 0.42,
      basis: 'current',
      teamAdjusted: true,
      provisional: false,
      ratingVersion: '2.0',
    }),
  ])
  const chips = container.querySelectorAll('.team-prediction')
  expect(Array.from(chips).map((chip) => chip.textContent)).toEqual([
    '58%',
    '42%',
  ])
  ReactDOM.unmountComponentAtNode(container)
})

test('shows no chips without prediction, including empty placeholders', () => {
  const container = renderBracket([playinMatch(null)])
  expect(container.querySelectorAll('.team-prediction')).toHaveLength(0)
  ReactDOM.unmountComponentAtNode(container)
})
