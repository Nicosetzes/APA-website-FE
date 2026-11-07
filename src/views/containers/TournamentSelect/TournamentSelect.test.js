/* eslint-env jest */
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import TournamentSelect from '.'

const tournaments = [
  { _id: 't2', name: 'Copa APA' },
  { _id: 't1', name: 'Liga APA' },
]

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
  const onChange = jest.fn()
  act(() => {
    ReactDOM.render(
      <TournamentSelect
        id="torneo"
        label="Torneo"
        value="all"
        tournaments={tournaments}
        onChange={onChange}
        {...props}
      />,
      container,
    )
  })
  return onChange
}
const select = () => container.querySelector('select')
const options = () =>
  [...select().options].map((option) => [option.value, option.textContent])

test('lists "Todos los torneos" first and then the tournaments in the given order', () => {
  render()
  expect(options()).toEqual([
    ['all', 'Todos los torneos'],
    ['t2', 'Copa APA'],
    ['t1', 'Liga APA'],
  ])
})

test('is labelled and shows the current value', () => {
  render({ value: 't1' })
  const label = container.querySelector('label[for="torneo"]')
  expect(label.textContent).toBe('Torneo')
  expect(select().id).toBe('torneo')
  expect(select().value).toBe('t1')
})

test('reports the chosen value', () => {
  const onChange = render()
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLSelectElement.prototype,
    'value',
  ).set
  act(() => {
    setter.call(select(), 't2')
    select().dispatchEvent(new Event('change', { bubbles: true }))
  })
  expect(onChange).toHaveBeenCalledWith('t2')
})

test('extraOption adds a disabled, selected option for a value that is not listed', () => {
  render({ value: 'zzz', extraOption: 'Viejo (fuera de la lista)' })
  expect(options()).toEqual([
    ['all', 'Todos los torneos'],
    ['zzz', 'Viejo (fuera de la lista)'],
    ['t2', 'Copa APA'],
    ['t1', 'Liga APA'],
  ])
  expect(select().value).toBe('zzz')
  expect(select().options[1].disabled).toBe(true)
})

test('without extraOption there is no extra option', () => {
  render({ value: 'zzz' })
  expect(select().options).toHaveLength(3)
})

test('can be disabled', () => {
  render({ disabled: true })
  expect(select().disabled).toBe(true)
})

test('works with an empty list', () => {
  render({ tournaments: [] })
  expect(options()).toEqual([['all', 'Todos los torneos']])
})
