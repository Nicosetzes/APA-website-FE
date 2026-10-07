// Helpers de rachas en JS puro: el Jest de CRA no resuelve bien date-fns 4.

const toLocalDay = (value) => {
  if (value === null || value === undefined || value === '') return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  }
}

// `month` es 0-indexado; el día 0 del mes siguiente es el último de `month`.
const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()

/**
 * Diferencia entre dos fechas calendario locales (truncadas a día).
 * Devuelve `null` si alguna fecha falta o es inválida.
 */
export const calendarDiff = (start, end) => {
  const from = toLocalDay(start)
  const to = toLocalDay(end)
  if (!from || !to) return null

  let years = to.year - from.year
  let months = to.month - from.month
  let days = to.day - from.day

  if (days < 0) {
    // Se pide prestado el mes anterior a `end`. Si el día de inicio no existe
    // en ese mes (31/01 → 01/03), se recorta a su último día.
    months -= 1
    const borrowed = daysInMonth(to.year, to.month - 1)
    days = borrowed - Math.min(from.day, borrowed) + to.day
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  return { years, months, days }
}

const plural = (value, singular, pluralForm) =>
  `${value} ${value === 1 ? singular : pluralForm}`

/**
 * Unidad de un valor de racha ("partido"/"partidos", "torneo"/"torneos").
 * Devuelve sólo la palabra: el número va aparte.
 */
export const getCountUnit = (count, [singular, pluralForm]) =>
  count === 1 ? singular : pluralForm

const joinParts = (parts) => {
  if (parts.length <= 1) return parts.join('')
  return `${parts.slice(0, -1).join(', ')} y ${parts[parts.length - 1]}`
}

/**
 * Duración legible de una racha ("1 año, 3 meses y 12 días").
 * `null` cuando no corresponde mostrarla: racha de un partido o sin fechas.
 */
export const formatStreakDuration = ({ startDate, endDate, count } = {}) => {
  if (count === 1) return null

  const diff = calendarDiff(startDate, endDate)
  if (!diff) return null

  const { years, months, days } = diff
  if (years < 0) return null

  const parts = []
  if (years > 0) parts.push(plural(years, 'año', 'años'))
  if (months > 0) parts.push(plural(months, 'mes', 'meses'))
  if (days > 0) parts.push(plural(days, 'día', 'días'))

  if (parts.length === 0) return 'En el mismo día'
  return joinParts(parts)
}

// Argentina es UTC-3 todo el año (sin horario de verano desde 2009), igual
// que el BE al filtrar `dateFrom`/`dateTo` en /matches.
const ARGENTINA_OFFSET_MS = 3 * 60 * 60 * 1000

const pad = (value) => String(value).padStart(2, '0')

/**
 * Día calendario en Argentina (`YYYY-MM-DD`, el formato de los filtros de
 * /matches) de una fecha, o `null` si falta o es inválida.
 */
export const toArgentinaDay = (value) => {
  if (value === null || value === undefined || value === '') return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const shifted = new Date(date.getTime() - ARGENTINA_OFFSET_MS)
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(
    shifted.getUTCDate(),
  )}`
}

// Filtros extra de /matches por familia de racha (valores de MatchListing y
// del BE). Las claves que no están acá no llevan link.
const STREAK_MATCH_FILTERS = {
  // Invicto: victorias y empates, no hay un resultado que lo represente.
  most_unbeaten_in_a_row: {},
  most_wins_in_a_row: { outcome: 'win' },
  most_draws_in_a_row: { outcome: 'draw' },
  most_losses_in_a_row: { outcome: 'loss' },
  most_consecutive_matches_scoring_1_plus_goals: {
    player1GoalsOp: 'gte',
    player1GoalsVal: '1',
  },
  most_consecutive_matches_scoring_2_plus_goals: {
    player1GoalsOp: 'gte',
    player1GoalsVal: '2',
  },
  most_consecutive_matches_scoring_3_plus_goals: {
    player1GoalsOp: 'gte',
    player1GoalsVal: '3',
  },
  most_clean_sheets_in_a_row: {
    player1ConcededOp: 'eq',
    player1ConcededVal: '0',
  },
  // "Eliminatoria" en /matches: playin + playoff.
  most_knockout_unbeaten_in_a_row: { type: 'knockout' },
  // En eliminación se gana también por penales.
  most_knockout_wins_in_a_row: {
    type: 'knockout',
    outcome: 'winIncludingPenalties',
  },
  // Partidos del jugador definidos por penales (ganados o perdidos).
  most_penalty_shootout_wins_in_a_row: { outcome: 'penalties' },
  // Semis: quien llegó a la final también jugó la semi, así que es la ronda
  // representativa de cada torneo.
  most_consecutive_semifinals: { type: 'playoff', playoffRound: 'semifinal' },
  most_consecutive_finals: { type: 'playoff', playoffRound: 'final' },
  // Finales ganadas, por penales o entre dos equipos del mismo jugador.
  most_consecutive_titles: {
    type: 'playoff',
    playoffRound: 'final',
    outcome: 'winIncludingPenalties',
  },
}

// Ronda de cada racha por torneo, con el sufijo de sus campos en el resumen
// del BE (`firstSemifinalPlayedAt`, `lastFinalPlayedAt`).
const TOURNAMENT_STREAK_ROUNDS = {
  most_consecutive_semifinals: 'Semifinal',
  most_consecutive_finals: 'Final',
  most_consecutive_titles: 'Final',
}

// Rachas por torneo: del primer partido del jugador en la ronda en el torneo
// de inicio al último en esa ronda en el torneo final. Sin esa fecha cae al
// primer/último partido de playoff del jugador y, con un BE sin esos campos,
// a las fechas del poseedor (cierre de cada torneo), que puede dejar afuera
// la ronda del primer torneo.
const getTournamentRange = (holder, round) => {
  const start = holder.startTournament
  const end = holder.endTournament
  return {
    from:
      start?.[`first${round}PlayedAt`] ??
      start?.firstPlayoffPlayedAt ??
      holder.startDate,
    to:
      holder.isActive || end?.ongoing === true
        ? null
        : end?.[`last${round}PlayedAt`] ??
          end?.lastPlayoffPlayedAt ??
          holder.endDate,
  }
}

// Rachas de partidos: del día del primer partido al del último válido. Una
// vigente puede seguir creciendo, así que va sin fin.
const getMatchRange = (holder) => ({
  from: holder.startDate,
  to: holder.isActive ? null : holder.endDate,
})

/**
 * Link a /matches con los filtros que mejor aproximan los partidos de la
 * racha de `holder`: el jugador, el rango de días (hora de Argentina, ambas
 * puntas inclusive) y, según la familia, el tipo, la ronda o el resultado. No promete el
 * conteo exacto: pueden colarse partidos del jugador del primer o del último
 * día que no son de la racha, y las fechas no exactas (año, aprox.) caen en un
 * día representativo.
 *
 * Devuelve `null` si no corresponde link: clave desconocida, poseedor sin id o
 * sin fecha de inicio.
 */
export const buildStreakMatchesLink = (recordKey, holder) => {
  const filters = STREAK_MATCH_FILTERS[recordKey]
  if (!filters || !holder?.id || !holder.startDate) return null

  const round = TOURNAMENT_STREAK_ROUNDS[recordKey]
  const { from, to } = round
    ? getTournamentRange(holder, round)
    : getMatchRange(holder)
  const dateFrom = toArgentinaDay(from)
  if (!dateFrom) return null
  const dateTo = toArgentinaDay(to)

  const params = new URLSearchParams({ player1: String(holder.id) })
  Object.entries(filters).forEach(([key, value]) => params.set(key, value))
  params.set('dateFrom', dateFrom)
  if (dateTo) params.set('dateTo', dateTo)

  return `/matches?${params.toString()}`
}
