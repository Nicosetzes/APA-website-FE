// Helpers del historial de Rating APA 2.0 (`GET /ratings/history`): atajos de
// período, colores, selección de jugadores y datos del gráfico. JS puro: el
// Jest de CRA no resuelve date-fns 4 (ver src/utils/dates.js).
import { toArgentinaDay } from 'utils/streaks'
import { describeRatingChange, formatRating } from 'utils/ratings'

export const REFERENCE_RATING = 1500

// Params de la URL de la pestaña "Rating APA" (StatisticsGeneral los limpia
// al cambiar de pestaña).
export const RATING_TAB_PARAMS = ['period', 'dateFrom', 'dateTo', 'players']

export const HISTORY_START_DATE = '2019-01-01'

export const DEFAULT_PERIOD = 'ultimo-anio'
export const MAX_DEFAULT_PLAYERS = 8
export const MAX_AXIS_TICKS = 8

// Año más antiguo con atajo propio y año más nuevo que siempre se ofrece
// (después se suma el año actual hacia arriba, si corresponde).
const OLDEST_YEAR_SHORTCUT = 2021
const NEWEST_FIXED_YEAR = 2026

const MONTH_LABELS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
]

const pad = (value) => String(value).padStart(2, '0')

const DAY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

const formatDayParts = (year, month, day) =>
  `${String(year).padStart(4, '0')}-${pad(month)}-${pad(day)}`

/** "YYYY-MM-DD" -> { year, month (1-12), day }, o `null` si no existe. */
export const parseDay = (value) => {
  const match = DAY_PATTERN.exec(value || '')
  if (!match) return null
  const [, year, month, day] = match.map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? { year, month, day }
    : null
}

/** "2026-10-27" -> "27/10/2026"; `''` si no es un día válido. */
export const formatDay = (value) => {
  const parts = parseDay(value)
  return parts ? `${pad(parts.day)}/${pad(parts.month)}/${parts.year}` : ''
}

/** Día argentino (`YYYY-MM-DD`) del instante `now`. Nunca `toDateParam`. */
export const getTodayArgentina = (now = new Date()) => toArgentinaDay(now)

/** Suma `amount` días (puede ser negativo) a un día `YYYY-MM-DD`. */
export const shiftDays = (value, amount) => {
  const parts = parseDay(value)
  if (!parts) return null
  const date = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day + amount),
  )
  return formatDayParts(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  )
}

/**
 * Suma `amount` meses al mismo día de calendario; si el mes destino no tiene
 * ese día, queda en su último día (31/03 - 1 mes = 28/02 o 29/02).
 */
export const shiftMonths = (value, amount) => {
  const parts = parseDay(value)
  if (!parts) return null
  const total = parts.year * 12 + (parts.month - 1) + amount
  const year = Math.floor(total / 12)
  const month = (total % 12) + 1
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return formatDayParts(year, month, Math.min(parts.day, lastDay))
}

/** Cantidad de días entre dos días `YYYY-MM-DD`; `Infinity` si alguno falla. */
export const daysBetween = (from, to) => {
  const a = parseDay(from)
  const b = parseDay(to)
  if (!a || !b) return Infinity
  return Math.round(
    (Date.UTC(b.year, b.month - 1, b.day) -
      Date.UTC(a.year, a.month - 1, a.day)) /
      86400000,
  )
}

/**
 * Atajos de período calculados desde `today` (día argentino). Devuelve los
 * atajos con nombre (`shortcuts`) y los años (`years`, del más nuevo al más
 * viejo). Los rangos son inclusivos y, salvo los años, terminan hoy.
 */
export const getPeriodOptions = (today) => {
  const currentYear = parseDay(today)?.year ?? NEWEST_FIXED_YEAR
  const shortcut = (slug, label, dateFrom) => ({
    slug,
    label,
    dateFrom,
    dateTo: today,
  })
  const shortcuts = [
    shortcut('hoy', 'Hoy', today),
    shortcut('ultima-semana', 'Última semana', shiftDays(today, -6)),
    shortcut('ultimo-mes', 'Último mes', shiftMonths(today, -1)),
    shortcut('ultimos-3-meses', 'Últimos 3 meses', shiftMonths(today, -3)),
    shortcut('ultimos-6-meses', 'Últimos 6 meses', shiftMonths(today, -6)),
    shortcut('ultimo-anio', 'Último año', shiftMonths(today, -12)),
    shortcut('todo', 'Todo el historial', HISTORY_START_DATE),
  ]
  const years = []
  for (
    let year = Math.max(currentYear, NEWEST_FIXED_YEAR);
    year >= OLDEST_YEAR_SHORTCUT;
    year -= 1
  ) {
    years.push({
      slug: String(year),
      label: String(year),
      dateFrom: `${year}-01-01`,
      dateTo: `${year}-12-31`,
    })
  }
  return { shortcuts, years }
}

const findShortcut = (slug, today) => {
  const { shortcuts, years } = getPeriodOptions(today)
  return [...shortcuts, ...years].find((option) => option.slug === slug)
}

/**
 * Período efectivo a partir de los params de la URL. Gana un atajo válido
 * (`period`); si no, un rango libre (`dateFrom` y `dateTo`); si no hay nada,
 * "Último año". `status`: `ok`, `incomplete` (falta una fecha o es inválida) o
 * `inverted` (`dateFrom` posterior a `dateTo`). Solo con `ok` se pide al BE.
 */
export const resolvePeriod = ({ period, dateFrom, dateTo } = {}, today) => {
  const shortcut = period ? findShortcut(period, today) : undefined
  if (shortcut) {
    return {
      status: 'ok',
      slug: shortcut.slug,
      dateFrom: shortcut.dateFrom,
      dateTo: shortcut.dateTo,
      message: null,
    }
  }
  if (!dateFrom && !dateTo) {
    const fallback = findShortcut(DEFAULT_PERIOD, today)
    return {
      status: 'ok',
      slug: fallback.slug,
      dateFrom: fallback.dateFrom,
      dateTo: fallback.dateTo,
      message: null,
    }
  }
  const from = parseDay(dateFrom) ? dateFrom : ''
  const to = parseDay(dateTo) ? dateTo : ''
  if (!from || !to) {
    return {
      status: 'incomplete',
      slug: null,
      dateFrom: from,
      dateTo: to,
      message: 'Elegí la fecha de inicio y la de fin para ver el período.',
    }
  }
  if (from > to) {
    return {
      status: 'inverted',
      slug: null,
      dateFrom: from,
      dateTo: to,
      message: 'La fecha de inicio no puede ser posterior a la de fin.',
    }
  }
  return { status: 'ok', slug: null, dateFrom: from, dateTo: to, message: null }
}

// Paleta estable (inspirada en Okabe-Ito). Todos los colores tienen al menos
// 3:1 de contraste sobre blanco; el amarillo se reemplazó por un dorado oscuro.
export const PLAYER_PALETTE = [
  '#0072B2',
  '#D55E00',
  '#00805F',
  '#B3478A',
  '#6A3D9A',
  '#9A7B00',
  '#00859B',
  '#A65628',
  '#222222',
  '#4C8C00',
]

/**
 * Color por jugador, determinístico: se asigna por posición en la lista de
 * ids ordenada alfabéticamente, sin depender de la selección ni del período
 * (mientras sean los mismos jugadores). Devuelve un `Map` id -> color.
 */
export const buildPlayerColors = (ids = []) => {
  const sorted = [...new Set(ids.map(String))].sort()
  return new Map(
    sorted.map((id, index) => [
      id,
      PLAYER_PALETTE[index % PLAYER_PALETTE.length],
    ]),
  )
}

// Valor de `players` en la URL que significa "ninguno" (ausente = por defecto).
export const NO_PLAYERS = 'none'

/**
 * Params `players` de la URL -> `null` (selección por defecto), `[]` (ninguno)
 * o la lista de ids.
 */
export const parsePlayersParam = (values = []) => {
  const clean = values.map((value) => String(value).trim()).filter(Boolean)
  if (clean.length === 0) return null
  if (clean.includes(NO_PLAYERS)) return []
  return [...new Set(clean)]
}

/** Inversa de `parsePlayersParam` para una selección explícita. */
export const serializePlayersParam = (ids = []) =>
  ids.length === 0 ? [NO_PLAYERS] : [...new Set(ids.map(String))]

/**
 * Selección por defecto: todos si son hasta 8; si hay más, los 8 con mayor
 * rating al cierre del período.
 */
export const getDefaultSelection = (players = []) => {
  const ids = players.map(({ player }) => String(player.id))
  if (players.length <= MAX_DEFAULT_PLAYERS) return ids
  return players
    .map((entry, index) => ({ entry, index }))
    .sort(
      (a, b) => b.entry.end.rating - a.entry.end.rating || a.index - b.index,
    )
    .slice(0, MAX_DEFAULT_PLAYERS)
    .map(({ entry }) => String(entry.player.id))
}

/**
 * Selección efectiva: lo pedido en la URL sin los ids que no están en el
 * período. Si la URL pide ids y ninguno existe, vuelve a la selección por
 * defecto. Conserva el orden de `players`.
 */
export const resolveSelection = (requestedIds, players = []) => {
  if (requestedIds === null || requestedIds === undefined) {
    return getDefaultSelection(players)
  }
  if (requestedIds.length === 0) return []
  const requested = new Set(requestedIds)
  const valid = players
    .map(({ player }) => String(player.id))
    .filter((id) => requested.has(id))
  return valid.length > 0 ? valid : getDefaultSelection(players)
}

/** Clave de la serie de un jugador en las filas del gráfico. */
export const playerKey = (id) => `p_${id}`

/**
 * Filas del gráfico: una fila inicial `x = 0` con el rating de arranque de
 * cada jugador y una fila por partido del período (`x = 1..N`, contando todos
 * los partidos, no solo los del jugador). El rating se arrastra hasta que el
 * jugador vuelve a jugar. Quien debuta en el período queda en `null` hasta su
 * primer partido. `points` guarda el detalle de los partidos que jugó cada
 * jugador en esa fila, para el tooltip.
 */
export const buildChartRows = ({
  timeline = [],
  players = [],
  selectedIds,
}) => {
  const selected = new Set((selectedIds ?? []).map(String))
  const chosen = players.filter(({ player }) => selected.has(String(player.id)))
  const pointsByX = chosen.map(
    ({ points }) => new Map(points.map((point) => [point.x, point])),
  )
  const current = chosen.map(({ start }) => (start ? start.rating : null))

  const initialRow = { x: 0, seq: null, t: null, points: {} }
  chosen.forEach(({ player }, index) => {
    initialRow[playerKey(player.id)] = current[index]
  })

  const rows = [initialRow]
  timeline.forEach(({ x, seq, t }) => {
    const row = { x, seq, t, points: {} }
    chosen.forEach(({ player }, index) => {
      const point = pointsByX[index].get(x)
      if (point) {
        current[index] = point.rating
        row.points[String(player.id)] = point
      }
      row[playerKey(player.id)] = current[index]
    })
    rows.push(row)
  })
  return rows
}

const thinTicks = (ticks, maxTicks) => {
  if (ticks.length <= maxTicks) return ticks
  const indexes = new Set()
  for (let i = 0; i < maxTicks; i += 1) {
    indexes.add(Math.round((i * (ticks.length - 1)) / (maxTicks - 1)))
  }
  return [...indexes].sort((a, b) => a - b).map((index) => ticks[index])
}

/**
 * Marcas del eje X (`[{ x, label }]`): la fecha del primer partido de cada mes
 * o, si el período dura 31 días o menos, de cada día. Se muestra el año en la
 * primera marca y cada vez que cambia. Se adelgaza a `maxTicks` marcas.
 */
export const buildAxisTicks = (
  timeline = [],
  { dateFrom, dateTo } = {},
  maxTicks = MAX_AXIS_TICKS,
) => {
  const byDay = daysBetween(dateFrom, dateTo) < 31
  const ticks = []
  let lastKey = null
  timeline.forEach(({ x, t }) => {
    const day = toArgentinaDay(t)
    if (!day) return
    const key = byDay ? day : day.slice(0, 7)
    if (key === lastKey) return
    lastKey = key
    ticks.push({ x, day })
  })

  let lastYear = null
  return thinTicks(ticks, maxTicks).map(({ x, day }) => {
    const { year, month, day: dayOfMonth } = parseDay(day)
    const base = byDay
      ? `${dayOfMonth} ${MONTH_LABELS[month - 1]}`
      : MONTH_LABELS[month - 1]
    const label = year === lastYear ? base : `${base} ${year}`
    lastYear = year
    return { x, label }
  })
}

/** Límites del eje Y: incluye siempre la referencia de 1500, con margen. */
export const computeYDomain = (rows = [], ids = []) => {
  const keys = ids.map(playerKey)
  let min = REFERENCE_RATING
  let max = REFERENCE_RATING
  rows.forEach((row) => {
    keys.forEach((key) => {
      const value = row[key]
      if (typeof value !== 'number') return
      if (value < min) min = value
      if (value > max) max = value
    })
  })
  return [Math.floor((min - 5) / 10) * 10, Math.ceil((max + 5) / 10) * 10]
}

/**
 * Ranking del período: por variación de rating (mayor primero), con el rating
 * final como desempate. Empatar en variación comparte el número de lugar
 * (1, 1, 3). Devuelve `[{ rank, ...jugador }]`.
 */
export const buildPeriodRanking = (players = []) => {
  const sorted = players
    .map((entry, index) => ({ entry, index }))
    .sort(
      (a, b) =>
        b.entry.summary.ratingChange - a.entry.summary.ratingChange ||
        b.entry.end.rating - a.entry.end.rating ||
        a.index - b.index,
    )
    .map(({ entry }) => entry)
  let rank = 0
  return sorted.map((entry, index) => {
    const previous = sorted[index - 1]
    if (
      !previous ||
      previous.summary.ratingChange !== entry.summary.ratingChange
    ) {
      rank = index + 1
    }
    return { ...entry, rank }
  })
}

/**
 * Link a /matches con el partido de un upset: los dos jugadores y el día
 * argentino del partido (mismos params que lee MatchListing). `null` si falta
 * algún dato.
 */
export const buildUpsetMatchesLink = (playerId, upset) => {
  const day = toArgentinaDay(upset?.t)
  if (!playerId || !upset?.opponent?.id || !day) return null
  const params = new URLSearchParams({
    player1: String(playerId),
    player2: String(upset.opponent.id),
    dateFrom: day,
    dateTo: day,
  })
  return `/matches?${params.toString()}`
}

const isFiniteNumber = (value) =>
  typeof value === 'number' && Number.isFinite(value)

/**
 * Porcentaje entero de una probabilidad (0-1): "27%". Si redondea a 0 devuelve
 * "menos de 1%". `null` si no es un número entre 0 y 1.
 */
export const formatChance = (value) => {
  if (!isFiniteNumber(value) || value < 0 || value > 1) return null
  const percent = Math.round(value * 100)
  return percent === 0 ? 'menos de 1%' : `${percent}%`
}

const UPSET_CHANCE_TEXT = {
  // Upset ganado: chances de lo que logró (`for`).
  won: { win: 'ganar', advance: 'avanzar', field: 'for' },
  // Upset perdido: chances de lo que le pasó (`against`).
  lost: { win: 'perder', advance: 'quedar eliminado', field: 'against' },
}

/**
 * Texto que explica un upset con la probabilidad del resultado que ocurrió:
 * "Tenía 27% de chances de ganar" (o de avanzar) en el ganado y "Tenía 19% de
 * chances de perder" (o de quedar eliminado) en el perdido. `kind` es 'won' o
 * 'lost'. `null` si no hay una probabilidad válida.
 */
export const describeUpsetProbability = (kind, probability) => {
  const texts = UPSET_CHANCE_TEXT[kind]
  if (!texts || !probability) return null
  const action = texts[probability.kind]
  const chance = formatChance(probability[texts.field])
  if (!action || !chance) return null
  return `Tenía ${chance} de chances de ${action}`
}

/**
 * Línea del tooltip con las chances previas del jugador en un partido:
 * "Chances de ganar: 62%" o "Chances de avanzar: 62%". `null` sin dato.
 */
export const describePointProbability = (probability) => {
  if (!probability) return null
  const action = { win: 'ganar', advance: 'avanzar' }[probability.kind]
  const chance = formatChance(probability.for)
  return action && chance ? `Chances de ${action}: ${chance}` : null
}

/**
 * Variación de Elo con signo del dueño del upset. Usa `ratingChange`; si el BE
 * es anterior y no lo manda, se deriva de `ratingSwing` (ganado: positivo,
 * perdido: negativo). `null` si no hay ningún dato.
 */
export const resolveUpsetRatingChange = (kind, upset) => {
  if (isFiniteNumber(upset?.ratingChange)) return upset.ratingChange
  if (!isFiniteNumber(upset?.ratingSwing)) return null
  const swing = Math.abs(upset.ratingSwing)
  return kind === 'lost' ? -swing : swing
}

const cleanText = (value) =>
  typeof value === 'string' && value.trim() !== '' ? value.trim() : null

// Id de equipo usable en la URL del escudo: un número o un texto simple.
const cleanTeamId = (id) => {
  if (typeof id === 'number') return Number.isFinite(id) ? id : null
  return typeof id === 'string' && /^[\w-]+$/.test(id) ? id : null
}

/**
 * Un lado de `teams` como `{ id, name }` (`id` válido o `null`, `name` texto o
 * `null`), o `null` si no hay ni uno ni otro. Acepta las dos formas del BE: el
 * objeto `{ id, name }` y, de un BE intermedio sin ids, el nombre como texto.
 */
const readTeam = (team) => {
  const isText = typeof team === 'string'
  const name = cleanText(isText ? team : team?.name)
  const id = isText ? null : cleanTeamId(team?.id)
  return name === null && id === null ? null : { id, name }
}

/**
 * Equipos de un punto o upset (`teams: { for, against }`), siempre como
 * `{ for, against }` y cada lado `{ id, name }` o `null`. Un BE anterior que no
 * manda `teams`, o un partido sin equipo, da `null` en ambos.
 */
export const readTeams = (teams) => ({
  for: readTeam(teams?.for),
  against: readTeam(teams?.against),
})

const isShootoutScore = (value) => Number.isInteger(value) && value >= 0

/**
 * Tanda de penales de un punto (`penalties: { for, against }`) o `null` si el
 * partido no se definió así, el dato no está o es inválido.
 */
export const readPenalties = (penalties) =>
  isShootoutScore(penalties?.for) && isShootoutScore(penalties?.against)
    ? { for: penalties.for, against: penalties.against }
    : null

// Con el nombre completo del equipo, no con la sigla: es lo que se escucha.
const withTeam = (name, team) => (team?.name ? `${name} (${team.name})` : name)

/**
 * Frase del partido desde el jugador, para lectores de pantalla (con el nombre
 * completo del equipo, no con la sigla de la pantalla): "Nico (Boca)
 * ganó 2-1 contra Santi (River)". El equipo se omite si no se conoce. En un
 * empate definido por penales agrega la tanda.
 */
export const describeMatchResult = ({
  playerName,
  opponentName,
  score,
  teams,
  penalties,
}) => {
  const { for: teamFor, against: teamAgainst } = readTeams(teams)
  const player = withTeam(playerName, teamFor)
  const opponent = withTeam(opponentName, teamAgainst)
  const shootout = readPenalties(penalties)
  const tail = shootout ? `, penales ${shootout.for}-${shootout.against}` : ''
  if (score.for > score.against) {
    return `${player} ganó ${score.for}-${score.against} contra ${opponent}`
  }
  if (score.for < score.against) {
    return `${player} perdió ${score.for}-${score.against} contra ${opponent}`
  }
  return `${player} empató ${score.for}-${score.against} con ${opponent}${tail}`
}

/** Fecha corta "27/10/2026" (día argentino) de un instante ISO. */
export const formatMatchDay = (value) => formatDay(toArgentinaDay(value))

/** Texto para lectores de pantalla que resume lo que muestra el gráfico. */
export const describeChartForScreenReaders = ({
  players = [],
  dateFrom,
  dateTo,
  matchesInPeriod = 0,
}) => {
  const intro = `Gráfico de líneas con la evolución del Rating APA 2.0 del ${formatDay(
    dateFrom,
  )} al ${formatDay(dateTo)}, en ${matchesInPeriod} ${
    matchesInPeriod === 1 ? 'partido' : 'partidos'
  }.`
  if (players.length === 0) return `${intro} No hay jugadores seleccionados.`
  const lines = players.map(({ player, start, end, summary }) => {
    const change = describeRatingChange(summary.ratingChange).text
    return start
      ? `${player.name}: de ${formatRating(start.rating)} a ${formatRating(
          end.rating,
        )} (${change}).`
      : `${player.name}: debutó en el período y terminó en ${formatRating(
          end.rating,
        )} (${change}).`
  })
  return `${intro} ${lines.join(' ')}`
}
