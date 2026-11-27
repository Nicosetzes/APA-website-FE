/* eslint-env jest */
import {
  DEFAULT_UPSETS_PENALTIES,
  DEFAULT_UPSETS_PERSPECTIVE,
  OBSOLETE_UPSETS_TAB_PARAMS,
  UPSETS_TAB_PARAMS,
  buildGlobalUpsetMatchesLink,
  buildUpsetsApiParams,
  describeGlobalUpsetProbability,
  formatGlobalUpsetDate,
  formatGlobalUpsetPenalties,
  formatGlobalUpsetRatingChange,
  formatGlobalUpsetScore,
  getUpsetTypeLabel,
  parseUpsetsFilters,
  updateUpsetsSearchParams,
} from './ratingUpsets'

const TOURNAMENT_ID = '0123456789abcdef01234567'

describe('global upset URL filters', () => {
  test('uses safe defaults when params are absent or invalid', () => {
    const filters = parseUpsetsFilters(
      new URLSearchParams(
        'upsetsDateFrom=2026-02-30&upsetsTournamentId=nope&upsetsType=group&upsetsPenalties=nope&upsetsLimit=30',
      ),
    )

    expect(filters).toEqual({
      dateFrom: '',
      dateTo: '',
      tournamentId: '',
      playerId: '',
      perspective: DEFAULT_UPSETS_PERSPECTIVE,
      type: '',
      penalties: DEFAULT_UPSETS_PENALTIES,
    })
  })

  test('parses every section-specific filter', () => {
    const filters = parseUpsetsFilters(
      new URLSearchParams(
        `upsetsDateFrom=2026-01-01&upsetsDateTo=2026-12-31&upsetsTournamentId=${TOURNAMENT_ID}&upsetsPlayerId=p1&upsetsPerspective=against&upsetsType=playoff&upsetsPenalties=only&upsetsLimit=25`,
      ),
    )

    expect(filters).toEqual({
      dateFrom: '2026-01-01',
      dateTo: '2026-12-31',
      tournamentId: TOURNAMENT_ID,
      playerId: 'p1',
      perspective: 'against',
      type: 'playoff',
      penalties: 'only',
    })
    expect(buildUpsetsApiParams(filters)).toEqual({
      dateFrom: '2026-01-01',
      dateTo: '2026-12-31',
      tournamentId: TOURNAMENT_ID,
      playerId: 'p1',
      perspective: 'against',
      type: 'playoff',
      penalties: 'only',
    })
  })

  test('omits empty optional API params but sends defaults', () => {
    expect(buildUpsetsApiParams(parseUpsetsFilters())).toEqual({
      dateFrom: undefined,
      dateTo: undefined,
      tournamentId: undefined,
      playerId: undefined,
      perspective: 'for',
      type: undefined,
      penalties: 'all',
    })
  })

  test('normalizes an against deep link without a player to the default', () => {
    const original = new URLSearchParams(
      'tab=surprises&upsetsPerspective=against&other=1',
    )
    const filters = parseUpsetsFilters(original)
    const normalized = updateUpsetsSearchParams(original, {})

    expect(filters.perspective).toBe(DEFAULT_UPSETS_PERSPECTIVE)
    expect(normalized.toString()).toBe('tab=surprises&other=1')
  })

  test('clearing the player also clears the against perspective', () => {
    const original = new URLSearchParams(
      'tab=surprises&upsetsPlayerId=p1&upsetsPerspective=against',
    )
    const updated = updateUpsetsSearchParams(original, { playerId: '' })

    expect(updated.toString()).toBe('tab=surprises')
  })

  test('updates only upset params and omits defaults from the URL', () => {
    const original = new URLSearchParams(
      'tab=records&other=1&dateFrom=2020-01-01&upsetsLimit=25&upsetsPenalties=only',
    )
    const updated = updateUpsetsSearchParams(original, {
      penalties: 'all',
      type: 'playin',
    })

    expect(updated.toString()).toBe(
      'tab=records&other=1&dateFrom=2020-01-01&upsetsType=playin',
    )
    expect(UPSETS_TAB_PARAMS).not.toContain('upsetsLimit')
    expect(OBSOLETE_UPSETS_TAB_PARAMS).toContain('upsetsLimit')
  })
})

describe('global upset presentation', () => {
  const upset = {
    playedAt: '2026-10-11T02:00:00.000Z',
    playedAtPrecision: 'exact',
    tournament: { id: TOURNAMENT_ID, name: 'Liga APA' },
    type: 'playoff',
    winner: { id: 'p1', name: 'Nico' },
    loser: { id: 'p2', name: 'Santi' },
    teams: {
      winner: { id: 1, name: 'Real Madrid' },
      loser: { id: 2, name: 'Peñarol' },
    },
    score: { winner: 1, loser: 1 },
    penalties: { winner: 5, loser: 4 },
    probability: 0.167,
    kind: 'advance',
    ratingChange: 7.45,
  }

  test('formats probability, score, penalties, date, type and rating change', () => {
    expect(describeGlobalUpsetProbability(upset)).toBe(
      '16,7% de chances de avanzar',
    )
    expect(formatGlobalUpsetScore(upset)).toBe('1-1')
    expect(formatGlobalUpsetPenalties(upset)).toBe('5-4')
    expect(formatGlobalUpsetDate(upset)).toBe('10/10/2026')
    expect(getUpsetTypeLabel(upset.type)).toBe('Playoff')
    expect(formatGlobalUpsetRatingChange(upset.ratingChange)).toEqual({
      trend: 'up',
      text: '+7.5',
    })
  })

  test('uses the precision label and distinguishes winning from advancing', () => {
    expect(
      formatGlobalUpsetDate({
        playedAt: '2019-07-09T12:00:00.000Z',
        playedAtPrecision: 'year',
      }),
    ).toBe('2019')
    expect(
      describeGlobalUpsetProbability({ probability: 0.301, kind: 'win' }),
    ).toBe('30,1% de chances de ganar')
    expect(
      describeGlobalUpsetProbability(
        { probability: 0.301, kind: 'win' },
        'against',
      ),
    ).toBe('30,1% de chances de perder')
    expect(describeGlobalUpsetProbability(upset, 'against')).toBe(
      '16,7% de chances de quedar eliminado',
    )
    expect(describeGlobalUpsetProbability({ probability: 0.3 })).toBe('-')
  })

  test('links to the existing match listing with the full known context', () => {
    expect(buildGlobalUpsetMatchesLink(upset)).toBe(
      `/matches?player1=p1&player1Team=Real+Madrid&player2=p2&opponentTeam=Pe%C3%B1arol&tournamentId=${TOURNAMENT_ID}&type=playoff&dateFrom=2026-10-10&dateTo=2026-10-10`,
    )
  })

  test('omits optional context and requires both players and the day', () => {
    expect(
      buildGlobalUpsetMatchesLink({
        ...upset,
        tournament: null,
        type: null,
        teams: null,
      }),
    ).toBe(
      '/matches?player1=p1&player2=p2&dateFrom=2026-10-10&dateTo=2026-10-10',
    )
    expect(buildGlobalUpsetMatchesLink({ ...upset, loser: null })).toBeNull()
    expect(buildGlobalUpsetMatchesLink({ ...upset, playedAt: null })).toBeNull()
  })
})
