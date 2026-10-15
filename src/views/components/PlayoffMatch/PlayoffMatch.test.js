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

const OUTCOMES = {
  kind: 'outcomes',
  p1Win: 0.5,
  draw: 0.2,
  p2Win: 0.3,
  basis: 'current',
  teamAdjusted: true,
  provisional: false,
  ratingVersion: '2.0',
  drawModelVersion: 'draw-1',
}

const outcomeChipOf = (container, outcome) =>
  container.querySelector(`[data-outcome="${outcome}"]`)

test('outcomes shape (two-legged legs): one win chip per row and the draw chip on the divider', () => {
  const container = document.createElement('div')
  renderMatch(container, { prediction: OUTCOMES })

  const rows = container.querySelectorAll('.container__team')
  expect(rows).toHaveLength(2)
  expect(chipsOf(container).map((chip) => chip.textContent)).toEqual([
    'V 50%',
    'V 30%',
  ])
  // Un chip por fila, en su lado.
  expect(rows[0].contains(outcomeChipOf(container, 'p1Win'))).toBe(true)
  expect(rows[1].contains(outcomeChipOf(container, 'p2Win'))).toBe(true)

  // El empate va en el divisor entre las dos filas y no dentro de ninguna.
  const draw = outcomeChipOf(container, 'draw')
  expect(draw.textContent).toBe('E 20%')
  const divider = draw.closest('.team-draw-divider')
  expect(divider).not.toBeNull()
  expect(divider.previousElementSibling).toBe(rows[0])
  expect(divider.nextElementSibling).toBe(rows[1])
  rows.forEach((row) => expect(row.contains(draw)).toBe(false))
  ReactDOM.unmountComponentAtNode(container)
})

test('outcomes shape: victory tooltip on the sides, draw tooltip on the divider, Spanish aria-labels', () => {
  const container = document.createElement('div')
  renderMatch(container, { prediction: OUTCOMES })
  ;['p1Win', 'p2Win'].forEach((outcome) => {
    expect(outcomeChipOf(container, outcome).getAttribute('title')).toBe(
      'Prob. de victoria (Rating APA 2.0)',
    )
  })
  expect(outcomeChipOf(container, 'draw').getAttribute('title')).toBe(
    'Prob. de empate (Rating APA 2.0)',
  )
  expect(outcomeChipOf(container, 'p1Win').getAttribute('aria-label')).toBe(
    'Probabilidad de que gane Nico: 50%',
  )
  expect(outcomeChipOf(container, 'draw').getAttribute('aria-label')).toBe(
    'Probabilidad de empate: 20%',
  )
  expect(outcomeChipOf(container, 'p2Win').getAttribute('aria-label')).toBe(
    'Probabilidad de que gane Santi: 30%',
  )
  ReactDOM.unmountComponentAtNode(container)
})

test('outcomes shape: marks only the winner who had fewer odds (draws are not upsets)', () => {
  const container = document.createElement('div')
  renderMatch(container, {
    prediction: OUTCOMES,
    played: true,
    scoreP1: 0,
    scoreP2: 1,
    outcome: { teamThatWon: ref(2, 'River') },
  })
  expect(outcomeChipOf(container, 'p2Win').hasAttribute('data-upset')).toBe(
    true,
  )
  expect(outcomeChipOf(container, 'p1Win').hasAttribute('data-upset')).toBe(
    false,
  )
  expect(outcomeChipOf(container, 'draw').hasAttribute('data-upset')).toBe(
    false,
  )
  // El tooltip no cambia: el aviso se marca con el color (y en el aria-label).
  expect(outcomeChipOf(container, 'p2Win').getAttribute('title')).toBe(
    'Prob. de victoria (Rating APA 2.0)',
  )
  ReactDOM.unmountComponentAtNode(container)

  const drawn = document.createElement('div')
  renderMatch(drawn, {
    prediction: OUTCOMES,
    played: true,
    scoreP1: 1,
    scoreP2: 1,
    outcome: { draw: true },
  })
  expect(drawn.querySelector('[data-upset]')).toBeNull()
  ReactDOM.unmountComponentAtNode(drawn)

  const favourite = document.createElement('div')
  renderMatch(favourite, {
    prediction: OUTCOMES,
    played: true,
    scoreP1: 2,
    scoreP2: 0,
    outcome: { teamThatWon: ref(1, 'Boca') },
  })
  expect(favourite.querySelector('[data-upset]')).toBeNull()
  ReactDOM.unmountComponentAtNode(favourite)
})

test('outcomes shape: no chips for invalid matches, null or malformed predictions', () => {
  for (const extra of [
    { prediction: OUTCOMES, valid: false },
    { prediction: null },
    { prediction: { ...OUTCOMES, p1Win: 'x' } },
    { prediction: { ...OUTCOMES, kind: 'advance' } },
  ]) {
    const container = document.createElement('div')
    renderMatch(container, extra)
    expect(chipsOf(container)).toHaveLength(0)
    expect(container.querySelector('.team-draw-divider')).toBeNull()
    expect(container.querySelector('[data-outcome]')).toBeNull()
    ReactDOM.unmountComponentAtNode(container)
  }
})

test('outcomes shape: keeps the score inputs and the confirm buttons', () => {
  const container = document.createElement('div')
  renderMatch(container, { prediction: OUTCOMES })

  expect(container.querySelector('[name="scoreP1"]')).not.toBeNull()
  expect(container.querySelector('[name="scoreP2"]')).not.toBeNull()
  expect(
    container.querySelector('[aria-label="Confirmar resultado"]'),
  ).not.toBeNull()
  ReactDOM.unmountComponentAtNode(container)
})

test('renders the same DOM with a null prediction as with none (no divider added)', () => {
  const withNull = document.createElement('div')
  const without = document.createElement('div')
  renderMatch(withNull, { prediction: null })
  renderMatch(without, {})
  expect(withNull.innerHTML).toBe(without.innerHTML)
  expect(withNull.querySelector('.team-draw-divider')).toBeNull()
  ReactDOM.unmountComponentAtNode(withNull)
  ReactDOM.unmountComponentAtNode(without)
})

test('without a prediction each row keeps an empty slot where the chip would go', () => {
  for (const extra of [
    { prediction: null },
    {},
    { prediction: OUTCOMES, valid: false },
  ]) {
    const container = document.createElement('div')
    renderMatch(container, extra)
    container.querySelectorAll('.container__team').forEach((row) => {
      const classes = Array.from(row.children).map((child) => child.className)
      const slot = classes.indexOf('team-prediction-slot')
      expect(slot).toBeGreaterThan(-1)
      // Entre el nombre y el marcador (o los inputs), igual que un chip.
      expect(classes[slot - 1]).toBe('team-name')
      expect(classes[slot + 1]).toBe('team-inputs')
      const element = row.children[slot]
      expect(element.getAttribute('aria-hidden')).toBe('true')
      expect(element.textContent).toBe('')
    })
    ReactDOM.unmountComponentAtNode(container)
  }
})

test('with a prediction the chip takes the place of the slot, same position in the row', () => {
  const container = document.createElement('div')
  renderMatch(container, { prediction: OUTCOMES })
  container.querySelectorAll('.container__team').forEach((row) => {
    const classes = Array.from(row.children).map((child) => child.className)
    expect(classes).not.toContain('team-prediction-slot')
    const chip = classes.indexOf('team-prediction')
    expect(classes[chip - 1]).toBe('team-name')
    expect(classes[chip + 1]).toBe('team-inputs')
  })
  ReactDOM.unmountComponentAtNode(container)
})
