import {
  describeMatchResult,
  readPenalties,
  readTeams,
} from 'utils/ratingHistory'
import { teamAbbreviation, teamLogoUrl } from 'utils/teams'
import {
  Crest,
  PenaltyNote,
  ScoreBadge,
  ScoreBox,
  Scoreboard,
  Side,
  SideName,
  SideTeam,
} from './styled'

const TeamTag = ({ team, crestFirst = false, compact }) => {
  if (!team) return null
  const abbreviation = teamAbbreviation(team.name)
  const crest =
    team.id !== null ? (
      <Crest
        $compact={compact}
        src={teamLogoUrl(team.id)}
        alt=""
        onError={(event) => {
          event.target.style.display = 'none'
        }}
      />
    ) : null

  return (
    <>
      {abbreviation && ' '}
      <SideTeam $compact={compact} $crestFirst={crestFirst}>
        {crestFirst && crest}
        {abbreviation && <span>{abbreviation}</span>}
        {!crestFirst && crest}
      </SideTeam>
    </>
  )
}

const MatchResult = ({
  playerName,
  opponentName,
  score,
  teams,
  penalties,
  compact = false,
}) => {
  const { for: teamFor, against: teamAgainst } = readTeams(teams)
  const shootout = readPenalties(penalties)
  const playerWon = score.for > score.against
  const opponentWon = score.for < score.against

  return (
    <Scoreboard
      $compact={compact}
      role="img"
      aria-label={describeMatchResult({
        playerName,
        opponentName,
        score,
        teams,
        penalties,
      })}
    >
      <Side $align="right" $compact={compact} $winner={playerWon}>
        <SideName>{playerName}</SideName>
        <TeamTag team={teamFor} compact={compact} />
      </Side>{' '}
      <ScoreBox>
        <ScoreBadge $compact={compact}>
          {score.for}-{score.against}
        </ScoreBadge>
        {shootout && (
          <>
            {' '}
            <PenaltyNote>
              Penales {shootout.for}-{shootout.against}
            </PenaltyNote>
          </>
        )}
      </ScoreBox>{' '}
      <Side $align="left" $compact={compact} $winner={opponentWon}>
        <SideName>{opponentName}</SideName>
        <TeamTag team={teamAgainst} crestFirst compact={compact} />
      </Side>
    </Scoreboard>
  )
}

export default MatchResult
