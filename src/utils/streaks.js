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
