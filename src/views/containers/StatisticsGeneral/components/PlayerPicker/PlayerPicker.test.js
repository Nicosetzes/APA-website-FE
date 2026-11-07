/* eslint-env jest */
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import PlayerPicker from '.'

const colors = new Map([
  ['a', '#111111'],
  ['b', '#222222'],
  ['c', '#333333'],
])
const three = [
  { id: 'a', name: 'Ana' },
  { id: 'b', name: 'Beto' },
  { id: 'c', name: 'Cami' },
]
const many = Array.from({ length: 10 }, (_, i) => ({
  id: `p${i}`,
  name: i === 4 ? 'Ángel' : `Jugador ${i}`,
}))

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
      <PlayerPicker
        players={three}
        colors={colors}
        selectedIds={['a', 'b', 'c']}
        onChange={() => {}}
        {...props}
      />,
      container,
    )
  })
}
const checkbox = (name) =>
  [...container.querySelectorAll('label')]
    .find((label) => label.textContent === name)
    .querySelector('input')
const button = (text) =>
  [...container.querySelectorAll('button')].find(
    (node) => node.textContent === text,
  )
const click = (node) => {
  act(() => {
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
}

test('shows one checkbox per player reflecting the selection', () => {
  render({ selectedIds: ['b'] })
  expect(checkbox('Ana').checked).toBe(false)
  expect(checkbox('Beto').checked).toBe(true)
  expect(checkbox('Cami').checked).toBe(false)
})

test('unchecking a player reports the remaining ids in list order', () => {
  const onChange = jest.fn()
  render({ onChange })
  click(checkbox('Beto'))
  expect(onChange).toHaveBeenCalledWith(['a', 'c'])
})

test('checking a player adds it keeping the list order', () => {
  const onChange = jest.fn()
  render({ selectedIds: ['c'], onChange })
  click(checkbox('Ana'))
  expect(onChange).toHaveBeenCalledWith(['a', 'c'])
})

test('Todos and Ninguno select everyone or nobody', () => {
  const onChange = jest.fn()
  render({ selectedIds: ['a'], onChange })
  click(button('Todos'))
  expect(onChange).toHaveBeenLastCalledWith(['a', 'b', 'c'])
  click(button('Ninguno'))
  expect(onChange).toHaveBeenLastCalledWith([])
})

test('has no search box with 8 players or fewer', () => {
  render()
  expect(container.querySelector('input[type="search"]')).toBeNull()
})

test('shows a search box with more than 8 players and filters by name', () => {
  render({
    players: many,
    selectedIds: many.map(({ id }) => id),
  })
  const search = container.querySelector('input[type="search"]')
  expect(search).not.toBeNull()
  expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(10)

  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  ).set
  act(() => {
    setter.call(search, 'angel')
    search.dispatchEvent(new Event('input', { bubbles: true }))
  })
  // Ignora mayúsculas y acentos.
  const labels = [...container.querySelectorAll('label')].map(
    (label) => label.textContent,
  )
  expect(labels).toEqual(['Ángel'])

  act(() => {
    setter.call(search, 'zzz')
    search.dispatchEvent(new Event('input', { bubbles: true }))
  })
  expect(container.textContent).toContain('No hay jugadores que coincidan')
})

test('searching does not change what Todos selects', () => {
  const onChange = jest.fn()
  render({ players: many, selectedIds: [], onChange })
  const search = container.querySelector('input[type="search"]')
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  ).set
  act(() => {
    setter.call(search, 'angel')
    search.dispatchEvent(new Event('input', { bubbles: true }))
  })
  click(button('Todos'))
  expect(onChange).toHaveBeenCalledWith(many.map(({ id }) => id))
})
