import { formatDate } from 'utils/dates'
import { formatPlayedAt } from 'utils/playedAt'
import { MatchCard, MatchLabel, MetaLine } from '../StreakMatchSummary/styled'
import { PhaseText, TournamentName } from './styled'

export const PHASE_LABELS = {
  regular: 'Fase regular',
  playin: 'Play-in',
  round_of_32: '16avos',
  round_of_16: 'Octavos',
  quarterfinal: 'Cuartos',
  semifinal: 'Semis',
  final: 'Final',
  champion: 'Campeón',
}

const UNNAMED = 'Torneo sin nombre'

const spokenDate = ({ ongoing, closedAt, closedAtPrecision }) => {
  if (ongoing) return 'en curso'
  if (!closedAt) return 'sin fecha registrada'
  return (
    formatPlayedAt(closedAt, closedAtPrecision, { style: 'long' }) ||
    formatPlayedAt(closedAt, 'day', { style: 'long' })
  )
}

const VisibleDate = ({ ongoing, closedAt, closedAtPrecision }) => {
  if (ongoing) return <span>En curso</span>
  if (!closedAt) return <span>sin fecha</span>
  return (
    <time dateTime={closedAt}>
      {formatPlayedAt(closedAt, closedAtPrecision) || formatDate(closedAt)}
    </time>
  )
}

const StreakTournamentSummary = ({
  label,
  description,
  holderName,
  tournament,
  isBreak = false,
}) => {
  if (!tournament) return null

  const name = tournament.name || UNNAMED
  const phase = PHASE_LABELS[tournament.phaseReached]
  const ariaLabel = [
    `${description}: ${holderName}`,
    name,
    phase,
    spokenDate(tournament),
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <MatchCard role="group" $isBreak={isBreak} aria-label={ariaLabel}>
      <MatchLabel $isBreak={isBreak}>{label}</MatchLabel>
      <TournamentName>{name}</TournamentName>
      {phase && <PhaseText>{phase}</PhaseText>}
      <MetaLine>
        <VisibleDate {...tournament} />
      </MetaLine>
    </MatchCard>
  )
}

export default StreakTournamentSummary
