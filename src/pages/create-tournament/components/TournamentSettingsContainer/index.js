import { StyledTournamentSettingsContainer } from './styled'
import TournamentSettings from './../TournamentSettings'

const FormatsContainer = ({ format, players, leagues }) => {
  return (
    <StyledTournamentSettingsContainer>
      <TournamentSettings format={format} players={players} leagues={leagues} />
    </StyledTournamentSettingsContainer>
  )
}

export default FormatsContainer
