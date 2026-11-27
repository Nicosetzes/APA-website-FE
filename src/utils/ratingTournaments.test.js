/* eslint-env jest */
import {
  TOURNAMENT_METRICS,
  buildPlayerTournamentRows,
  buildTournamentPlayerRows,
  buildTournamentSummaries,
  formatTournamentMetric,
  formatTournamentRange,
  getTournamentMetricTrend,
  normalizeTournamentComparisons,
  sortTournamentRows,
} from './ratingTournaments'

const data = {
  players: [
    { id: 'n', name: 'Nico' },
    { id: 's', name: 'Santi' },
    { id: 'm', name: 'Mati' },
  ],
  tournaments: [
    {
      id: 't1',
      name: 'Copa Uno',
      firstPlayedAt: '2021-01-10T12:00:00.000Z',
      firstPlayedAtPrecision: 'day',
      lastPlayedAt: '2021-01-12T12:00:00.000Z',
      lastPlayedAtPrecision: 'day',
    },
    { id: 't2', name: 'Copa Dos' },
    { id: 't3', name: 'Copa Breve' },
  ],
  performances: [
    {
      tournamentId: 't1',
      playerId: 'n',
      matches: 6,
      record: { wins: 4, draws: 1, losses: 1 },
      ratingChange: 5,
      actualPercentage: 75,
      expectedPercentage: 60,
      differencePercentagePoints: 15,
      teamAdjustmentPercentagePoints: null,
      comparable: true,
    },
    {
      tournamentId: 't2',
      playerId: 'n',
      matches: 5,
      record: { wins: 1, draws: 2, losses: 2 },
      ratingChange: -2,
      actualPercentage: 40,
      expectedPercentage: 50,
      differencePercentagePoints: -10,
      teamAdjustmentPercentagePoints: 0,
      comparable: true,
    },
    {
      tournamentId: 't3',
      playerId: 'n',
      matches: 2,
      record: { wins: 2, draws: 0, losses: 0 },
      ratingChange: 100,
      actualPercentage: 100,
      expectedPercentage: 20,
      differencePercentagePoints: 80,
      teamAdjustmentPercentagePoints: 3,
      comparable: false,
    },
    {
      tournamentId: 't1',
      playerId: 's',
      matches: 6,
      record: { wins: 1, draws: 1, losses: 4 },
      ratingChange: -5,
      actualPercentage: 25,
      expectedPercentage: 40,
      differencePercentagePoints: -15,
      teamAdjustmentPercentagePoints: 0,
      comparable: true,
    },
  ],
}

test('normalizes the aggregate without collapsing null and zero', () => {
  const normalized = normalizeTournamentComparisons(data)

  expect(normalized.performances[0]).toEqual(
    expect.objectContaining({
      playerId: 'n',
      playerName: 'Nico',
      tournamentId: 't1',
      tournamentName: 'Copa Uno',
      matches: 6,
      record: { wins: 4, draws: 1, losses: 1 },
      teamAdjustmentPercentagePoints: null,
      comparable: true,
    }),
  )
  expect(normalized.performances[1].teamAdjustmentPercentagePoints).toBe(0)
})

test('builds one player-mode row per primary tournament and pairs an optional comparison', () => {
  const { performances } = normalizeTournamentComparisons(data)
  const rows = buildPlayerTournamentRows(performances, 'n', 's')

  expect(rows).toHaveLength(3)
  expect(rows[0]).toEqual(
    expect.objectContaining({
      id: 't1',
      primary: expect.objectContaining({ playerId: 'n' }),
      comparison: expect.objectContaining({ playerId: 's' }),
    }),
  )
  expect(rows[1].comparison).toBeNull()
  expect(buildPlayerTournamentRows(performances, 'n')).toHaveLength(3)
})

test('builds one tournament-mode row per participant', () => {
  const { performances } = normalizeTournamentComparisons(data)
  const rows = buildTournamentPlayerRows(performances, 't1')

  expect(rows.map(({ playerId }) => playerId)).toEqual(['n', 's'])
  expect(rows.every(({ comparison }) => comparison === null)).toBe(true)
})

test('sorts player rows only by the primary performance and remains stable on ties', () => {
  const { performances } = normalizeTournamentComparisons(data)
  const rows = buildPlayerTournamentRows(performances, 'n', 's')
  const withMisleadingComparison = rows.map((row, index) => ({
    ...row,
    comparison: row.comparison
      ? { ...row.comparison, ratingChange: index === 0 ? -1000 : 1000 }
      : null,
  }))

  expect(
    sortTournamentRows(withMisleadingComparison, {
      key: 'ratingChange',
      direction: 'asc',
    }).map(({ tournamentId }) => tournamentId),
  ).toEqual(['t2', 't1', 't3'])

  const tied = rows.map((row) => ({
    ...row,
    primary: { ...row.primary, ratingChange: 0 },
  }))
  expect(
    sortTournamentRows(tied, {
      key: 'ratingChange',
      direction: 'desc',
    }).map(({ tournamentId }) => tournamentId),
  ).toEqual(['t1', 't2', 't3'])
})

test('builds every metric summary for every eligible player from comparable rows only', () => {
  const { players, performances } = normalizeTournamentComparisons(data)
  const summaries = buildTournamentSummaries(players, performances)
  const nico = summaries.find(({ playerId }) => playerId === 'n')
  const mati = summaries.find(({ playerId }) => playerId === 'm')
  const rating = nico.metrics.find(({ id }) => id === 'ratingChange')

  expect(summaries).toHaveLength(3)
  expect(nico.metrics).toHaveLength(TOURNAMENT_METRICS.length)
  expect(rating.high.tournamentId).toBe('t1')
  expect(rating.low.tournamentId).toBe('t2')
  expect([rating.high.tournamentId, rating.low.tournamentId]).not.toContain(
    't3',
  )
  expect(mati.metrics.every(({ high, low }) => !high && !low)).toBe(true)
})

test('formats and styles signed values while keeping zero and absence neutral', () => {
  expect(formatTournamentMetric(null, 'teamAdjustmentPercentagePoints')).toBe(
    '—',
  )
  expect(formatTournamentMetric(0, 'teamAdjustmentPercentagePoints')).toBe(
    '0,0 pp',
  )
  expect(getTournamentMetricTrend(5, 'ratingChange')).toBe('positive')
  expect(getTournamentMetricTrend(-5, 'differencePercentagePoints')).toBe(
    'negative',
  )
  expect(getTournamentMetricTrend(0, 'teamAdjustmentPercentagePoints')).toBe(
    'neutral',
  )
  expect(getTournamentMetricTrend(75, 'actualPercentage')).toBe('neutral')
})

test('formats ranges according to each endpoint precision', () => {
  expect(formatTournamentRange(data.tournaments[0])).toContain('2021')
  expect(
    formatTournamentRange({
      firstPlayedAt: '2022-06-01T12:00:00.000Z',
      firstPlayedAtPrecision: 'year',
      lastPlayedAt: '2023-06-01T12:00:00.000Z',
      lastPlayedAtPrecision: 'approx',
    }),
  ).toBe('2022 – aprox. jun. 2023')
  expect(formatTournamentRange({})).toBe('Rango no disponible')
})
