/* eslint-env jest */
// date-fns 4 no resuelve en el Jest de CRA: se reemplaza por un dd/MM/yyyy local.
jest.mock('date-fns', () => {
  const pad = (value) => String(value).padStart(2, '0')
  return {
    format: (date) =>
      `${pad(date.getDate())}/${pad(
        date.getMonth() + 1,
      )}/${date.getFullYear()}`,
    parseISO: (value) => new Date(value),
  }
})
jest.mock('date-fns/locale', () => ({ es: {} }))
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import RecordsTab from '.'

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

const streak = (count, name, overrides = {}) => ({
  count,
  players: [
    {
      id: name.toLowerCase(),
      name,
      date: '2026-09-20T12:00:00',
      isActive: false,
      startDate: '2026-07-02T12:00:00',
      endDate: '2026-09-20T12:00:00',
      startMatch: match(),
      endMatch: match({ date: '2026-09-20T12:00:00' }),
      breakMatch: match({ date: '2026-09-27T12:00:00', result: 'L' }),
      ...overrides,
    },
  ],
})

const MATCH_STREAK_TITLES = [
  'Invicto (sin derrotas)',
  'Con victoria',
  'Con empate',
  'Con derrota',
  'Convirtiendo (+1 gol)',
  'Convirtiendo (+2 goles)',
  'Convirtiendo (+3 goles)',
  'Con valla invicta',
]

const SHOOTOUT_TITLE = 'Con victoria (penales)'
const SHOOTOUT_KEY = 'most_penalty_shootout_wins_in_a_row'

const KNOCKOUT_TITLES = ['Invicto (eliminación)', 'Con victoria (eliminación)']

const KNOCKOUT_HELP = 'Partidos de eliminatoria (Playin / Playoffs)'

const TOURNAMENT_TITLES = [
  'Semis consecutivas',
  'Finales consecutivas',
  'Campeonatos consecutivos',
]

const TITLES_IN_ORDER = [
  ...MATCH_STREAK_TITLES,
  SHOOTOUT_TITLE,
  ...KNOCKOUT_TITLES,
  ...TOURNAMENT_TITLES,
]

const NEW_KEYS = [
  'most_knockout_wins_in_a_row',
  'most_knockout_unbeaten_in_a_row',
  'most_consecutive_semifinals',
  'most_consecutive_finals',
  'most_consecutive_titles',
]

const summary = (overrides) => ({
  id: 't2022',
  name: 'Superliga Europea 2022',
  phaseReached: 'champion',
  ongoing: false,
  closedAt: '2022-07-04T12:00:00',
  closedAtPrecision: 'exact',
  lastPlayedAt: '2022-07-04T12:00:00',
  lastPlayedAtPrecision: 'exact',
  ...overrides,
})

const tournamentStreak = (count, name, overrides = {}) => ({
  count,
  players: [
    {
      id: name.toLowerCase(),
      name,
      date: '2022-07-04T12:00:00',
      datePrecision: 'exact',
      isActive: false,
      startDate: '2020-06-01T12:00:00',
      startDatePrecision: 'exact',
      endDate: '2022-07-04T12:00:00',
      endDatePrecision: 'exact',
      startTournament: summary({ id: 't2020', name: 'Liga 2020' }),
      endTournament: summary(),
      breakTournament: summary({
        id: 't2023',
        name: 'Liga 2023',
        phaseReached: 'quarterfinal',
      }),
      ...overrides,
    },
  ],
})

const buildRecords = () => ({
  highest_scoring_difference_match: {
    diff: 7,
    match: {
      player1: 'Nico',
      team1: 'Racing',
      player2: 'Santi',
      team2: 'Boca',
      score: '7-0',
      tournament: 'Liga',
      date: null,
    },
  },
  highest_total_goals_match: null,
  // Desordenadas a propósito: manda la whitelist.
  most_clean_sheets_in_a_row: streak(3, 'Fede'),
  most_losses_in_a_row: streak(5, 'Juan'),
  most_wins_in_a_row: streak(9, 'Nico', { isActive: true, breakMatch: null }),
  most_unbeaten_in_a_row: streak(12, 'Nico'),
  most_draws_in_a_row: streak(1, 'Santi'),
  most_consecutive_matches_scoring_1_plus_goals: streak(20, 'Santi'),
  most_consecutive_matches_scoring_2_plus_goals: streak(6, 'Fede'),
  most_consecutive_matches_scoring_3_plus_goals: null,
  most_magic_in_a_row: streak(99, 'Desconocido'),
  // Desordenadas también.
  most_consecutive_titles: tournamentStreak(2, 'Nico'),
  most_knockout_unbeaten_in_a_row: streak(7, 'Santi'),
  most_consecutive_semifinals: tournamentStreak(4, 'Juan'),
  most_knockout_wins_in_a_row: streak(5, 'Nico'),
  most_consecutive_finals: null,
  // Tandas: el marcador empatado con la tanda entre paréntesis.
  most_penalty_shootout_wins_in_a_row: streak(3, 'Pedro', {
    startMatch: match({
      type: 'playoff',
      goalsFor: 1,
      goalsAgainst: 1,
      penalties: { won: true, goalsFor: 5, goalsAgainst: 4 },
    }),
    endMatch: match({
      date: '2026-09-20T12:00:00',
      type: 'playin',
      goalsFor: 0,
      goalsAgainst: 0,
      penalties: { won: true, goalsFor: 3, goalsAgainst: 2 },
    }),
    breakMatch: match({
      date: '2026-09-27T12:00:00',
      type: 'playoff',
      goalsFor: 2,
      goalsAgainst: 2,
      result: 'L',
      penalties: { won: false, goalsFor: 1, goalsAgainst: 3 },
    }),
  }),
})

const buildActiveStreaks = () => ({
  most_clean_sheets_in_a_row: null,
  most_losses_in_a_row: null,
  // Igual al récord: lleva el tag "Récord".
  most_wins_in_a_row: streak(9, 'Nico', { isActive: true, breakMatch: null }),
  most_unbeaten_in_a_row: streak(4, 'Fede', {
    isActive: true,
    breakMatch: null,
  }),
  most_draws_in_a_row: null,
  most_consecutive_matches_scoring_1_plus_goals: streak(3, 'Juan', {
    isActive: true,
    breakMatch: null,
  }),
  most_consecutive_matches_scoring_2_plus_goals: null,
  most_consecutive_matches_scoring_3_plus_goals: null,
  most_magic_in_a_row: streak(50, 'Desconocido', { isActive: true }),
  most_knockout_wins_in_a_row: streak(3, 'Pedro', {
    isActive: true,
    breakMatch: null,
  }),
  most_knockout_unbeaten_in_a_row: null,
  most_penalty_shootout_wins_in_a_row: null,
  // Igual al récord: lleva el tag "Récord".
  most_consecutive_titles: tournamentStreak(2, 'Nico', {
    isActive: true,
    breakTournament: null,
  }),
  most_consecutive_semifinals: tournamentStreak(2, 'Lucas', {
    isActive: true,
    breakTournament: null,
  }),
  most_consecutive_finals: null,
})

const withoutKeys = (section, keys) =>
  Object.fromEntries(
    Object.entries(section).filter(([key]) => !keys.includes(key)),
  )

let container

const render = (props) => {
  act(() => {
    ReactDOM.render(<RecordsTab {...props} />, container)
  })
}

const tab = (name) =>
  Array.from(container.querySelectorAll('[role="tab"]')).find(
    (node) => node.textContent === name,
  )
const panelOf = (tabNode) =>
  document.getElementById(tabNode.getAttribute('aria-controls'))
const cardTitles = (root) =>
  Array.from(root.querySelectorAll('h4')).map((node) => node.textContent)
const cardByTitle = (root, title) =>
  Array.from(root.querySelectorAll('h4')).find(
    (node) => node.textContent === title,
  ).parentElement
const press = (node, key) => {
  act(() => {
    node.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  })
}

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
})

test('récords de partidos se mantienen arriba de las rachas', () => {
  render({ records: buildRecords(), activeStreaks: buildActiveStreaks() })

  const text = container.textContent
  expect(text).toContain('Récords de Partidos')
  expect(text).toContain('Mayor diferencia de goles')
  expect(text).toContain('7-0')
  expect(text).not.toContain('Más goles en un partido')
  expect(text.indexOf('Récords de Partidos')).toBeLessThan(
    text.indexOf('Rachas históricas'),
  )
})

test('por defecto muestra "Rachas históricas"', () => {
  render({ records: buildRecords(), activeStreaks: buildActiveStreaks() })

  const tablist = container.querySelector('[role="tablist"]')
  expect(tablist.getAttribute('aria-label')).toBe('Tipo de rachas')
  const historicas = tab('Rachas históricas')
  const actuales = tab('Rachas actuales')
  expect(historicas.getAttribute('aria-selected')).toBe('true')
  expect(historicas.tabIndex).toBe(0)
  expect(actuales.getAttribute('aria-selected')).toBe('false')
  expect(actuales.tabIndex).toBe(-1)

  const panel = panelOf(historicas)
  expect(panel.getAttribute('role')).toBe('tabpanel')
  expect(panel.getAttribute('aria-labelledby')).toBe(historicas.id)
  expect(panel.hidden).toBe(false)
  expect(panelOf(actuales).hidden).toBe(true)
})

test('whitelist ordenada en una sola grilla, con tags de categoría', () => {
  render({ records: buildRecords(), activeStreaks: buildActiveStreaks() })

  const panel = panelOf(tab('Rachas históricas'))
  expect(cardTitles(panel)).toEqual(TITLES_IN_ORDER)
  expect(panel.textContent).not.toContain('Desconocido')
  expect(panel.textContent).not.toContain('99')
  // Sin secciones por grupo: las categorías son tags dentro de cada tarjeta.
  expect(panel.querySelectorAll('h3')).toHaveLength(0)
  expect(cardByTitle(panel, 'Con victoria').textContent).toContain('Resultados')
  expect(cardByTitle(panel, 'Convirtiendo (+2 goles)').textContent).toContain(
    'Goles',
  )
  expect(cardByTitle(panel, 'Con valla invicta').textContent).toContain(
    'Defensa',
  )
})

test('históricas: activa con aclaración, cerrada con corte, vacías < 2', () => {
  render({ records: buildRecords(), activeStreaks: buildActiveStreaks() })

  const panel = panelOf(tab('Rachas históricas'))
  const wins = cardByTitle(panel, 'Con victoria')
  expect(wins.textContent).toContain('Activa')
  expect(wins.textContent).toContain('Último')

  const unbeaten = cardByTitle(panel, 'Invicto (sin derrotas)')
  expect(unbeaten.textContent).not.toContain('Activa')
  expect(unbeaten.textContent).toContain('Fin')
  expect(
    unbeaten.querySelector('[aria-label^="Partido que cortó la racha"]'),
  ).not.toBeNull()

  // count 1 y null: estado vacío.
  expect(cardByTitle(panel, 'Con empate').textContent).toContain(
    'Sin racha registrada',
  )
  expect(cardByTitle(panel, 'Convirtiendo (+3 goles)').textContent).toContain(
    'Sin racha registrada',
  )
  expect(panel.textContent).not.toContain('Récord')
})

test('click y teclado cambian de pestaña', () => {
  render({ records: buildRecords(), activeStreaks: buildActiveStreaks() })

  const historicas = tab('Rachas históricas')
  const actuales = tab('Rachas actuales')

  act(() => {
    actuales.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  expect(actuales.getAttribute('aria-selected')).toBe('true')
  expect(panelOf(actuales).hidden).toBe(false)
  expect(panelOf(historicas).hidden).toBe(true)

  // Flechas con wrap, Home y End; el foco acompaña a la selección.
  press(actuales, 'ArrowRight')
  expect(historicas.getAttribute('aria-selected')).toBe('true')
  expect(document.activeElement).toBe(historicas)

  press(historicas, 'ArrowLeft')
  expect(actuales.getAttribute('aria-selected')).toBe('true')
  expect(document.activeElement).toBe(actuales)

  press(actuales, 'Home')
  expect(historicas.getAttribute('aria-selected')).toBe('true')

  press(historicas, 'End')
  expect(actuales.getAttribute('aria-selected')).toBe('true')
  expect(actuales.tabIndex).toBe(0)
  expect(historicas.tabIndex).toBe(-1)
})

test('actuales: mejor racha en curso, "Récord" si iguala, sin "Activa"', () => {
  render({ records: buildRecords(), activeStreaks: buildActiveStreaks() })

  const panel = panelOf(tab('Rachas actuales'))
  expect(cardTitles(panel)).toEqual(TITLES_IN_ORDER)
  expect(panel.textContent).not.toContain('Desconocido')
  expect(panel.textContent).not.toContain('Activa')

  const wins = cardByTitle(panel, 'Con victoria')
  expect(wins.textContent).toContain('Récord')
  expect(wins.textContent).toContain('Último')

  const unbeaten = cardByTitle(panel, 'Invicto (sin derrotas)')
  expect(unbeaten.textContent).toContain('Fede')
  expect(unbeaten.textContent).not.toContain('Récord')

  expect(cardByTitle(panel, 'Con empate').textContent).toContain(
    'Nadie en racha',
  )
  expect(cardByTitle(panel, 'Con valla invicta').textContent).toContain(
    'Nadie en racha',
  )
})

test('actuales filtra count < 2 aunque el BE lo mande', () => {
  const activeStreaks = buildActiveStreaks()
  activeStreaks.most_wins_in_a_row = streak(1, 'Nico', { isActive: true })
  render({ records: buildRecords(), activeStreaks })

  const panel = panelOf(tab('Rachas actuales'))
  const wins = cardByTitle(panel, 'Con victoria')
  expect(wins.textContent).toContain('Nadie en racha')
  expect(wins.textContent).not.toContain('Récord')
})

test('BE sin activeStreaks: sólo históricas, sin tabs', () => {
  render({ records: buildRecords() })

  expect(container.querySelector('[role="tablist"]')).toBeNull()
  expect(container.querySelector('[role="tabpanel"]')).toBeNull()
  expect(container.textContent).not.toContain('Rachas actuales')
  expect(container.textContent).not.toContain('Nadie en racha')
  expect(cardTitles(container)).toEqual(TITLES_IN_ORDER)
})

test('sin rachas: mensaje general', () => {
  render({ records: {}, activeStreaks: {} })

  expect(container.textContent).toContain(
    'Todavía no hay partidos cargados para calcular récords.',
  )
  expect(container.textContent).toContain('Todavía no hay rachas registradas.')
  expect(container.textContent).toContain('No hay rachas en curso.')
})

test('rachas nuevas al final de la whitelist, con sus tags y unidades', () => {
  render({ records: buildRecords(), activeStreaks: buildActiveStreaks() })

  for (const name of ['Rachas históricas', 'Rachas actuales']) {
    const panel = panelOf(tab(name))
    expect(cardTitles(panel)).toEqual(TITLES_IN_ORDER)

    const tags = Array.from(panel.querySelectorAll('h4')).map(
      (node) => node.previousElementSibling?.textContent,
    )
    expect(tags.slice(-6)).toEqual([
      'Penales',
      'Partidos de eliminación',
      'Partidos de eliminación',
      'Eliminatorias',
      'Eliminatorias',
      'Eliminatorias',
    ])
  }

  const historicas = panelOf(tab('Rachas históricas'))
  const knockout = cardByTitle(historicas, 'Con victoria (eliminación)')
  expect(knockout.textContent).toContain('5partidos')
  const semis = cardByTitle(historicas, 'Semis consecutivas')
  expect(semis.textContent).toContain('4torneos')
  expect(semis.textContent).toContain('Liga 2020')
  expect(semis.textContent).toContain('Liga 2023')
  expect(semis.textContent).toContain('Cuartos')
  expect(
    semis.querySelector('[aria-label^="Torneo que cortó la racha"]'),
  ).not.toBeNull()
  expect(cardByTitle(historicas, 'Finales consecutivas').textContent).toContain(
    'Sin racha registrada',
  )
})

test('actuales: "Récord" en una racha por torneo que iguala el récord', () => {
  render({ records: buildRecords(), activeStreaks: buildActiveStreaks() })

  const panel = panelOf(tab('Rachas actuales'))
  const titles = cardByTitle(panel, 'Campeonatos consecutivos')
  expect(titles.textContent).toContain('Récord')
  expect(titles.textContent).toContain('Último')
  expect(titles.textContent).not.toContain('Activa')

  const semis = cardByTitle(panel, 'Semis consecutivas')
  expect(semis.textContent).toContain('Lucas')
  expect(semis.textContent).not.toContain('Récord')

  expect(cardByTitle(panel, 'Invicto (eliminación)').textContent).toContain(
    'Nadie en racha',
  )
})

test('BE viejo sin las claves nuevas: no se renderizan sus tarjetas', () => {
  const missing = [SHOOTOUT_KEY, ...NEW_KEYS]
  render({
    records: withoutKeys(buildRecords(), missing),
    activeStreaks: withoutKeys(buildActiveStreaks(), missing),
  })

  for (const name of ['Rachas históricas', 'Rachas actuales']) {
    const panel = panelOf(tab(name))
    expect(cardTitles(panel)).toEqual(MATCH_STREAK_TITLES)
    expect(panel.textContent).not.toContain('Penales')
    expect(panel.textContent).not.toContain('Partidos de eliminación')
    expect(panel.textContent).not.toContain('Eliminatorias')
  }
})

test('BE sin la racha de penales: el resto sigue igual', () => {
  render({
    records: withoutKeys(buildRecords(), [SHOOTOUT_KEY]),
    activeStreaks: withoutKeys(buildActiveStreaks(), [SHOOTOUT_KEY]),
  })

  const panel = panelOf(tab('Rachas históricas'))
  expect(cardTitles(panel)).toEqual(
    TITLES_IN_ORDER.filter((title) => title !== SHOOTOUT_TITLE),
  )
})

test('sin rachas por torneo (falló su lectura): sólo las de partidos', () => {
  const tournamentKeys = NEW_KEYS.slice(2)
  render({
    records: withoutKeys(buildRecords(), tournamentKeys),
    activeStreaks: withoutKeys(buildActiveStreaks(), tournamentKeys),
  })

  const panel = panelOf(tab('Rachas históricas'))
  expect(cardTitles(panel)).toEqual([
    ...MATCH_STREAK_TITLES,
    SHOOTOUT_TITLE,
    ...KNOCKOUT_TITLES,
  ])
  expect(panel.textContent).not.toContain('Eliminatorias')
})

test('penales: después de "Con valla invicta", con la tanda entre paréntesis', () => {
  render({ records: buildRecords(), activeStreaks: buildActiveStreaks() })

  const historicas = panelOf(tab('Rachas históricas'))
  const titles = cardTitles(historicas)
  expect(titles.indexOf(SHOOTOUT_TITLE)).toBe(
    titles.indexOf('Con valla invicta') + 1,
  )

  const card = cardByTitle(historicas, SHOOTOUT_TITLE)
  expect(card.textContent).toContain('3partidos')
  expect(card.textContent).toContain('Pedro')
  const [start, cut] = card.querySelectorAll('[role="group"]')
  expect(start.textContent).toContain('1-1 (5-4)')
  expect(start.getAttribute('aria-label')).toContain('ganó 5 a 4 en penales')
  // La mini-card del corte conserva el label "Fin".
  expect(cut.textContent).toContain('Fin')
  expect(cut.textContent).toContain('2-2 (1-3)')
  expect(cut.getAttribute('aria-label')).toMatch(
    /^Partido que cortó la racha: .*perdió 1 a 3 en penales/,
  )

  const actuales = panelOf(tab('Rachas actuales'))
  expect(cardByTitle(actuales, SHOOTOUT_TITLE).textContent).toContain(
    'Nadie en racha',
  )
})

test('ayuda junto a "eliminación" en los títulos de partidos de eliminación', () => {
  render({ records: buildRecords(), activeStreaks: buildActiveStreaks() })

  const panel = panelOf(tab('Rachas históricas'))
  for (const title of KNOCKOUT_TITLES) {
    const heading = cardByTitle(panel, title).querySelector('h4')
    const help = heading.querySelectorAll('button')
    expect(help).toHaveLength(1)
    expect(help[0].getAttribute('type')).toBe('button')
    expect(help[0].getAttribute('aria-label')).toBe(KNOCKOUT_HELP)
    expect(help[0].tabIndex).toBe(0)
    // Pegado a la última palabra del título, que es "(eliminación)".
    expect(help[0].parentElement.textContent).toBe('(eliminación)')
  }

  // El resto de los títulos no lleva ayuda.
  const others = Array.from(panel.querySelectorAll('h4')).filter(
    (node) => !KNOCKOUT_TITLES.includes(node.textContent),
  )
  expect(others).toHaveLength(TITLES_IN_ORDER.length - KNOCKOUT_TITLES.length)
  for (const node of others) {
    expect(node.querySelector('button')).toBeNull()
  }
})

test('récord de partido con fecha no exacta muestra la etiqueta de precisión', () => {
  const records = buildRecords()
  records.highest_total_goals_match = {
    total: 11,
    match: {
      player1: 'Nico',
      team1: 'Racing',
      player2: 'Santi',
      team2: 'Boca',
      score: '6-5',
      tournament: 'Chempions',
      date: '2019-07-09T12:00:00',
      datePrecision: 'year',
    },
  }
  records.highest_scoring_difference_match.match.date = '2026-07-02T12:00:00'
  records.highest_scoring_difference_match.match.datePrecision = 'exact'
  render({ records, activeStreaks: buildActiveStreaks() })

  const text = container.textContent
  expect(text).toContain('Más goles en un partido')
  expect(text).toMatch(/Chempions\s*2019/)
  // Exacta: el formato de siempre.
  expect(text).toContain('02/07/2026')
})
