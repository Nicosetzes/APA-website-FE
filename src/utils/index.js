export const formatTeamName = (team) => {
  if (!team) return ''
  const words = team.split(' ')
  if (words.length > 1)
    return words.map((word) => word[0].toUpperCase()).join('')
  return team.substring(0, 3).toUpperCase()
}
