import { useState } from 'react'
import { StyledFormatsContainer } from './styled'
import FormatBox from '../FormatBox'
import TournamentSettingsContainer from './../TournamentSettingsContainer'

const FormatsContainer = ({ database }) => {
  const [tournamentFormat, setTournamentFormat] = useState()

  const tournamentOnClickHandler = (e) => {
    console.log(e.target.title)
    setTournamentFormat(e.target.title)
  }

  console.log(tournamentFormat)

  return (
    <>
      <StyledFormatsContainer>
        <FormatBox
          format={'Copa del Mundo'}
          title={'world_cup'}
          img={`${database}/tournaments/logos/2`}
          handler={() => tournamentOnClickHandler(event)}
        />
        <FormatBox
          format={'Liga única'}
          title={'league'}
          img={`${database}/tournaments/logos/9`}
          handler={() => tournamentOnClickHandler(event)}
        />
        <FormatBox
          format={'Playoffs'}
          title={'playoff'}
          img={`${database}/tournaments/logos/4`}
          handler={() => tournamentOnClickHandler(event)}
        />
        <FormatBox
          format={'Liga con grupos + Playin + Playoffs'}
          title={'league_playin_playoff'}
          img={`${database}/tournaments/logos/8`}
          handler={() => tournamentOnClickHandler(event)}
        />
      </StyledFormatsContainer>
      {tournamentFormat && (
        <TournamentSettingsContainer format={tournamentFormat} />
      )}
    </>
  )
}

export default FormatsContainer
