/* eslint-env jest */
import {
  HISTORY_START_DATE,
  PLAYER_PALETTE,
  buildAxisTicks,
  buildChartRows,
  buildPeriodRanking,
  buildPlayerColors,
  buildUpsetMatchesLink,
  computeYDomain,
  daysBetween,
  describeChartForScreenReaders,
  describeMatchResult,
  describePointProbability,
  describeUpsetProbability,
  formatChance,
  formatDay,
  getDefaultSelection,
  getPeriodOptions,
  getTodayArgentina,
  parseDay,
  parsePlayersParam,
  playerKey,
  readPenalties,
  readTeams,
  resolvePeriod,
  resolveSelection,
  resolveUpsetRatingChange,
  serializePlayersParam,
  shiftDays,
  shiftMonths,
} from './ratingHistory'

describe('getTodayArgentina', () => {
  test('uses the Argentine calendar day (UTC-3)', () => {
    expect(getTodayArgentina(new Date('2026-10-27T02:59:59.000Z'))).toBe(
      '2026-10-26',
    )
    expect(getTodayArgentina(new Date('2026-10-27T03:00:00.000Z'))).toBe(
      '2026-10-27',
    )
  })
})

describe('calendar arithmetic', () => {
  test('parseDay rejects non-existent days', () => {
    expect(parseDay('2026-02-30')).toBeNull()
    expect(parseDay('26-02-01')).toBeNull()
    expect(parseDay('')).toBeNull()
    expect(parseDay('2026-02-28')).toEqual({ year: 2026, month: 2, day: 28 })
  })

  test('formatDay shows DD/MM/YYYY', () => {
    expect(formatDay('2026-10-07')).toBe('07/10/2026')
    expect(formatDay('nope')).toBe('')
  })

  test('shiftDays crosses months and years', () => {
    expect(shiftDays('2026-10-27', -6)).toBe('2026-10-21')
    expect(shiftDays('2026-01-03', -6)).toBe('2025-12-28')
    expect(shiftDays('2028-02-28', 1)).toBe('2028-02-29')
  })

  test('shiftMonths caps to the last day of the target month', () => {
    expect(shiftMonths('2026-03-31', -1)).toBe('2026-02-28')
    expect(shiftMonths('2028-03-31', -1)).toBe('2028-02-29')
    expect(shiftMonths('2026-08-31', -6)).toBe('2026-02-28')
    expect(shiftMonths('2026-01-15', -3)).toBe('2025-10-15')
    expect(shiftMonths('2026-01-31', -12)).toBe('2025-01-31')
    expect(shiftMonths('2028-02-29', -12)).toBe('2027-02-28')
  })

  test('daysBetween counts calendar days', () => {
    expect(daysBetween('2026-10-01', '2026-10-31')).toBe(30)
    expect(daysBetween('2026-10-01', 'nope')).toBe(Infinity)
  })
})

describe('getPeriodOptions', () => {
  const today = '2026-10-27'
  const bySlug = () => {
    const { shortcuts, years } = getPeriodOptions(today)
    return Object.fromEntries([...shortcuts, ...years].map((o) => [o.slug, o]))
  }

  test('rolling shortcuts end today and count back from it', () => {
    const options = bySlug()
    expect(options.hoy).toMatchObject({
      dateFrom: '2026-10-27',
      dateTo: '2026-10-27',
    })
    // Hoy + los 6 días anteriores = 7 días.
    expect(options['ultima-semana']).toMatchObject({
      dateFrom: '2026-10-21',
      dateTo: '2026-10-27',
    })
    expect(options['ultimo-mes'].dateFrom).toBe('2026-09-27')
    expect(options['ultimos-3-meses'].dateFrom).toBe('2026-07-27')
    expect(options['ultimos-6-meses'].dateFrom).toBe('2026-04-27')
    expect(options['ultimo-anio']).toMatchObject({
      dateFrom: '2025-10-27',
      dateTo: '2026-10-27',
    })
    expect(options.todo).toMatchObject({
      dateFrom: HISTORY_START_DATE,
      dateTo: '2026-10-27',
    })
  })

  test('lists the shortcuts in the requested order', () => {
    expect(getPeriodOptions(today).shortcuts.map((o) => o.label)).toEqual([
      'Hoy',
      'Última semana',
      'Último mes',
      'Últimos 3 meses',
      'Últimos 6 meses',
      'Último año',
      'Todo el historial',
    ])
  })

  test('years go from the newest down to 2021 with the full calendar year', () => {
    const { years } = getPeriodOptions(today)
    expect(years.map((y) => y.slug)).toEqual([
      '2026',
      '2025',
      '2024',
      '2023',
      '2022',
      '2021',
    ])
    expect(years[0]).toMatchObject({
      dateFrom: '2026-01-01',
      dateTo: '2026-12-31',
    })
  })

  test('a newer current year is added on top', () => {
    const { years } = getPeriodOptions('2027-03-01')
    expect(years[0].slug).toBe('2027')
    expect(years).toHaveLength(7)
  })

  test('an older current year never drops 2026', () => {
    const { years } = getPeriodOptions('2025-05-05')
    expect(years.map((y) => y.slug)).toEqual([
      '2026',
      '2025',
      '2024',
      '2023',
      '2022',
      '2021',
    ])
  })
})

describe('resolvePeriod', () => {
  const today = '2026-10-27'

  test('defaults to the last year', () => {
    expect(resolvePeriod({}, today)).toMatchObject({
      status: 'ok',
      slug: 'ultimo-anio',
      dateFrom: '2025-10-27',
      dateTo: '2026-10-27',
    })
  })

  test('a valid shortcut wins over dates', () => {
    expect(
      resolvePeriod(
        { period: '2024', dateFrom: '2026-01-01', dateTo: '2026-02-01' },
        today,
      ),
    ).toMatchObject({
      slug: '2024',
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31',
    })
  })

  test('an unknown shortcut falls back to the free range or the default', () => {
    expect(
      resolvePeriod(
        { period: 'nope', dateFrom: '2026-01-01', dateTo: '2026-02-01' },
        today,
      ),
    ).toMatchObject({ status: 'ok', slug: null, dateFrom: '2026-01-01' })
    expect(resolvePeriod({ period: 'nope' }, today).slug).toBe('ultimo-anio')
  })

  test('free ranges resolve to themselves', () => {
    expect(
      resolvePeriod({ dateFrom: '2026-01-01', dateTo: '2026-01-01' }, today),
    ).toMatchObject({
      status: 'ok',
      dateFrom: '2026-01-01',
      dateTo: '2026-01-01',
    })
  })

  test('a single or invalid date is incomplete and keeps the valid one', () => {
    expect(resolvePeriod({ dateFrom: '2026-01-01' }, today)).toMatchObject({
      status: 'incomplete',
      dateFrom: '2026-01-01',
      dateTo: '',
    })
    expect(
      resolvePeriod({ dateFrom: '2026-02-30', dateTo: '2026-03-01' }, today),
    ).toMatchObject({
      status: 'incomplete',
      dateFrom: '',
      dateTo: '2026-03-01',
    })
  })

  test('an inverted range is reported', () => {
    const result = resolvePeriod(
      { dateFrom: '2026-05-01', dateTo: '2026-04-01' },
      today,
    )
    expect(result.status).toBe('inverted')
    expect(result.message).toMatch(/inicio/)
  })
})

describe('player colors', () => {
  test('are assigned by sorted id and do not depend on the order given', () => {
    const a = buildPlayerColors(['c', 'a', 'b'])
    const b = buildPlayerColors(['b', 'c', 'a', 'a'])
    expect([...a.entries()]).toEqual([...b.entries()])
    expect(a.get('a')).toBe(PLAYER_PALETTE[0])
    expect(a.get('c')).toBe(PLAYER_PALETTE[2])
  })

  test('are stable when a smaller set contains the same ids', () => {
    const all = buildPlayerColors(['a', 'b', 'c'])
    expect(all.get('b')).toBe(PLAYER_PALETTE[1])
  })

  test('wrap around after the palette ends', () => {
    const ids = Array.from(
      { length: 12 },
      (_, i) => `id${String(i).padStart(2, '0')}`,
    )
    const colors = buildPlayerColors(ids)
    expect(colors.get('id10')).toBe(PLAYER_PALETTE[0])
  })

  test('the palette has distinct colors with at least 3:1 contrast on white', () => {
    const luminance = (hex) => {
      const [r, g, b] = [1, 3, 5]
        .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    expect(new Set(PLAYER_PALETTE).size).toBe(PLAYER_PALETTE.length)
    PLAYER_PALETTE.forEach((hex) => {
      expect(1.05 / (luminance(hex) + 0.05)).toBeGreaterThanOrEqual(3)
    })
  })
})

describe('players param', () => {
  test('absent means default selection', () => {
    expect(parsePlayersParam([])).toBeNull()
    expect(parsePlayersParam([''])).toBeNull()
  })

  test('none means nobody', () => {
    expect(parsePlayersParam(['none'])).toEqual([])
    expect(parsePlayersParam(['a', 'none'])).toEqual([])
  })

  test('repeated values are deduplicated', () => {
    expect(parsePlayersParam(['a', 'b', 'a'])).toEqual(['a', 'b'])
  })

  test('serializes a selection and the empty selection', () => {
    expect(serializePlayersParam(['a', 'b'])).toEqual(['a', 'b'])
    expect(serializePlayersParam([])).toEqual(['none'])
    expect(parsePlayersParam(serializePlayersParam([]))).toEqual([])
  })
})

const entry = (id, endRating, extra = {}) => ({
  player: { id, name: id.toUpperCase() },
  start: { rating: 1500, matches: 10 },
  end: { rating: endRating, matches: 11 },
  summary: { ratingChange: endRating - 1500 },
  points: [],
  ...extra,
})

describe('default selection', () => {
  test('is everyone with 8 players or fewer', () => {
    const players = ['a', 'b', 'c', 'd', 'e'].map((id, i) =>
      entry(id, 1500 + i),
    )
    expect(getDefaultSelection(players)).toEqual(['a', 'b', 'c', 'd', 'e'])
  })

  test('is the top 8 by final rating with more players', () => {
    const players = Array.from({ length: 12 }, (_, i) =>
      entry(`p${String(i).padStart(2, '0')}`, 1400 + i * 10),
    )
    const selection = getDefaultSelection(players)
    expect(selection).toHaveLength(8)
    expect(selection[0]).toBe('p11')
    expect(selection).not.toContain('p00')
    expect(selection).not.toContain('p03')
    expect(selection).toContain('p04')
  })

  test('resolveSelection ignores unknown ids and falls back when none match', () => {
    const players = [entry('a', 1510), entry('b', 1490)]
    expect(resolveSelection(null, players)).toEqual(['a', 'b'])
    expect(resolveSelection([], players)).toEqual([])
    expect(resolveSelection(['b', 'zzz'], players)).toEqual(['b'])
    expect(resolveSelection(['zzz'], players)).toEqual(['a', 'b'])
  })
})

describe('buildChartRows', () => {
  const point = (x, rating, extra = {}) => ({
    x,
    seq: x + 100,
    rating,
    delta: 1,
    ...extra,
  })
  const timeline = [
    { x: 1, seq: 101, t: '2026-10-01T15:00:00.000Z' },
    { x: 2, seq: 102, t: '2026-10-01T15:00:00.000Z' },
    { x: 3, seq: 103, t: '2026-10-02T15:00:00.000Z' },
  ]
  const players = [
    entry('a', 1505, {
      start: { rating: 1500, matches: 4 },
      points: [point(1, 1510), point(3, 1505)],
    }),
    // Debuta en el partido 2.
    entry('b', 1490, {
      start: null,
      points: [point(2, 1490)],
    }),
    // No juega en el período.
    entry('c', 1450, {
      start: { rating: 1450, matches: 9 },
      points: [],
    }),
  ]

  test('starts with an x = 0 row and carries the last value forward', () => {
    const rows = buildChartRows({
      timeline,
      players,
      selectedIds: ['a', 'b', 'c'],
    })
    expect(rows.map((row) => row.x)).toEqual([0, 1, 2, 3])
    expect(rows.map((row) => row[playerKey('a')])).toEqual([
      1500, 1510, 1510, 1505,
    ])
  })

  test('a debuting player is null until the first match', () => {
    const rows = buildChartRows({ timeline, players, selectedIds: ['b'] })
    expect(rows.map((row) => row[playerKey('b')])).toEqual([
      null,
      null,
      1490,
      1490,
    ])
  })

  test('a player without matches is flat', () => {
    const rows = buildChartRows({ timeline, players, selectedIds: ['c'] })
    expect(rows.map((row) => row[playerKey('c')])).toEqual([
      1450, 1450, 1450, 1450,
    ])
  })

  test('only includes the selected players and keeps the shared x axis', () => {
    const rows = buildChartRows({ timeline, players, selectedIds: ['b'] })
    expect(rows).toHaveLength(4)
    expect(rows[1]).not.toHaveProperty(playerKey('a'))
  })

  test('keeps the match detail of the players who played each row', () => {
    const rows = buildChartRows({ timeline, players, selectedIds: ['a', 'b'] })
    expect(Object.keys(rows[1].points)).toEqual(['a'])
    expect(Object.keys(rows[2].points)).toEqual(['b'])
    expect(rows[3].points.a.rating).toBe(1505)
  })

  test('no selection gives only the structure rows', () => {
    const rows = buildChartRows({ timeline, players, selectedIds: [] })
    expect(rows).toHaveLength(4)
  })

  test('computeYDomain always includes the 1500 reference', () => {
    const rows = buildChartRows({ timeline, players, selectedIds: ['a'] })
    expect(computeYDomain(rows, ['a'])).toEqual([1490, 1520])
    const lowRows = buildChartRows({ timeline, players, selectedIds: ['c'] })
    expect(computeYDomain(lowRows, ['c'])).toEqual([1440, 1510])
    expect(computeYDomain(rows, [])).toEqual([1490, 1510])
  })
})

describe('buildAxisTicks', () => {
  const at = (x, iso) => ({ x, seq: x, t: iso })

  test('marks the first match of each month and shows the year at the start', () => {
    const timeline = [
      at(1, '2026-09-30T12:00:00.000Z'),
      at(2, '2026-09-30T18:00:00.000Z'),
      at(3, '2026-10-01T15:00:00.000Z'),
      at(4, '2026-10-20T15:00:00.000Z'),
      at(5, '2026-11-05T15:00:00.000Z'),
    ]
    expect(
      buildAxisTicks(timeline, {
        dateFrom: '2026-01-01',
        dateTo: '2026-12-31',
      }),
    ).toEqual([
      { x: 1, label: 'sep 2026' },
      { x: 3, label: 'oct' },
      { x: 5, label: 'nov' },
    ])
  })

  test('uses the Argentine day to group matches near midnight UTC', () => {
    const timeline = [
      at(1, '2026-10-01T01:00:00.000Z'),
      at(2, '2026-10-01T15:00:00.000Z'),
    ]
    // 01:00Z del 1/10 todavía es 30/09 en Argentina.
    expect(
      buildAxisTicks(timeline, {
        dateFrom: '2026-01-01',
        dateTo: '2026-12-31',
      }),
    ).toEqual([
      { x: 1, label: 'sep 2026' },
      { x: 2, label: 'oct' },
    ])
  })

  test('adds the year again when it changes', () => {
    const timeline = [
      at(1, '2026-12-10T15:00:00.000Z'),
      at(2, '2027-01-03T15:00:00.000Z'),
    ]
    expect(
      buildAxisTicks(timeline, {
        dateFrom: '2026-01-01',
        dateTo: '2027-12-31',
      }),
    ).toEqual([
      { x: 1, label: 'dic 2026' },
      { x: 2, label: 'ene 2027' },
    ])
  })

  test('marks each day when the period lasts 31 days or less', () => {
    const timeline = [
      at(1, '2026-10-01T15:00:00.000Z'),
      at(2, '2026-10-01T16:00:00.000Z'),
      at(3, '2026-10-02T15:00:00.000Z'),
    ]
    expect(
      buildAxisTicks(timeline, {
        dateFrom: '2026-10-01',
        dateTo: '2026-10-31',
      }),
    ).toEqual([
      { x: 1, label: '1 oct 2026' },
      { x: 3, label: '2 oct' },
    ])
  })

  test('thins the ticks keeping the first and the last', () => {
    const timeline = Array.from({ length: 20 }, (_, i) =>
      at(i + 1, new Date(Date.UTC(2025, i, 15, 15)).toISOString()),
    )
    const ticks = buildAxisTicks(timeline, {
      dateFrom: '2025-01-01',
      dateTo: '2026-12-31',
    })
    expect(ticks.length).toBeLessThanOrEqual(8)
    expect(ticks[0].x).toBe(1)
    expect(ticks[ticks.length - 1].x).toBe(20)
  })

  test('skips matches without date', () => {
    expect(
      buildAxisTicks([{ x: 1, seq: 1, t: null }], {
        dateFrom: '2026-01-01',
        dateTo: '2026-12-31',
      }),
    ).toEqual([])
  })
})

describe('buildPeriodRanking', () => {
  test('sorts by rating change and breaks ties by final rating', () => {
    const players = [
      entry('a', 1510),
      entry('b', 1530),
      entry('c', 1510, { end: { rating: 1520, matches: 5 } }),
      entry('d', 1480),
    ]
    const ranking = buildPeriodRanking(players)
    expect(ranking.map((row) => row.player.id)).toEqual(['b', 'c', 'a', 'd'])
  })

  test('players tied on rating change share the rank number', () => {
    const players = [entry('a', 1510), entry('b', 1530), entry('c', 1510)]
    expect(buildPeriodRanking(players).map((row) => row.rank)).toEqual([
      1, 2, 2,
    ])
    expect(
      buildPeriodRanking([
        entry('a', 1510),
        entry('b', 1510),
        entry('c', 1400),
      ]).map((row) => row.rank),
    ).toEqual([1, 1, 3])
  })

  test('does not mutate its input', () => {
    const players = [entry('a', 1400), entry('b', 1600)]
    buildPeriodRanking(players)
    expect(players.map((row) => row.player.id)).toEqual(['a', 'b'])
  })
})

describe('buildUpsetMatchesLink', () => {
  test('links to /matches filtered by both players and the match day', () => {
    const link = buildUpsetMatchesLink('p1', {
      t: '2026-10-11T02:00:00.000Z',
      opponent: { id: 'p2', name: 'Santi' },
    })
    const url = new URL(link, 'http://x')
    expect(url.pathname).toBe('/matches')
    expect(Object.fromEntries(url.searchParams)).toEqual({
      player1: 'p1',
      player2: 'p2',
      // 02:00Z todavía es el día anterior en Argentina.
      dateFrom: '2026-10-10',
      dateTo: '2026-10-10',
    })
  })

  test('returns null when data is missing', () => {
    expect(buildUpsetMatchesLink('p1', null)).toBeNull()
    expect(
      buildUpsetMatchesLink('p1', { t: null, opponent: { id: 'x' } }),
    ).toBeNull()
    expect(
      buildUpsetMatchesLink('p1', { t: '2026-10-11T12:00:00Z', opponent: {} }),
    ).toBeNull()
  })
})

describe('describeChartForScreenReaders', () => {
  test('summarizes the period and each player', () => {
    const text = describeChartForScreenReaders({
      players: [
        {
          player: { name: 'Nico' },
          start: { rating: 1500 },
          end: { rating: 1532.4 },
          summary: { ratingChange: 32.4 },
        },
        {
          player: { name: 'Lalo' },
          start: null,
          end: { rating: 1490 },
          summary: { ratingChange: -10 },
        },
      ],
      dateFrom: '2026-01-01',
      dateTo: '2026-12-31',
      matchesInPeriod: 12,
    })
    expect(text).toContain('del 01/01/2026 al 31/12/2026, en 12 partidos')
    expect(text).toContain('Nico: de 1500 a 1532 (+32.4).')
    expect(text).toContain(
      'Lalo: debutó en el período y terminó en 1490 (-10.0).',
    )
  })

  test('says so when nobody is selected', () => {
    expect(
      describeChartForScreenReaders({
        players: [],
        dateFrom: '2026-01-01',
        dateTo: '2026-01-01',
        matchesInPeriod: 1,
      }),
    ).toContain('No hay jugadores seleccionados.')
  })
})

describe('formatChance', () => {
  test('rounds to a whole percent', () => {
    expect(formatChance(0.274)).toBe('27%')
    expect(formatChance(0.275)).toBe('28%')
    expect(formatChance(0.5)).toBe('50%')
    expect(formatChance(1)).toBe('100%')
  })
  test('says "menos de 1%" when it rounds to zero', () => {
    expect(formatChance(0.004)).toBe('menos de 1%')
    expect(formatChance(0)).toBe('menos de 1%')
    expect(formatChance(0.005)).toBe('1%')
  })
  test('returns null for anything that is not a probability', () => {
    expect(formatChance(null)).toBeNull()
    expect(formatChance(undefined)).toBeNull()
    expect(formatChance(NaN)).toBeNull()
    expect(formatChance('0.3')).toBeNull()
    expect(formatChance(-0.1)).toBeNull()
    expect(formatChance(1.2)).toBeNull()
  })
})

describe('describeUpsetProbability', () => {
  const win = { kind: 'win', for: 0.274, against: 0.41 }
  const advance = { kind: 'advance', for: 0.274, against: 0.726 }

  test('won upset: chances of winning or advancing (for)', () => {
    expect(describeUpsetProbability('won', win)).toBe(
      'Tenía 27% de chances de ganar',
    )
    expect(describeUpsetProbability('won', advance)).toBe(
      'Tenía 27% de chances de avanzar',
    )
  })
  test('lost upset: chances of losing or being eliminated (against)', () => {
    expect(describeUpsetProbability('lost', win)).toBe(
      'Tenía 41% de chances de perder',
    )
    expect(describeUpsetProbability('lost', advance)).toBe(
      'Tenía 73% de chances de quedar eliminado',
    )
  })
  test('uses "menos de 1%"', () => {
    expect(
      describeUpsetProbability('won', {
        kind: 'win',
        for: 0.002,
        against: 0.5,
      }),
    ).toBe('Tenía menos de 1% de chances de ganar')
  })
  test('returns null without usable data', () => {
    expect(describeUpsetProbability('won', null)).toBeNull()
    expect(describeUpsetProbability('won', undefined)).toBeNull()
    expect(
      describeUpsetProbability('won', { kind: 'otro', for: 0.3 }),
    ).toBeNull()
    expect(describeUpsetProbability('won', { kind: 'win' })).toBeNull()
    expect(describeUpsetProbability('other', win)).toBeNull()
  })
})

describe('describePointProbability', () => {
  test('describes the chance of the player in the match', () => {
    expect(
      describePointProbability({ kind: 'win', for: 0.62, against: 0.2 }),
    ).toBe('Chances de ganar: 62%')
    expect(
      describePointProbability({ kind: 'advance', for: 0.62, against: 0.38 }),
    ).toBe('Chances de avanzar: 62%')
  })
  test('returns null without probability', () => {
    expect(describePointProbability(null)).toBeNull()
    expect(describePointProbability(undefined)).toBeNull()
    expect(describePointProbability({ kind: 'win', for: null })).toBeNull()
  })
})

describe('readPenalties', () => {
  test('returns the shootout', () => {
    expect(readPenalties({ for: 4, against: 3 })).toEqual({
      for: 4,
      against: 3,
    })
    expect(readPenalties({ for: 0, against: 0 })).toEqual({
      for: 0,
      against: 0,
    })
  })
  test('returns null when it is missing or invalid', () => {
    expect(readPenalties(null)).toBeNull()
    expect(readPenalties(undefined)).toBeNull()
    expect(readPenalties({ for: 4 })).toBeNull()
    expect(readPenalties({ for: -1, against: 3 })).toBeNull()
    expect(readPenalties({ for: 1.5, against: 3 })).toBeNull()
    expect(readPenalties({ for: '4', against: '3' })).toBeNull()
  })
})

describe('readTeams', () => {
  test('reads { id, name } for each side', () => {
    expect(
      readTeams({
        for: { id: 1, name: ' Boca ' },
        against: { id: '2', name: 'River' },
      }),
    ).toEqual({
      for: { id: 1, name: 'Boca' },
      against: { id: '2', name: 'River' },
    })
  })
  test('keeps whichever of id or name is known', () => {
    expect(
      readTeams({
        for: { id: 5, name: null },
        against: { id: null, name: 'River' },
      }),
    ).toEqual({
      for: { id: 5, name: null },
      against: { id: null, name: 'River' },
    })
  })
  test('accepts the plain-text names of a BE without ids', () => {
    expect(readTeams({ for: 'Boca', against: '  ' })).toEqual({
      for: { id: null, name: 'Boca' },
      against: null,
    })
  })
  test('gives null for missing or unusable sides', () => {
    const none = { for: null, against: null }
    for (const teams of [
      undefined,
      null,
      {},
      none,
      { for: {}, against: { id: null, name: '' } },
      { for: '', against: '   ' },
      { for: 7, against: [] },
    ]) {
      expect(readTeams(teams)).toEqual(none)
    }
  })
  test('keeps each side independent', () => {
    expect(readTeams({ for: { id: 1, name: 'Boca' } })).toEqual({
      for: { id: 1, name: 'Boca' },
      against: null,
    })
  })
  test('drops ids that cannot go in a logo URL', () => {
    const { for: side } = readTeams({
      for: { id: '../x?y', name: 'Boca' },
      against: null,
    })
    expect(side).toEqual({ id: null, name: 'Boca' })
    expect(readTeams({ for: { id: NaN, name: null } }).for).toBeNull()
  })
})

describe('describeMatchResult', () => {
  const base = {
    playerName: 'Nico',
    opponentName: 'Santi',
    teams: {
      for: { id: 1, name: 'Boca' },
      against: { id: 2, name: 'River' },
    },
  }
  test('says who won, with the teams', () => {
    expect(
      describeMatchResult({ ...base, score: { for: 2, against: 1 } }),
    ).toBe('Nico (Boca) ganó 2-1 contra Santi (River)')
    expect(
      describeMatchResult({ ...base, score: { for: 0, against: 1 } }),
    ).toBe('Nico (Boca) perdió 0-1 contra Santi (River)')
  })
  test('describes a draw, with the shootout if there was one', () => {
    const score = { for: 2, against: 2 }
    expect(describeMatchResult({ ...base, score })).toBe(
      'Nico (Boca) empató 2-2 con Santi (River)',
    )
    expect(
      describeMatchResult({
        ...base,
        score,
        penalties: { for: 3, against: 4 },
      }),
    ).toBe('Nico (Boca) empató 2-2 con Santi (River), penales 3-4')
  })
  test('leaves out the teams that are not known', () => {
    const score = { for: 2, against: 1 }
    expect(describeMatchResult({ ...base, score, teams: undefined })).toBe(
      'Nico ganó 2-1 contra Santi',
    )
    expect(
      describeMatchResult({
        ...base,
        score,
        teams: { for: null, against: { id: 2, name: 'River' } },
      }),
    ).toBe('Nico ganó 2-1 contra Santi (River)')
  })
  test('uses the full team name, never the abbreviation, and ignores ids alone', () => {
    const score = { for: 2, against: 1 }
    expect(
      describeMatchResult({
        ...base,
        score,
        teams: {
          for: { id: 1, name: 'Boca Juniors' },
          against: { id: 2, name: null },
        },
      }),
    ).toBe('Nico (Boca Juniors) ganó 2-1 contra Santi')
    expect(
      describeMatchResult({
        ...base,
        score,
        teams: { for: 'Boca', against: 'River' },
      }),
    ).toBe('Nico (Boca) ganó 2-1 contra Santi (River)')
  })
})

describe('resolveUpsetRatingChange', () => {
  test('uses the signed ratingChange from the BE', () => {
    expect(resolveUpsetRatingChange('won', { ratingChange: 7.4 })).toBe(7.4)
    expect(
      resolveUpsetRatingChange('lost', {
        ratingChange: -7.4,
        ratingSwing: 7.4,
      }),
    ).toBe(-7.4)
  })
  test('derives the sign from ratingSwing with an older BE', () => {
    expect(resolveUpsetRatingChange('won', { ratingSwing: 7.4 })).toBe(7.4)
    expect(resolveUpsetRatingChange('lost', { ratingSwing: 7.4 })).toBe(-7.4)
  })
  test('returns null without data', () => {
    expect(resolveUpsetRatingChange('won', {})).toBeNull()
    expect(resolveUpsetRatingChange('won', null)).toBeNull()
  })
})
