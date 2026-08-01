import { database } from 'api'
import { formatTeamName } from 'utils'
import {
  Container,
  PlayerName,
  Seed,
  Team,
  TeamLogo,
  TeamName,
  TeamNameContainer,
  Versus,
} from './styled'

const MatchPreview = ({
  playerP1,
  playerP2,
  seedP1,
  seedP2,
  teamP1,
  teamP2,
}) => {
  return (
    <Container>
      <Team>
        <TeamLogo src={`${database}/logos/${teamP1.id}`} alt={teamP1.name} />
        <TeamNameContainer>
          <Seed>{seedP1}</Seed>
          <TeamName>{formatTeamName(teamP1.name)}</TeamName>
        </TeamNameContainer>
        <PlayerName>{playerP1.name}</PlayerName>
      </Team>
      <Versus>VS</Versus>
      <Team>
        <TeamLogo src={`${database}/logos/${teamP2.id}`} alt={teamP2.name} />
        <TeamNameContainer>
          <Seed>{seedP2}</Seed>
          <TeamName>{formatTeamName(teamP2.name)}</TeamName>
        </TeamNameContainer>
        <PlayerName>{playerP2.name}</PlayerName>
      </Team>
    </Container>
  )
}

export default MatchPreview
