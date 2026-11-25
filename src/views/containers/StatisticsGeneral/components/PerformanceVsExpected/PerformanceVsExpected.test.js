/* eslint-env jest */
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

test('shows obtained, expected, signed difference and matches for every player', () => {
  render()

  expect(container.textContent).toContain('Rendimiento frente al pronóstico')
  expect(container.textContent).toContain(
    'Compara los resultados obtenidos con lo que el Rating APA esperaba antes de cada partido',
  )
  expect(container.textContent).toContain(
    'La diferencia muestra cuántos puntos porcentuales rindió cada jugador por encima o por debajo del pronóstico',
  )
  expect(
    [...container.querySelectorAll('thead th')].map(
      (header) => header.textContent,
    ),
  ).toEqual(['Jugador', 'Obtenido', 'Esperado', 'Diferencia', 'Partidos'])
  expect(rows()).toEqual([
    ['Nico', '50,0%', '53,5%', '-3,5 pp', '2'],
    ['Santi', '50,0%', '46,5%', '+3,5 pp', '2'],
  ])
  expect(
    [...container.querySelectorAll('[data-trend]')].map(
      (value) => value.dataset.trend,
    ),
  ).toEqual(['down', 'up'])
  expect(buttonByText('Todos los partidos').getAttribute('aria-pressed')).toBe(
    'true',
  )
})

test('switches locally to play-in and playoff matches without changing its inputs', () => {
  render()
  click(buttonByText('Eliminatorias'))

  expect(rows()).toEqual([
    ['Nico', '0,0%', '62,0%', '-62,0 pp', '1'],
    ['Santi', '100,0%', '38,0%', '+62,0 pp', '1'],
  ])
  expect(buttonByText('Eliminatorias').getAttribute('aria-pressed')).toBe(
    'true',
  )
  expect(buttonByText('Todos los partidos').getAttribute('aria-pressed')).toBe(
    'false',
  )
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
          differencePercentagePoints: null,
        },
      },
    },
  }))
  render(withoutKnockouts)
  click(buttonByText('Eliminatorias'))

  expect(container.textContent).toContain(
    'No hay partidos de eliminatorias en este ámbito.',
  )
  expect(container.querySelector('tbody')).toBeNull()
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
