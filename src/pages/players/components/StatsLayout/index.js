import { useMediaQuery } from 'react-responsive'
import { StyledStatsLayout } from './styled'
import { database } from '../../../../api'
import MatchBox from './../MatchBox'

const StatsLayout = ({ playerStats }) => {
  const isXL = useMediaQuery({ query: '(min-width: 1200px)' })

  const {
    matches,
    stats: {
      played,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      scoringDifference,
      effectiveness,
    },
    teams,
  } = playerStats
  console.log(played)

  return (
    <StyledStatsLayout isXL={isXL}>
      {/* <div className="">Cantidad de partidos: {matches.length}</div> */}
      {/* <div className="stats__player">Jugador: {player.name}</div> */}
      <div className="stats__teams">
        <span>Equipos</span>
        <div>
          {teams
            .sort((a, b) => {
              if (a.name < b.name) return -1
              if (a.name > b.name) return 1
            })
            .map(({ id, name }) => (
              <div key={id} className="teams__team">
                <span>{name}</span>
                <img src={`${database}/logos/${id}`} alt={name} />
              </div>
            ))}
        </div>
      </div>
      <div className="stats__container">
        <div className="stats__data">
          <div className="data__card played">
            <div className="card__title">Totales (PJ)</div>
            <div className="card__value">{played}</div>
          </div>
          <div className="data__card wins">
            <div className="card__title">Victorias (PG)</div>
            <div className="card__value">{wins}</div>
          </div>
          <div className="data__card draws">
            <div className="card__title">Empates (PE)</div>
            <div className="card__value">{draws}</div>
          </div>
          <div className="data__card losses">
            <div className="card__title">Derrotas (PP)</div>
            <div className="card__value">{losses}</div>
          </div>
          <div className="data__card scored">
            <div className="card__title">Goles a favor</div>
            <div className="card__value">{goalsFor}</div>
          </div>
          <div className="data__card received">
            <div className="card__title">Goles en contra</div>
            <div className="card__value">{goalsAgainst}</div>
          </div>
          <div className="data__card scoringDifference">
            <div className="card__title">Diferencia de gol</div>
            <div className="card__value">
              {scoringDifference > 0 && '+'}
              {scoringDifference}
            </div>
          </div>
          <div className="data__card effectiveness">
            <div className="card__title">Efectividad</div>
            <div className="card__value">{effectiveness}%</div>
          </div>
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
      </div>
    </StyledStatsLayout>
  )
}

export default StatsLayout
