/* eslint-env jest */
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import {
  NICO,
  NICO_POSITIONS,
  SANTI,
  SANTI_POSITIONS,
  withPositions,
} from 'utils/testing/ratingHistoryFixtures'
import PeriodSummary from '.'

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

const render = (players, mode, afterRanking = null) => {
  act(() => {
    ReactDOM.render(
      <MemoryRouter>
        <PeriodSummary
          players={players}
          colors={colors}
          mode={mode}
          afterRanking={afterRanking}
        />
      </MemoryRouter>,
      container,
    )
  })
}

const rows = () =>
  [...container.querySelectorAll('tbody tr')].map((tr) =>
    [...tr.children].map((cell) => cell.textContent),
  )
const headers = () =>
  [...container.querySelectorAll('thead th')].map((th) => th.textContent)

const inTournament = (entry) => ({
  ...entry,
  summary: {
    ...entry.summary,
    position: null,
    previousPosition: null,
    positionChange: null,
  },
})

test('ranks the players by rating change with all period columns', () => {
  render([SANTI, NICO])

  expect(headers()).toEqual([
    '#',
    'Jugador',
    'Elo inicial',
    'Elo final',
    'Variación',
    'Mín.',
    'Máx.',
    'V/E/D',
    'Posición',
  ])
  expect(rows()).toEqual([
    [
      '1',
      'Nico2 partidos',
      '1500',
      '1503',
      '+3.0',
      '1500',
      '1510',
      '1/0/1',
      '1°1',
    ],
    [
      '2',
      'Santi2 partidos',
      '1500',
      '1497',
      '-3.0',
      '1490',
      '1500',
      '1/0/1',
      '2°1',
    ],
  ])
})

test('describes position changes for screen readers', () => {
  render([NICO, SANTI])

  const labels = [...container.querySelectorAll('[aria-label]')]
    .map((node) => node.getAttribute('aria-label'))
    .filter((label) => /lugar/.test(label))
  expect(labels).toEqual([
    'Subió 1 lugar en el ranking',
    'Bajó 1 lugar en el ranking',
  ])
})

test('marks a provisional debut at the reference rating', () => {
  render([
    NICO,
    {
      ...SANTI,
      start: null,
      summary: { ...SANTI.summary, positionChange: null, provisional: true },
    },
  ])

  const santi = rows()[1]
  expect(santi[1]).toContain('Debut')
  expect(santi[1]).toContain('Provisorio')
  expect(santi[2]).toBe('1500')
})

test('removes the upset block while preserving following Rating content', () => {
  render([NICO, SANTI], undefined, <section>Comparación conservada</section>)

  expect(container.textContent).not.toContain('Upsets del período')
  expect(container.textContent).not.toContain('Mayor upset')
  expect(container.textContent).not.toContain('Peor upset')
  expect(container.textContent).toContain('Comparación conservada')
})

test('does not reintroduce the upset block in tournament mode', () => {
  render([inTournament(NICO), inTournament(SANTI)], 'tournament')

  expect(container.textContent).not.toContain('Upsets del torneo')
  expect(container.textContent).not.toContain('Mayor upset')
  expect(container.textContent).toContain('Ranking del torneo')
})

test('renders nothing without players', () => {
  render([])
  expect(container.textContent).toBe('')
})

test('tournament mode keeps its ranking columns and outside change', () => {
  render(
    [
      {
        ...inTournament(NICO),
        start: { rating: 1546, matches: 10 },
        end: { rating: 1576, matches: 61 },
        summary: {
          ...inTournament(NICO).summary,
          ratingChange: 58.2,
          outsideChange: -28.4,
        },
      },
    ],
    'tournament',
  )

  expect(headers()).toEqual([
    '#',
    'Jugador',
    'Elo inicial',
    'Elo final',
    'En el torneo',
    'Fuera del torneo',
    'Mín.',
    'Máx.',
    'V/E/D',
  ])
  expect(rows()[0].slice(2, 6)).toEqual(['1546', '1576', '+58.2', '-28.4'])
  expect(container.querySelector('table').getAttribute('aria-label')).toBe(
    'Ranking de jugadores por variación de Elo en el torneo',
  )
})

test('tournament mode derives outside change with an older backend', () => {
  render(
    [
      {
        ...inTournament(NICO),
        start: { rating: 1664, matches: 10 },
        end: { rating: 1663, matches: 61 },
        summary: { ...inTournament(NICO).summary, ratingChange: -18.6 },
      },
      {
        ...inTournament(SANTI),
        start: null,
        end: { rating: 1490, matches: 2 },
        summary: { ...inTournament(SANTI).summary, ratingChange: -10 },
      },
    ],
    'tournament',
  )

  const [santi, nico] = rows()
  expect(nico.slice(4, 6)).toEqual(['-18.6', '+17.6'])
  expect(santi.slice(4, 6)).toEqual(['-10.0', '0.0'])
})

test('shows matches at number one only when period data includes them', () => {
  render([
    withPositions(NICO, NICO_POSITIONS, 3),
    withPositions(SANTI, SANTI_POSITIONS, 0),
  ])

  expect(headers().at(-1)).toBe('En el #1')
  expect(rows().map((cells) => cells.at(-1))).toEqual(['3', '0'])

  render([NICO, SANTI])
  expect(headers()).not.toContain('En el #1')
})
