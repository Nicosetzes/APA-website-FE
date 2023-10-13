import { StyledStatsLayout } from './styled'
import { database } from '../../../../api'
import MatchBox from './../MatchBox'

const StatsLayout = ({ playerStats }) => {
  const { matches, player, stats, teams } = playerStats
  console.log(matches)
  return (
    <StyledStatsLayout>
      {/* <div className="">Cantidad de partidos: {matches.length}</div> */}
      {/* <div className="stats__player">Jugador: {player.name}</div> */}
      <div className="stats__teams">
        Equipos:{' '}
        {teams.map(({ id, name }) => (
          <div key={id} className="teams__team">
            <span>{name}</span>
            <img src={`${database}/logos/${id}`} alt={name} />
          </div>
        ))}
      </div>
      <div className="stats__matches">
        {matches.map(
          ({
            _id,
            updatedAt,
            playerP1,
            playerP2,
            teamP1,
            teamP2,
            scoreP1,
            scoreP2,
            outcome,
          }) => (
            <MatchBox
              key={_id}
              outcome={outcome}
              playerP1={playerP1}
              playerP2={playerP2}
              teamP1={teamP1}
              teamP2={teamP2}
              scoreP1={scoreP1}
              scoreP2={scoreP2}
              updatedAt={updatedAt}
            />
          ),
        )}
      </div>
    </StyledStatsLayout>
  )
}

export default StatsLayout
