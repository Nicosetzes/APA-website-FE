import { database } from 'api'
import { useSearchParams } from 'react-router-dom'
import {
  MatchDate,
  MatchScore,
  MatchTeam,
  OutcomeTag,
  StyledMatchBox,
} from './styled'
import { format, parseISO } from 'date-fns'

const OUTCOME_COLORS = { win: '#22c55e', draw: '#eab308', loss: '#ef4444' }
const OUTCOME_LABELS = { win: 'V', draw: 'E', loss: 'D' }

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

  const getOutcomeKey = () => {
    const player = searchParams.get('player')
    const { playerThatWon } = outcome
    if (!playerThatWon) return 'draw'
    return playerThatWon.id === player ? 'win' : 'loss'
  }

  const key = getOutcomeKey()
  const color = OUTCOME_COLORS[key]

  return (
    <StyledMatchBox $color={color}>
      <OutcomeTag $color={color}>{OUTCOME_LABELS[key]}</OutcomeTag>
      <div className="match__body">
        <MatchTeam className="team--left">
          <img src={`${database}/logos/${teamP1.id}`} alt={teamP1.name} />
          <span className="player-name">{playerP1.name}</span>
        </MatchTeam>
        <MatchScore>
          <span>{scoreP1}</span>
          <span className="separator">–</span>
          <span>{scoreP2}</span>
        </MatchScore>
        <MatchTeam className="team--right">
          <span className="player-name">{playerP2.name}</span>
          <img src={`${database}/logos/${teamP2.id}`} alt={teamP2.name} />
        </MatchTeam>
      </div>
      <MatchDate>{format(parseISO(updatedAt), 'dd/MM/yyyy')}</MatchDate>
    </StyledMatchBox>
  )
}

export default MatchBox
