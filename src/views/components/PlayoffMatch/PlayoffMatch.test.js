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
  teamP1: ref(1, 'Boca'),
  seedP1: '1A',
  playerP2: ref('p2', 'Santi'),
  teamP2: ref(2, 'River'),
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

test('marks the series winner from a numeric winnerTeamId', () => {
  const container = document.createElement('div')
  renderMatch(container, {
    played: true,
    scoreP1: 0,
    scoreP2: 2,
    outcome: {},
    series: { ...baseProps.series, status: 'decided', winnerTeamId: 2 },
  })

  const rows = container.querySelectorAll('[data-series-winner="true"]')
  expect(rows).toHaveLength(1)
  expect(rows[0].textContent).toContain('River')
  ReactDOM.unmountComponentAtNode(container)

  renderMatch(container, {
    series: { ...baseProps.series, winnerTeamId: null },
  })
  expect(container.querySelector('[data-series-winner="true"]')).toBeNull()
  ReactDOM.unmountComponentAtNode(container)
})

test('shows the W/O badge only next to the numeric winner of an invalid match', () => {
  const container = document.createElement('div')
  renderMatch(container, {
    played: true,
    valid: false,
    outcome: { teamThatWon: ref(2, 'River') },
  })

  const teamScores = container.querySelectorAll('.team-score')
  expect(teamScores[0].querySelector('.team-walkover')).toBeNull()
  expect(teamScores[1].querySelector('.team-walkover')).not.toBeNull()
  ReactDOM.unmountComponentAtNode(container)

  // Sin equipo cargado no hay ganador que marcar.
  renderMatch(container, {
    played: true,
    valid: false,
    teamP1: { name: 'Boca' },
    outcome: { teamThatWon: {} },
  })
  expect(container.querySelector('.team-walkover')).toBeNull()
  ReactDOM.unmountComponentAtNode(container)
})

const PREDICTION = {
  p1: 0.623,
  p2: 0.377,
  basis: 'current',
  teamAdjusted: true,
  provisional: false,
  ratingVersion: '2.0',
}

const chipsOf = (container) =>
  Array.from(container.querySelectorAll('.team-prediction'))

test('shows one prediction chip per row with an accessible label', () => {
  const container = document.createElement('div')
  renderMatch(container, { prediction: PREDICTION })

  const chips = chipsOf(container)
  expect(chips.map((chip) => chip.textContent)).toEqual(['62%', '38%'])
  expect(chips[0].getAttribute('aria-label')).toBe('Probabilidad de éxito 62%')
  expect(chips[1].getAttribute('aria-label')).toBe('Probabilidad de éxito 38%')
  // Una por fila, cada una dentro de su equipo.
  const rows = container.querySelectorAll('.container__team')
  expect(rows[0].contains(chips[0])).toBe(true)
  expect(rows[1].contains(chips[1])).toBe(true)
  ReactDOM.unmountComponentAtNode(container)
})

test('renders no chip when the prediction is null or missing', () => {
  const container = document.createElement('div')
  for (const prediction of [null, undefined, {}, { p1: 'x' }]) {
    renderMatch(container, { prediction })
    expect(chipsOf(container)).toHaveLength(0)
    ReactDOM.unmountComponentAtNode(container)
  }
})

test('renders no chip for an invalid (SIM or W/O) played match', () => {
  const container = document.createElement('div')
  renderMatch(container, {
    prediction: PREDICTION,
    played: true,
    valid: false,
    outcome: { teamThatWon: ref(2, 'River') },
  })
  expect(chipsOf(container)).toHaveLength(0)
  ReactDOM.unmountComponentAtNode(container)
})

test('puts the chip between the team name and the score on both sides', () => {
  const container = document.createElement('div')
  for (const side of ['left', 'right']) {
    renderMatch(container, {
      prediction: PREDICTION,
      side,
      played: true,
      scoreP1: 1,
      scoreP2: 0,
      outcome: { teamThatWon: ref(1, 'Boca') },
    })
    expect(chipsOf(container)).toHaveLength(2)
    container.querySelectorAll('.container__team').forEach((row) => {
      const classes = Array.from(row.children).map((child) => child.className)
      const name = classes.indexOf('team-name')
      const chip = classes.indexOf('team-prediction')
      const score = classes.indexOf('team-score')
      expect(name).toBeGreaterThan(-1)
      expect(chip).toBe(name + 1)
      expect(score).toBe(chip + 1)
    })
    ReactDOM.unmountComponentAtNode(container)
  }
})

test('keeps the DOM unchanged when there is no prediction', () => {
  const withNull = document.createElement('div')
  const without = document.createElement('div')
  renderMatch(withNull, { prediction: null })
  renderMatch(without, {})
  expect(withNull.innerHTML).toBe(without.innerHTML)
  ReactDOM.unmountComponentAtNode(withNull)
  ReactDOM.unmountComponentAtNode(without)
})

test('does not highlight the chip of the favourite that advanced', () => {
  const container = document.createElement('div')
  renderMatch(container, {
    prediction: PREDICTION,
    played: true,
    scoreP1: 2,
    scoreP2: 1,
    outcome: { teamThatWon: ref(1, 'Boca') },
  })
  expect(container.querySelector('[data-upset]')).toBeNull()
  ReactDOM.unmountComponentAtNode(container)
})

test('highlights only the chip of the side that advanced against the odds', () => {
  const container = document.createElement('div')
  renderMatch(container, {
    prediction: PREDICTION,
    played: true,
    scoreP1: 0,
    scoreP2: 1,
    outcome: { teamThatWon: ref(2, 'River') },
  })
  const upsets = container.querySelectorAll('[data-upset]')
  expect(upsets).toHaveLength(1)
  expect(upsets[0].textContent).toBe('38%')
  ReactDOM.unmountComponentAtNode(container)
})

test('uses the outcome, not the score, when penalties leave the score tied', () => {
  const container = document.createElement('div')
  renderMatch(container, {
    prediction: PREDICTION,
    played: true,
    scoreP1: 2,
    scoreP2: 2,
    outcome: {
      penalties: true,
      teamThatWon: ref(2, 'River'),
      scoreFromTeamThatWon: 5,
      scoreFromTeamThatLost: 4,
    },
  })
  const upsets = container.querySelectorAll('[data-upset]')
  expect(upsets).toHaveLength(1)
  expect(upsets[0].textContent).toBe('38%')
  ReactDOM.unmountComponentAtNode(container)
})

test('clamps extreme probabilities to 1% and 99%', () => {
  const container = document.createElement('div')
  renderMatch(container, {
    prediction: { ...PREDICTION, p1: 0.999, p2: 0.001 },
  })
  expect(chipsOf(container).map((chip) => chip.textContent)).toEqual([
    '99%',
    '1%',
  ])
  ReactDOM.unmountComponentAtNode(container)
})

test('the chip coexists with the result inputs and confirmation buttons', () => {
  const container = document.createElement('div')
  renderMatch(container, { prediction: PREDICTION })

  expect(chipsOf(container)).toHaveLength(2)
  expect(container.querySelector('[name="scoreP1"]')).not.toBeNull()
  expect(container.querySelector('[name="scoreP2"]')).not.toBeNull()
  expect(
    container.querySelector('[aria-label="Confirmar resultado"]'),
  ).not.toBeNull()
  expect(
    container.querySelector('[aria-label="Confirmar resultado simulado"]'),
  ).not.toBeNull()
  ReactDOM.unmountComponentAtNode(container)
})
