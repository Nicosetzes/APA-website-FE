import PlayerBox from '../PlayerBox'
import { StyledAccolades } from './styled'
import { useMemo } from 'react'

const Accolades = ({ tournaments }) => {
  const playerTrophies = useMemo(() => {
    if (!tournaments) return {}

    const trophiesByPlayer = {}

    tournaments.forEach((tournament) => {
      if (tournament.outcome?.champion) {
        const playerName = tournament.outcome.champion.player.name
        if (!trophiesByPlayer[playerName]) {
          trophiesByPlayer[playerName] = []
        }
        trophiesByPlayer[playerName].push(tournament.cloudinary_id)
      }
    })

    return trophiesByPlayer
  }, [tournaments])

  const sortedPlayers = useMemo(() => {
    return Object.entries(playerTrophies)
      .sort(([, a], [, b]) => b.length - a.length)
      .map(([player, trophies]) => ({ player, trophies }))
  }, [playerTrophies])

  return (
    <>
      <StyledAccolades>
        {sortedPlayers.map(({ player, trophies }) => (
          <PlayerBox key={player} player={player} trophies={trophies} />
        ))}
      </StyledAccolades>
    </>
  )
}

export default Accolades
