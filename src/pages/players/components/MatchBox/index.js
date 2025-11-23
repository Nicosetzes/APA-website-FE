import { StyledMatchBox } from './styled'
import { useSearchParams } from 'react-router-dom'
import { database } from '../../../../api'
import { format, parseISO } from 'date-fns'

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
  const [searchParams] = useSearchParams()

  const establishOutcomeColor = (outcome) => {
    const player = searchParams.get('player')
    const { playerThatWon } = outcome
    if (!playerThatWon) return `#ebebe9`
    else if (playerThatWon.id == player) return `#67eb55`
    else return `#f53f3f`
  }

  return (
    <>
      <StyledMatchBox
        style={{ border: `${establishOutcomeColor(outcome)} 2px solid` }}
      >
        <div className="match__info">
          <div className="info__team">
            <span>
              {playerP1.name.at(0) + playerP1.name.at(1).toUpperCase()}
            </span>
            <img src={`${database}/logos/${teamP1.id}`} alt={teamP1.name} />
          </div>
          <div
            className="info__score"
            style={{
              backgroundColor: `${establishOutcomeColor(outcome)}`,
            }}
          >
            <div>{scoreP1}</div>
            <div>{scoreP2}</div>
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
          {format(parseISO(updatedAt), 'dd/MM/yyyy')}
        </div>
      </StyledMatchBox>
    </>
  )
}

export default MatchBox
