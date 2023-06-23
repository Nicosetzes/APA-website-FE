import { StyledTeamRankings } from './styled'
import { useMediaQuery } from 'react-responsive'
import { database } from '../../../../api'

const TeamRankings = ({ title, subtitle, teams }) => {
  // const isL = useMediaQuery({ query: '(min-width: 992px)' })
  // const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 576px)' })
  // const isXS = useMediaQuery({ query: '(min-width: 400px)' })

  return (
    <StyledTeamRankings>
      <div className="title">{title}</div>
      <div className="subtitle">{subtitle}</div>
      <div className="container__rankings">
        {teams.map(
          ({ id, name, played, wins, points, effectiveness }, index) => (
            <div key={id} className="rankings__row">
              <div className="row__team">
                <div className="row__position">
                  <span className="position-pos">Pos.</span>{' '}
                  <span className="position-number">{index + 1}.</span>{' '}
                </div>
                <img src={`${database}/logos/${id}`} alt={name} />
              </div>
              <div
                className="row__stats"
                style={{ marginTop: !isSm ? '1rem' : '0' }}
              >
                <div className="stats-title">
                  <span>{name}</span>
                </div>
                <div className="stats-numbers">
                  <div className="numbers-row">
                    <span>Partidos totales: </span>
                    <span>{played}</span>{' '}
                  </div>
                  <div className="numbers-row">
                    <span>Victorias: </span>
                    <span>{wins}</span>{' '}
                  </div>
                  <div className="numbers-row">
                    <span>Puntos: </span>
                    <span>{points}</span>{' '}
                  </div>
                  <div className="numbers-row">
                    <span>Efectividad (pts/total): </span>
                    <span>{effectiveness}%</span>{' '}
                  </div>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </StyledTeamRankings>
  )
}

export default TeamRankings
