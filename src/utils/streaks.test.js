/* eslint-env jest */
import {
  buildStreakMatchesLink,
  calendarDiff,
  formatStreakDuration,
  getCountUnit,
  toArgentinaDay,
} from './streaks'

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

describe('toArgentinaDay', () => {
  test('convierte a día de Argentina (UTC-3) alrededor de la medianoche UTC', () => {
    // 23:30 del 22/10 en Argentina es 02:30 UTC del 23/10.
    expect(toArgentinaDay('2024-10-23T02:30:00.000Z')).toBe('2024-10-22')
    // 00:00 del 23/10 en Argentina.
    expect(toArgentinaDay('2024-10-23T03:00:00.000Z')).toBe('2024-10-23')
    expect(toArgentinaDay('2024-10-23T02:59:59.999Z')).toBe('2024-10-22')
    // Cambio de año y Date.
    expect(toArgentinaDay(new Date('2025-01-01T01:00:00.000Z'))).toBe(
      '2024-12-31',
    )
    expect(toArgentinaDay('2024-07-08T15:00:00.000Z')).toBe('2024-07-08')
  })

  test('null, vacío o fecha inválida devuelve null', () => {
    expect(toArgentinaDay(null)).toBeNull()
    expect(toArgentinaDay(undefined)).toBeNull()
    expect(toArgentinaDay('')).toBeNull()
    expect(toArgentinaDay('no-es-fecha')).toBeNull()
  })
})

describe('buildStreakMatchesLink', () => {
  const START = '2024-07-08T22:00:00.000Z'
  // 23:30 del 22/10 en Argentina: no corre el día.
  const END = '2024-10-23T02:30:00.000Z'

  const holder = (overrides) => ({
    id: 'p1',
    name: 'Nico',
    isActive: false,
    startDate: START,
    startDatePrecision: 'exact',
    endDate: END,
    endDatePrecision: 'exact',
    ...overrides,
  })

  const linkOf = (recordKey, overrides) =>
    buildStreakMatchesLink(recordKey, holder(overrides))

  // Query string completo de cada racha de partidos: jugador, filtros de la
  // familia y rango de días, sin parámetros de más.
  const RANGE = 'dateFrom=2024-07-08&dateTo=2024-10-22'

  test.each([
    ['most_unbeaten_in_a_row', ''],
    ['most_wins_in_a_row', 'outcome=win&'],
    ['most_draws_in_a_row', 'outcome=draw&'],
    ['most_losses_in_a_row', 'outcome=loss&'],
    [
      'most_consecutive_matches_scoring_1_plus_goals',
      'player1GoalsOp=gte&player1GoalsVal=1&',
    ],
    [
      'most_consecutive_matches_scoring_2_plus_goals',
      'player1GoalsOp=gte&player1GoalsVal=2&',
    ],
    [
      'most_consecutive_matches_scoring_3_plus_goals',
      'player1GoalsOp=gte&player1GoalsVal=3&',
    ],
    [
      'most_clean_sheets_in_a_row',
      'player1ConcededOp=eq&player1ConcededVal=0&',
    ],
    ['most_penalty_shootout_wins_in_a_row', 'outcome=penalties&'],
    ['most_knockout_unbeaten_in_a_row', 'type=knockout&'],
    [
      'most_knockout_wins_in_a_row',
      'type=knockout&outcome=winIncludingPenalties&',
    ],
  ])('%s: jugador, filtros de la racha y rango de días', (recordKey, extra) => {
    expect(linkOf(recordKey)).toBe(`/matches?player1=p1&${extra}${RANGE}`)
  })

  const tournamentHolder = (overrides) => ({
    // Fechas del poseedor: cierre de cada torneo.
    startDate: '2019-08-01T15:00:00.000Z',
    endDate: '2022-07-10T15:00:00.000Z',
    startTournament: {
      ongoing: false,
      firstPlayoffPlayedAt: '2019-07-02T02:00:00.000Z',
      lastPlayoffPlayedAt: '2019-07-20T15:00:00.000Z',
      // 23:30 del 10/07 en Argentina.
      firstSemifinalPlayedAt: '2019-07-11T02:30:00.000Z',
      lastSemifinalPlayedAt: '2019-07-12T15:00:00.000Z',
      firstFinalPlayedAt: '2019-07-20T15:00:00.000Z',
      lastFinalPlayedAt: '2019-07-20T15:00:00.000Z',
    },
    endTournament: {
      ongoing: false,
      firstPlayoffPlayedAt: '2022-06-01T15:00:00.000Z',
      lastPlayoffPlayedAt: '2022-07-04T02:30:00.000Z',
      firstSemifinalPlayedAt: '2022-06-20T15:00:00.000Z',
      lastSemifinalPlayedAt: '2022-06-25T15:00:00.000Z',
      // 23:30 del 03/07 en Argentina.
      firstFinalPlayedAt: '2022-07-04T02:30:00.000Z',
      lastFinalPlayedAt: '2022-07-04T02:30:00.000Z',
    },
    ...overrides,
  })

  test('semis consecutivas: playoffRound=semifinal, de la primera a la última semi', () => {
    expect(linkOf('most_consecutive_semifinals', tournamentHolder())).toBe(
      '/matches?player1=p1&type=playoff&playoffRound=semifinal&dateFrom=2019-07-10&dateTo=2022-06-25',
    )
  })

  test('finales consecutivas: playoffRound=final, de la primera a la última final', () => {
    expect(linkOf('most_consecutive_finals', tournamentHolder())).toBe(
      '/matches?player1=p1&type=playoff&playoffRound=final&dateFrom=2019-07-20&dateTo=2022-07-03',
    )
  })

  test('campeonatos consecutivos: finales ganadas, incluso por penales', () => {
    expect(linkOf('most_consecutive_titles', tournamentHolder())).toBe(
      '/matches?player1=p1&type=playoff&playoffRound=final&outcome=winIncludingPenalties&dateFrom=2019-07-20&dateTo=2022-07-03',
    )
  })

  test('torneos sin fechas de la ronda: cae al primer/último partido de playoff', () => {
    const noRound = {
      firstSemifinalPlayedAt: null,
      lastSemifinalPlayedAt: null,
      firstFinalPlayedAt: null,
      lastFinalPlayedAt: null,
    }
    const holderWithoutRounds = tournamentHolder({
      startTournament: { ...tournamentHolder().startTournament, ...noRound },
      endTournament: { ...tournamentHolder().endTournament, ...noRound },
    })
    expect(linkOf('most_consecutive_semifinals', holderWithoutRounds)).toBe(
      '/matches?player1=p1&type=playoff&playoffRound=semifinal&dateFrom=2019-07-01&dateTo=2022-07-03',
    )
  })

  test('torneos sin las fechas de playoff (BE viejo): cae a las del poseedor', () => {
    expect(
      linkOf(
        'most_consecutive_titles',
        tournamentHolder({
          startTournament: { ongoing: false },
          endTournament: { ongoing: false, lastPlayoffPlayedAt: null },
        }),
      ),
    ).toBe(
      '/matches?player1=p1&type=playoff&playoffRound=final&outcome=winIncludingPenalties&dateFrom=2019-08-01&dateTo=2022-07-10',
    )
  })

  test('racha activa: sin dateTo', () => {
    expect(linkOf('most_wins_in_a_row', { isActive: true })).toBe(
      '/matches?player1=p1&outcome=win&dateFrom=2024-07-08',
    )
    expect(
      linkOf('most_consecutive_finals', tournamentHolder({ isActive: true })),
    ).toBe(
      '/matches?player1=p1&type=playoff&playoffRound=final&dateFrom=2019-07-20',
    )
  })

  test('torneo final en curso: sin dateTo aunque la racha no figure activa', () => {
    expect(
      linkOf(
        'most_consecutive_semifinals',
        tournamentHolder({
          endTournament: {
            ongoing: true,
            lastPlayoffPlayedAt: '2026-09-20T15:00:00.000Z',
          },
        }),
      ),
    ).toBe(
      '/matches?player1=p1&type=playoff&playoffRound=semifinal&dateFrom=2019-07-10',
    )
  })

  test('cerrada sin fecha de fin: sin dateTo', () => {
    expect(linkOf('most_wins_in_a_row', { endDate: null })).toBe(
      '/matches?player1=p1&outcome=win&dateFrom=2024-07-08',
    )
  })

  test('sin fecha de inicio, sin id o clave desconocida: null', () => {
    expect(linkOf('most_wins_in_a_row', { startDate: null })).toBeNull()
    expect(
      linkOf('most_consecutive_titles', tournamentHolder({ startDate: null })),
    ).toBeNull()
    expect(linkOf('most_wins_in_a_row', { id: null })).toBeNull()
    expect(
      linkOf('most_wins_in_a_row', { startDate: 'no-es-fecha' }),
    ).toBeNull()
    expect(linkOf('most_magic_in_a_row')).toBeNull()
    expect(buildStreakMatchesLink('most_wins_in_a_row', null)).toBeNull()
  })

  test('empate: cada poseedor con su jugador y su rango', () => {
    const holders = [
      holder({ isActive: true }),
      holder({
        id: 'p3',
        startDate: '2023-01-10T12:00:00.000Z',
        endDate: '2023-03-01T12:00:00.000Z',
      }),
    ]
    expect(
      holders.map((entry) =>
        buildStreakMatchesLink('most_unbeaten_in_a_row', entry),
      ),
    ).toEqual([
      '/matches?player1=p1&dateFrom=2024-07-08',
      '/matches?player1=p3&dateFrom=2023-01-10&dateTo=2023-03-01',
    ])
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
