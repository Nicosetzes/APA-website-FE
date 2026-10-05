export const normalizePlayoffMode = (tournament = {}) =>
  tournament.playoffMode || 'single'

export const normalizeLeg = (match = {}) => match.leg || 1

export const getLegLabel = ({ format, playoffMode, playoffId, leg }) => {
  if (format !== 'playoff') return null
  if (
    normalizePlayoffMode({ playoffMode }) !== 'two_legged' ||
    Number(playoffId) === 31
  ) {
    return 'Partido único'
  }
  return { 1: 'Ida', 2: 'Vuelta', 3: 'Desempate' }[Number(leg)] || null
}

export const sortSeriesMatches = (matches = []) =>
  [...matches].sort((left, right) => {
    const byLeg = normalizeLeg(left) - normalizeLeg(right)
    if (byLeg) return byLeg
    return String(left._id).localeCompare(String(right._id))
  })

export const groupPlayoffSeries = (matches = [], tournamentId = '') => {
  const groups = new Map()
  matches.forEach((match) => {
    const key =
      match.series?.key ||
      `${tournamentId || match.tournament?.id}:${match.playoff_id}`
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        playoffId: Number(match.playoff_id),
        matches: [],
      })
    }
    groups.get(key).matches.push(match)
  })
  return [...groups.values()]
    .map((tie) => ({ ...tie, matches: sortSeriesMatches(tie.matches) }))
    .sort((left, right) => left.playoffId - right.playoffId)
}
