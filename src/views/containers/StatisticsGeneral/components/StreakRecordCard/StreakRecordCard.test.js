/* eslint-env jest */
// Las fechas salen de utils/dates (JS puro): no hace falta mockear date-fns.
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import StreakRecordCard from '.'
import { buildStreakMatchesLink } from 'utils/streaks'

const match = (overrides) => ({
  date: '2026-07-02T12:00:00',
  tournament: { id: 't1', name: 'Liga' },
  type: 'regular',
  team: { id: '10', name: 'Racing' },
  opponent: { id: 'p2', name: 'Santi' },
  opponentTeam: { id: '20', name: 'Boca' },
  goalsFor: 2,
  goalsAgainst: 1,
  result: 'W',
  penalties: null,
  ...overrides,
})

const holder = (overrides) => ({
  id: 'p1',
  name: 'Nico',
  date: '2026-09-20T12:00:00',
  isActive: true,
  startDate: '2026-07-02T12:00:00',
  startDatePrecision: 'exact',
  endDate: '2026-09-20T12:00:00',
  endDatePrecision: 'exact',
  startMatch: match(),
  endMatch: match({
    date: '2026-09-20T12:00:00',
    type: 'playoff',
    goalsFor: 1,
    goalsAgainst: 1,
    result: 'D',
    penalties: { won: true, goalsFor: 4, goalsAgainst: 3 },
  }),
  breakMatch: null,
  ...overrides,
})

const breakMatch = match({
  date: '2026-09-27T12:00:00',
  goalsFor: 0,
  goalsAgainst: 3,
  result: 'L',
  opponent: { id: 'p4', name: 'Juan' },
  opponentTeam: { id: '30', name: 'Lanús' },
})

let container

const render = (record, props = {}) => {
  act(() => {
    ReactDOM.render(
      <MemoryRouter>
        <StreakRecordCard
          idPrefix="historicas"
          recordKey="most_wins_in_a_row"
          title="Con victoria"
          tone="positive"
          category="Resultados"
          record={record}
          {...props}
        />
      </MemoryRouter>,
      container,
    )
  })
}

// Label visible de cada mini-tarjeta (primer hijo del grupo).
const labels = () =>
  Array.from(
    container.querySelectorAll('[role="group"] > span:first-child'),
  ).map((node) => node.textContent)

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
})

test('racha activa: badge con aclaración, rango, duración, inicio y último', () => {
  render({ count: 9, players: [holder()] })

  const text = container.textContent
  expect(text).toContain('Resultados')
  expect(text).toContain('Activa')
  expect(text).toContain('02/07/2026')
  expect(text).toContain('20/09/2026')
  expect(text).toContain('2 meses y 18 días')
  expect(labels()).toEqual(['Inicio', 'Último'])
  expect(text).toContain('1-1 (4-3)')
  expect(text).not.toContain('por penales')
  const [, last] = container.querySelectorAll('[role="group"]')
  expect(last.getAttribute('aria-label')).toContain(
    'Nico 1 a 1 Santi, 4 a 3 en penales, Liga',
  )
  expect(text).toContain('Playoff')
  expect(text).toContain('vs Santi (Boca)')
  expect(text).not.toContain('Récord')

  const times = container.querySelectorAll('time')
  expect(times[0].getAttribute('dateTime')).toBe('2026-07-02T12:00:00')
  expect(container.querySelector('img').getAttribute('alt')).toBe('Racing')
  // Un solo poseedor: sin toggle.
  expect(container.querySelector('button')).toBeNull()
})

test('penales perdidos: la tanda va en la perspectiva del poseedor', () => {
  render({
    count: 4,
    players: [
      holder({
        isActive: false,
        breakMatch: match({
          date: '2026-09-27T12:00:00',
          goalsFor: 1,
          goalsAgainst: 1,
          result: 'D',
          penalties: { won: false, goalsFor: 3, goalsAgainst: 4 },
        }),
      }),
    ],
  })

  const [, cut] = container.querySelectorAll('[role="group"]')
  expect(cut.textContent).toContain('1-1 (3-4)')
  expect(cut.getAttribute('aria-label')).toContain(
    '1 a 1 Santi, 3 a 4 en penales',
  )
})

test('racha cerrada: inicio y corte con el partido que la cortó', () => {
  render({
    count: 4,
    players: [holder({ isActive: false, breakMatch })],
  })

  const text = container.textContent
  expect(text).not.toContain('Activa')
  expect(text).not.toContain('Puede extenderse')
  expect(labels()).toEqual(['Inicio', 'Fin'])
  expect(text).toContain('vs Juan (Lanús)')
  expect(text).toContain('0-3')
  expect(text).toContain('27/09/2026')
  // El rango sigue siendo el de la racha: termina en su último partido.
  expect(text).toMatch(/02\/07\/2026\s*→\s*hasta\s*20\/09\/2026/)
  const [, cut] = container.querySelectorAll('[role="group"]')
  expect(cut.getAttribute('aria-label')).toMatch(
    /^Partido que cortó la racha: Nico 0 a 3 Juan/,
  )
})

test('corte sin fecha: "sin fecha"; inicio sin fecha en el rango', () => {
  render({
    count: 4,
    players: [
      holder({
        isActive: false,
        startDate: null,
        startMatch: match({ date: null }),
        breakMatch: { ...breakMatch, date: null },
      }),
    ],
  })

  const text = container.textContent
  expect(text).toContain('Inicio sin fecha registrada')
  expect(labels()).toEqual(['Inicio', 'Fin'])
  const metas = Array.from(container.querySelectorAll('[role="group"]')).map(
    (group) => group.textContent,
  )
  expect(metas[0]).toContain('sin fecha')
  expect(metas[1]).toContain('sin fecha')
  expect(text).not.toMatch(/meses|días|mismo día/)
})

test('no vigente muestra el partido de corte con label Fin, no el último de la racha', () => {
  render({ count: 4, players: [holder({ isActive: false, breakMatch })] })

  expect(labels()).toEqual(['Inicio', 'Fin'])
  const [, cut] = container.querySelectorAll('[role="group"]')
  expect(cut.textContent).toContain('vs Juan (Lanús)')
  // El último partido de la racha (1-1 con tanda 4-3) no es el corte.
  expect(cut.textContent).not.toContain('(4-3)')
  expect(cut.getAttribute('aria-label')).not.toMatch(/^Partido final/)
})

test.each([
  ['sin récord', null],
  ['count 1', { count: 1, players: [holder()] }],
  ['sin poseedores', { count: 3, players: [] }],
])('estado vacío (%s)', (_, record) => {
  render(record, { emptyMessage: 'Nadie en racha' })

  const text = container.textContent
  expect(text).toContain('Con victoria')
  expect(text).toContain('Resultados')
  expect(text).toContain('Nadie en racha')
  expect(text).not.toContain('partido')
  expect(container.querySelector('[role="group"]')).toBeNull()
})

test('estado vacío por defecto: "Sin racha registrada"', () => {
  render({ count: 1, players: [holder()] })
  expect(container.textContent).toContain('Sin racha registrada')
})

test('actuales: tag "Récord" y sin pill "Activa" redundante', () => {
  render(
    { count: 6, players: [holder()] },
    { idPrefix: 'actuales', showActive: false, isRecord: true },
  )

  const text = container.textContent
  expect(text).toContain('Récord')
  expect(text).not.toContain('Activa')
  expect(text).not.toContain('Puede extenderse')
  expect(labels()).toEqual(['Inicio', 'Último'])
})

const pillLine = (label) =>
  Array.from(container.querySelectorAll('span'))
    .filter((node) => node.textContent === label)
    .map((node) => node.parentElement.textContent)

test('"Récord" y "Activa" comparten lugar junto al nombre', () => {
  render({ count: 6, players: [holder()] })
  expect(pillLine('Activa')).toEqual(['NicoActiva'])

  render(
    { count: 6, players: [holder()] },
    { idPrefix: 'actuales', showActive: false, isRecord: true },
  )
  expect(pillLine('Récord')).toEqual(['NicoRécord'])
})

test('actuales con empate: "Récord" en cada poseedor', () => {
  render(
    { count: 6, players: [holder(), holder({ id: 'p3', name: 'Fede' })] },
    { idPrefix: 'actuales', showActive: false, isRecord: true },
  )
  expect(pillLine('Récord')).toEqual(['NicoRécord', 'FedeRécord'])
})

test('empate: partidos detrás de "Ver partidos"', () => {
  render({
    count: 9,
    players: [
      holder(),
      holder({ id: 'p3', name: 'Fede', isActive: false, breakMatch }),
    ],
  })

  const buttons = container.querySelectorAll('button')
  expect(buttons).toHaveLength(2)
  const [first, second] = buttons
  expect(first.getAttribute('aria-controls')).toBe(
    'historicas-most_wins_in_a_row-p1-partidos',
  )
  const panel = document.getElementById(first.getAttribute('aria-controls'))
  expect(first.getAttribute('aria-expanded')).toBe('false')
  expect(panel.hidden).toBe(true)

  act(() => {
    first.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  expect(first.getAttribute('aria-expanded')).toBe('true')
  expect(panel.hidden).toBe(false)

  const secondPanel = document.getElementById(
    second.getAttribute('aria-controls'),
  )
  expect(secondPanel.textContent).toContain('Fin')
  expect(
    secondPanel.querySelector('[aria-label^="Partido que cortó la racha"]'),
  ).not.toBeNull()
})

test.each([
  ['year', '2019', 'Liga, 2019'],
  ['approx', 'aprox. jul. 2019', 'Liga, aproximadamente julio de 2019'],
])(
  'punta no exacta (%s): etiqueta de precisión y sin duración',
  (precision, label, spoken) => {
    render({
      count: 9,
      players: [
        holder({
          startDate: '2019-07-09T12:00:00',
          startDatePrecision: precision,
          endDatePrecision: 'exact',
          startMatch: match({
            date: '2019-07-09T12:00:00',
            datePrecision: precision,
          }),
        }),
      ],
    })

    const text = container.textContent
    expect(text).toMatch(new RegExp(`${label}\\s*→\\s*hasta\\s*20/09/2026`))
    expect(text).not.toMatch(/años|meses|días|mismo día/)
    const [start] = container.querySelectorAll('[role="group"]')
    expect(start.textContent).toContain(label)
    expect(start.getAttribute('aria-label')).toContain(spoken)
  },
)

test('partidos de eliminación: unidad "partidos" y la tanda como victoria en el aria-label', () => {
  render(
    {
      count: 3,
      players: [
        holder({
          endMatch: match({
            date: '2026-09-20T12:00:00',
            type: 'playoff',
            goalsFor: 1,
            goalsAgainst: 1,
            result: 'W',
            penalties: { won: true, goalsFor: 4, goalsAgainst: 3 },
          }),
        }),
      ],
    },
    {
      recordKey: 'most_knockout_wins_in_a_row',
      title: 'Con victoria (eliminación)',
      category: 'Partidos de eliminación',
      variant: 'knockout',
    },
  )

  const text = container.textContent
  expect(text).toContain('Partidos de eliminación')
  expect(text).toContain('partidos')
  expect(text).toContain('1-1 (4-3)')
  const [, last] = container.querySelectorAll('[role="group"]')
  expect(last.getAttribute('aria-label')).toContain(
    'Nico 1 a 1 Santi, ganó 4 a 3 en penales, Liga',
  )
})

describe('ayuda en el título', () => {
  const HELP = 'Partidos de eliminatoria (Playin / Playoffs)'
  const tooltip = () => document.querySelector('[role="tooltip"]')

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  const renderWithHelp = (props) =>
    render(
      { count: 3, players: [holder()] },
      {
        title: 'Invicto (eliminación)',
        titleHelp: HELP,
        ...props,
      },
    )

  test('botón enfocable con nombre accesible, pegado a la última palabra', () => {
    renderWithHelp()

    const heading = container.querySelector('h4')
    expect(heading.textContent).toBe('Invicto (eliminación)')
    const button = heading.querySelector('button')
    expect(button.getAttribute('type')).toBe('button')
    expect(button.getAttribute('aria-label')).toBe(HELP)
    expect(button.tabIndex).toBe(0)
    expect(button.parentElement.textContent).toBe('(eliminación)')
    expect(button.querySelector('svg').getAttribute('aria-hidden')).toBe('true')
  })

  test('el tooltip abre con el mouse', () => {
    renderWithHelp()
    const button = container.querySelector('h4 button')
    expect(tooltip()).toBeNull()

    act(() => {
      button.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
      jest.advanceTimersByTime(500)
    })
    expect(tooltip().textContent).toBe(HELP)
  })

  test('el tooltip abre con el foco del teclado', () => {
    renderWithHelp()
    const button = container.querySelector('h4 button')
    expect(tooltip()).toBeNull()

    // Tab desde el teclado y después el foco.
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
      )
      button.focus()
      jest.advanceTimersByTime(500)
    })
    expect(document.activeElement).toBe(button)
    expect(tooltip().textContent).toBe(HELP)
  })

  test('sin ayuda el título queda como texto y acepta un nodo', () => {
    render({ count: 3, players: [holder()] })
    expect(container.querySelector('h4').textContent).toBe('Con victoria')
    expect(container.querySelector('h4 button')).toBeNull()

    renderWithHelp({ title: <em>Título armado</em> })
    const heading = container.querySelector('h4')
    expect(heading.querySelector('em').textContent).toBe('Título armado')
    expect(heading.querySelector('button').getAttribute('aria-label')).toBe(
      HELP,
    )
  })
})

test('partidos de eliminación: tanda perdida con su resultado', () => {
  render(
    {
      count: 3,
      players: [
        holder({
          isActive: false,
          breakMatch: match({
            date: '2026-09-27T12:00:00',
            type: 'playoff',
            goalsFor: 0,
            goalsAgainst: 0,
            result: 'L',
            penalties: { won: false, goalsFor: 2, goalsAgainst: 4 },
          }),
        }),
      ],
    },
    { variant: 'knockout' },
  )

  const [, cut] = container.querySelectorAll('[role="group"]')
  expect(cut.textContent).toContain('0-0 (2-4)')
  expect(cut.textContent).not.toContain('(pen.)')
  expect(cut.getAttribute('aria-label')).toContain(
    '0 a 0 Santi, perdió 2 a 4 en penales',
  )
})

const summary = (overrides) => ({
  id: 't2019',
  name: 'Chempions 2019/20',
  phaseReached: 'semifinal',
  ongoing: false,
  closedAt: '2019-07-09T12:00:00',
  closedAtPrecision: 'year',
  lastPlayedAt: '2019-07-09T12:00:00',
  lastPlayedAtPrecision: 'year',
  ...overrides,
})

const tournamentHolder = (overrides) => ({
  id: 'p1',
  name: 'Nico',
  date: '2022-07-04T12:00:00',
  datePrecision: 'exact',
  isActive: false,
  startDate: '2019-07-09T12:00:00',
  startDatePrecision: 'year',
  endDate: '2022-07-04T12:00:00',
  endDatePrecision: 'exact',
  startTournament: summary(),
  endTournament: summary({
    id: 't2022',
    name: 'Superliga Europea 2022',
    phaseReached: 'champion',
    closedAt: '2022-07-04T12:00:00',
    closedAtPrecision: 'exact',
  }),
  breakTournament: summary({
    id: 't2023',
    name: 'Liga 2023',
    phaseReached: 'quarterfinal',
    closedAt: '2023-05-10T12:00:00',
    closedAtPrecision: 'exact',
  }),
  ...overrides,
})

const renderTournament = (record, props = {}) =>
  render(record, {
    recordKey: 'most_consecutive_semifinals',
    title: 'Semis consecutivas',
    category: 'Eliminatorias',
    variant: 'tournament',
    ...props,
  })

test('torneos cerrada: Inicio y Fin con nombre, fase y fecha según precisión', () => {
  renderTournament({ count: 3, players: [tournamentHolder()] })

  const text = container.textContent
  expect(text).toContain('Eliminatorias')
  expect(text).toContain('3torneos')
  // La unidad es "torneos" (el link del rango sí dice "partidos").
  expect(text).not.toMatch(/\dpartidos/)
  expect(text).not.toContain('3 3')
  expect(labels()).toEqual(['Inicio', 'Fin'])

  const [start, cut] = container.querySelectorAll('[role="group"]')
  expect(start.textContent).toContain('Chempions 2019/20')
  expect(start.textContent).toContain('Semis')
  expect(start.textContent).toContain('2019')
  expect(start.getAttribute('aria-label')).toBe(
    'Torneo de inicio: Nico, Chempions 2019/20, Semis, 2019',
  )
  expect(cut.textContent).toContain('Liga 2023')
  expect(cut.textContent).toContain('Cuartos')
  expect(cut.textContent).toContain('10/05/2023')
  expect(cut.getAttribute('aria-label')).toMatch(
    /^Torneo que cortó la racha: Nico, Liga 2023, Cuartos/,
  )
  // Una punta con precisión "year": sin duración.
  expect(text).not.toMatch(/años|meses|días|mismo día/)
})

test('torneos activa con un torneo en curso: "Último" y "En curso"', () => {
  renderTournament({
    count: 2,
    players: [
      tournamentHolder({
        isActive: true,
        breakTournament: null,
        endTournament: summary({
          id: 't2026',
          name: 'Copa Afinidades 2026',
          ongoing: true,
          closedAt: null,
          closedAtPrecision: null,
          lastPlayedAt: '2026-09-20T12:00:00',
          lastPlayedAtPrecision: 'exact',
        }),
      }),
    ],
  })

  expect(labels()).toEqual(['Inicio', 'Último'])
  expect(container.textContent).toContain('Activa')
  const [, last] = container.querySelectorAll('[role="group"]')
  expect(last.textContent).toContain('Copa Afinidades 2026')
  expect(last.textContent).toContain('En curso')
  expect(last.getAttribute('aria-label')).toMatch(/^Último torneo: Nico/)
  expect(last.getAttribute('aria-label')).toMatch(/en curso$/)
})

const ongoingEnd = summary({
  id: 't2026',
  name: 'Copa Afinidades 2026',
  phaseReached: 'final',
  ongoing: true,
  closedAt: null,
  closedAtPrecision: null,
  lastPlayedAt: '2026-09-20T12:00:00',
  lastPlayedAtPrecision: 'exact',
})

test('torneos con el último torneo en curso: "→ En curso" y sin duración', () => {
  renderTournament({
    count: 2,
    players: [
      tournamentHolder({
        isActive: true,
        startDate: '2024-11-15T12:00:00',
        startDatePrecision: 'exact',
        // El BE manda el lastPlayedAt del torneo abierto: no se muestra.
        endDate: '2026-09-20T12:00:00',
        endDatePrecision: 'exact',
        breakTournament: null,
        endTournament: ongoingEnd,
      }),
    ],
  })

  const times = container.querySelectorAll('time')
  // Sólo el inicio del rango es una fecha real.
  expect(times[0].getAttribute('dateTime')).toBe('2024-11-15T12:00:00')
  expect(
    Array.from(times).some(
      (node) => node.getAttribute('dateTime') === '2026-09-20T12:00:00',
    ),
  ).toBe(false)

  const range = times[0].parentElement
  const nodes = Array.from(range.childNodes)
  const isDecorative = (node) => node.getAttribute?.('aria-hidden') === 'true'
  // Visible: "15/11/2024 → En curso"; "En curso" es texto, no <time>.
  expect(nodes.filter(isDecorative).map((node) => node.textContent)).toEqual([
    ' → ',
  ])
  expect(range.lastChild.nodeType).toBe(Node.TEXT_NODE)
  expect(range.lastChild.textContent).toBe('En curso')
  // Lectores de pantalla: "desde el 15/11/2024, En curso".
  expect(
    nodes
      .filter((node) => !isDecorative(node))
      .map((node) => node.textContent)
      .join(''),
  ).toBe('desde el 15/11/2024, En curso')
  expect(container.textContent).not.toContain('20/09/2026')
  expect(container.textContent).not.toMatch(/años|meses|días|mismo día/)
})

test('torneos con el último torneo cerrado: rango y duración normales', () => {
  renderTournament({
    count: 2,
    players: [
      tournamentHolder({
        startDate: '2024-11-15T12:00:00',
        startDatePrecision: 'exact',
        endDate: '2026-09-20T12:00:00',
        endDatePrecision: 'exact',
        endTournament: {
          ...ongoingEnd,
          ongoing: false,
          closedAt: '2026-09-20T12:00:00',
          closedAtPrecision: 'exact',
        },
      }),
    ],
  })

  const text = container.textContent
  expect(text).toMatch(/15\/11\/2024\s*→\s*hasta\s*20\/09\/2026/)
  expect(text).toContain('1 año, 10 meses y 5 días')
  const range = container.querySelector('time').parentElement
  expect(range.textContent).not.toContain('En curso')
  expect(range.querySelectorAll('time')).toHaveLength(2)
})

test('torneos sin fecha de inicio y último torneo en curso', () => {
  renderTournament({
    count: 2,
    players: [
      tournamentHolder({
        isActive: true,
        startDate: null,
        startDatePrecision: null,
        breakTournament: null,
        endTournament: ongoingEnd,
      }),
    ],
  })

  const text = container.textContent
  expect(text).toMatch(/Inicio sin fecha registrada\s*→\s*,\s*En curso/)
  expect(text).not.toContain('Sin fechas registradas')
  expect(text).not.toMatch(/años|meses|días|mismo día/)
})

test('torneos con inicio y fin en curso: "En curso" sin romper', () => {
  renderTournament({
    count: 2,
    players: [
      tournamentHolder({
        isActive: true,
        startDate: '2026-09-20T12:00:00',
        startDatePrecision: 'exact',
        endDate: '2026-09-20T12:00:00',
        endDatePrecision: 'exact',
        startTournament: ongoingEnd,
        breakTournament: null,
        endTournament: ongoingEnd,
      }),
    ],
  })

  const text = container.textContent
  expect(text).toContain('En curso')
  expect(text).not.toContain('→')
  expect(text).not.toMatch(/años|meses|días|mismo día/)
})

test('partidos: "ongoing" en un ítem no cambia el rango', () => {
  render({
    count: 9,
    players: [holder({ endTournament: { ongoing: true } })],
  })

  expect(container.textContent).toMatch(
    /02\/07\/2026\s*→\s*hasta\s*20\/09\/2026/,
  )
  expect(container.textContent).toContain('2 meses y 18 días')
})

test('torneos cortada por un torneo en curso: "Fin" con "En curso" y "Cuartos"', () => {
  renderTournament({
    count: 2,
    players: [
      tournamentHolder({
        breakTournament: summary({
          id: 't2026',
          name: 'Copa Afinidades 2026',
          phaseReached: 'quarterfinal',
          ongoing: true,
          closedAt: null,
          closedAtPrecision: null,
        }),
      }),
    ],
  })

  expect(labels()).toEqual(['Inicio', 'Fin'])
  const [, cut] = container.querySelectorAll('[role="group"]')
  expect(cut.textContent).toContain('En curso')
  expect(cut.textContent).toContain('Cuartos')
})

test('torneos: duración sólo con las dos puntas exactas', () => {
  renderTournament({
    count: 2,
    players: [
      tournamentHolder({
        startDate: '2026-07-02T12:00:00',
        startDatePrecision: 'exact',
        endDate: '2026-09-20T12:00:00',
        endDatePrecision: 'exact',
      }),
    ],
  })
  expect(container.textContent).toContain('2 meses y 18 días')

  // Sin precisión no se asume exacta.
  renderTournament({
    count: 2,
    players: [
      tournamentHolder({
        startDate: '2026-07-02T12:00:00',
        startDatePrecision: undefined,
        endDate: '2026-09-20T12:00:00',
        endDatePrecision: 'exact',
      }),
    ],
  })
  expect(container.textContent).not.toContain('2 meses y 18 días')
})

test('torneos sin startTournament ni breakTournament: degrada sin romper', () => {
  renderTournament({
    count: 2,
    players: [
      tournamentHolder({ startTournament: null, breakTournament: undefined }),
    ],
  })

  expect(container.querySelector('[role="group"]')).toBeNull()
  expect(container.textContent).toContain('Nico')

  renderTournament({
    count: 2,
    players: [
      tournamentHolder({
        startTournament: undefined,
        endTournament: undefined,
        breakTournament: undefined,
      }),
    ],
  })
  expect(container.querySelector('[role="group"]')).toBeNull()
  expect(container.textContent).toContain('Nico')
})

test('torneos con empate: toggle "Ver torneos"', () => {
  renderTournament({
    count: 2,
    players: [tournamentHolder(), tournamentHolder({ id: 'p3', name: 'Fede' })],
  })

  const [first] = container.querySelectorAll('button')
  expect(first.textContent).toBe('Ver torneos')
  expect(first.getAttribute('aria-controls')).toBe(
    'historicas-most_consecutive_semifinals-p1-torneos',
  )
  const panel = document.getElementById(first.getAttribute('aria-controls'))
  expect(panel.hidden).toBe(true)

  act(() => {
    first.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  expect(first.textContent).toBe('Ocultar torneos')
  expect(panel.hidden).toBe(false)
})

test('torneos: estado vacío con count 1', () => {
  renderTournament(
    { count: 1, players: [tournamentHolder()] },
    { emptyMessage: 'Nadie en racha' },
  )

  expect(container.textContent).toContain('Nadie en racha')
  expect(container.textContent).toContain('Eliminatorias')
  expect(container.textContent).not.toContain('torneo')
  expect(container.querySelector('[role="group"]')).toBeNull()
})

describe('link del rango a /matches', () => {
  const links = () => Array.from(container.querySelectorAll('a'))
  const hrefOf = (link) => link.getAttribute('href')
  // Texto que lee un lector de pantalla: sin los nodos aria-hidden.
  const accessibleName = (node) =>
    Array.from(node.childNodes)
      .map((child) => {
        if (child.nodeType === Node.TEXT_NODE) return child.textContent
        if (child.getAttribute('aria-hidden') === 'true') return ''
        return accessibleName(child)
      })
      .join('')

  test('racha cerrada: jugador y días de inicio y fin, con nombre accesible', () => {
    render({ count: 4, players: [holder({ isActive: false, breakMatch })] })

    const [link] = links()
    expect(links()).toHaveLength(1)
    expect(hrefOf(link)).toBe(
      '/matches?player1=p1&outcome=win&dateFrom=2026-07-02&dateTo=2026-09-20',
    )
    expect(accessibleName(link)).toBe(
      'Ver los partidos de la racha de Nico: 02/07/2026 hasta 20/09/2026',
    )
    // El texto visible del rango sigue igual y las fechas siguen siendo <time>.
    expect(link.textContent).toMatch(/02\/07\/2026\s*→\s*hasta\s*20\/09\/2026/)
    const times = link.querySelectorAll('time')
    expect(times).toHaveLength(2)
    expect(times[0].getAttribute('dateTime')).toBe('2026-07-02T12:00:00')
    // Las mini-tarjetas no son links.
    container.querySelectorAll('[role="group"]').forEach((group) => {
      expect(group.closest('a')).toBeNull()
      expect(group.querySelector('a')).toBeNull()
    })
  })

  test('racha activa: sin dateTo', () => {
    render({ count: 9, players: [holder()] })
    expect(hrefOf(links()[0])).toBe(
      '/matches?player1=p1&outcome=win&dateFrom=2026-07-02',
    )
  })

  test('actuales: también lleva link', () => {
    render(
      { count: 6, players: [holder()] },
      { idPrefix: 'actuales', showActive: false, isRecord: true },
    )
    expect(hrefOf(links()[0])).toBe(
      '/matches?player1=p1&outcome=win&dateFrom=2026-07-02',
    )
  })

  test('empate: un link por poseedor, cada uno con su rango', () => {
    render({
      count: 9,
      players: [
        holder(),
        holder({
          id: 'p3',
          name: 'Fede',
          isActive: false,
          startDate: '2025-01-10T12:00:00',
          endDate: '2025-03-01T12:00:00',
          breakMatch,
        }),
      ],
    })

    expect(links().map(hrefOf)).toEqual([
      '/matches?player1=p1&outcome=win&dateFrom=2026-07-02',
      '/matches?player1=p3&outcome=win&dateFrom=2025-01-10&dateTo=2025-03-01',
    ])
    expect(accessibleName(links()[1])).toMatch(
      /^Ver los partidos de la racha de Fede: /,
    )
  })

  test('victorias en eliminación: type=knockout + victoria incl. penales', () => {
    render(
      { count: 3, players: [holder({ isActive: false, breakMatch })] },
      { recordKey: 'most_knockout_wins_in_a_row', variant: 'knockout' },
    )
    expect(hrefOf(links()[0])).toBe(
      '/matches?player1=p1&type=knockout&outcome=winIncludingPenalties&dateFrom=2026-07-02&dateTo=2026-09-20',
    )
  })

  test.each([
    'most_consecutive_matches_scoring_3_plus_goals',
    'most_clean_sheets_in_a_row',
    'most_draws_in_a_row',
  ])('%s: el href es el de buildStreakMatchesLink', (recordKey) => {
    const entry = holder({ isActive: false, breakMatch })
    render({ count: 4, players: [entry] }, { recordKey })
    expect(hrefOf(links()[0])).toBe(buildStreakMatchesLink(recordKey, entry))
  })

  test('sin fecha de inicio o sin fechas: sin link', () => {
    render({
      count: 4,
      players: [holder({ isActive: false, startDate: null, breakMatch })],
    })
    expect(container.textContent).toContain('Inicio sin fecha registrada')
    expect(links()).toHaveLength(0)

    render({
      count: 4,
      players: [holder({ startDate: null, endDate: null })],
    })
    expect(container.textContent).toContain('Sin fechas registradas')
    expect(links()).toHaveLength(0)
  })

  test.each([
    ['sin récord', null],
    ['count 1', { count: 1, players: [holder()] }],
    ['sin poseedores', { count: 3, players: [] }],
  ])('estado vacío (%s): sin link', (_, record) => {
    render(record)
    expect(links()).toHaveLength(0)
  })

  test('semis consecutivas: type=playoff + playoffRound=semifinal, de la primera a la última semi', () => {
    renderTournament({
      count: 3,
      players: [
        tournamentHolder({
          startTournament: summary({
            firstPlayoffPlayedAt: '2019-06-20T12:00:00',
            firstPlayoffPlayedAtPrecision: 'exact',
            firstSemifinalPlayedAt: '2019-06-25T12:00:00',
            firstSemifinalPlayedAtPrecision: 'exact',
          }),
          endTournament: summary({
            id: 't2022',
            closedAt: '2022-07-04T12:00:00',
            closedAtPrecision: 'exact',
            lastPlayoffPlayedAt: '2022-06-30T12:00:00',
            lastPlayoffPlayedAtPrecision: 'exact',
            lastSemifinalPlayedAt: '2022-06-28T12:00:00',
            lastSemifinalPlayedAtPrecision: 'exact',
          }),
        }),
      ],
    })
    expect(hrefOf(links()[0])).toBe(
      '/matches?player1=p1&type=playoff&playoffRound=semifinal&dateFrom=2019-06-25&dateTo=2022-06-28',
    )
  })

  test('torneos con el último torneo en curso: sin dateTo, "→ En curso" dentro del link', () => {
    renderTournament({
      count: 2,
      players: [
        tournamentHolder({
          isActive: true,
          startDate: '2024-11-15T12:00:00',
          startDatePrecision: 'exact',
          endDate: '2026-09-20T12:00:00',
          endDatePrecision: 'exact',
          breakTournament: null,
          startTournament: summary({
            firstPlayoffPlayedAt: '2024-11-01T12:00:00',
          }),
          endTournament: ongoingEnd,
        }),
      ],
    })

    const [link] = links()
    expect(hrefOf(link)).toBe(
      '/matches?player1=p1&type=playoff&playoffRound=semifinal&dateFrom=2024-11-01',
    )
    expect(accessibleName(link)).toBe(
      'Ver los partidos de la racha de Nico: desde el 15/11/2024, En curso',
    )
  })
})

test('sin precisión no muestra duración', () => {
  render({
    count: 9,
    players: [
      holder({ startDatePrecision: undefined, endDatePrecision: undefined }),
    ],
  })

  expect(container.textContent).toMatch(
    /02\/07\/2026\s*→\s*hasta\s*20\/09\/2026/,
  )
  expect(container.textContent).not.toMatch(/años|meses|días|mismo día/)
})
