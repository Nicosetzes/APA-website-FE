/* eslint-env jest */
import {
  describeRatingChange,
  formatRating,
  indexRatingsByPlayer,
  orderByRating,
} from './ratings'

describe('formatRating', () => {
  test('rounds to an integer', () => {
    expect(formatRating(1631.7)).toBe('1632')
    expect(formatRating(1664.4)).toBe('1664')
    expect(formatRating(1500)).toBe('1500')
  })

  test('shows a dash when there is no value', () => {
    expect(formatRating(null)).toBe('-')
    expect(formatRating(undefined)).toBe('-')
    expect(formatRating(NaN)).toBe('-')
  })
})

describe('describeRatingChange', () => {
  test('marks gains, losses and flat changes with their sign', () => {
    expect(describeRatingChange(1.4)).toEqual({ trend: 'up', text: '+1.4' })
    expect(describeRatingChange(-3.24)).toEqual({ trend: 'down', text: '-3.2' })
    expect(describeRatingChange(0)).toEqual({ trend: 'flat', text: '0.0' })
  })

  test('treats a change that rounds to zero as flat, including -0', () => {
    expect(describeRatingChange(0.04)).toEqual({ trend: 'flat', text: '0.0' })
    expect(describeRatingChange(-0.04)).toEqual({ trend: 'flat', text: '0.0' })
  })

  test('falls back to a dash without a number', () => {
    expect(describeRatingChange(null)).toEqual({ trend: 'flat', text: '-' })
    expect(describeRatingChange(undefined)).toEqual({
      trend: 'flat',
      text: '-',
    })
  })
})

describe('orderByRating', () => {
  const ratings = [
    { position: 1, player: { id: 'n' } },
    { position: 2, player: { id: 's' } },
  ]

  test('follows the ranking order, not the incoming one', () => {
    const players = [{ player: { id: 's' } }, { player: { id: 'n' } }]

    expect(
      orderByRating(players, ratings).map(({ player }) => player.id),
    ).toEqual(['n', 's'])
  })

  test('keeps unranked players last in their original order', () => {
    const players = [
      { player: { id: 'x' } },
      { player: { id: 's' } },
      { player: { id: 'y' } },
      { player: { id: 'n' } },
    ]

    expect(
      orderByRating(players, ratings).map(({ player }) => player.id),
    ).toEqual(['n', 's', 'x', 'y'])
  })

  test('does not mutate the input and compares ids as text', () => {
    const players = [{ player: { id: 2 } }, { player: { id: 1 } }]
    const numeric = [
      { position: 1, player: { id: '1' } },
      { position: 2, player: { id: '2' } },
    ]

    expect(
      orderByRating(players, numeric).map(({ player }) => player.id),
    ).toEqual([1, 2])
    expect(players.map(({ player }) => player.id)).toEqual([2, 1])
  })

  test('returns the players untouched without ratings', () => {
    const players = [{ player: { id: 'b' } }, { player: { id: 'a' } }]

    expect(orderByRating(players, []).map(({ player }) => player.id)).toEqual([
      'b',
      'a',
    ])
    expect(orderByRating(players).map(({ player }) => player.id)).toEqual([
      'b',
      'a',
    ])
  })
})

describe('indexRatingsByPlayer', () => {
  test('finds a rating by player id', () => {
    const index = indexRatingsByPlayer([{ player: { id: 7 }, rating: 1600 }])

    expect(index.get('7').rating).toBe(1600)
    expect(index.get('8')).toBeUndefined()
  })
})
