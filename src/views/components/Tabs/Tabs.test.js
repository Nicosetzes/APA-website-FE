/* eslint-env jest */
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import Tabs from '.'

const tabs = [
  { id: 'one', label: 'Uno', content: <p>contenido uno</p> },
  { id: 'two', label: 'Dos', content: <p>contenido dos</p> },
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
  act(() => {
    ReactDOM.render(<Tabs tabs={tabs} {...props} />, container)
  })
}
const click = (label) => {
  const button = [...container.querySelectorAll('button')].find(
    (node) => node.textContent === label,
  )
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
}

test('shows the first tab when there are no props', () => {
  render()
  expect(container.textContent).toContain('contenido uno')
  expect(container.textContent).not.toContain('contenido dos')
})

test('defaultTab sets the initial tab', () => {
  render({ defaultTab: 'two' })
  expect(container.textContent).toContain('contenido dos')
})

test('uncontrolled mode switches on click and reports it', () => {
  const onChange = jest.fn()
  render({ onChange })
  click('Dos')
  expect(container.textContent).toContain('contenido dos')
  expect(onChange).toHaveBeenCalledWith('two')
})

test('controlled mode calls onChange but does not switch by itself', () => {
  const onChange = jest.fn()
  render({ activeTab: 'one', defaultTab: 'two', onChange })
  expect(container.textContent).toContain('contenido uno')
  click('Dos')
  expect(onChange).toHaveBeenCalledWith('two')
  expect(container.textContent).toContain('contenido uno')
  render({ activeTab: 'two', onChange })
  expect(container.textContent).toContain('contenido dos')
})

test('an unknown activeTab does not break and shows no content', () => {
  render({ activeTab: 'nope' })
  expect(container.querySelectorAll('button')).toHaveLength(2)
  expect(container.textContent).not.toContain('contenido')
})
