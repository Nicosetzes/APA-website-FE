// Fecha en la que se jugó un partido y su precisión, en JS puro (el Jest de
// CRA no resuelve date-fns 4). Mientras haya partidos sin backfill se cae a
// `updatedAt`, igual que el BE.

const SHORT_MONTHS = [
  'ene.',
  'feb.',
  'mar.',
  'abr.',
  'may.',
  'jun.',
  'jul.',
  'ago.',
  'sept.',
  'oct.',
  'nov.',
  'dic.',
]

const LONG_MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

export const getPlayedAt = (match) =>
  match?.playedAt ?? match?.updatedAt ?? null

export const getPlayedAtPrecision = (match) => {
  if (match?.playedAt) return match.playedAtPrecision ?? 'exact'
  return match?.updatedAt ? 'exact' : null
}

// Sin precisión (BE viejo) se asume exacta.
export const isExactPrecision = (precision) =>
  !precision || precision === 'exact'

const pad = (value) => String(value).padStart(2, '0')

const toDate = (value) => {
  if (value === null || value === undefined || value === '') return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const FORMATTERS = {
  day: {
    short: (date) =>
      `${pad(date.getDate())}/${pad(
        date.getMonth() + 1,
      )}/${date.getFullYear()}`,
    long: (date) =>
      `${date.getDate()} de ${
        LONG_MONTHS[date.getMonth()]
      } de ${date.getFullYear()}`,
  },
  month: {
    short: (date) => `${SHORT_MONTHS[date.getMonth()]} ${date.getFullYear()}`,
    long: (date) => `${LONG_MONTHS[date.getMonth()]} de ${date.getFullYear()}`,
  },
  year: {
    short: (date) => String(date.getFullYear()),
    long: (date) => String(date.getFullYear()),
  },
  // Nivel mes con prefijo: el día es inventado.
  approx: {
    short: (date) =>
      `aprox. ${SHORT_MONTHS[date.getMonth()]} ${date.getFullYear()}`,
    long: (date) =>
      `aproximadamente ${
        LONG_MONTHS[date.getMonth()]
      } de ${date.getFullYear()}`,
  },
}

/**
 * Etiqueta de una fecha no exacta ("30/11/2021", "nov. 2022", "2019",
 * "aprox. nov. 2022"); `style: 'long'` es para aria-labels. Devuelve `null` si
 * la precisión es exacta (o falta) o la fecha es inválida, para que el
 * componente use su formato de siempre.
 */
export const formatPlayedAt = (value, precision, { style = 'short' } = {}) => {
  if (isExactPrecision(precision)) return null
  const formatter = FORMATTERS[precision]?.[style]
  const date = toDate(value)
  if (!formatter || !date) return null
  return formatter(date)
}
