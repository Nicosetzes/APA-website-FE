import { database } from 'api'
import { formatDate } from 'utils/dates'
import { formatPlayedAt } from 'utils/playedAt'
import {
  MatchCard,
  MatchLabel,
  MetaLine,
  Opponent,
  Score,
  ScoreLine,
  TypeChip,
} from '../StreakMatchSummary/styled'

const TYPE_LABELS = { playin: 'Playin', playoff: 'Playoff' }

// Partido de un reinado en el #1, sin perspectiva: puede no involucrar al #1
// (lo pueden superar mientras juegan otros). El nombre del #1 va resaltado si
// jugó el partido.
const sideText = (side) =>
  side?.team?.name ? `${side.name} (${side.team.name})` : side?.name || '?'

const Logo = ({ team }) =>
  team?.id !== null && team?.id !== undefined ? (
    <img src={`${database}/logos/${team.id}`} alt={team.name || ''} />
  ) : null

const SideName = ({ side, holderId }) =>
  String(side?.id) === String(holderId) ? (
    <strong>{sideText(side)}</strong>
  ) : (
    sideText(side)
  )

const formatMatchDate = (match, style) =>
  formatPlayedAt(match.date, match.datePrecision, { style }) ||
  (style === 'long'
    ? formatPlayedAt(match.date, 'day', { style })
    : formatDate(match.date))

const buildAriaLabel = (description, match) => {
  const { p1, p2, penalties } = match
  const parts = [
    `${description}: ${sideText(p1)} ${p1.score} a ${p2.score} ${sideText(p2)}`,
  ]
  if (penalties) parts.push(`${penalties.p1} a ${penalties.p2} en penales`)
  if (match.tournament) parts.push(match.tournament)
  parts.push(
    match.date ? formatMatchDate(match, 'long') : 'sin fecha registrada',
  )
  return parts.join(', ')
}

const ReignMatchSummary = ({
  label,
  description,
  holderId,
  match,
  isBreak = false,
}) => {
  if (!match?.p1 || !match?.p2) return null
  const { p1, p2, penalties } = match
  const typeLabel = TYPE_LABELS[match.type]
  return (
    <MatchCard
      role="group"
      $isBreak={isBreak}
      aria-label={buildAriaLabel(description, match)}
    >
      <MatchLabel $isBreak={isBreak}>{label}</MatchLabel>
      <ScoreLine aria-hidden="true">
        <Logo team={p1.team} />
        <Score>
          {p1.score}-{p2.score}
          {penalties && ` (${penalties.p1}-${penalties.p2})`}
        </Score>
        <Logo team={p2.team} />
      </ScoreLine>
      <Opponent aria-hidden="true">
        <SideName side={p1} holderId={holderId} /> vs{' '}
        <SideName side={p2} holderId={holderId} />
      </Opponent>
      <MetaLine aria-hidden="true">
        {match.tournament && <span>{match.tournament}</span>}
        {match.tournament && <span>·</span>}
        {match.date ? (
          <time dateTime={match.date}>{formatMatchDate(match, 'short')}</time>
        ) : (
          <span>sin fecha</span>
        )}
        {typeLabel && <TypeChip>{typeLabel}</TypeChip>}
      </MetaLine>
    </MatchCard>
  )
}

export default ReignMatchSummary
