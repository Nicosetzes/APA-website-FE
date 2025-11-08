import { StyledSmallMatch } from './styled'
import { database } from './../../api'

const SmallMatch = ({
  playerP1,
  teamP1,
  scoreP1,
  playerP2,
  teamP2,
  scoreP2,
  updatedAt,
}) => {
  return (
    <>
      <StyledSmallMatch>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="match-info">
            <div className="match-info-team">
              {(teamP1.name[0] + teamP1.name[1] + teamP1.name[2]).toUpperCase()}
            </div>
            <div className="match-info-logo">
              <img src={`${database}/logos/${teamP1.id}`} alt={teamP1.name} />
            </div>
            <div className="match-info-player">{playerP1.name}</div>
          </div>
          <div className="match-score">
            <div className="match-score-goals">{scoreP1}</div>
            <div className="match-score-versus">vs</div>
            <div className="match-score-goals">{scoreP2}</div>
          </div>
          <div className="match-info">
            <div className="match-info-team">
              {(teamP2.name[0] + teamP2.name[1] + teamP2.name[2]).toUpperCase()}
            </div>
            <div className="match-info-logo">
              <img src={`${database}/logos/${teamP2.id}`} alt={teamP2.name} />
            </div>
            <div className="match-info-player">{playerP2.name}</div>
          </div>
        </div>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            fontSize: '0.75rem',
            justifyContent: 'center',
            margin: '0.5rem 0',
          }}
        >
          {new Date(updatedAt).toLocaleString()}
        </div>
      </StyledSmallMatch>
    </>
  )
}

export default SmallMatch
