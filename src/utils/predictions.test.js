/* eslint-env jest */
import { formatPrediction, getAdvancingSide, getUpsetSide } from './predictions'

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
