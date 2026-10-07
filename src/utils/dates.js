// Formato de fechas del FE (Argentina): DD/MM/YYYY y 24 horas sin segundos.
// JS puro y en hora local, porque el Jest de CRA no resuelve date-fns 4.

const pad = (value) => String(value).padStart(2, '0')

const DATE_PARAM_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

const toDate = (value) => {
  if (value === null || value === undefined || value === '') return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** "08/07/2024"; `''` si el valor falta o es inválido. */
export const formatDate = (value) => {
  const date = toDate(value)
  if (!date) return ''
  return `${pad(date.getDate())}/${pad(
    date.getMonth() + 1,
  )}/${date.getFullYear()}`
}

/** "21:15" (24 horas, sin segundos); `''` si el valor falta o es inválido. */
export const formatTime = (value) => {
  const date = toDate(value)
  if (!date) return ''
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** "08/07/2024 21:15"; `''` si el valor falta o es inválido. */
export const formatDateTime = (value) => {
  const date = toDate(value)
  if (!date) return ''
  return `${formatDate(date)} ${formatTime(date)}`
}

/**
 * "YYYY-MM-DD" (params `dateFrom`/`dateTo`) -> Date a medianoche local, o
 * `null`. `new Date('2024-07-08')` sería UTC y en Argentina caería el día
 * anterior.
 */
export const parseDateParam = (value) => {
  const match = DATE_PARAM_PATTERN.exec(value || '')
  if (!match) return null
  const [, year, month, day] = match.map(Number)
  const date = new Date(year, month - 1, day)
  // Descarta fechas que no existen (ej. 2024-02-31).
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null
}

/** Date -> "YYYY-MM-DD" con el día local; `''` si falta o es inválida. */
export const toDateParam = (value) => {
  const date = toDate(value)
  if (!date) return ''
  return `${String(date.getFullYear()).padStart(4, '0')}-${pad(
    date.getMonth() + 1,
  )}-${pad(date.getDate())}`
}
