const normalizeId = (value) => {
  if (value == null) return ''

  if (typeof value === 'object') {
    return normalizeId(value.id) || normalizeId(value._id)
  }

  return String(value).trim()
}

export const canMutateTournament = (tournament, user) => {
  if (user?.role === 'superadmin') return true

  const userId = normalizeId(user?.id) || normalizeId(user?._id)
  if (!userId) return false

  const playerIds = Array.isArray(tournament?.players)
    ? tournament.players.map(normalizeId)
    : []
  const teamPlayerIds = Array.isArray(tournament?.teams)
    ? tournament.teams.map(({ player } = {}) => normalizeId(player))
    : []

  return [...playerIds, ...teamPlayerIds].some(
    (participantId) => participantId && participantId === userId,
  )
}
