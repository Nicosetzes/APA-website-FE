import { StyledMatchBox } from './styled'
import { useSearchParams } from 'react-router-dom'
import { database } from '../../../../api'

const MatchBox = ({
  outcome,
  playerP1,
  playerP2,
  teamP1,
  teamP2,
  scoreP1,
  scoreP2,
  updatedAt,
}) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const establishMatchBorderColor = (outcome) => {
    const player = searchParams.get('player')
    const { playerThatWon } = outcome
    if (!playerThatWon) return `#dbb311`
    else if (playerThatWon.id == player) return `#42eb2b`
    else return `#e10e0e`
  }

  return (
    <>
      <StyledMatchBox
        style={{ border: `${establishMatchBorderColor(outcome)} 2px solid` }}
      >
        <div className="match__info">
          <div className="info__team">
            <span>
              {playerP1.name.at(0) + playerP1.name.at(1).toUpperCase()}
            </span>
            <img src={`${database}/logos/${teamP1.id}`} alt={teamP1.name} />
          </div>
          <div className="info__score">
            {scoreP1} - {scoreP2}
          </div>
          <div className="info__team">
            <img src={`${database}/logos/${teamP2.id}`} alt={teamP2.name} />
            <span>
              {' '}
              {playerP2.name.at(0) + playerP2.name.at(1).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="match__date">
          {new Date(updatedAt).toLocaleDateString()}
        </div>
      </StyledMatchBox>
    </>
  )
}

export default MatchBox
