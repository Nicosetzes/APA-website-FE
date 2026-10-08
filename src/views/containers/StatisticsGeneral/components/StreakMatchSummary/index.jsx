import { database } from 'api'
import { formatDate } from 'utils/dates'
import { formatPlayedAt } from 'utils/playedAt'
import {
  MatchCard,
  MatchLabel,
  MetaLine,
  Opponent,
  ResultChip,
  Score,
  ScoreLine,
  TypeChip,
} from './styled'

const RESULT_LABELS = { W: 'V', D: 'E', L: 'D' }
const TYPE_LABELS = { playin: 'Playin', playoff: 'Playoff' }

const getShootout = (penalties) => {
  if (!penalties) return null
  const { goalsFor, goalsAgainst } = penalties
  return {
    text: `(${goalsFor}-${goalsAgainst})`,
    spoken: `${goalsFor} a ${goalsAgainst} en penales`,
  }
}

const KNOCKOUT_VERBS = { W: 'ganó', L: 'perdió' }

const getSpokenShootout = (shootout, match, isKnockout) => {
  const verb = isKnockout && KNOCKOUT_VERBS[match.result]
  return verb ? `${verb} ${shootout.spoken}` : shootout.spoken
}

const buildAriaLabel = ({
  description,
  holderName,
  match,
  shootout,
  isKnockout,
}) => {
  const parts = [
    `${description}: ${holderName} ${match.goalsFor} a ${match.goalsAgainst} ${
      match.opponent?.name || ''
    }`.trim(),
  ]
  if (shootout) parts.push(getSpokenShootout(shootout, match, isKnockout))
  if (match.tournament?.name) parts.push(match.tournament.name)
  parts.push(
    match.date
      ? formatPlayedAt(match.date, match.datePrecision, { style: 'long' }) ||
          // Exacta: "4 de julio de 2022", el mismo texto largo que nivel día.
          formatPlayedAt(match.date, 'day', { style: 'long' })
      : 'sin fecha registrada',
  )
  return parts.join(', ')
}

const StreakMatchSummary = ({
  label,
  description,
  holderName,
  match,
  isBreak = false,
  isKnockout = false,
}) => {
  if (!match) return null

  const shootout = getShootout(match.penalties)
  const typeLabel = TYPE_LABELS[match.type]

  return (
    <MatchCard
      role="group"
      $isBreak={isBreak}
      aria-label={buildAriaLabel({
        description,
        holderName,
        match,
        shootout,
        isKnockout,
      })}
    >
      <MatchLabel $isBreak={isBreak}>{label}</MatchLabel>
      <ScoreLine>
        {match.team?.id && (
          <img
            src={`${database}/logos/${match.team.id}`}
            alt={match.team.name || ''}
          />
        )}
        <Score>
          {match.goalsFor}-{match.goalsAgainst}
          {shootout && ` ${shootout.text}`}
        </Score>
        {RESULT_LABELS[match.result] && (
          <ResultChip $result={match.result} aria-hidden="true">
            {RESULT_LABELS[match.result]}
          </ResultChip>
        )}
      </ScoreLine>
      <Opponent>
        vs {match.opponent?.name || '?'}
        {match.opponentTeam?.name && ` (${match.opponentTeam.name})`}
      </Opponent>
      <MetaLine>
        {match.tournament?.name && <span>{match.tournament.name}</span>}
        {match.tournament?.name && <span aria-hidden="true">·</span>}
        {match.date ? (
          <time dateTime={match.date}>
            {formatPlayedAt(match.date, match.datePrecision) ||
              formatDate(match.date)}
          </time>
        ) : (
          <span>sin fecha</span>
        )}
        {typeLabel && <TypeChip>{typeLabel}</TypeChip>}
      </MetaLine>
    </MatchCard>
  )
}

export default StreakMatchSummary
