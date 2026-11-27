import { formatMatchDay, parseDay, parseTournamentParam } from './ratingHistory'
import { formatPlayedAt } from './playedAt'
import { describeRatingChange } from './ratings'

export const UPSETS_TAB_PARAMS = [
  'upsetsDateFrom',
  'upsetsDateTo',
  'upsetsTournamentId',
  'upsetsPlayerId',
  'upsetsPerspective',
  'upsetsType',
  'upsetsPenalties',
]

export const OBSOLETE_UPSETS_TAB_PARAMS = ['upsetsLimit']
export const DEFAULT_UPSETS_PENALTIES = 'all'
export const DEFAULT_UPSETS_PERSPECTIVE = 'for'

const TYPES = new Set(['regular', 'playin', 'playoff'])
const PENALTIES = new Set(['all', 'exclude', 'only'])
const PERSPECTIVES = new Set(['for', 'against'])
const MAX_PLAYER_ID_LENGTH = 100
const MAX_TEAM_FILTER_LENGTH = 100

const cleanPlayerId = (value) => {
  const id = typeof value === 'string' ? value.trim() : ''
  return id && id.length <= MAX_PLAYER_ID_LENGTH ? id : ''
}

export const parseUpsetsFilters = (searchParams = new URLSearchParams()) => {
  const read = (name) => searchParams.get(name) || ''
  const type = read('upsetsType')
  const penalties = read('upsetsPenalties')
  const playerId = cleanPlayerId(read('upsetsPlayerId'))
  const perspective = read('upsetsPerspective')

  return {
    dateFrom: parseDay(read('upsetsDateFrom')) ? read('upsetsDateFrom') : '',
    dateTo: parseDay(read('upsetsDateTo')) ? read('upsetsDateTo') : '',
    tournamentId: parseTournamentParam(read('upsetsTournamentId')),
    playerId,
    perspective:
      playerId && PERSPECTIVES.has(perspective)
        ? perspective
        : DEFAULT_UPSETS_PERSPECTIVE,
    type: TYPES.has(type) ? type : '',
    penalties: PENALTIES.has(penalties) ? penalties : DEFAULT_UPSETS_PENALTIES,
  }
}

export const buildUpsetsApiParams = (filters) => ({
  dateFrom: filters.dateFrom || undefined,
  dateTo: filters.dateTo || undefined,
  tournamentId: filters.tournamentId || undefined,
  playerId: filters.playerId || undefined,
  perspective: filters.perspective,
  type: filters.type || undefined,
  penalties: filters.penalties,
})

const URL_KEYS = {
  dateFrom: 'upsetsDateFrom',
  dateTo: 'upsetsDateTo',
  tournamentId: 'upsetsTournamentId',
  playerId: 'upsetsPlayerId',
  perspective: 'upsetsPerspective',
  type: 'upsetsType',
  penalties: 'upsetsPenalties',
}

export const updateUpsetsSearchParams = (searchParams, changes) => {
  const params = new URLSearchParams(searchParams)
  const filters = { ...parseUpsetsFilters(params), ...changes }
  const normalized = parseUpsetsFilters(
    new URLSearchParams(
      Object.entries(filters).map(([name, value]) => [URL_KEYS[name], value]),
    ),
  )

  ;[...UPSETS_TAB_PARAMS, ...OBSOLETE_UPSETS_TAB_PARAMS].forEach((name) =>
    params.delete(name),
  )
  Object.entries(normalized).forEach(([name, value]) => {
    if (!value) return
    if (name === 'penalties' && value === DEFAULT_UPSETS_PENALTIES) return
    if (name === 'perspective' && value === DEFAULT_UPSETS_PERSPECTIVE) return
    params.set(URL_KEYS[name], String(value))
  })
  return params
}

export const describeGlobalUpsetProbability = (
  { probability, kind } = {},
  perspective = DEFAULT_UPSETS_PERSPECTIVE,
) => {
  if (
    typeof probability !== 'number' ||
    !Number.isFinite(probability) ||
    probability < 0 ||
    probability > 1
  ) {
    return '-'
  }
  const against = perspective === 'against'
  const action = against
    ? kind === 'advance'
      ? 'quedar eliminado'
      : kind === 'win'
      ? 'perder'
      : ''
    : kind === 'advance'
    ? 'avanzar'
    : kind === 'win'
    ? 'ganar'
    : ''
  if (!action) return '-'
  const percentage = Math.round(probability * 1000) / 10
  return `${percentage.toLocaleString('es-AR')}% de chances de ${action}`
}

export const formatGlobalUpsetRatingChange = (value) =>
  describeRatingChange(value)

export const formatGlobalUpsetDate = (upset) =>
  formatPlayedAt(upset?.playedAt, upset?.playedAtPrecision) ||
  formatMatchDay(upset?.playedAt) ||
  '-'

export const formatGlobalUpsetScore = (upset) => {
  const { winner, loser } = upset?.score || {}
  return Number.isInteger(winner) && Number.isInteger(loser)
    ? `${winner}-${loser}`
    : '-'
}

export const formatGlobalUpsetPenalties = (upset) => {
  const { winner, loser } = upset?.penalties || {}
  return Number.isInteger(winner) && Number.isInteger(loser)
    ? `${winner}-${loser}`
    : null
}

export const getUpsetTypeLabel = (type) =>
  ({ regular: 'Fase regular', playin: 'Play-in', playoff: 'Playoff' }[type] ||
  'Sin fase')

const teamName = (team) =>
  typeof team?.name === 'string' && team.name.trim()
    ? team.name.trim().slice(0, MAX_TEAM_FILTER_LENGTH)
    : null

export const buildGlobalUpsetMatchesLink = (upset) => {
  const winnerId = cleanPlayerId(String(upset?.winner?.id ?? ''))
  const loserId = cleanPlayerId(String(upset?.loser?.id ?? ''))
  const day = formatMatchDay(upset?.playedAt).split('/').reverse().join('-')
  if (!winnerId || !loserId || !parseDay(day)) return null

  const tournamentId = parseTournamentParam(String(upset?.tournament?.id ?? ''))
  const type = TYPES.has(upset?.type) ? upset.type : null
  const entries = [
    ['player1', winnerId],
    ['player1Team', teamName(upset?.teams?.winner)],
    ['player2', loserId],
    ['opponentTeam', teamName(upset?.teams?.loser)],
    ['tournamentId', tournamentId],
    ['type', type],
    ['dateFrom', day],
    ['dateTo', day],
  ].filter(([, value]) => value)

  return `/matches?${new URLSearchParams(entries).toString()}`
}
