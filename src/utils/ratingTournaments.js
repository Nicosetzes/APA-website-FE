import { formatMatchDay } from 'utils/ratingHistory'
import { formatPlayedAt } from 'utils/playedAt'

export const DEFAULT_TOURNAMENT_METRIC = 'ratingChange'

export const TOURNAMENT_METRICS = [
  {
    id: 'ratingChange',
    label: 'Variación de rating',
    highLabel: 'Más positiva',
    lowLabel: 'Más negativa',
    signed: true,
  },
  {
    id: 'actualPercentage',
    label: 'Obtenido',
    highLabel: 'Mayor',
    lowLabel: 'Menor',
    signed: false,
  },
  {
    id: 'expectedPercentage',
    label: 'Esperado',
    highLabel: 'Mayor',
    lowLabel: 'Menor',
    signed: false,
  },
  {
    id: 'differencePercentagePoints',
    label: 'Diferencia',
    highLabel: 'Más positiva',
    lowLabel: 'Más negativa',
    signed: true,
  },
  {
    id: 'teamAdjustmentPercentagePoints',
    label: 'Ajuste de equipos',
    highLabel: 'Más positivo',
    lowLabel: 'Más negativo',
    signed: true,
  },
]

const PERCENTAGE_METRICS = new Set(['actualPercentage', 'expectedPercentage'])
const POINT_METRICS = new Set([
  'differencePercentagePoints',
  'teamAdjustmentPercentagePoints',
])

const isFiniteNumber = (value) =>
  typeof value === 'number' && Number.isFinite(value)

const normalizeId = (value) =>
  typeof value === 'string' || typeof value === 'number' ? String(value) : null

const normalizeName = (value, fallback) =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback

const normalizeCount = (value) =>
  Number.isInteger(value) && value >= 0 ? value : 0

const normalizeMetric = (value) => (isFiniteNumber(value) ? value : null)

const normalizeRecord = (record) => ({
  wins: normalizeCount(record?.wins),
  draws: normalizeCount(record?.draws),
  losses: normalizeCount(record?.losses),
})

const normalizeTournament = (tournament, id) => ({
  id,
  name: normalizeName(tournament?.name, 'Torneo sin nombre'),
  firstPlayedAt: tournament?.firstPlayedAt ?? null,
  firstPlayedAtPrecision: tournament?.firstPlayedAtPrecision ?? null,
  lastPlayedAt: tournament?.lastPlayedAt ?? null,
  lastPlayedAtPrecision: tournament?.lastPlayedAtPrecision ?? null,
})

/** Une el contrato normalizado del BE en filas listas para presentar. */
export const normalizeTournamentComparisons = (data) => {
  const sourcePlayers = Array.isArray(data?.players) ? data.players : []
  const sourceTournaments = Array.isArray(data?.tournaments)
    ? data.tournaments
    : []
  const sourcePerformances = Array.isArray(data?.performances)
    ? data.performances
    : []

  const playersById = new Map()
  sourcePlayers.forEach((player) => {
    const id = normalizeId(player?.id)
    if (!id) return
    playersById.set(id, {
      id,
      name: normalizeName(player.name, `Jugador ${id}`),
    })
  })

  const tournamentsById = new Map()
  sourceTournaments.forEach((tournament) => {
    const id = normalizeId(tournament?.id)
    if (!id) return
    tournamentsById.set(id, normalizeTournament(tournament, id))
  })

  const performances = sourcePerformances.flatMap((performance, index) => {
    const playerId = normalizeId(performance?.playerId)
    const tournamentId = normalizeId(performance?.tournamentId)
    if (!playerId || !tournamentId) return []

    if (!playersById.has(playerId)) {
      playersById.set(playerId, {
        id: playerId,
        name: `Jugador ${playerId}`,
      })
    }
    if (!tournamentsById.has(tournamentId)) {
      tournamentsById.set(tournamentId, normalizeTournament(null, tournamentId))
    }

    const player = playersById.get(playerId)
    const tournament = tournamentsById.get(tournamentId)
    return [
      {
        playerId,
        playerName: player.name,
        tournamentId,
        tournamentName: tournament.name,
        tournament,
        matches: normalizeCount(performance.matches),
        record: normalizeRecord(performance.record),
        ratingChange: normalizeMetric(performance.ratingChange),
        actualPercentage: normalizeMetric(performance.actualPercentage),
        expectedPercentage: normalizeMetric(performance.expectedPercentage),
        differencePercentagePoints: normalizeMetric(
          performance.differencePercentagePoints,
        ),
        teamAdjustmentPercentagePoints: normalizeMetric(
          performance.teamAdjustmentPercentagePoints,
        ),
        comparable: performance.comparable === true,
        sourceIndex: index,
      },
    ]
  })

  return {
    players: [...playersById.values()],
    tournaments: [...tournamentsById.values()],
    performances,
  }
}

export const buildPlayerTournamentRows = (
  performances,
  primaryPlayerId,
  comparisonPlayerId = null,
) => {
  const primaryId = normalizeId(primaryPlayerId)
  const comparisonId = normalizeId(comparisonPlayerId)
  const comparisonsByTournament = new Map(
    performances
      .filter(({ playerId }) => comparisonId && playerId === comparisonId)
      .map((performance) => [performance.tournamentId, performance]),
  )

  return performances
    .filter(({ playerId }) => primaryId && playerId === primaryId)
    .map((primary) => ({
      id: primary.tournamentId,
      tournamentId: primary.tournamentId,
      tournamentName: primary.tournamentName,
      tournament: primary.tournament,
      primary,
      comparison: comparisonId
        ? comparisonsByTournament.get(primary.tournamentId) ?? null
        : null,
    }))
}

export const buildTournamentPlayerRows = (performances, tournamentId) =>
  performances
    .filter(
      ({ tournamentId: rowTournamentId }) =>
        tournamentId && rowTournamentId === String(tournamentId),
    )
    .map((primary) => ({
      id: primary.playerId,
      playerId: primary.playerId,
      playerName: primary.playerName,
      primary,
      comparison: null,
    }))

const recordValue = ({ wins, draws, losses }) =>
  wins * 1000000 + draws * 1000 - losses

const sortValue = (row, key) => {
  if (key === 'playerName' || key === 'tournamentName') return row[key]
  if (key === 'record') return recordValue(row.primary.record)
  return row.primary[key]
}

const compareValues = (left, right) => {
  if (typeof left === 'string' && typeof right === 'string') {
    return left.localeCompare(right, 'es', { sensitivity: 'base' })
  }
  return left - right
}

/** Orden estable. Siempre toma la actuación principal y deja ausentes al final. */
export const sortTournamentRows = (
  rows,
  { key = DEFAULT_TOURNAMENT_METRIC, direction = 'desc' } = {},
) =>
  rows
    .map((row, index) => ({ row, index }))
    .sort((leftEntry, rightEntry) => {
      const left = sortValue(leftEntry.row, key)
      const right = sortValue(rightEntry.row, key)
      const leftMissing = left === null || left === undefined
      const rightMissing = right === null || right === undefined
      if (leftMissing || rightMissing) {
        if (leftMissing && rightMissing)
          return leftEntry.index - rightEntry.index
        return leftMissing ? 1 : -1
      }
      const comparison = compareValues(left, right)
      if (comparison === 0) return leftEntry.index - rightEntry.index
      return direction === 'asc' ? comparison : -comparison
    })
    .map(({ row }) => row)

/** Resume todas las métricas por jugador usando solo actuaciones comparables. */
export const buildTournamentSummaries = (players, performances) =>
  players.map((player) => {
    const rows = performances.filter(
      (performance) => performance.playerId === player.id,
    )
    return {
      playerId: player.id,
      playerName: player.name,
      metrics: TOURNAMENT_METRICS.map((metric) => {
        const comparable = rows
          .filter((row) => row.comparable && isFiniteNumber(row[metric.id]))
          .sort((left, right) => right[metric.id] - left[metric.id])
        return {
          ...metric,
          high: comparable[0] ?? null,
          low: comparable[comparable.length - 1] ?? null,
        }
      }),
    }
  })

export const getTournamentMetricTrend = (value, metric) => {
  const definition = TOURNAMENT_METRICS.find(({ id }) => id === metric)
  if (!definition?.signed || !isFiniteNumber(value) || value === 0) {
    return 'neutral'
  }
  return value > 0 ? 'positive' : 'negative'
}

const formatNumber = (value) =>
  value.toLocaleString('es-AR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

export const formatTournamentMetric = (value, metric) => {
  if (!isFiniteNumber(value)) return '—'
  const sign = value > 0 ? '+' : ''
  if (PERCENTAGE_METRICS.has(metric)) return `${formatNumber(value)}%`
  if (POINT_METRICS.has(metric)) return `${sign}${formatNumber(value)} pp`
  if (metric === 'ratingChange') return `${sign}${formatNumber(value)}`
  return formatNumber(value)
}

const formatRangeDate = (value, precision) => {
  if (!value || !precision) return null
  return formatPlayedAt(value, precision) || formatMatchDay(value)
}

export const formatTournamentRange = (tournament) => {
  const first = formatRangeDate(
    tournament?.firstPlayedAt,
    tournament?.firstPlayedAtPrecision,
  )
  const last = formatRangeDate(
    tournament?.lastPlayedAt,
    tournament?.lastPlayedAtPrecision,
  )
  if (first && last) return first === last ? first : `${first} – ${last}`
  if (first) return `Desde ${first}`
  if (last) return `Hasta ${last}`
  return 'Rango no disponible'
}
