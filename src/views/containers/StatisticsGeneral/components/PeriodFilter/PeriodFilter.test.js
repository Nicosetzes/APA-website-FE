/* eslint-env jest */
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import PeriodFilter from '.'

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
  const handlers = { onShortcut: jest.fn(), onDateChange: jest.fn() }
  act(() => {
    ReactDOM.render(
      <PeriodFilter
        today="2026-10-27"
        slug="ultimo-anio"
        dateFrom="2025-10-27"
        dateTo="2026-10-27"
        {...handlers}
        {...props}
      />,
      container,
    )
  })
  return handlers
}
const shortcutButtons = () => [
  ...container.querySelectorAll('button[aria-pressed]'),
]
const click = (node) => {
  act(() => {
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
}

test('lists the shortcuts in order and marks the active one', () => {
  render()
  expect(shortcutButtons().map((node) => node.textContent)).toEqual([
    'Hoy',
    'Última semana',
    'Último mes',
    'Últimos 3 meses',
    'Últimos 6 meses',
    'Último año',
    'Todo el historial',
  ])
  expect(
    shortcutButtons()
      .filter((node) => node.getAttribute('aria-pressed') === 'true')
      .map((node) => node.textContent),
  ).toEqual(['Último año'])
})

test('clicking a shortcut reports its slug', () => {
  const { onShortcut } = render()
  const slugs = []
  shortcutButtons().forEach((node) => {
    click(node)
    slugs.push(onShortcut.mock.calls[onShortcut.mock.calls.length - 1][0])
  })
  expect(slugs).toEqual([
    'hoy',
    'ultima-semana',
    'ultimo-mes',
    'ultimos-3-meses',
    'ultimos-6-meses',
    'ultimo-anio',
    'todo',
  ])
})

test('the year select lists the years and reports the chosen one', () => {
  const { onShortcut } = render()
  const select = container.querySelector('select')
  expect([...select.options].map((option) => option.value)).toEqual([
    '',
    '2026',
    '2025',
    '2024',
    '2023',
    '2022',
    '2021',
    '2020',
    '2019',
  ])
  expect(select.value).toBe('')
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLSelectElement.prototype,
    'value',
  ).set
  act(() => {
    setter.call(select, '2024')
    select.dispatchEvent(new Event('change', { bubbles: true }))
  })
  expect(onShortcut).toHaveBeenCalledWith('2024')
})

test('a year shortcut is selected in the year select and no button is pressed', () => {
  render({ slug: '2025', dateFrom: '2025-01-01', dateTo: '2025-12-31' })
  expect(container.querySelector('select').value).toBe('2025')
  expect(
    shortcutButtons().filter(
      (node) => node.getAttribute('aria-pressed') === 'true',
    ),
  ).toHaveLength(0)
})

test('the oldest year (2019) can be the active year', () => {
  render({ slug: '2019', dateFrom: '2019-01-01', dateTo: '2019-12-31' })
  expect(container.querySelector('select').value).toBe('2019')
})

test('shows the effective range in the date fields', () => {
  render({ slug: null, dateFrom: '2026-01-05', dateTo: '2026-02-20' })
  expect(container.querySelector('#rating-dateFrom').value).toBe('05/01/2026')
  expect(container.querySelector('#rating-dateTo').value).toBe('20/02/2026')
  expect(container.textContent).toContain(
    'Mostrando del 05/01/2026 al 20/02/2026.',
  )
  expect(
    shortcutButtons().filter(
      (node) => node.getAttribute('aria-pressed') === 'true',
    ),
  ).toHaveLength(0)
})

test('typing a date reports the change with the YYYY-MM-DD value', () => {
  const { onDateChange } = render({
    slug: null,
    dateFrom: '2026-01-05',
    dateTo: '2026-02-20',
  })
  const input = container.querySelector('#rating-dateTo')
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  ).set
  act(() => {
    setter.call(input, '25/02/2026')
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
  expect(onDateChange).toHaveBeenCalledWith('dateTo', '2026-02-25')
})

const NOTE =
  'El período no aplica mientras hay un torneo elegido. Elegí un período para volver.'
const ERROR =
  'No se pudo cargar la lista de torneos; el filtro por torneo no está disponible.'
const pressed = () =>
  shortcutButtons().filter(
    (node) => node.getAttribute('aria-pressed') === 'true',
  )

test('by default it is not dimmed, has no tournament select and no notes', () => {
  render()
  expect(container.textContent).not.toContain('El período no aplica')
  expect(container.textContent).not.toContain('No se pudo cargar la lista')
  expect(container.querySelector('#tournament')).toBeNull()
  expect(container.textContent).toContain(
    'Mostrando del 27/10/2025 al 27/10/2026.',
  )
})

test('dimmed shows the explanation instead of the range and keeps everything clickable', () => {
  const { onShortcut, onDateChange } = render({
    dimmed: true,
    dimmedNote: NOTE,
    slug: '',
    dateFrom: '',
    dateTo: '',
  })
  expect(container.textContent).toContain(NOTE)
  expect(container.textContent).not.toContain('Mostrando del')
  expect(pressed()).toHaveLength(0)
  expect(container.querySelector('#rating-dateFrom').value).toBe('')
  expect(container.querySelector('#rating-dateTo').value).toBe('')
  expect(shortcutButtons().every((node) => !node.disabled)).toBe(true)
  expect(container.querySelector('select').disabled).toBe(false)
  click(shortcutButtons()[1])
  expect(onShortcut).toHaveBeenCalledWith('ultima-semana')
  expect(onDateChange).not.toHaveBeenCalled()
})

const stylesheet = () =>
  [...document.querySelectorAll('style')]
    .map((style) => style.textContent)
    .join('')
    .replace(/\s+/g, '')

test('dimmed lowers the opacity of the shortcuts and the period fields only', () => {
  render({
    dimmed: true,
    dimmedNote: NOTE,
    tournamentSelect: <select id="tournament" />,
  })
  const css = stylesheet()
  // Atajos: la fila lleva la opacidad.
  const row = container.querySelector('[role="group"]')
  const rowClass = [...row.classList].pop()
  expect(css).toMatch(new RegExp('\\.' + rowClass + '\\{[^}]*opacity:0.55'))
  // Campos: todos los hijos de la grilla menos la celda del torneo.
  expect(css).toMatch(/>\*:not\(\.[^)]+\)\{opacity:0\.55/)
  const cell = container.querySelector('#tournament').parentElement
  const notDimmed = css.match(/>\*:not\(\.([^)]+)\)\{opacity:0\.55/)[1]
  expect([...cell.classList]).toContain(notDimmed)
})

test('the tournament select is one more cell of the same grid as Año, Desde and Hasta', () => {
  render({ tournamentSelect: <select id="tournament" /> })
  const grid = container
    .querySelector('#rating-year')
    .closest('div').parentElement
  const cells = [...grid.children]
  expect(cells).toHaveLength(4)
  expect(cells[cells.length - 1]).toBe(
    container.querySelector('#tournament').parentElement,
  )
})

test('renders the tournament select node and the load error', () => {
  render({
    tournamentSelect: <select id="tournament" />,
    tournamentsError: ERROR,
  })
  expect(container.querySelector('#tournament')).not.toBeNull()
  expect(container.textContent).toContain(ERROR)
})
