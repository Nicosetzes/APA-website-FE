import { useMediaQuery } from 'react-responsive'
import { StyledStatsLayout } from './styled'
import { database } from '../../../../api'
import MatchBox from './../MatchBox'

const StatsLayout = ({ playerStats }) => {
  const isXL = useMediaQuery({ query: '(min-width: 1200px)' })
  // const isL = useMediaQuery({ query: '(min-width: 992px)' })
  // const isM = useMediaQuery({ query: '(min-width: 768px)' })
  // const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  // const isXS = useMediaQuery({ query: '(min-width: 350px)' })

  const { matches, player, stats, teams } = playerStats
  console.log(stats)
  return (
    <StyledStatsLayout isXL={isXL}>
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
      <div className="stats__container">
        <div className="stats__data">
          <div className="data__card played">
            <div className="card__title">Totales (PJ)</div>
            <div className="card__value">{stats.played}</div>
          </div>
          <div className="data__card wins">
            <div className="card__title">Victorias (PG)</div>
            <div className="card__value">{stats.wins}</div>
          </div>
          <div className="data__card draws">
            <div className="card__title">Empates (PE)</div>
            <div className="card__value">{stats.draws}</div>
          </div>
          <div className="data__card losses">
            <div className="card__title">Derrotas (PP)</div>
            <div className="card__value">{stats.losses}</div>
          </div>
          <div className="data__card scored">
            <div className="card__title">Goles a favor</div>
            <div className="card__value">{stats.goalsFor}</div>
          </div>
          <div className="data__card received">
            <div className="card__title">Goles en contra</div>
            <div className="card__value">{stats.goalsAgainst}</div>
          </div>
          <div className="data__card effectiveness">
            <div className="card__title">Efectividad</div>
            <div className="card__value">{stats.effectiveness}%</div>
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
