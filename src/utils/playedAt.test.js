/* eslint-env jest */
import { formatPlayedAt, isExactPrecision } from './playedAt'

// Mediodía UTC: el día local es el mismo en cualquier zona razonable.
const NOV_30_2021 = '2021-11-30T15:00:00.000Z'
const NOV_15_2022 = '2022-11-15T15:00:00.000Z'
const JUL_09_2019 = '2019-07-09T15:00:00.000Z'

describe('isExactPrecision', () => {
  it('is true only for an explicit exact precision', () => {
    expect(isExactPrecision('exact')).toBe(true)
    expect(isExactPrecision(undefined)).toBe(false)
    expect(isExactPrecision(null)).toBe(false)
    expect(isExactPrecision('day')).toBe(false)
    expect(isExactPrecision('approx')).toBe(false)
  })
})

describe('formatPlayedAt', () => {
  it('returns null for exact or missing precision so components keep their format', () => {
    expect(formatPlayedAt(NOV_30_2021, 'exact')).toBeNull()
    expect(formatPlayedAt(NOV_30_2021, undefined)).toBeNull()
  })

  it('formats each precision in short style', () => {
    expect(formatPlayedAt(NOV_30_2021, 'day')).toBe('30/11/2021')
    expect(formatPlayedAt(NOV_15_2022, 'month')).toBe('nov. 2022')
    expect(formatPlayedAt(JUL_09_2019, 'year')).toBe('2019')
    expect(formatPlayedAt(NOV_15_2022, 'approx')).toBe('aprox. nov. 2022')
    expect(formatPlayedAt('2022-09-10T15:00:00.000Z', 'month')).toBe(
      'sept. 2022',
    )
  })

  it('formats each precision in long style for aria labels', () => {
    const long = { style: 'long' }
    expect(formatPlayedAt(NOV_30_2021, 'day', long)).toBe(
      '30 de noviembre de 2021',
    )
    expect(formatPlayedAt(NOV_15_2022, 'month', long)).toBe('noviembre de 2022')
    expect(formatPlayedAt(JUL_09_2019, 'year', long)).toBe('2019')
    expect(formatPlayedAt(NOV_15_2022, 'approx', long)).toBe(
      'aproximadamente noviembre de 2022',
    )
  })

  it('accepts Date objects and rejects invalid values', () => {
    expect(formatPlayedAt(new Date(JUL_09_2019), 'year')).toBe('2019')
    expect(formatPlayedAt('not-a-date', 'year')).toBeNull()
    expect(formatPlayedAt(null, 'year')).toBeNull()
    expect(formatPlayedAt(NOV_15_2022, 'week')).toBeNull()
  })
})
