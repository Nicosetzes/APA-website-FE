/* eslint-env jest */
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import {
  NICO,
  SANTI,
  withNameOnlyTeams,
  withoutTeams,
} from 'utils/testing/ratingHistoryFixtures'
import PeriodSummary from '.'

jest.mock('api', () => ({ database: 'http://db' }))

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

const render = (players) => {
  act(() => {
    ReactDOM.render(
      <MemoryRouter>
        <PeriodSummary players={players} colors={colors} />
      </MemoryRouter>,
      container,
    )
  })
}
const rows = () =>
  [...container.querySelectorAll('tbody tr')].map((tr) =>
    [...tr.children].map((cell) => cell.textContent),
  )

test('ranks the players by rating change with all the columns', () => {
  // Llegan en otro orden: el ranking del período los reordena.
  render([SANTI, NICO])
  expect(
    [...container.querySelectorAll('thead th')].map((th) => th.textContent),
  ).toEqual([
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
  const [first, second] = rows()
  expect(first).toEqual([
    '1',
    'Nico2 partidos',
    '1500',
    '1503',
    '+3.0',
    '1500',
    '1510',
    '1/0/1',
    '1°1',
  ])
  expect(second).toEqual([
    '2',
    'Santi2 partidos',
    '1500',
    '1497',
    '-3.0',
    '1490',
    '1500',
    '1/0/1',
    '2°1',
  ])
})

test('describes the position change for screen readers', () => {
  render([NICO, SANTI])
  const labels = [...container.querySelectorAll('[aria-label]')]
    .map((node) => node.getAttribute('aria-label'))
    .filter((label) => /lugar/.test(label))
  expect(labels).toEqual([
    'Subió 1 lugar en el ranking',
    'Bajó 1 lugar en el ranking',
  ])
})

test('does not show a position change when it did not move or is unknown', () => {
  render([
    {
      ...NICO,
      summary: { ...NICO.summary, positionChange: 0 },
    },
    {
      ...SANTI,
      summary: {
        ...SANTI.summary,
        positionChange: null,
        previousPosition: null,
      },
    },
  ])
  const [first, second] = rows()
  expect(first[8]).toBe('1°')
  expect(second[8]).toBe('2°')
})

test('marks a player who debuts in the period', () => {
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
  // Quien debuta arranca desde el 1500 del Elo, no desde un guión.
  expect(santi[2]).toBe('1500')
})

test('shows 1500 as the initial Elo of a debut for any start-less player', () => {
  render([{ ...NICO, start: null }])
  const [row] = rows()
  expect(row[1]).toContain('Debut')
  expect(row[2]).toBe('1500')
  expect(container.textContent).not.toContain('Elo inicial-')
})

test('shows each player upsets with a link to the match', () => {
  render([NICO, SANTI])
  const cards = [...container.querySelectorAll('h4')].map(
    (heading) => heading.parentElement,
  )
  expect(cards).toHaveLength(2)
  const nico = cards[0]
  expect(nico.textContent).toContain('Nico')
  expect(nico.textContent).toContain('Mayor upset')
  expect(nico.textContent).toContain('Nico BOC 2-1 Santi RIV')
  expect(nico.textContent).toContain(
    'Tenía 34% de chances de ganar · +10.0 ELO · 10/10/2026',
  )
  expect(nico.textContent).toContain('Peor upset')
  expect(nico.textContent).toContain('Nico LAN 0-1 Santi RAC')
  expect(nico.textContent).toContain(
    'Tenía 38% de chances de quedar eliminado · -7.0 ELO · 11/10/2026',
  )

  const hrefs = [...nico.querySelectorAll('a')].map((a) =>
    a.getAttribute('href'),
  )
  expect(hrefs).toEqual([
    '/matches?player1=n&player1Team=Boca&player2=s&opponentTeam=River&dateFrom=2026-10-10&dateTo=2026-10-10',
    '/matches?player1=n&player1Team=Lan%C3%BAs&player2=s&opponentTeam=Racing&dateFrom=2026-10-11&dateTo=2026-10-11',
  ])
  // Santi juega el mismo partido desde el otro lado: él es player1.
  const santiHrefs = [
    ...container.querySelectorAll('h4')[1].parentElement.querySelectorAll('a'),
  ].map((a) => a.getAttribute('href'))
  expect(santiHrefs).toEqual([
    '/matches?player1=s&player1Team=Racing&player2=n&opponentTeam=Lan%C3%BAs&dateFrom=2026-10-11&dateTo=2026-10-11',
    '/matches?player1=s&player1Team=River&player2=n&opponentTeam=Boca&dateFrom=2026-10-10&dateTo=2026-10-10',
  ])
})

test('says so when a player has no upsets', () => {
  render([
    {
      ...NICO,
      summary: { ...NICO.summary, biggestUpsetWon: null, worstUpsetLost: null },
    },
  ])
  const card = container.querySelector('h4').parentElement
  expect(card.textContent.match(/Sin upsets en el período/g)).toHaveLength(2)
  expect(card.querySelector('a')).toBeNull()
})

test('renders nothing without players', () => {
  render([])
  expect(container.textContent).toBe('')
})

const stylesheetText = () =>
  [...document.querySelectorAll('style')]
    .map((style) => style.textContent)
    .join('')

const upsetCards = () =>
  [...container.querySelectorAll('h4')].map((heading) => heading.parentElement)

test('explains each upset with the probability of the result that happened', () => {
  render([NICO, SANTI])
  const [nico, santi] = upsetCards()
  // Ganado + victoria / perdido + eliminación (Nico).
  expect(nico.textContent).toContain('Tenía 34% de chances de ganar')
  expect(nico.textContent).toContain('Tenía 38% de chances de quedar eliminado')
  // Ganado + avanzar / perdido + derrota (Santi).
  expect(santi.textContent).toContain('Tenía 38% de chances de avanzar')
  expect(santi.textContent).toContain('Tenía 34% de chances de perder')
})

test('shows "menos de 1%" when the chance rounds to zero', () => {
  render([
    {
      ...NICO,
      summary: {
        ...NICO.summary,
        biggestUpsetWon: {
          ...NICO.summary.biggestUpsetWon,
          probability: { kind: 'win', for: 0.004, against: 0.9 },
        },
      },
    },
  ])
  expect(container.textContent).toContain(
    'Tenía menos de 1% de chances de ganar',
  )
})

test('colors the Elo change green when positive and red when negative', () => {
  render([NICO, SANTI])
  const [nico] = upsetCards()
  const deltas = [...nico.querySelectorAll('[data-trend]')]
  expect(deltas.map((node) => [node.textContent, node.dataset.trend])).toEqual([
    ['+10.0 ELO', 'up'],
    ['-7.0 ELO', 'down'],
  ])
  // jsdom no resuelve `var()`, así que se comprueba la regla de estilo.
  expect(stylesheetText()).toMatch(
    /\[data-trend=["']up["']\]\s*\{\s*color:\s*var\(--green-900\)/,
  )
  expect(stylesheetText()).toMatch(
    /\[data-trend=["']down["']\]\s*\{\s*color:\s*var\(--red-700\)/,
  )
})

test('does not show the old "Puntaje esperado" or "movió" wording', () => {
  render([NICO, SANTI])
  expect(container.textContent).not.toContain('Puntaje esperado')
  expect(container.textContent).not.toContain('movió')
  expect(container.textContent).not.toContain(' pts')
})

test('omits the chance but keeps the Elo change when there is no probability', () => {
  render([
    {
      ...NICO,
      summary: {
        ...NICO.summary,
        biggestUpsetWon: {
          ...NICO.summary.biggestUpsetWon,
          probability: null,
        },
        worstUpsetLost: {
          ...NICO.summary.worstUpsetLost,
          probability: undefined,
        },
      },
    },
  ])
  const [nico] = upsetCards()
  expect(nico.textContent).not.toContain('chances')
  expect(nico.textContent).toContain('+10.0 ELO · 10/10/2026')
  expect(nico.textContent).toContain('-7.0 ELO · 11/10/2026')
})

const matchResults = (card) =>
  [...card.querySelectorAll('[role="img"]')].map((node) => ({
    text: node.textContent,
    label: node.getAttribute('aria-label'),
  }))

const crestSources = (card) =>
  [...card.querySelectorAll('img')].map((img) => img.getAttribute('src'))

test('shows the whole match from the point of view of the upset owner', () => {
  render([NICO, SANTI])
  const [nico, santi] = upsetCards()
  // Sigla de 3 letras en mayúsculas; la frase hablada lleva el nombre completo.
  expect(matchResults(nico)).toEqual([
    {
      text: 'Nico BOC 2-1 Santi RIV',
      label: 'Nico (Boca) ganó 2-1 contra Santi (River)',
    },
    {
      text: 'Nico LAN 0-1 Santi RAC',
      label: 'Nico (Lanús) perdió 0-1 contra Santi (Racing)',
    },
  ])
  // Santi es el dueño del upset: sus equipos y su marcador van primero.
  expect(matchResults(santi)).toEqual([
    {
      text: 'Santi RAC 1-0 Nico LAN',
      label: 'Santi (Racing) ganó 1-0 contra Nico (Lanús)',
    },
    {
      text: 'Santi RIV 1-2 Nico BOC',
      label: 'Santi (River) perdió 1-2 contra Nico (Boca)',
    },
  ])
})

test('shows the crest of each team by id, like /matches', () => {
  render([NICO, SANTI])
  const [nico, santi] = upsetCards()
  // Orden del DOM: escudo del dueño, escudo del rival (Boca 1, River 2, Lanús
  // 3, Racing 4).
  expect(crestSources(nico)).toEqual([
    'http://db/logos/1',
    'http://db/logos/2',
    'http://db/logos/3',
    'http://db/logos/4',
  ])
  expect(crestSources(santi)).toEqual([
    'http://db/logos/4',
    'http://db/logos/3',
    'http://db/logos/2',
    'http://db/logos/1',
  ])
})

test('puts the crest outside of the score, as /matches does', () => {
  render([NICO])
  const [nico] = upsetCards()
  const [first] = nico.querySelectorAll('[role="img"]')
  const [left, , right] = first.children
  // Lado del jugador: sigla y después escudo. Lado del rival: escudo y sigla.
  expect(left.lastElementChild.firstElementChild.textContent).toBe('BOC')
  expect(left.lastElementChild.lastElementChild.tagName).toBe('IMG')
  expect(right.lastElementChild.firstElementChild.tagName).toBe('IMG')
  expect(right.lastElementChild.lastElementChild.textContent).toBe('RIV')
})

test('hides a crest that fails to load and keeps the abbreviation', () => {
  render([NICO])
  const [nico] = upsetCards()
  const [img] = nico.querySelectorAll('img')
  act(() => {
    img.dispatchEvent(new Event('error'))
  })
  expect(img.style.display).toBe('none')
  expect(matchResults(nico)[0].text).toBe('Nico BOC 2-1 Santi RIV')
})

test('keeps the probability and Elo labels next to the teams', () => {
  render([NICO])
  const [nico] = upsetCards()
  const text = nico.textContent
  expect(text.indexOf('Nico BOC 2-1 Santi RIV')).toBeLessThan(
    text.indexOf('Tenía 34% de chances de ganar · +10.0 ELO · 10/10/2026'),
  )
})

test('shows the abbreviation without crest when the BE sends only the names', () => {
  render([withNameOnlyTeams(NICO), withNameOnlyTeams(SANTI)])
  const [nico, santi] = upsetCards()
  expect(matchResults(nico)).toEqual([
    {
      text: 'Nico BOC 2-1 Santi RIV',
      label: 'Nico (Boca) ganó 2-1 contra Santi (River)',
    },
    {
      text: 'Nico LAN 0-1 Santi RAC',
      label: 'Nico (Lanús) perdió 0-1 contra Santi (Racing)',
    },
  ])
  expect(matchResults(santi)[0].text).toBe('Santi RAC 1-0 Nico LAN')
  expect(container.querySelectorAll('img')).toHaveLength(0)
})

test('shows the abbreviation without crest when a team has no id', () => {
  const noId = {
    ...NICO,
    summary: {
      ...NICO.summary,
      biggestUpsetWon: {
        ...NICO.summary.biggestUpsetWon,
        teams: {
          for: { id: null, name: 'Boca' },
          against: { id: 2, name: 'River' },
        },
      },
    },
  }
  render([noId])
  const [nico] = upsetCards()
  expect(matchResults(nico)[0].text).toBe('Nico BOC 2-1 Santi RIV')
  expect(crestSources(nico)).toEqual([
    'http://db/logos/2',
    'http://db/logos/3',
    'http://db/logos/4',
  ])
})

test('shows only the crest when the team has an id but no name', () => {
  const noName = {
    ...NICO,
    summary: {
      ...NICO.summary,
      biggestUpsetWon: {
        ...NICO.summary.biggestUpsetWon,
        teams: {
          for: { id: 1, name: null },
          against: { id: 2, name: null },
        },
      },
    },
  }
  render([noName])
  const [nico] = upsetCards()
  expect(matchResults(nico)[0]).toEqual({
    text: 'Nico 2-1 Santi',
    label: 'Nico ganó 2-1 contra Santi',
  })
  expect(crestSources(nico).slice(0, 2)).toEqual([
    'http://db/logos/1',
    'http://db/logos/2',
  ])
})

test('shows only the names when the match has no teams', () => {
  const noTeams = {
    ...NICO,
    summary: {
      ...NICO.summary,
      biggestUpsetWon: {
        ...NICO.summary.biggestUpsetWon,
        teams: { for: null, against: null },
      },
      worstUpsetLost: {
        ...NICO.summary.worstUpsetLost,
        teams: { for: '   ', against: undefined },
      },
    },
  }
  render([noTeams])
  const [nico] = upsetCards()
  expect(matchResults(nico).map(({ text }) => text)).toEqual([
    'Nico 2-1 Santi',
    'Nico 0-1 Santi',
  ])
  expect(nico.textContent).not.toMatch(/\(\s*\)|null|undefined/)
})

test('shows the team of just one side when the other is unknown', () => {
  const partial = {
    ...NICO,
    summary: {
      ...NICO.summary,
      biggestUpsetWon: {
        ...NICO.summary.biggestUpsetWon,
        teams: { for: { id: 1, name: 'Boca' }, against: null },
      },
    },
  }
  render([partial])
  const [nico] = upsetCards()
  expect(matchResults(nico)[0]).toEqual({
    text: 'Nico BOC 2-1 Santi',
    label: 'Nico (Boca) ganó 2-1 contra Santi',
  })
})

test('still works with an older BE that sends no teams at all', () => {
  render([withoutTeams(NICO), withoutTeams(SANTI)])
  const [nico, santi] = upsetCards()
  expect(matchResults(nico).map(({ text }) => text)).toEqual([
    'Nico 2-1 Santi',
    'Nico 0-1 Santi',
  ])
  expect(matchResults(santi).map(({ text }) => text)).toEqual([
    'Santi 1-0 Nico',
    'Santi 1-2 Nico',
  ])
  // Lo demás se muestra como antes.
  expect(nico.textContent).toContain(
    'Tenía 34% de chances de ganar · +10.0 ELO · 10/10/2026',
  )
  // Sin equipos el link queda como antes, sin params de equipo vacíos.
  expect(
    [...nico.querySelectorAll('a')].map((a) => a.getAttribute('href')),
  ).toEqual([
    '/matches?player1=n&player2=s&dateFrom=2026-10-10&dateTo=2026-10-10',
    '/matches?player1=n&player2=s&dateFrom=2026-10-11&dateTo=2026-10-11',
  ])
})

test('derives the signed Elo change from ratingSwing with an older BE', () => {
  const { ratingChange: won, ...biggestUpsetWon } = NICO.summary.biggestUpsetWon
  const { ratingChange: lost, ...worstUpsetLost } = NICO.summary.worstUpsetLost
  expect([won, lost]).toEqual([10, -7])
  render([
    {
      ...NICO,
      summary: { ...NICO.summary, biggestUpsetWon, worstUpsetLost },
    },
  ])
  const [nico] = upsetCards()
  expect(
    [...nico.querySelectorAll('[data-trend]')].map((node) => [
      node.textContent,
      node.dataset.trend,
    ]),
  ).toEqual([
    ['+10.0 ELO', 'up'],
    ['-7.0 ELO', 'down'],
  ])
})
