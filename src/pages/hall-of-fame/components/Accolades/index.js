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

  const runnerUpsByPlayer = useMemo(() => {
    const counts = {}

    ;(tournaments || []).forEach((tournament) => {
      const playerName = tournament.outcome?.finalist?.player?.name
      if (playerName) counts[playerName] = (counts[playerName] || 0) + 1
    })

    return counts
  }, [tournaments])

  const sortedPlayers = useMemo(() => {
    return Object.entries(playerTrophies)
      .sort(([, a], [, b]) => b.length - a.length)
      .map(([player, trophies]) => ({
        player,
        trophies,
        runnerUps: runnerUpsByPlayer[player] || 0,
      }))
  }, [playerTrophies, runnerUpsByPlayer])

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
        {sortedPlayers.map(({ player, trophies, runnerUps }) => (
          <PlayerBox
            key={player}
            player={player}
            trophies={trophies}
            runnerUps={runnerUps}
          />
        ))}
      </div>
    </StyledAccolades>
  )
}

export default Accolades
