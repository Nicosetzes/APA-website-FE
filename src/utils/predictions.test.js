/* eslint-env jest */
import {
  formatOutcomesPrediction,
  formatPrediction,
  getAdvancingSide,
  getOutcomesUpsetSide,
  getUpsetSide,
} from './predictions'

const teamP1 = { id: 10, name: 'Equipo 1' }
const teamP2 = { id: 20, name: 'Equipo 2' }
const playerP1 = { id: 'a', name: 'Nico' }
const playerP2 = { id: 'b', name: 'Santi' }
const sides = { teamP1, teamP2, playerP1, playerP2 }

describe('formatPrediction', () => {
  test('rounds to integers and the other side is the complement', () => {
    expect(formatPrediction({ p1: 0.623, p2: 0.377 })).toEqual({
      p1Pct: 62,
      p2Pct: 38,
    })
    expect(formatPrediction({ p1: 0.5 })).toEqual({ p1Pct: 50, p2Pct: 50 })
    expect(formatPrediction({ p1: 0.625 })).toEqual({ p1Pct: 63, p2Pct: 37 })
  })

  test('both sides always add up to 100', () => {
    for (let thousandths = 0; thousandths <= 1000; thousandths += 1) {
      const { p1Pct, p2Pct } = formatPrediction({ p1: thousandths / 1000 })
      expect(p1Pct + p2Pct).toBe(100)
    }
  })

  test('clamps to 1 and 99', () => {
    expect(formatPrediction({ p1: 0.004 })).toEqual({ p1Pct: 1, p2Pct: 99 })
    expect(formatPrediction({ p1: 0.996 })).toEqual({ p1Pct: 99, p2Pct: 1 })
    expect(formatPrediction({ p1: 0 })).toEqual({ p1Pct: 1, p2Pct: 99 })
    expect(formatPrediction({ p1: 1 })).toEqual({ p1Pct: 99, p2Pct: 1 })
  })

  test('returns null when there is no valid prediction', () => {
    expect(formatPrediction(null)).toBeNull()
    expect(formatPrediction(undefined)).toBeNull()
    expect(formatPrediction({})).toBeNull()
    expect(formatPrediction('0.5')).toBeNull()
    expect(formatPrediction({ p1: NaN })).toBeNull()
    expect(formatPrediction({ p1: Infinity })).toBeNull()
    expect(formatPrediction({ p1: '0.6' })).toBeNull()
    expect(formatPrediction({ p1: -0.1 })).toBeNull()
    expect(formatPrediction({ p1: 1.2 })).toBeNull()
  })
})

describe('getAdvancingSide', () => {
  test('uses the winning team, not the score', () => {
    // 2-2 definido por penales: el marcador no dice quién avanzó.
    const outcome = { draw: true, penalties: true, teamThatWon: teamP2 }
    expect(getAdvancingSide({ outcome, ...sides })).toBe('p2')
    expect(
      getAdvancingSide({ outcome: { teamThatWon: teamP1 }, ...sides }),
    ).toBe('p1')
  })

  test('compares ids as strings', () => {
    expect(
      getAdvancingSide({ outcome: { teamThatWon: { id: '10' } }, ...sides }),
    ).toBe('p1')
  })

  test('falls back to the winning player when there is no team', () => {
    expect(
      getAdvancingSide({ outcome: { playerThatWon: playerP2 }, ...sides }),
    ).toBe('p2')
    expect(
      getAdvancingSide({ outcome: { playerThatWon: playerP1 }, ...sides }),
    ).toBe('p1')
  })

  test('is null without a winner', () => {
    expect(getAdvancingSide({ outcome: null, ...sides })).toBeNull()
    expect(getAdvancingSide({ outcome: {}, ...sides })).toBeNull()
    expect(
      getAdvancingSide({ outcome: { teamThatWon: { id: 99 } }, ...sides }),
    ).toBeNull()
  })
})

describe('getUpsetSide', () => {
  const base = {
    played: true,
    prediction: { p1: 0.7 },
    outcome: { teamThatWon: teamP1 },
    ...sides,
  }

  test('is null when the favourite advances', () => {
    expect(getUpsetSide(base)).toBeNull()
    expect(
      getUpsetSide({
        ...base,
        prediction: { p1: 0.3 },
        outcome: { teamThatWon: teamP2 },
      }),
    ).toBeNull()
  })

  test('flags the side that advanced with the lower probability', () => {
    expect(getUpsetSide({ ...base, prediction: { p1: 0.3 } })).toBe('p1')
    expect(getUpsetSide({ ...base, outcome: { teamThatWon: teamP2 } })).toBe(
      'p2',
    )
  })

  test('works for penalties with a tied score', () => {
    expect(
      getUpsetSide({
        ...base,
        scoreP1: 1,
        scoreP2: 1,
        outcome: { penalties: true, teamThatWon: teamP2 },
      }),
    ).toBe('p2')
  })

  test('works with the winning player when there is no winning team', () => {
    expect(
      getUpsetSide({
        ...base,
        outcome: { playerThatWon: playerP2 },
      }),
    ).toBe('p2')
  })

  test('a 50/50 is not an upset', () => {
    expect(getUpsetSide({ ...base, prediction: { p1: 0.5 } })).toBeNull()
    expect(getUpsetSide({ ...base, prediction: { p1: 0.504 } })).toBeNull()
  })

  test('is null for unplayed, invalid or prediction-less matches', () => {
    expect(getUpsetSide({ ...base, played: false })).toBeNull()
    expect(
      getUpsetSide({ ...base, valid: false, prediction: { p1: 0.3 } }),
    ).toBeNull()
    expect(getUpsetSide({ ...base, prediction: null })).toBeNull()
    expect(
      getUpsetSide({ ...base, outcome: null, prediction: { p1: 0.3 } }),
    ).toBeNull()
  })
})

const outcomes = (p1Win, draw, p2Win) => ({
  kind: 'outcomes',
  p1Win,
  draw,
  p2Win,
  basis: 'current',
  teamAdjusted: true,
  provisional: false,
  ratingVersion: '2.0',
  drawModelVersion: 'draw-1',
})
describe('formatOutcomesPrediction', () => {
  test('matches the reference example 44 / 22 / 34', () => {
    expect(formatOutcomesPrediction(outcomes(0.441, 0.218, 0.341))).toEqual({
      p1Pct: 44,
      drawPct: 22,
      p2Pct: 34,
    })
  })
  test('always sums to exactly 100 over a sweep', () => {
    for (let p1Win = 0; p1Win <= 0.98; p1Win += 0.005) {
      const draw = 0.2
      const p2Win = 1 - p1Win - draw
      if (p2Win < 0) continue
      const pct = formatOutcomesPrediction(outcomes(p1Win, draw, p2Win))
      expect(pct.p1Pct + pct.drawPct + pct.p2Pct).toBe(100)
      Object.values(pct).forEach((value) =>
        expect(Number.isInteger(value)).toBe(true),
      )
    }
    const pct = formatOutcomesPrediction(outcomes(0.4841, 0.2379, 0.278))
    expect(pct.p1Pct + pct.drawPct + pct.p2Pct).toBe(100)
  })
  test('uses the largest remainder and breaks ties in order p1, draw, p2', () => {
    // 1/3 cada uno: sobra 1 punto y va al primero.
    expect(formatOutcomesPrediction(outcomes(1 / 3, 1 / 3, 1 / 3))).toEqual({
      p1Pct: 34,
      drawPct: 33,
      p2Pct: 33,
    })
  })
  test('raises any probability above 0 to at least 1', () => {
    expect(formatOutcomesPrediction(outcomes(0.995, 0.004, 0.001))).toEqual({
      p1Pct: 98,
      drawPct: 1,
      p2Pct: 1,
    })
  })
  test('keeps a real zero as 0', () => {
    expect(formatOutcomesPrediction(outcomes(0.7, 0, 0.3))).toEqual({
      p1Pct: 70,
      drawPct: 0,
      p2Pct: 30,
    })
  })
  test('returns null when a segment would be 100', () => {
    expect(formatOutcomesPrediction(outcomes(1, 0, 0))).toBeNull()
    expect(formatOutcomesPrediction(outcomes(0, 1, 0))).toBeNull()
    expect(formatOutcomesPrediction(outcomes(0, 0, 1))).toBeNull()
  })
  test('returns null for missing, invalid or legacy shapes', () => {
    const invalid = [
      null,
      undefined,
      {},
      'outcomes',
      '0.5',
      outcomes(NaN, 0.5, 0.5),
      outcomes(Infinity, 0, 0),
      outcomes(-0.1, 0.6, 0.5),
      outcomes(1.2, -0.1, -0.1),
      outcomes('0.4', 0.2, 0.4),
      outcomes(0.5, 0.5, 0.5),
      outcomes(0.2, 0.2, 0.2),
      { ...outcomes(0.4, 0.2, 0.4), p1Win: undefined },
      { p1: 0.6, p2: 0.4 },
      { ...outcomes(0.4, 0.2, 0.4), kind: 'advance' },
      { ...outcomes(0.4, 0.2, 0.4), kind: undefined },
    ]
    invalid.forEach((prediction) =>
      expect(formatOutcomesPrediction(prediction)).toBeNull(),
    )
  })
  test('accepts a sum within 0.01 of 1', () => {
    const pct = formatOutcomesPrediction(outcomes(0.4, 0.2, 0.395))
    expect(pct.p1Pct + pct.drawPct + pct.p2Pct).toBe(100)
  })
})
describe('getOutcomesUpsetSide', () => {
  const base = {
    prediction: outcomes(0.6, 0.2, 0.2),
    played: true,
    valid: true,
    scoreP1: 1,
    scoreP2: 0,
  }
  test('is null when the favourite wins', () => {
    expect(getOutcomesUpsetSide(base)).toBeNull()
    expect(getOutcomesUpsetSide({ ...base, scoreP1: 0, scoreP2: 1 })).toBe('p2')
  })
  test('returns the side that won with fewer displayed percentage', () => {
    const prediction = outcomes(0.2, 0.2, 0.6)
    expect(
      getOutcomesUpsetSide({ ...base, prediction, scoreP1: 2, scoreP2: 1 }),
    ).toBe('p1')
    expect(
      getOutcomesUpsetSide({ ...base, prediction, scoreP1: 0, scoreP2: 3 }),
    ).toBeNull()
  })
  test('a draw is never an upset', () => {
    expect(getOutcomesUpsetSide({ ...base, scoreP1: 1, scoreP2: 1 })).toBeNull()
    expect(getOutcomesUpsetSide({ ...base, scoreP1: 0, scoreP2: 0 })).toBeNull()
  })
  test('is null for unplayed, invalid or prediction-less matches', () => {
    const upset = { ...base, scoreP1: 0, scoreP2: 1 }
    expect(getOutcomesUpsetSide({ ...upset, played: false })).toBe(null)
    expect(getOutcomesUpsetSide({ ...upset, valid: false })).toBe(null)
    expect(getOutcomesUpsetSide({ ...upset, prediction: null })).toBe(null)
    expect(getOutcomesUpsetSide({ ...upset, prediction: undefined })).toBe(null)
    expect(
      getOutcomesUpsetSide({ ...upset, prediction: { p1: 0.6, p2: 0.4 } }),
    ).toBe(null)
  })
  test('treats a missing valid flag as valid', () => {
    expect(
      getOutcomesUpsetSide({
        ...base,
        valid: undefined,
        scoreP1: 0,
        scoreP2: 1,
      }),
    ).toBe('p2')
  })
  test('is null for non-integer or missing scores', () => {
    const prediction = outcomes(0.2, 0.2, 0.6)
    for (const [scoreP1, scoreP2] of [
      [1.5, 0],
      [1, null],
      [undefined, 0],
      ['1', '0'],
      [NaN, 0],
    ]) {
      expect(
        getOutcomesUpsetSide({ ...base, prediction, scoreP1, scoreP2 }),
      ).toBeNull()
    }
  })
  test('is null when the displayed percentages are equal', () => {
    const prediction = outcomes(0.4, 0.2, 0.4)
    expect(
      getOutcomesUpsetSide({ ...base, prediction, scoreP1: 1, scoreP2: 0 }),
    ).toBeNull()
    expect(
      getOutcomesUpsetSide({ ...base, prediction, scoreP1: 0, scoreP2: 1 }),
    ).toBeNull()
  })
})
describe('legacy helpers ignore the outcomes shape', () => {
  test('formatPrediction and getUpsetSide return null', () => {
    const prediction = outcomes(0.5, 0.2, 0.3)
    expect(formatPrediction(prediction)).toBeNull()
    expect(
      getUpsetSide({
        prediction,
        played: true,
        outcome: { teamThatWon: teamP2 },
        ...sides,
      }),
    ).toBeNull()
  })
})
