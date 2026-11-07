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
