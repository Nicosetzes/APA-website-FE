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
    <StyledAccolades aria-labelledby="historic-champions-title">
      <div className="accolades__intro">
        <h2 id="historic-champions-title">
          Campeones históricos
          <img
            className="section-title__logo"
            src="/images/sitioapalogo-transparent.png"
            alt=""
          />
        </h2>
      </div>

      <div className="accolades__grid">
        {sortedPlayers.map(({ player, trophies }) => (
          <PlayerBox key={player} player={player} trophies={trophies} />
        ))}
      </div>
    </StyledAccolades>
  )
}

export default Accolades
