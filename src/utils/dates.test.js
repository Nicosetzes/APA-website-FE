/* eslint-env jest */
import {
  formatDate,
  formatDateTime,
  formatTime,
  parseDateParam,
  toDateParam,
} from './dates'

// Fechas en hora local para que los tests no dependan de la zona horaria.
const local = (year, month, day, hours = 0, minutes = 0, seconds = 0) =>
  new Date(year, month - 1, day, hours, minutes, seconds)

describe('formatDate', () => {
  it('formats DD/MM/YYYY with slashes, padding days and months', () => {
    expect(formatDate(local(2024, 7, 8))).toBe('08/07/2024')
    expect(formatDate(local(2024, 1, 1))).toBe('01/01/2024')
    expect(formatDate(local(2024, 12, 31, 23, 59))).toBe('31/12/2024')
  })

  it('keeps the local day at midnight', () => {
    expect(formatDate(local(2024, 7, 8, 0, 0))).toBe('08/07/2024')
  })

  it('accepts ISO strings', () => {
    expect(formatDate(local(2024, 7, 8, 21, 15).toISOString())).toBe(
      '08/07/2024',
    )
    // Sin zona horaria: ISO lo interpreta como hora local.
    expect(formatDate('2022-07-04T12:00:00')).toBe('04/07/2022')
  })

  it('returns "" for null, undefined, empty and invalid values', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
    expect(formatDate('')).toBe('')
    expect(formatDate('not-a-date')).toBe('')
    expect(formatDate(new Date('invalid'))).toBe('')
  })
})

describe('formatTime', () => {
  it('uses 24h without seconds', () => {
    expect(formatTime(local(2024, 7, 8, 0, 5, 30))).toBe('00:05')
    expect(formatTime(local(2024, 7, 8, 23, 59, 59))).toBe('23:59')
    expect(formatTime(local(2024, 7, 8, 12, 0))).toBe('12:00')
  })

  it('returns "" for invalid values', () => {
    expect(formatTime(null)).toBe('')
    expect(formatTime('nope')).toBe('')
  })
})

describe('formatDateTime', () => {
  it('formats "DD/MM/YYYY HH:mm" in 24h without seconds or AM/PM', () => {
    expect(formatDateTime(local(2024, 7, 8, 21, 15, 42))).toBe(
      '08/07/2024 21:15',
    )
    expect(formatDateTime(local(2024, 7, 8, 0, 0))).toBe('08/07/2024 00:00')
    expect(formatDateTime(local(2024, 3, 5, 0, 5))).toBe('05/03/2024 00:05')
    expect(formatDateTime(local(2024, 3, 5, 23, 59, 59))).toBe(
      '05/03/2024 23:59',
    )
    expect(formatDateTime(local(2024, 3, 5, 13, 1))).not.toMatch(/AM|PM/)
  })

  it('accepts ISO strings and Date objects alike', () => {
    const date = local(2023, 11, 9, 9, 7)
    expect(formatDateTime(date.toISOString())).toBe('09/11/2023 09:07')
    expect(formatDateTime(date)).toBe('09/11/2023 09:07')
  })

  it('returns "" for null and invalid values', () => {
    expect(formatDateTime(null)).toBe('')
    expect(formatDateTime(undefined)).toBe('')
    expect(formatDateTime('not-a-date')).toBe('')
  })
})

describe('parseDateParam / toDateParam (URL YYYY-MM-DD)', () => {
  it('parses YYYY-MM-DD as local midnight', () => {
    const date = parseDateParam('2024-07-08')
    expect(date.getFullYear()).toBe(2024)
    expect(date.getMonth()).toBe(6)
    expect(date.getDate()).toBe(8)
    expect(date.getHours()).toBe(0)
    expect(formatDate(date)).toBe('08/07/2024')
  })

  it('rejects missing, malformed and non-existent dates', () => {
    expect(parseDateParam('')).toBeNull()
    expect(parseDateParam(null)).toBeNull()
    expect(parseDateParam('08/07/2024')).toBeNull()
    expect(parseDateParam('2024-7-8')).toBeNull()
    expect(parseDateParam('2024-02-31')).toBeNull()
    expect(parseDateParam('2024-13-01')).toBeNull()
  })

  it('serializes the local day and round-trips', () => {
    expect(toDateParam(local(2024, 7, 8, 23, 59))).toBe('2024-07-08')
    expect(toDateParam(local(2024, 1, 1, 0, 0))).toBe('2024-01-01')
    expect(toDateParam(parseDateParam('2019-07-10'))).toBe('2019-07-10')
    expect(toDateParam(null)).toBe('')
    expect(toDateParam(new Date('invalid'))).toBe('')
  })
})
