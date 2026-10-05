/* eslint-env jest */
jest.mock('views/components', () => ({ Loader: () => null }))
jest.mock('api/axiosConfig', () => ({ apiClient: { put: jest.fn() } }))
jest.mock('utils/notifications', () => ({
  confirmDialog: jest.fn(() => Promise.resolve(true)),
  toast: { success: jest.fn(), apiError: jest.fn(), error: jest.fn() },
}))

import ReactDOM from 'react-dom'
import { act, Simulate } from 'react-dom/test-utils'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { apiClient } from 'api/axiosConfig'
import { confirmDialog, toast } from 'utils/notifications'
import PlayoffMatch from '.'

const ref = (id, name) => ({ id, name })
const baseProps = {
  canMutate: true,
  canDelete: true,
  id: 'match',
  playerP1: ref('p1', 'Nico'),
  teamP1: ref('a', 'Boca'),
  seedP1: '1A',
  playerP2: ref('p2', 'Santi'),
  teamP2: ref('b', 'River'),
  seedP2: '1B',
  played: false,
  getData: jest.fn(() => Promise.resolve()),
  series: { revision: 4, aggregate: [] },
}

const renderMatch = (container, props) =>
  act(() => {
    ReactDOM.render(
      <MemoryRouter initialEntries={['/tournaments/t']}>
        <Routes>
          <Route
            path="/tournaments/:tournament"
            element={<PlayoffMatch {...baseProps} {...props} />}
          />
        </Routes>
      </MemoryRouter>,
      container,
    )
  })

beforeEach(() => {
  jest.clearAllMocks()
  confirmDialog.mockResolvedValue(true)
})

test('shows penalties only for tied decisive matches and sends revision', async () => {
  apiClient.put.mockResolvedValue({ data: {} })
  const container = document.createElement('div')
  renderMatch(container, { leg: 3, legLabel: 'Desempate' })
  const scoreP1 = container.querySelector('[name="scoreP1"]')
  const scoreP2 = container.querySelector('[name="scoreP2"]')
  act(() => {
    Simulate.change(scoreP1, { target: { name: 'scoreP1', value: '1' } })
    Simulate.change(scoreP2, { target: { name: 'scoreP2', value: '1' } })
  })
  expect(container.querySelector('[name="penaltyScoreP1"]')).not.toBeNull()
  act(() => {
    Simulate.change(container.querySelector('[name="penaltyScoreP1"]'), {
      target: { name: 'penaltyScoreP1', value: '5' },
    })
    Simulate.change(container.querySelector('[name="penaltyScoreP2"]'), {
      target: { name: 'penaltyScoreP2', value: '4' },
    })
  })
  await act(async () => {
    Simulate.click(container.querySelector('.match__confirmation button'))
  })
  expect(apiClient.put.mock.calls[0][1].expectedSeriesRevision).toBe(4)
  expect(container.textContent).not.toContain('Desempate')
  expect(container.textContent).not.toContain('Ganador de la serie')
  ReactDOM.unmountComponentAtNode(container)
})

test('omits hidden penalties after a decisive score stops being tied', async () => {
  apiClient.put.mockResolvedValue({ data: {} })
  const container = document.createElement('div')
  renderMatch(container, { leg: 3, legLabel: 'Desempate' })

  act(() => {
    Simulate.change(container.querySelector('[name="scoreP1"]'), {
      target: { name: 'scoreP1', value: '1' },
    })
    Simulate.change(container.querySelector('[name="scoreP2"]'), {
      target: { name: 'scoreP2', value: '1' },
    })
  })
  act(() => {
    Simulate.change(container.querySelector('[name="penaltyScoreP1"]'), {
      target: { name: 'penaltyScoreP1', value: '5' },
    })
    Simulate.change(container.querySelector('[name="penaltyScoreP2"]'), {
      target: { name: 'penaltyScoreP2', value: '4' },
    })
    Simulate.change(container.querySelector('[name="scoreP2"]'), {
      target: { name: 'scoreP2', value: '0' },
    })
  })

  expect(container.querySelector('[name="penaltyScoreP1"]')).toBeNull()
  await act(async () => {
    Simulate.click(
      container.querySelector('[aria-label="Confirmar resultado"]'),
    )
  })
  expect(apiClient.put.mock.calls.at(-1)[1]).not.toHaveProperty(
    'penaltyScoreP1',
  )
  expect(apiClient.put.mock.calls.at(-1)[1]).not.toHaveProperty(
    'penaltyScoreP2',
  )
  ReactDOM.unmountComponentAtNode(container)
})

test('disables leg two until leg one is played without explanatory copy', () => {
  const container = document.createElement('div')
  renderMatch(container, {
    leg: 2,
    legLabel: 'Vuelta',
    isSeriesLeg: true,
    series: { ...baseProps.series, status: 'awaiting_leg1' },
  })
  expect(container.querySelector('[name="scoreP1"]').disabled).toBe(true)
  expect(container.textContent).not.toContain('La ida debe jugarse')
  ReactDOM.unmountComponentAtNode(container)

  renderMatch(container, { seedP2: null })
  expect(container.querySelector('[name="scoreP1"]')).toBeNull()
  expect(container.textContent).not.toContain('unidades competidoras completas')
  ReactDOM.unmountComponentAtNode(container)
})

test('keeps locked deletion visible and disabled without explanatory copy', () => {
  const container = document.createElement('div')
  renderMatch(container, {
    played: true,
    scoreP1: 1,
    scoreP2: 0,
    outcome: {},
    mutation: {
      canEditResult: false,
      canDeleteResult: false,
      reason: 'series_advanced',
    },
  })
  expect(
    container.querySelector('button[aria-label="Eliminar resultado"]').disabled,
  ).toBe(true)
  expect(container.textContent).not.toContain('intervención administrativa')
  ReactDOM.unmountComponentAtNode(container)
})

test('awaits conflict refresh before showing the error', async () => {
  const order = []
  apiClient.put.mockRejectedValue({ response: { status: 409 } })
  toast.apiError.mockImplementation(() => order.push('toast'))
  const getData = jest.fn(async () => order.push('refresh'))
  const container = document.createElement('div')
  renderMatch(container, { getData })
  act(() => {
    Simulate.change(container.querySelector('[name="scoreP1"]'), {
      target: { name: 'scoreP1', value: '2' },
    })
    Simulate.change(container.querySelector('[name="scoreP2"]'), {
      target: { name: 'scoreP2', value: '1' },
    })
  })
  await act(async () => {
    Simulate.click(
      container.querySelector('[aria-label="Confirmar resultado"]'),
    )
  })
  expect(order).toEqual(['refresh', 'toast'])
  ReactDOM.unmountComponentAtNode(container)
})

test('confirms destructive result removal before sending it', async () => {
  apiClient.put.mockResolvedValue({ data: {} })
  confirmDialog.mockResolvedValue(false)
  const container = document.createElement('div')
  renderMatch(container, {
    played: true,
    scoreP1: 1,
    scoreP2: 0,
    outcome: {},
  })
  const deleteButton = container.querySelector(
    'button[aria-label="Eliminar resultado"]',
  )
  expect(deleteButton.disabled).toBe(false)
  expect(deleteButton.closest('.match__deletion')).not.toBeNull()
  await act(async () => {
    Simulate.click(deleteButton)
    await Promise.resolve()
  })
  expect(confirmDialog).toHaveBeenCalledWith(
    expect.objectContaining({ danger: true }),
  )
  expect(apiClient.put).not.toHaveBeenCalled()
  ReactDOM.unmountComponentAtNode(container)
})

test('renders penalty scores as compact superscripts inside each team score', () => {
  const container = document.createElement('div')
  renderMatch(container, {
    played: true,
    scoreP1: 1,
    scoreP2: 1,
    outcome: {
      penalties: true,
      teamThatWon: baseProps.teamP1,
      scoreFromTeamThatWon: 5,
      scoreFromTeamThatLost: 4,
    },
  })

  const teamScores = container.querySelectorAll('.team-score')
  expect(teamScores).toHaveLength(2)
  expect(teamScores[0].textContent).toBe('15')
  expect(teamScores[1].textContent).toBe('14')
  expect(teamScores[0].querySelector('sup.penalty-score').textContent).toBe('5')
  expect(teamScores[1].querySelector('sup.penalty-score').textContent).toBe('4')
  expect(container.querySelector('.team-penalties')).toBeNull()
  ReactDOM.unmountComponentAtNode(container)
})
