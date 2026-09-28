import { database } from 'api'
import {
  Divider,
  MatchCard,
  Seed,
  TeamCode,
  TeamInfo,
  TeamLogo,
  TeamPlayerName,
  TeamResults,
  TeamRow,
} from './styled'

const Results = ({ results }) => {
  if (!results) return null

  const { wins = 0, draws = 0, losses = 0 } = results

  return (
    <TeamResults>
      <span>{wins}V</span> / <span>{draws}E</span> / <span>{losses}D</span>
    </TeamResults>
  )
}

const PlayoffBracketPreviewMatch = ({
  side,
  playerP1,
  teamP1,
  seedP1,
  resultsP1,
  playerP2,
  teamP2,
  seedP2,
  resultsP2,
}) => {
  return (
    <MatchCard side={side}>
      <TeamRow side={side}>
        <Seed>{seedP1 || '?'}</Seed>
        <TeamLogo src={`${database}/logos/${teamP1?.id}`} alt={teamP1?.name} />
        <TeamInfo side={side}>
          <TeamCode>{teamP1?.name}</TeamCode>
          <Results results={resultsP1} />
          <TeamPlayerName>{playerP1?.name}</TeamPlayerName>
        </TeamInfo>
      </TeamRow>
      <Divider>VS</Divider>
      <TeamRow side={side}>
        <Seed>{seedP2 || '?'}</Seed>
        <TeamLogo src={`${database}/logos/${teamP2?.id}`} alt={teamP2?.name} />
        <TeamInfo side={side}>
          <TeamCode>{teamP2?.name}</TeamCode>
          <Results results={resultsP2} />
          <TeamPlayerName>{playerP2?.name}</TeamPlayerName>
        </TeamInfo>
      </TeamRow>
    </MatchCard>
  )
}

export default PlayoffBracketPreviewMatch
