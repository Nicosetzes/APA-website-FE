/* eslint-env jest */
// Las fechas salen de utils/dates (JS puro): no hace falta mockear date-fns.
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import StreakTournamentSummary, { PHASE_LABELS } from '.'

const tournament = (overrides) => ({
  id: 't1',
  name: 'Superliga Europea 2022',
  phaseReached: 'champion',
  ongoing: false,
  closedAt: '2022-07-04T12:00:00',
  closedAtPrecision: 'exact',
  lastPlayedAt: '2022-07-04T12:00:00',
  lastPlayedAtPrecision: 'exact',
  ...overrides,
})

let container

const render = (props) => {
  act(() => {
    ReactDOM.render(
      <StreakTournamentSummary
        label="Inicio"
        description="Torneo de inicio"
        holderName="Nico"
        {...props}
      />,
      container,
    )
  })
}

const group = () => container.querySelector('[role="group"]')

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
})

test.each(Object.entries(PHASE_LABELS))(
  'fase %s en texto: "%s"',
  (phaseReached, label) => {
    render({ tournament: tournament({ phaseReached }) })
    expect(group().textContent).toContain(label)
    expect(group().getAttribute('aria-label')).toContain(`, ${label},`)
  },
)

test('torneo cerrado: nombre, fase, fecha exacta y aria-label completo', () => {
  render({ tournament: tournament() })

  const text = group().textContent
  expect(text).toContain('Inicio')
  expect(text).toContain('Superliga Europea 2022')
  expect(text).toContain('Campeón')
  expect(text).toContain('04/07/2022')
  expect(group().querySelector('strong').textContent).toBe(
    'Superliga Europea 2022',
  )
  expect(group().querySelector('time').getAttribute('dateTime')).toBe(
    '2022-07-04T12:00:00',
  )
  expect(group().getAttribute('aria-label')).toBe(
    'Torneo de inicio: Nico, Superliga Europea 2022, Campeón, 4 de julio de 2022',
  )
})

test('fecha no exacta: etiqueta de precisión', () => {
  render({
    tournament: tournament({
      closedAt: '2019-07-09T12:00:00',
      closedAtPrecision: 'year',
    }),
  })

  expect(group().querySelector('time').textContent).toBe('2019')
  expect(group().getAttribute('aria-label')).toMatch(/, 2019$/)
})

test('en curso: "En curso" en lugar de la fecha', () => {
  render({
    label: 'Fin',
    description: 'Torneo que cortó la racha',
    isBreak: true,
    tournament: tournament({
      ongoing: true,
      phaseReached: 'quarterfinal',
      closedAt: null,
      closedAtPrecision: null,
    }),
  })

  const text = group().textContent
  expect(text).toContain('Fin')
  expect(text).toContain('Cuartos')
  expect(text).toContain('En curso')
  expect(group().querySelector('time')).toBeNull()
  expect(group().getAttribute('aria-label')).toBe(
    'Torneo que cortó la racha: Nico, Superliga Europea 2022, Cuartos, en curso',
  )
})

test('sin fecha: "sin fecha"; sin nombre: "Torneo sin nombre"', () => {
  render({
    tournament: tournament({ name: null, closedAt: null }),
  })

  const text = group().textContent
  expect(text).toContain('Torneo sin nombre')
  expect(text).toContain('sin fecha')
  expect(group().getAttribute('aria-label')).toBe(
    'Torneo de inicio: Nico, Torneo sin nombre, Campeón, sin fecha registrada',
  )
})

test('fase desconocida: se omite', () => {
  render({ tournament: tournament({ phaseReached: 'group_stage' }) })

  expect(group().textContent).not.toContain('group_stage')
  expect(group().getAttribute('aria-label')).toBe(
    'Torneo de inicio: Nico, Superliga Europea 2022, 4 de julio de 2022',
  )
})

test('sin torneo no renderiza nada', () => {
  render({ tournament: null })
  expect(container.innerHTML).toBe('')
})
