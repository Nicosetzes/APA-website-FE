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

  const rounded = Math.sign(change) * (Math.round(Math.abs(change) * 10) / 10)

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

const isNumber = (value) => typeof value === 'number' && Number.isFinite(value)

const TOOLTIP_MATCH_RATING = 'Rating APA 2.0'

const playerTag = (name, fallback) =>
  typeof name === 'string' && name.trim()
    ? name.trim().substring(0, 3).toUpperCase()
    : fallback

export const describeMatchRatingChange = (
  ratingChange,
  { nameP1, nameP2, idP1, idP2, focusPlayerId } = {},
) => {
  if (!ratingChange || typeof ratingChange !== 'object') return null
  const { p1, p2 } = ratingChange
  if (!isNumber(p1) || !isNumber(p2)) return null

  const same = (a, b) => a != null && b != null && String(a) === String(b)
  const build = (side, value, name, fallback) => {
    const { trend, text } = describeRatingChange(value)
    const tag = playerTag(name, fallback)
    return { side, tag, name: name || fallback, text: `${tag} ${text}`, trend }
  }
  const all = [build('p1', p1, nameP1, 'P1'), build('p2', p2, nameP2, 'P2')]

  let lines = all
  if (same(focusPlayerId, idP1)) lines = [all[0]]
  else if (same(focusPlayerId, idP2)) lines = [all[1]]

  const label = lines
    .map((line) => `${line.name} ${line.text.slice(line.tag.length + 1)}`)
    .join(', ')

  return {
    lines,
    focused: lines.length === 1,
    tooltip: TOOLTIP_MATCH_RATING,
    label: `Variación de Elo: ${label}`,
  }
}
