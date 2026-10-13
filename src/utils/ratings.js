// Helpers del ranking Elo (`GET /ratings`). El BE manda el rating con un
// decimal; en pantalla se muestra entero, salvo la variación, que es chica.

export const formatRating = (value) =>
  typeof value === 'number' && Number.isFinite(value)
    ? String(Math.round(value))
    : '-'

// Variación del último partido: `trend` define el color y la flecha, `text` el
// valor ya con signo. Una variación que redondea a 0,0 es neutra.
export const describeRatingChange = (change) => {
  if (typeof change !== 'number' || !Number.isFinite(change)) {
    return { trend: 'flat', text: '-' }
  }

  const rounded = Math.round(change * 10) / 10

  if (rounded === 0) return { trend: 'flat', text: '0.0' }

  return {
    trend: rounded > 0 ? 'up' : 'down',
    text: `${rounded > 0 ? '+' : ''}${rounded.toFixed(1)}`,
  }
}

// Ordena las tarjetas de jugadores según su lugar en el ranking Elo. Los que
// no figuran en el ranking van al final y conservan su orden original.
export const orderByRating = (players = [], ratings = []) => {
  const positions = new Map(
    ratings.map(({ player, position }) => [String(player.id), position]),
  )

  return players
    .map((entry, index) => ({
      entry,
      index,
      position: positions.get(String(entry.player.id)),
    }))
    .sort((a, b) => {
      if (a.position === undefined && b.position === undefined) {
        return a.index - b.index
      }
      if (a.position === undefined) return 1
      if (b.position === undefined) return -1
      return a.position - b.position
    })
    .map(({ entry }) => entry)
}

export const indexRatingsByPlayer = (ratings = []) =>
  new Map(ratings.map((row) => [String(row.player.id), row]))
