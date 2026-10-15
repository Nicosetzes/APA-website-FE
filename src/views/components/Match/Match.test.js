/* eslint-env jest */
jest.mock('api', () => ({ api: 'http://api', database: 'http://db' }))
jest.mock('api/axiosConfig', () => ({ apiClient: { put: jest.fn() } }))
jest.mock('utils/notifications', () => ({
  confirmDialog: jest.fn(),
  toast: { error: jest.fn(), success: jest.fn() },
}))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import Match from '.'

// Hora local para que el test no dependa de la zona horaria.
const local = (...args) => new Date(...args).toISOString()

const match = (overrides) => ({
  _id: 'm1',
  createdAt: local(2024, 6, 1, 10, 0),
  playedAt: local(2024, 6, 8, 21, 15, 42),
  playedAtPrecision: 'exact',
  group: 'A',
  played: true,
  playerP1: { id: 'p1', name: 'Nico' },
  playerP2: { id: 'p2', name: 'Santi' },
  teamP1: { id: 10, name: 'Boca' },
  teamP2: { id: 11, name: 'River' },
  scoreP1: 1,
  scoreP2: 0,
  ...overrides,
})

let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
})

const render = (props) => {
  act(() => {
    ReactDOM.render(
      <MemoryRouter>
        <Match canMutate={false} getFixtureData={jest.fn()} {...props} />
      </MemoryRouter>,
      container,
    )
  })
}

test('muestra la fecha del partido como DD/MM/YYYY HH:mm (24h, sin segundos)', () => {
  render({ match: match() })

  expect(container.textContent).toContain('08/07/2024 21:15')
  expect(container.textContent).not.toMatch(/\b(AM|PM)\b|21:15:42/)
})

test('partido sin jugar: mensaje en lugar de la fecha', () => {
  render({ match: match({ played: false }) })

  expect(container.textContent).toContain('El partido aún no se ha jugado')
})

test('muestra playedAt y no la última edición (updatedAt)', () => {
  render({
    match: match({
      playedAt: local(2024, 6, 8, 21, 15),
      playedAtPrecision: 'exact',
      updatedAt: local(2024, 9, 3, 18, 40),
    }),
  })

  expect(container.textContent).toContain('08/07/2024 21:15')
  expect(container.textContent).not.toContain('03/10/2024')
})

test('sin playedAt no cae a updatedAt: mensaje de no jugado', () => {
  render({
    match: match({
      playedAt: undefined,
      playedAtPrecision: undefined,
      updatedAt: local(2024, 9, 3, 18, 40),
    }),
  })

  expect(container.textContent).toContain('El partido aún no se ha jugado')
  expect(container.textContent).not.toContain('03/10/2024')
})

test('partidos jugados por equipo: compara ids numéricos', () => {
  render({
    match: match(),
    teamStats: [
      { teamId: 10, playedMatches: 3, totalMatches: 6 },
      { teamId: 11, playedMatches: 2, totalMatches: 6 },
    ],
  })

  expect(container.textContent).toContain('3/6')
  expect(container.textContent).toContain('2/6')
})

test('fecha aproximada: sin hora', () => {
  render({
    match: match({
      playedAt: local(2019, 6, 9, 7, 0),
      playedAtPrecision: 'year',
    }),
  })

  expect(container.textContent).toContain('2019')
  expect(container.textContent).not.toContain('07:00')
})

const OUTCOMES = {
  kind: 'outcomes',
  p1Win: 0.441,
  draw: 0.218,
  p2Win: 0.341,
  basis: 'current',
  teamAdjusted: true,
  provisional: false,
  ratingVersion: '2.0',
  drawModelVersion: 'draw-1',
}

const chipsOf = (root) => Array.from(root.querySelectorAll('[data-outcome]'))
const chipOf = (root, outcome) =>
  root.querySelector(`[data-outcome="${outcome}"]`)

test('chips de resultados: se muestran en un partido pendiente y en uno jugado', () => {
  render({
    match: match({
      played: false,
      scoreP1: null,
      scoreP2: null,
      prediction: OUTCOMES,
    }),
  })
  expect(chipsOf(container)).toHaveLength(3)
  ReactDOM.unmountComponentAtNode(container)

  render({ match: match({ prediction: OUTCOMES }) })
  expect(chipsOf(container)).toHaveLength(3)
})

test('chips de resultados: texto y aria-label en español con nombres y porcentajes', () => {
  render({ match: match({ prediction: OUTCOMES }) })

  expect(chipOf(container, 'p1Win').textContent).toBe('V 44%')
  expect(chipOf(container, 'draw').textContent).toBe('E 22%')
  expect(chipOf(container, 'p2Win').textContent).toBe('V 34%')
  expect(chipOf(container, 'p1Win').getAttribute('aria-label')).toBe(
    'Probabilidad de que gane Nico: 44%',
  )
  expect(chipOf(container, 'draw').getAttribute('aria-label')).toBe(
    'Probabilidad de empate: 22%',
  )
  expect(chipOf(container, 'p2Win').getAttribute('aria-label')).toBe(
    'Probabilidad de que gane Santi: 34%',
  )
})

test('chips de resultados: usa el equipo si falta el nombre del jugador', () => {
  render({
    match: match({
      playerP1: { id: 'p1' },
      playerP2: { id: 'p2', name: undefined },
      prediction: OUTCOMES,
    }),
  })

  expect(chipOf(container, 'p1Win').getAttribute('aria-label')).toBe(
    'Probabilidad de que gane Boca: 44%',
  )
  expect(chipOf(container, 'p2Win').getAttribute('aria-label')).toBe(
    'Probabilidad de que gane River: 34%',
  )
})

test('chips de resultados: los tres forman una sola fila entre el marcador y la fecha', () => {
  render({ match: match({ prediction: OUTCOMES }), canMutate: true })

  const form = container.querySelector('form')
  const chips = chipsOf(container)
  // Orden: gana P1, empate, gana P2, todos en la misma fila (mismo contenedor).
  expect(chips.map((chip) => chip.dataset.outcome)).toEqual([
    'p1Win',
    'draw',
    'p2Win',
  ])
  const row = chips[0].parentElement.parentElement
  chips.forEach((chip) => expect(chip.parentElement.parentElement).toBe(row))
  expect(row.children).toHaveLength(3)

  // La fila es hijo directo de la tarjeta: después de MatchView y antes de la
  // fecha. No está dentro de las columnas de los jugadores ni del marcador.
  const view = form.querySelector('[name="scoreP1"]').closest('form > div')
  const date = Array.from(form.children).find((child) =>
    child.textContent.includes('08/07/2024'),
  )
  const follows = (a, b) =>
    Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
  expect(row.parentElement).toBe(form)
  expect(view.contains(row)).toBe(false)
  expect(follows(view, row)).toBe(true)
  expect(follows(row, date)).toBe(true)
})

const expectTooltips = (root) => {
  expect(chipOf(root, 'p1Win').getAttribute('title')).toBe(
    'Prob. de victoria (Rating APA 2.0)',
  )
  expect(chipOf(root, 'p2Win').getAttribute('title')).toBe(
    'Prob. de victoria (Rating APA 2.0)',
  )
  expect(chipOf(root, 'draw').getAttribute('title')).toBe(
    'Prob. de empate (Rating APA 2.0)',
  )
}

test('chips de resultados: tooltip de victoria en los costados y de empate al medio, pendiente o jugado', () => {
  render({
    match: match({
      played: false,
      scoreP1: null,
      scoreP2: null,
      prediction: OUTCOMES,
    }),
  })
  expectTooltips(container)
  ReactDOM.unmountComponentAtNode(container)

  render({ match: match({ prediction: OUTCOMES }) })
  expectTooltips(container)
})

test('chips de resultados: marca solo al ganador que tenía menos probabilidad', () => {
  render({
    match: match({
      scoreP1: 0,
      scoreP2: 1,
      prediction: { ...OUTCOMES, p1Win: 0.6, draw: 0.2, p2Win: 0.2 },
    }),
  })

  expect(
    chipsOf(container).map((chip) => chip.hasAttribute('data-upset')),
  ).toEqual([false, false, true])
  expect(chipOf(container, 'p2Win').getAttribute('aria-label')).toBe(
    'Probabilidad de que gane Santi: 20%. Ganó quien tenía menos probabilidad.',
  )
  // El tooltip no cambia: el aviso se marca con el color (y en el aria-label).
  expectTooltips(container)
})

test('chips de resultados: sin marca si gana el favorito o si empatan', () => {
  const prediction = { ...OUTCOMES, p1Win: 0.6, draw: 0.2, p2Win: 0.2 }
  for (const [scoreP1, scoreP2] of [
    [2, 0],
    [1, 1],
  ]) {
    render({ match: match({ scoreP1, scoreP2, prediction }) })
    expect(container.querySelector('[data-upset]')).toBeNull()
    chipsOf(container).forEach((chip) => {
      expect(chip.getAttribute('aria-label')).not.toContain('Ganó')
    })
    ReactDOM.unmountComponentAtNode(container)
  }
})

test('chips de resultados: sin marca en un partido pendiente', () => {
  render({
    match: match({
      played: false,
      scoreP1: null,
      scoreP2: null,
      prediction: OUTCOMES,
    }),
  })

  expect(container.querySelector('[data-upset]')).toBeNull()
})

test('chips de resultados: no renderiza nada sin una predicción de resultados válida', () => {
  const legacy = { p1: 0.6, p2: 0.4, basis: 'current', ratingVersion: '2.0' }
  const garbage = [
    null,
    undefined,
    legacy,
    {},
    'x',
    { ...OUTCOMES, p1Win: 'x' },
    { ...OUTCOMES, p1Win: 1, draw: 0, p2Win: 0 },
  ]
  for (const prediction of garbage) {
    render({ match: match({ prediction }) })
    expect(chipsOf(container)).toHaveLength(0)
    ReactDOM.unmountComponentAtNode(container)
  }
})

test('chips de resultados: el DOM es idéntico sin predicción, nula o legacy', () => {
  const html = (overrides) => {
    render({ match: match(overrides) })
    const result = container.innerHTML
    ReactDOM.unmountComponentAtNode(container)
    return result
  }
  const without = html()

  expect(html({ prediction: null })).toBe(without)
  expect(html({ prediction: undefined })).toBe(without)
  expect(html({ prediction: { p1: 0.6, p2: 0.4 } })).toBe(without)
  expect(html({ prediction: { ...OUTCOMES, kind: 'advance' } })).toBe(without)
  // Con predicción solo se agregan los chips: el resto no cambia.
  expect(html({ prediction: OUTCOMES })).not.toBe(without)
})

test('chips de resultados: conserva inputs, logos, fecha y botones', () => {
  render({ match: match({ prediction: OUTCOMES }), canMutate: true })

  expect(container.querySelector('[name="scoreP1"]')).not.toBeNull()
  expect(container.querySelector('[name="scoreP2"]')).not.toBeNull()
  expect(container.querySelectorAll('img')).toHaveLength(2)
  expect(container.textContent).toContain('08/07/2024 21:15')
  expect(container.querySelector('button[aria-label="edit"]')).not.toBeNull()
  expect(container.querySelector('button[aria-label="delete"]')).not.toBeNull()
})
