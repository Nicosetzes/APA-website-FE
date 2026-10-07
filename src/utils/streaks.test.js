/* eslint-env jest */
import { calendarDiff, formatStreakDuration, getCountUnit } from './streaks'

// Fechas en hora local para que los tests no dependan de la zona horaria.
const local = (year, month, day, hours = 12) =>
  new Date(year, month - 1, day, hours)

const duration = (start, end, count = 5) =>
  formatStreakDuration({ startDate: start, endDate: end, count })

describe('calendarDiff', () => {
  test('resta componente a componente', () => {
    expect(calendarDiff(local(2024, 6, 3), local(2025, 9, 15))).toEqual({
      years: 1,
      months: 3,
      days: 12,
    })
  })

  test('trunca a día calendario local', () => {
    expect(calendarDiff(local(2026, 9, 20, 23), local(2026, 9, 21, 1))).toEqual(
      { years: 0, months: 0, days: 1 },
    )
  })

  test('fin de mes: 31/01 → 01/03 en año común y bisiesto', () => {
    expect(calendarDiff(local(2025, 1, 31), local(2025, 3, 1))).toEqual({
      years: 0,
      months: 1,
      days: 1,
    })
    expect(calendarDiff(local(2024, 1, 31), local(2024, 3, 1))).toEqual({
      years: 0,
      months: 1,
      days: 1,
    })
  })

  test('pide prestado el mes anterior a end', () => {
    // Febrero 2024 tiene 29 días: 15/01 → 10/03 = 1 mes y 24 días.
    expect(calendarDiff(local(2024, 1, 15), local(2024, 3, 10))).toEqual({
      years: 0,
      months: 1,
      days: 24,
    })
    // Febrero 2025 tiene 28 días.
    expect(calendarDiff(local(2025, 1, 15), local(2025, 3, 10))).toEqual({
      years: 0,
      months: 1,
      days: 23,
    })
    expect(calendarDiff(local(2025, 1, 31), local(2025, 2, 28))).toEqual({
      years: 0,
      months: 0,
      days: 28,
    })
  })

  test('años bisiestos: 29/02 → 28/02 y 29/02 → 01/03', () => {
    expect(calendarDiff(local(2024, 2, 29), local(2025, 2, 28))).toEqual({
      years: 0,
      months: 11,
      days: 30,
    })
    expect(calendarDiff(local(2024, 2, 29), local(2025, 3, 1))).toEqual({
      years: 1,
      months: 0,
      days: 1,
    })
  })

  test('resta un año cuando los meses dan negativo', () => {
    expect(calendarDiff(local(2024, 11, 10), local(2025, 2, 5))).toEqual({
      years: 0,
      months: 2,
      days: 26,
    })
  })

  test('acepta strings ISO', () => {
    expect(calendarDiff('2026-07-02T12:00:00', '2026-09-20T12:00:00')).toEqual({
      years: 0,
      months: 2,
      days: 18,
    })
  })

  test('null o fecha inválida devuelve null', () => {
    expect(calendarDiff(null, local(2025, 1, 1))).toBeNull()
    expect(calendarDiff(local(2025, 1, 1), undefined)).toBeNull()
    expect(calendarDiff('no-es-fecha', local(2025, 1, 1))).toBeNull()
  })
})

describe('formatStreakDuration', () => {
  test('singular y plural de días', () => {
    expect(duration(local(2026, 9, 20), local(2026, 9, 21))).toBe('1 día')
    expect(duration(local(2026, 9, 1), local(2026, 9, 13))).toBe('12 días')
  })

  test('meses con y sin días', () => {
    expect(duration(local(2026, 1, 10), local(2026, 4, 10))).toBe('3 meses')
    expect(duration(local(2026, 1, 10), local(2026, 4, 14))).toBe(
      '3 meses y 4 días',
    )
    expect(duration(local(2026, 1, 10), local(2026, 2, 11))).toBe(
      '1 mes y 1 día',
    )
  })

  test('años, omitiendo componentes en 0', () => {
    expect(duration(local(2024, 5, 1), local(2025, 5, 1))).toBe('1 año')
    expect(duration(local(2022, 5, 1), local(2024, 8, 1))).toBe(
      '2 años y 3 meses',
    )
    expect(duration(local(2024, 6, 3), local(2025, 9, 15))).toBe(
      '1 año, 3 meses y 12 días',
    )
    expect(duration(local(2024, 6, 3), local(2025, 6, 4))).toBe('1 año y 1 día')
  })

  test('fin de mes en bisiesto', () => {
    expect(duration(local(2024, 1, 31), local(2024, 3, 1))).toBe(
      '1 mes y 1 día',
    )
  })

  test('mismo día', () => {
    expect(duration(local(2026, 9, 20, 10), local(2026, 9, 20, 22))).toBe(
      'En el mismo día',
    )
  })

  test('racha de un partido no tiene duración', () => {
    expect(duration(local(2026, 9, 20), local(2026, 9, 20), 1)).toBeNull()
  })

  test('sin fechas no tiene duración', () => {
    expect(duration(null, local(2026, 9, 20))).toBeNull()
    expect(duration(null, null)).toBeNull()
    expect(formatStreakDuration()).toBeNull()
  })
})

// La tarjeta trata count < 2 como vacía: el singular sólo se ve acá.
describe('getCountUnit', () => {
  test('singular con 1 y plural con el resto', () => {
    expect(getCountUnit(1, ['partido', 'partidos'])).toBe('partido')
    expect(getCountUnit(3, ['partido', 'partidos'])).toBe('partidos')
    expect(getCountUnit(1, ['torneo', 'torneos'])).toBe('torneo')
    expect(getCountUnit(3, ['torneo', 'torneos'])).toBe('torneos')
  })
})
