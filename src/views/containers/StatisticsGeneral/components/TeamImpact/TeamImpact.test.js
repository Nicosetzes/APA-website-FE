/* eslint-env jest */
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { NICO, SANTI } from 'utils/testing/ratingHistoryFixtures'
import TeamImpact from '.'

const colors = new Map([
  ['n', '#0072B2'],
  ['s', '#D55E00'],
])

let container
beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})
afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
})

const render = (players = [SANTI, NICO]) => {
  act(() => {
    ReactDOM.render(
      <TeamImpact players={players} colors={colors} />,
      container,
    )
  })
}

const metric = (playerId, name) =>
  container.querySelector(
    `tr[data-player-id="${playerId}"] [data-metric="${name}"]`,
  )

test('renders the aggregate decomposition and sample metadata', () => {
  render()

  const table = container.querySelector(
    'table[aria-label="Descomposición del impacto de los equipos"]',
  )
  expect(table).not.toBeNull()
  expect(table.querySelectorAll('thead th')).toHaveLength(7)
  expect(table.querySelectorAll('tbody tr')).toHaveLength(2)
  expect(metric('n', 'player-rating').textContent).toBe('50,0%')
  expect(metric('n', 'team-adjustment').textContent).toBe('+3,5 pp')
  expect(metric('n', 'final-prediction').textContent).toBe('53,5%')
  expect(metric('n', 'actual').textContent).toBe('50,0%')
  expect(metric('n', 'difference').textContent).toBe('-3,5 pp')
  expect(metric('n', 'sample').querySelector('[data-sample-size]').dataset.sampleSize).toBe(
    '2',
  )
  expect(metric('n', 'sample').querySelector('[data-quality]').dataset.quality).toBe(
    'small',
  )
  expect(
    metric('n', 'sample').querySelector('[aria-label^="Calidad de muestra:"]'),
  ).not.toBeNull()
})

test('shows a scoped empty state when no match has team-strength data', () => {
  const withoutCoverage = [NICO, SANTI].map((row) => ({
    ...row,
    summary: {
      ...row.summary,
      teamImpact: {
        matches: 0,
        totalMatches: row.summary.matchesInPeriod,
        sampleQuality: null,
        playerRatingExpectedPercentage: null,
        teamAdjustmentPercentagePoints: null,
        finalExpectedPercentage: null,
        actualPercentage: null,
        differencePercentagePoints: null,
      },
    },
  }))
  render(withoutCoverage)

  expect(container.querySelector('[role="status"]')).not.toBeNull()
  expect(container.querySelector('table')).toBeNull()
})

test('stays hidden with a response from an older backend', () => {
  const legacyPlayers = [NICO, SANTI].map((row) => {
    const summary = { ...row.summary }
    delete summary.teamImpact
    return { ...row, summary }
  })
  render(legacyPlayers)

  expect(container.innerHTML).toBe('')
})
