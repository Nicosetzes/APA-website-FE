/* eslint-env jest */
import { buildReignRecords } from './ratingReigns'

const reign = (id, matches, overrides = {}) => ({
  player: { id, name: id.toUpperCase() },
  matches,
  startDate: '2019-03-01T15:00:00.000Z',
  endDate: '2022-08-01T15:00:00.000Z',
  isActive: false,
  dethronedBy: { id: 'x', name: 'X' },
  ...overrides,
})

describe('buildReignRecords', () => {
  test('maps the longest and the current reign to streak records in years', () => {
    const current = reign('s', 40, {
      startDate: '2024-01-01T15:00:00.000Z',
      endDate: '2026-10-01T15:00:00.000Z',
      isActive: true,
      dethronedBy: null,
    })
    const records = buildReignRecords({
      current,
      longest: [reign('n', 234)],
      reigns: [reign('n', 234), current],
    })
    expect(records.historic).toEqual({
      count: 234,
      players: [
        {
          id: 'n',
          name: 'N',
          startDate: '2019-03-01T15:00:00.000Z',
          endDate: '2022-08-01T15:00:00.000Z',
          startDatePrecision: 'year',
          endDatePrecision: 'year',
          isActive: false,
          startMatch: null,
          endMatch: null,
          breakMatch: null,
        },
      ],
    })
    expect(records.current.count).toBe(40)
    expect(records.current.players[0]).toMatchObject({
      id: 's',
      isActive: true,
    })
  })

  test('keeps one holder per player when the longest reigns tie', () => {
    const records = buildReignRecords({
      current: null,
      longest: [
        reign('n', 50),
        reign('s', 50),
        reign('n', 50, { startDate: '2024-01-01T15:00:00.000Z' }),
      ],
      reigns: [],
    })
    expect(records.historic.players.map((holder) => holder.id)).toEqual([
      'n',
      's',
    ])
    expect(records.historic.players[0].startDate).toBe(
      '2019-03-01T15:00:00.000Z',
    )
    expect(records.current).toBeNull()
  })

  test('returns empty records without data', () => {
    expect(buildReignRecords(null)).toEqual({ historic: null, current: null })
    expect(buildReignRecords(undefined)).toEqual({
      historic: null,
      current: null,
    })
    expect(
      buildReignRecords({ current: null, longest: [], reigns: [] }),
    ).toEqual({ historic: null, current: null })
  })
})
