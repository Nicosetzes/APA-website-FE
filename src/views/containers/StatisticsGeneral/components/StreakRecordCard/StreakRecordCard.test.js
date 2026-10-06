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
import StreakRecordCard from '.'

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
  endDate: '2026-09-20T12:00:00',
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
      <StreakRecordCard
        idPrefix="historicas"
        recordKey="most_wins_in_a_row"
        title="Con victoria"
        tone="positive"
        category="Resultados"
        record={record}
        {...props}
      />,
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

test.each([
  ['tanda sin registrar', { won: true, goalsFor: null, goalsAgainst: null }],
  ['BE viejo con sólo won', { won: false }],
])('penales sin resultado de la tanda (%s): "(pen.)"', (_, penalties) => {
  render({
    count: 9,
    players: [
      holder({
        endMatch: match({
          goalsFor: 2,
          goalsAgainst: 2,
          result: 'D',
          penalties,
        }),
      }),
    ],
  })

  const [, last] = container.querySelectorAll('[role="group"]')
  expect(last.textContent).toContain('2-2 (pen.)')
  expect(last.textContent).not.toContain('por penales')
  expect(last.getAttribute('aria-label')).toContain(
    '2 a 2 Santi, definido por penales',
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

test('BE sin breakMatch: racha cerrada cae a inicio y fin', () => {
  const legacy = holder({ isActive: false })
  delete legacy.breakMatch
  render({ count: 4, players: [legacy] })

  expect(labels()).toEqual(['Inicio', 'Fin'])
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

test('BE viejo: sólo valor y poseedores', () => {
  render({
    count: 5,
    players: [{ id: 'p1', name: 'Nico', date: '2026-09-20T12:00:00' }],
  })

  const text = container.textContent
  expect(text).toContain('5')
  expect(text).toContain('Nico')
  expect(text).not.toContain('Activa')
  expect(container.querySelector('time')).toBeNull()
  expect(container.querySelector('[role="group"]')).toBeNull()
})
