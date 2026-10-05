/* eslint-env jest */
import ReactDOM from 'react-dom'
import { act, Simulate } from 'react-dom/test-utils'
import { FormProvider, useForm } from 'react-hook-form'
import StepFormat from './steps/Format'
import StepPlayoffBracket from './steps/PlayoffBracket'

const FormatHarness = () => {
  const methods = useForm({
    defaultValues: {
      tournamentName: '',
      format: {},
      playoffMode: 'single',
      cloudinaryId: '',
    },
  })
  return (
    <FormProvider {...methods}>
      <StepFormat tournamentImages={[]} />
    </FormProvider>
  )
}

const BracketHarness = () => {
  const methods = useForm({
    defaultValues: {
      playoffMode: 'single',
      selectedPlayers: [],
      teamsData: [],
      playoffBracket: [],
    },
  })
  return (
    <FormProvider {...methods}>
      <StepPlayoffBracket players={[]} />
    </FormProvider>
  )
}

test('format selection does not show the playoff mode yet', () => {
  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(<FormatHarness />, container)
  })
  const title = [...container.querySelectorAll('div')].find(
    (node) => node.textContent === 'Playoffs',
  )
  act(() => Simulate.click(title))
  expect(container.querySelectorAll('[name="playoffMode"]')).toHaveLength(0)
  ReactDOM.unmountComponentAtNode(container)
})

test('broken tournament image is removed and valid one stays selectable', () => {
  const images = [
    { cloudinary_id: 'tournaments/gone', url: 'http://localhost/gone.jpg' },
    { cloudinary_id: 'tournaments/ok', url: 'http://localhost/ok.jpg' },
  ]
  let values
  const Harness = () => {
    const methods = useForm({
      defaultValues: { tournamentName: '', format: {}, cloudinaryId: '' },
    })
    values = methods.watch
    return (
      <FormProvider {...methods}>
        <StepFormat tournamentImages={images} />
      </FormProvider>
    )
  }
  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(<Harness />, container)
  })
  const tournamentImgs = () =>
    [...container.querySelectorAll('img')].filter(
      (img) => img.alt === 'Imagen de torneo',
    )
  expect(tournamentImgs()).toHaveLength(2)
  act(() => Simulate.error(tournamentImgs()[0]))
  expect(tournamentImgs()).toHaveLength(1)
  expect(tournamentImgs()[0].src).toBe('http://localhost/ok.jpg')
  act(() => Simulate.click(tournamentImgs()[0].parentElement))
  expect(values('cloudinaryId')).toBe('tournaments/ok')
  ReactDOM.unmountComponentAtNode(container)
})

test('selected tournament image that breaks clears the selection', () => {
  const images = [
    { cloudinary_id: 'tournaments/gone', url: 'http://localhost/gone.jpg' },
    { cloudinary_id: 'tournaments/ok', url: 'http://localhost/ok.jpg' },
  ]
  let values
  const Harness = () => {
    const methods = useForm({
      defaultValues: {
        tournamentName: '',
        format: {},
        cloudinaryId: 'tournaments/gone',
      },
    })
    values = methods.watch
    return (
      <FormProvider {...methods}>
        <StepFormat tournamentImages={images} />
      </FormProvider>
    )
  }
  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(<Harness />, container)
  })
  const tournamentImgs = () =>
    [...container.querySelectorAll('img')].filter(
      (img) => img.alt === 'Imagen de torneo',
    )
  act(() => Simulate.error(tournamentImgs()[0]))
  expect(tournamentImgs()).toHaveLength(1)
  expect(values('cloudinaryId')).toBe('')
  ReactDOM.unmountComponentAtNode(container)
})

test('slot assignment step shows exactly two modes defaulting to single', () => {
  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(<BracketHarness />, container)
  })
  const radios = container.querySelectorAll('[name="playoffMode"]')
  expect(radios).toHaveLength(2)
  expect(radios[0].value).toBe('single')
  expect(radios[0].checked).toBe(true)
  expect(radios[1].value).toBe('two_legged')
  ReactDOM.unmountComponentAtNode(container)
})
