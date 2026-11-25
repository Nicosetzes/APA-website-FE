// Reinados en el #1 del Rating APA (`GET /ratings/reigns`) con la forma de
// récord que usa `StreakRecordCard` (`{ count, players }`). Las fechas de los
// partidos viejos no siempre son exactas, pero el año sí: el rango se muestra
// en años ("2019 → 2022").

// Clave de la racha en la pestaña Récords.
export const REIGN_RECORD_KEY = 'rating_reign'

const isReign = (reign) =>
  Boolean(reign?.player?.id) && Number.isInteger(reign.matches)

const toHolder = (reign) => ({
  id: String(reign.player.id),
  name: reign.player.name,
  startDate: reign.startDate ?? null,
  endDate: reign.endDate ?? null,
  startDatePrecision: 'year',
  endDatePrecision: 'year',
  isActive: reign.isActive === true,
  // Partidos sin perspectiva (`p1`/`p2`): el que lo coronó, el último como #1
  // y el que lo destronó. Con la forma de `StreakRecordCard`
  // (`startMatch`/`endMatch`/`breakMatch`).
  startMatch: reign.startMatch ?? null,
  endMatch: reign.lastMatch ?? null,
  breakMatch: reign.breakMatch ?? null,
})

/**
 * `data` de `/ratings/reigns` -> `{ historic, current }`, cada uno
 * `{ count, players }` o `null`. En el histórico, con empate en partidos, va
 * un poseedor por jugador (su primer reinado de ese largo). `null` en los dos
 * si no hay datos (el pedido falló o todavía no llegó).
 */
export const buildReignRecords = (reigns) => {
  if (!reigns) return { historic: null, current: null }
  const longest = (Array.isArray(reigns.longest) ? reigns.longest : []).filter(
    isReign,
  )
  const seen = new Set()
  const holders = longest.filter((reign) => {
    const id = String(reign.player.id)
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
  const current = isReign(reigns.current) ? reigns.current : null
  return {
    historic:
      holders.length > 0
        ? { count: holders[0].matches, players: holders.map(toHolder) }
        : null,
    current: current
      ? { count: current.matches, players: [toHolder(current)] }
      : null,
  }
}
