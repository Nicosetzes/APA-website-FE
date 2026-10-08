/* eslint-env jest */
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import ScoreBox from '.'

// Hora local para que el test no dependa de la zona horaria.
const local = (...args) => new Date(...args).toISOString()

const props = {
  result: 'w',
  playerP1: { id: 'p1', name: 'Nico' },
  teamP1: { id: 10, name: 'Boca' },
  scoreP1: 2,
  playerP2: { id: 'p2', name: 'Santi' },
  teamP2: { id: 11, name: 'River' },
  scoreP2: 1,
}

let container

beforeEach(() => {
  jest.useFakeTimers()
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
  jest.useRealTimers()
})

// Hover sobre la caja y espera el enterDelay del Tooltip de MUI.
const hover = (overrides) => {
  act(() => {
    ReactDOM.render(<ScoreBox {...props} {...overrides} />, container)
  })
  act(() => {
    container.firstChild.dispatchEvent(
      new MouseEvent('mouseover', { bubbles: true }),
    )
    jest.runAllTimers()
  })
  const tooltip = document.querySelector('[role="tooltip"]')
  return tooltip ? tooltip.textContent : ''
}

test('fecha exacta: DD/MM/YYYY HH:mm', () => {
  const text = hover({
    playedAt: local(2024, 6, 8, 21, 15, 42),
    datePrecision: 'exact',
  })

  expect(text).toContain('08/07/2024 21:15')
  expect(text).not.toMatch(/\b(AM|PM)\b|21:15:42/)
})

test('fecha no exacta: etiqueta de precisión sin hora', () => {
  const text = hover({
    playedAt: local(2019, 6, 9, 7, 0),
    datePrecision: 'year',
  })

  expect(text).toContain('2019')
  expect(text).not.toContain('07:00')
})

test('sin playedAt no muestra fecha, aunque llegue un texto `date`', () => {
  const text = hover({ playedAt: null, date: '7/8/2024, 9:15:42 PM' })

  expect(text).toContain('Boca')
  expect(text).not.toContain('9:15:42 PM')
})
