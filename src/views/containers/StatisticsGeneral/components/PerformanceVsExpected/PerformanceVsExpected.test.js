/* eslint-env jest */
import { getAllByRole, getByRole } from '@testing-library/dom'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { NICO, SANTI } from 'utils/testing/ratingHistoryFixtures'
import PerformanceVsExpected from '.'

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
      <PerformanceVsExpected players={players} colors={colors} />,
      container,
    )
  })
}

const click = (button) => {
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
}

const buttonByText = (text) =>
  [...container.querySelectorAll('button')].find(
    (button) => button.textContent === text,
  )

const rows = () =>
  [...container.querySelectorAll('tbody tr')].map((row) =>
    [...row.children].map((cell) => cell.textContent),
  )

test('presents the explanation as a semantic list', () => {
  render()

  const explanation = getByRole(container, 'list')
  const items = getAllByRole(explanation, 'listitem')
  expect(items).toHaveLength(explanation.children.length)
  expect(items.length).toBeGreaterThan(1)
})

test('shows obtained, expected, signed difference and matches for every player', () => {
  render()

  expect(
    container.querySelector(
      'table[aria-label="Resultados obtenidos comparados con lo esperado"]',
    ),
  ).not.toBeNull()
  expect(
    [...container.querySelectorAll('thead th')].map(
      (header) => header.textContent,
    ),
  ).toEqual([
    'Jugador',
    'Obtenido',
    'Esperado',
    'Ajuste equipos',
    'Diferencia',
    'Partidos',
  ])
  expect(rows()).toEqual([
    ['Nico', '50,0%', '53,5%', '+3,5 pp', '-3,5 pp', '2'],
    ['Santi', '50,0%', '46,5%', '-3,5 pp', '+3,5 pp', '2'],
  ])
  expect(
    [...container.querySelectorAll('[data-trend]')].map(
      (value) => value.dataset.trend,
    ),
  ).toEqual(['down', 'up'])
  expect(buttonByText('Todos los partidos').getAttribute('aria-pressed')).toBe(
    'true',
  )
  expect(
    [...container.querySelectorAll('[role="group"] button')].map(
      (button) => button.textContent,
    ),
  ).toEqual([
    'Todos los partidos',
    'Eliminatorias',
    'Favorito',
    'Parejo',
    'No favorito',
  ])
})

test('switches locally to play-in and playoff matches without changing its inputs', () => {
  render()
  click(buttonByText('Eliminatorias'))

  expect(rows()).toEqual([
    ['Nico', '0,0%', '62,0%', '+12,0 pp', '-62,0 pp', '1'],
    ['Santi', '100,0%', '38,0%', '-12,0 pp', '+62,0 pp', '1'],
  ])
  expect(buttonByText('Eliminatorias').getAttribute('aria-pressed')).toBe(
    'true',
  )
  expect(buttonByText('Todos los partidos').getAttribute('aria-pressed')).toBe(
    'false',
  )
})

test('switches among expectation cohorts in the same table', () => {
  render()

  click(buttonByText('Favorito'))
  expect(rows()).toEqual([
    ['Nico', '0,0%', '62,0%', '+12,0 pp', '-62,0 pp', '1'],
    ['Santi', '0,0%', '55,0%', '+5,0 pp', '-55,0 pp', '1'],
  ])
  expect(container.querySelectorAll('table')).toHaveLength(1)

  click(buttonByText('No favorito'))
  expect(rows()).toEqual([
    ['Nico', '100,0%', '45,0%', '-5,0 pp', '+55,0 pp', '1'],
    ['Santi', '100,0%', '38,0%', '-12,0 pp', '+62,0 pp', '1'],
  ])
  expect(buttonByText('No favorito').getAttribute('aria-pressed')).toBe('true')

  click(buttonByText('Parejo'))
  expect(container.querySelector('[role="status"]')).not.toBeNull()
  expect(container.querySelector('table')).toBeNull()
})

test('shows an empty knockout state when the selected scope has none', () => {
  const withoutKnockouts = [NICO, SANTI].map((row) => ({
    ...row,
    summary: {
      ...row.summary,
      performanceVsExpected: {
        ...row.summary.performanceVsExpected,
        knockouts: {
          matches: 0,
          actualPercentage: null,
          expectedPercentage: null,
          teamAdjustmentPercentagePoints: null,
          differencePercentagePoints: null,
        },
      },
    },
  }))
  render(withoutKnockouts)
  click(buttonByText('Eliminatorias'))

  expect(container.querySelector('[role="status"]')).not.toBeNull()
  expect(container.querySelector('tbody')).toBeNull()
})

test('distinguishes missing team data from a neutral adjustment', () => {
  const players = [NICO, SANTI].map((row, index) => ({
    ...row,
    summary: {
      ...row.summary,
      performanceVsExpected: {
        ...row.summary.performanceVsExpected,
        all: {
          ...row.summary.performanceVsExpected.all,
          teamAdjustmentPercentagePoints: index === 0 ? null : 0,
        },
      },
    },
  }))
  render(players)

  expect(
    [...container.querySelectorAll('[data-metric="team-adjustment"]')].map(
      (cell) => cell.textContent,
    ),
  ).toEqual(['—', '0,0 pp'])
  expect(container.querySelectorAll('th[scope="col"]')).toHaveLength(6)
  expect(container.querySelectorAll('th[scope="row"]')).toHaveLength(2)
})

test('keeps the existing table with a response that predates team adjustment', () => {
  const legacyPlayers = [NICO, SANTI].map((row) => ({
    ...row,
    summary: {
      ...row.summary,
      performanceVsExpected: Object.fromEntries(
        Object.entries(row.summary.performanceVsExpected).map(
          ([key, metric]) => {
            const legacyMetric = { ...metric }
            delete legacyMetric.teamAdjustmentPercentagePoints
            return [key, legacyMetric]
          },
        ),
      ),
    },
  }))
  render(legacyPlayers)

  expect(container.querySelector('table')).not.toBeNull()
  expect(
    [...container.querySelectorAll('thead th')].map(
      (header) => header.textContent,
    ),
  ).toEqual(['Jugador', 'Obtenido', 'Esperado', 'Diferencia', 'Partidos'])
})

test('keeps the two existing views with a response that predates cohorts', () => {
  const legacyPlayers = [NICO, SANTI].map((row) => {
    const performanceVsExpected = {
      all: row.summary.performanceVsExpected.all,
      knockouts: row.summary.performanceVsExpected.knockouts,
    }
    return {
      ...row,
      summary: { ...row.summary, performanceVsExpected },
    }
  })
  render(legacyPlayers)

  expect(container.querySelector('table')).not.toBeNull()
  expect(
    [...container.querySelectorAll('[role="group"] button')].map(
      (button) => button.textContent,
    ),
  ).toEqual(['Todos los partidos', 'Eliminatorias'])
})

test('stays hidden with a response from an older backend', () => {
  const legacyPlayers = [NICO, SANTI].map((row) => {
    const summary = { ...row.summary }
    delete summary.performanceVsExpected
    return { ...row, summary }
  })
  render(legacyPlayers)

  expect(container.innerHTML).toBe('')
})
