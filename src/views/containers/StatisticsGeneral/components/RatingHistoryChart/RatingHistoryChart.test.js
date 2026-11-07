/* eslint-env jest */
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { installResizeObserver } from 'utils/testing/mockResizeObserver'
import {
  BOCA,
  LANUS,
  RACING,
  RIVER,
  historyData,
} from 'utils/testing/ratingHistoryFixtures'
import RatingHistoryChart, { RatingHistoryTooltip } from '.'

jest.mock('api', () => ({ database: 'http://db' }))

const colors = new Map([
  ['n', '#0072B2'],
  ['s', '#D55E00'],
])

let container
let restoreResizeObserver
beforeEach(() => {
  restoreResizeObserver = installResizeObserver()
  container = document.createElement('div')
  document.body.appendChild(container)
})
afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
  restoreResizeObserver()
})

const render = (selectedIds, data = historyData(), extra = {}) => {
  act(() => {
    ReactDOM.render(
      <RatingHistoryChart
        data={data}
        selectedIds={selectedIds}
        colors={colors}
        {...extra}
      />,
      container,
    )
  })
}

describe('RatingHistoryChart', () => {
  test('draws one curve per selected player and the 1500 reference line', () => {
    render(['n', 's'])
    expect(container.querySelector('svg')).not.toBeNull()
    expect(container.querySelectorAll('.recharts-line-curve')).toHaveLength(2)
    expect(container.querySelectorAll('.recharts-reference-line')).toHaveLength(
      1,
    )
  })

  test('each curve uses its player color', () => {
    render(['n', 's'])
    const strokes = [...container.querySelectorAll('.recharts-line-curve')].map(
      (curve) => curve.getAttribute('stroke'),
    )
    expect(strokes).toEqual(['#0072B2', '#D55E00'])
  })

  test('hiding a player removes its curve', () => {
    render(['n'])
    const strokes = [...container.querySelectorAll('.recharts-line-curve')].map(
      (curve) => curve.getAttribute('stroke'),
    )
    expect(strokes).toEqual(['#0072B2'])
  })

  test('curves are stepped (flat until the player plays again)', () => {
    render(['n'])
    const path = container
      .querySelector('.recharts-line-curve')
      .getAttribute('d')
    // Un stepAfter solo tiene tramos horizontales y verticales (cada punto
    // comparte x o y con el anterior), nunca diagonales.
    const points = path
      .replace(/^M/, '')
      .split('L')
      .map((pair) => pair.split(',').map(Number))
    expect(points.length).toBeGreaterThan(2)
    points.slice(1).forEach(([x, y], index) => {
      const [previousX, previousY] = points[index]
      expect(x === previousX || y === previousY).toBe(true)
    })
  })

  test('labels the x axis with the date of the first match of each day', () => {
    // Período de 2 días: una marca por día.
    render(['n', 's'])
    const labels = [
      ...container.querySelectorAll(
        '.recharts-xAxis .recharts-cartesian-axis-tick-value',
      ),
    ].map((node) => node.textContent)
    expect(labels).toEqual(['10 oct 2026', '11 oct'])
  })

  test('exposes a text summary for screen readers', () => {
    render(['n', 's'])
    const box = container.querySelector('[role="img"]')
    const label = box.getAttribute('aria-label')
    expect(label).toContain('del 10/10/2026 al 11/10/2026, en 3 partidos')
    expect(label).toContain('Nico: de 1500 a 1503 (+3.0).')
    expect(label).toContain('Santi: de 1500 a 1497 (-3.0).')
  })

  test('asks to pick a player when nobody is selected', () => {
    render([])
    expect(container.querySelector('svg')).toBeNull()
    expect(container.textContent).toContain('Elegí al menos un jugador')
  })

  test('without marks it draws no tournament marks', () => {
    render(['n', 's'])
    expect(container.querySelector('.tournament-marks')).toBeNull()
    expect(container.querySelector('.recharts-customized-wrapper')).toBeNull()
    expect(
      container.querySelector('[role="img"]').getAttribute('aria-label'),
    ).not.toContain('Torneos marcados')
  })

  test('the x axis says "Partidos del período" by default and "Partidos del torneo" in tournament mode', () => {
    render(['n', 's'])
    expect(container.textContent).toContain('Partidos del período')
    render(['n', 's'], historyData(), { mode: 'tournament' })
    expect(container.textContent).toContain('Partidos del torneo')
    expect(container.textContent).not.toContain('Partidos del período')
  })
})

describe('RatingHistoryChart tournament marks', () => {
  const MARK_A = {
    id: 'a',
    name: 'Liga APA',
    fromX: 1,
    toX: 2,
    matches: 2,
    fromT: '2026-10-10T15:00:00.000Z',
    toT: '2026-10-10T16:00:00.000Z',
    color: '#64748B',
  }
  // Simultánea con la anterior: comparte partidos, necesita otro carril.
  const MARK_B = {
    id: 'b',
    name: 'Copa del Sur',
    fromX: 2,
    toX: 3,
    matches: 2,
    fromT: '2026-10-10T16:00:00.000Z',
    toT: '2026-10-11T15:00:00.000Z',
    color: '#0F766E',
  }
  // Un solo partido.
  const MARK_C = {
    id: 'c',
    name: 'Supercopa',
    fromX: 3,
    toX: 3,
    matches: 1,
    fromT: '2026-10-11T15:00:00.000Z',
    toT: '2026-10-11T15:00:00.000Z',
    color: '#B45309',
  }
  const bars = () => [...container.querySelectorAll('.tournament-mark-bar')]
  const titles = () =>
    [...container.querySelectorAll('.tournament-mark title')].map(
      (node) => node.textContent,
    )
  const markLines = (index) => {
    const marks = container.querySelectorAll('.tournament-mark')
    return marks[index].querySelectorAll('line')
  }

  test('draws one bar with a title per tournament, simultaneous ones in different lanes', () => {
    render(['n', 's'], historyData(), { marks: [MARK_A, MARK_B, MARK_C] })
    expect(bars()).toHaveLength(3)
    expect(titles()).toEqual([
      'Liga APA: el 10/10/2026, 2 partidos',
      'Copa del Sur: del 10/10/2026 al 11/10/2026, 2 partidos',
      'Supercopa: el 11/10/2026, 1 partido',
    ])
    const [barA, barB, barC] = bars()
    // A y B se solapan (carriles 0 y 1); el carril 0 queda libre porque A
    // termina en el partido 2 y C empieza en el 3.
    expect(barA.getAttribute('y')).not.toBe(barB.getAttribute('y'))
    expect(barC.getAttribute('y')).toBe(barA.getAttribute('y'))
  })

  test('start and end lines per tournament; a one-match tournament has a single line', () => {
    render(['n', 's'], historyData(), { marks: [MARK_A, MARK_B, MARK_C] })
    expect(markLines(0)).toHaveLength(2)
    expect(markLines(1)).toHaveLength(2)
    expect(markLines(2)).toHaveLength(1)
    const [start, end] = markLines(0)
    expect(start.getAttribute('stroke-dasharray')).toBe('4 3')
    expect(end.getAttribute('stroke-dasharray')).toBe('1.5 3')
    expect(start.getAttribute('stroke')).toBe('#64748B')
    expect(start.getAttribute('stroke-width')).toBe('1')
  })

  test('uses the color of each mark and does not use ReferenceLine', () => {
    render(['n', 's'], historyData(), { marks: [MARK_A, MARK_B] })
    expect(bars().map((bar) => bar.getAttribute('fill'))).toEqual([
      '#64748B',
      '#0F766E',
    ])
    expect(container.querySelectorAll('.recharts-reference-line')).toHaveLength(
      1,
    )
  })

  test('reserves vertical space for the lanes without touching the plot height', () => {
    render(['n', 's'])
    const plain = container.querySelector('[role="img"]')
    const plainClass = plain.className
    render(['n', 's'], historyData(), { marks: [MARK_A, MARK_B] })
    const withMarks = container.querySelector('[role="img"]')
    const css = [...document.querySelectorAll('style')]
      .map((style) => style.textContent)
      .join('')
    const heightOf = (className) => {
      const match = new RegExp(
        `\\.${className.split(' ').pop()}\\{[^}]*height:(\\d+)px`,
      ).exec(css.replace(/\s+/g, ''))
      return match && Number(match[1])
    }
    expect(heightOf(plainClass)).toBe(380)
    expect(heightOf(withMarks.className)).toBe(380 + 2 * 16)
  })

  test('writes a label inside the bar when it is wide enough', () => {
    render(['n', 's'], historyData(), { marks: [MARK_A] })
    const labels = [...container.querySelectorAll('.tournament-mark text')]
    expect(labels).toHaveLength(1)
    expect(labels[0].textContent.length).toBeGreaterThanOrEqual(4)
    expect(labels[0].textContent.startsWith('Liga')).toBe(true)
  })

  test('a one-match tournament has a minimal bar without text but keeps its title', () => {
    render(['n', 's'], historyData(), { marks: [MARK_C] })
    expect(bars()).toHaveLength(1)
    expect(container.querySelectorAll('.tournament-mark text')).toHaveLength(0)
    expect(titles()).toEqual(['Supercopa: el 11/10/2026, 1 partido'])
  })

  test('never hides a mark: those beyond 4 lanes get lines and a minimal bar', () => {
    const overlapping = Array.from({ length: 6 }, (_, index) => ({
      ...MARK_A,
      id: `m${index}`,
      name: `Torneo ${index}`,
      fromX: 1,
      toX: 3,
      matches: 3,
    }))
    render(['n', 's'], historyData(), { marks: overlapping })
    expect(container.querySelectorAll('.tournament-mark')).toHaveLength(6)
    expect(bars()).toHaveLength(6)
    expect(container.querySelectorAll('.tournament-mark text')).toHaveLength(4)
    expect(titles()).toHaveLength(6)
    const lastBars = bars().slice(4)
    lastBars.forEach((bar) => {
      expect(bar.getAttribute('height')).toBe('4')
    })
  })

  test('the screen reader summary lists the tournaments', () => {
    render(['n', 's'], historyData(), { marks: [MARK_A, MARK_C] })
    const label = container
      .querySelector('[role="img"]')
      .getAttribute('aria-label')
    expect(label).toContain(
      'Torneos marcados: Liga APA: el 10/10/2026, 2 partidos; Supercopa: el 11/10/2026, 1 partido.',
    )
    expect(label).toContain('Nico: de 1500 a 1503')
  })

  test('tournament mode names the tournament in the summary', () => {
    const data = {
      ...historyData(),
      scope: { type: 'tournament', tournament: { id: 'a', name: 'Liga APA' } },
    }
    render(['n', 's'], data, { mode: 'tournament' })
    expect(
      container.querySelector('[role="img"]').getAttribute('aria-label'),
    ).toContain('Rating APA 2.0 del torneo Liga APA del 10/10/2026')
  })
})

describe('RatingHistoryTooltip', () => {
  const row = (extra = {}) => ({
    x: 3,
    seq: 103,
    t: '2026-10-11T15:00:00.000Z',
    points: {
      n: {
        rating: 1503,
        delta: -7,
        tournament: 'Liga APA',
        opponent: { id: 's', name: 'Santi' },
        score: { for: 0, against: 1 },
        teams: { for: LANUS, against: RACING },
        penalties: null,
        expectedScore: 0.62,
        probability: { kind: 'advance', for: 0.62, against: 0.38 },
      },
    },
    ...extra,
  })
  const payload = [
    {
      dataKey: 'p_n',
      name: 'Nico',
      color: '#0072B2',
      value: 1503,
      payload: row(),
    },
    {
      dataKey: 'p_s',
      name: 'Santi',
      color: '#D55E00',
      value: 1497,
      payload: row(),
    },
    {
      dataKey: 'p_l',
      name: 'Lalo',
      color: '#00805F',
      value: null,
      payload: row(),
    },
  ]
  const renderTooltip = (props) => {
    act(() => {
      ReactDOM.render(<RatingHistoryTooltip {...props} />, container)
    })
  }

  test('shows date, opponent, result, tournament, delta and chances', () => {
    renderTooltip({ active: true, payload })
    const text = container.textContent
    expect(text).toContain('Partido 3 · 11/10/2026')
    expect(text).toContain('Nico1503 (-7.0 ELO)')
    expect(text).toContain('Nico LAN 0-1 Santi RAC')
    expect(text).toContain('Liga APA')
    expect(text).toContain('Chances de avanzar: 62%')
    expect(text).not.toContain('Puntaje esperado')
  })

  test('colors the delta green or red like the upset cards', () => {
    renderTooltip({ active: true, payload })
    const delta = container.querySelector('[data-trend]')
    expect(delta.textContent).toBe('-7.0 ELO')
    expect(delta.dataset.trend).toBe('down')

    const won = row()
    won.points.n = { ...won.points.n, delta: 10 }
    renderTooltip({
      active: true,
      payload: [{ ...payload[0], payload: won }],
    })
    const positive = container.querySelector('[data-trend]')
    expect(positive.textContent).toBe('+10.0 ELO')
    expect(positive.dataset.trend).toBe('up')

    // jsdom no resuelve `var()`, así que se comprueba la regla de estilo.
    const css = [...document.querySelectorAll('style')]
      .map((style) => style.textContent)
      .join('')
    expect(css).toMatch(
      /\[data-trend=["']up["']\]\s*\{\s*color:\s*var\(--green-900\)/,
    )
    expect(css).toMatch(
      /\[data-trend=["']down["']\]\s*\{\s*color:\s*var\(--red-700\)/,
    )
  })

  test('says "chances de ganar" for a match that can end in a draw', () => {
    const league = row()
    league.points.n = {
      ...league.points.n,
      probability: { kind: 'win', for: 0.41, against: 0.37 },
    }
    renderTooltip({
      active: true,
      payload: [{ ...payload[0], payload: league }],
    })
    expect(container.textContent).toContain('Chances de ganar: 41%')
  })

  test('omits the chances line without probability', () => {
    const old = row()
    old.points.n = { ...old.points.n, probability: null }
    renderTooltip({ active: true, payload: [{ ...payload[0], payload: old }] })
    expect(container.textContent).not.toContain('Chances')
    expect(container.textContent).toContain('Nico1503 (-7.0 ELO)')
  })

  const singlePlayer = (point) => {
    const single = row()
    single.points.n = { ...single.points.n, ...point }
    renderTooltip({
      active: true,
      payload: [{ ...payload[0], payload: single }],
    })
    return container.querySelector('[role="img"]')
  }

  test('shows the player team, the score and the opponent team from the player point of view', () => {
    renderTooltip({ active: true, payload })
    const result = container.querySelector('[role="img"]')
    expect(result.textContent).toBe('Nico LAN 0-1 Santi RAC')
    expect(result.getAttribute('aria-label')).toBe(
      'Nico (Lanús) perdió 0-1 contra Santi (Racing)',
    )
  })

  test('shows the crest of each team by id and keeps the abbreviation if one fails', () => {
    renderTooltip({ active: true, payload })
    const result = container.querySelector('[role="img"]')
    const crests = [...result.querySelectorAll('img')]
    expect(crests.map((img) => img.getAttribute('src'))).toEqual([
      'http://db/logos/3',
      'http://db/logos/4',
    ])
    act(() => {
      crests[0].dispatchEvent(new Event('error'))
    })
    expect(crests[0].style.display).toBe('none')
    expect(result.textContent).toBe('Nico LAN 0-1 Santi RAC')
  })

  test('shows the abbreviation without crest for a BE that sends only names', () => {
    const result = singlePlayer({ teams: { for: 'Lanús', against: 'Racing' } })
    expect(result.textContent).toBe('Nico LAN 0-1 Santi RAC')
    expect(result.getAttribute('aria-label')).toBe(
      'Nico (Lanús) perdió 0-1 contra Santi (Racing)',
    )
    expect(result.querySelectorAll('img')).toHaveLength(0)
  })

  test('shows the abbreviation without crest when the id is missing', () => {
    const result = singlePlayer({
      teams: { for: { id: null, name: 'Lanús' }, against: RACING },
    })
    expect(result.textContent).toBe('Nico LAN 0-1 Santi RAC')
    expect([...result.querySelectorAll('img')].map((i) => i.src)).toEqual([
      'http://db/logos/4',
    ])
  })

  test('uses the compact crest size and keeps the score as one box', () => {
    renderTooltip({ active: true, payload })
    const result = container.querySelector('[role="img"]')
    const [img] = result.querySelectorAll('img')
    const css = [...document.querySelectorAll('style')]
      .map((style) => style.textContent)
      .join('')
    const className = [...img.classList].find((name) =>
      css.includes(`.${name}`),
    )
    expect(css).toMatch(
      new RegExp(`\\.${className}\\s*\\{[^}]*height:\\s*16px`),
    )
    expect(result.children).toHaveLength(3)
  })

  test('orients the teams when the player was the home side or won', () => {
    const result = singlePlayer({
      score: { for: 3, against: 2 },
      teams: { for: BOCA, against: RIVER },
      delta: 6.2,
    })
    expect(result.textContent).toBe('Nico BOC 3-2 Santi RIV')
    expect(result.getAttribute('aria-label')).toBe(
      'Nico (Boca) ganó 3-2 contra Santi (River)',
    )
  })

  test('shows just the names when the match has no teams', () => {
    for (const teams of [
      undefined,
      null,
      {},
      { for: null, against: null },
      { for: '', against: '  ' },
    ]) {
      const result = singlePlayer({ teams })
      expect(result.textContent).toBe('Nico 0-1 Santi')
    }
  })

  test('shows only the known team', () => {
    const result = singlePlayer({ teams: { for: null, against: RACING } })
    expect(result.textContent).toBe('Nico 0-1 Santi RAC')
  })

  test('still shows the rest of the info with an older BE (no teams, no penalties)', () => {
    const old = row()
    old.points.n = { ...old.points.n }
    delete old.points.n.teams
    delete old.points.n.penalties
    renderTooltip({ active: true, payload: [{ ...payload[0], payload: old }] })
    const text = container.textContent
    expect(text).toContain('Partido 3 · 11/10/2026')
    expect(text).toContain('Nico1503 (-7.0 ELO)')
    expect(text).toContain('Nico 0-1 Santi')
    expect(text).toContain('Liga APA')
    expect(text).toContain('Chances de avanzar: 62%')
  })

  test('adds the penalty shootout of a draw decided on penalties', () => {
    const result = singlePlayer({
      score: { for: 2, against: 2 },
      penalties: { for: 4, against: 3 },
      teams: { for: BOCA, against: RIVER },
      delta: 0,
    })
    expect(result.textContent).toBe('Nico BOC 2-2 Penales 4-3 Santi RIV')
    expect(result.getAttribute('aria-label')).toBe(
      'Nico (Boca) empató 2-2 con Santi (River), penales 4-3',
    )
  })

  test('does not mention penalties for a draw without a shootout', () => {
    const result = singlePlayer({
      score: { for: 1, against: 1 },
      penalties: null,
    })
    expect(result.textContent).toBe('Nico LAN 1-1 Santi RAC')
    expect(result.getAttribute('aria-label')).not.toContain('penales')
  })

  test('ignores an invalid shootout', () => {
    for (const penalties of [{ for: -1, against: 2 }, { for: 'x' }, {}, 5]) {
      const result = singlePlayer({
        score: { for: 1, against: 1 },
        penalties,
      })
      expect(result.textContent).not.toContain('Penales')
    }
  })

  test('lists the players who did not play with just their rating', () => {
    renderTooltip({ active: true, payload })
    expect(container.textContent).toContain('Santi1497')
    // Sin rating todavía (debuta más adelante): no aparece.
    expect(container.textContent).not.toContain('Lalo')
  })

  test('the first row is the start of the period', () => {
    renderTooltip({
      active: true,
      payload: [{ ...payload[0], payload: row({ x: 0, t: null, points: {} }) }],
    })
    expect(container.textContent).toContain('Inicio del período')
    expect(container.textContent).toContain('Nico1503')
  })

  test('renders nothing when inactive', () => {
    renderTooltip({ active: false, payload })
    expect(container.textContent).toBe('')
  })
})
