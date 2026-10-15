/* eslint-env jest */
import {
  describeMatchRatingChange,
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

describe('describeMatchRatingChange', () => {
  const players = {
    nameP1: 'Camilo',
    nameP2: 'Nico',
    idP1: 'p1',
    idP2: 'p2',
  }

  test('returns one line per player, player 1 first, with tag and signed value', () => {
    const result = describeMatchRatingChange({ p1: 6.67, p2: -6.67 }, players)
    expect(result.lines).toEqual([
      { side: 'p1', tag: 'CAM', name: 'Camilo', text: 'CAM +6.7', trend: 'up' },
      { side: 'p2', tag: 'NIC', name: 'Nico', text: 'NIC -6.7', trend: 'down' },
    ])
    expect(result.focused).toBe(false)
    expect(result.tooltip).toBe('Rating APA 2.0')
    expect(result.label).toBe('Variación de Elo: Camilo +6.7, Nico -6.7')
  })

  test('shows only the filtered player when he plays the match', () => {
    const asP2 = describeMatchRatingChange(
      { p1: 6.67, p2: -6.67 },
      { ...players, focusPlayerId: 'p2' },
    )
    expect(asP2.lines.map((line) => line.text)).toEqual(['NIC -6.7'])
    expect(asP2.lines[0].trend).toBe('down')
    expect(asP2.focused).toBe(true)
    expect(asP2.label).toBe('Variación de Elo: Nico -6.7')

    const asP1 = describeMatchRatingChange(
      { p1: 6.67, p2: -6.67 },
      { ...players, focusPlayerId: 'p1' },
    )
    expect(asP1.lines.map((line) => line.text)).toEqual(['CAM +6.7'])
    expect(asP1.lines[0].trend).toBe('up')
  })

  test('compares the filtered id as a string and ignores one that is not in the match', () => {
    const numeric = describeMatchRatingChange(
      { p1: 1, p2: -1 },
      { ...players, idP1: 7, idP2: 8, focusPlayerId: '8' },
    )
    expect(numeric.lines.map((line) => line.side)).toEqual(['p2'])

    for (const focusPlayerId of ['other', '', null, undefined]) {
      const result = describeMatchRatingChange(
        { p1: 1, p2: -1 },
        { ...players, focusPlayerId },
      )
      expect(result.lines).toHaveLength(2)
      expect(result.focused).toBe(false)
    }
  })

  test('shows zero as flat without a sign and never -0', () => {
    for (const change of [
      { p1: 0, p2: 0 },
      { p1: 0.04, p2: -0.04 },
      { p1: -0, p2: -0 },
    ]) {
      const result = describeMatchRatingChange(change, players)
      expect(result.lines.map((line) => line.text)).toEqual([
        'CAM 0.0',
        'NIC 0.0',
      ])
      expect(result.lines.every((line) => line.trend === 'flat')).toBe(true)
    }
  })

  test('falls back to P1 / P2 when the names are missing', () => {
    const result = describeMatchRatingChange({ p1: 1.04, p2: -1.04 })
    expect(result.lines.map((line) => line.text)).toEqual([
      'P1 +1.0',
      'P2 -1.0',
    ])
    expect(
      describeMatchRatingChange(
        { p1: 1, p2: -1 },
        { nameP1: '  ', nameP2: null },
      ).lines.map((line) => line.tag),
    ).toEqual(['P1', 'P2'])
  })

  test('returns null for missing or malformed data and never NaN', () => {
    for (const value of [
      null,
      undefined,
      'x',
      5,
      [],
      {},
      { p1: 1 },
      { p2: 1 },
      { p1: '1', p2: '-1' },
      { p1: NaN, p2: 1 },
      { p1: Infinity, p2: -Infinity },
    ]) {
      expect(describeMatchRatingChange(value, players)).toBeNull()
    }
  })
})

describe('symmetric rounding of half values', () => {
  test('describeRatingChange rounds +x.x5 and -x.x5 to the same magnitude', () => {
    expect(describeRatingChange(0.35)).toEqual({ trend: 'up', text: '+0.4' })
    expect(describeRatingChange(-0.35)).toEqual({
      trend: 'down',
      text: '-0.4',
    })
    expect(describeRatingChange(3.25).text).toBe('+3.3')
    expect(describeRatingChange(-3.25).text).toBe('-3.3')
    expect(describeRatingChange(-0.05).text).toBe('-0.1')
    expect(describeRatingChange(0.05).text).toBe('+0.1')
  })

  test('both players of a match always show the same magnitude', () => {
    for (const points of [0.35, 0.05, 1.25, 2.45, 3.15, 6.65, 12.35]) {
      const result = describeMatchRatingChange(
        { p1: points, p2: -points },
        { nameP1: 'Camilo', nameP2: 'Juan' },
      )
      const [first, second] = result.lines.map(
        (line) => line.text.split(' ')[1],
      )
      expect(first.replace('+', '')).toBe(second.replace('-', ''))
    }
    const half = describeMatchRatingChange(
      { p1: 0.35, p2: -0.35 },
      { nameP1: 'Camilo', nameP2: 'Juan' },
    )
    expect(half.lines.map((line) => line.text)).toEqual([
      'CAM +0.4',
      'JUA -0.4',
    ])
    expect(half.label).toBe('Variación de Elo: Camilo +0.4, Juan -0.4')
  })
})
