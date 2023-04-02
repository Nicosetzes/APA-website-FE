import { useState } from 'react'
import { StyledFormatsContainer } from './styled'
import FormatBox from '../FormatBox'
import TournamentSettingsContainer from './../TournamentSettingsContainer'

const FormatsContainer = ({ database }) => {
  const [tournamentFormat, setTournamentFormat] = useState()

  const tournamentOnClickHandler = (e) => {
    console.log(e)
    setTournamentFormat(e.target.title)
  }

  console.log(tournamentFormat)

  return (
    <>
      <StyledFormatsContainer>
        <FormatBox
          title={'Copa del Mundo'}
          img={`${database}/tournaments/logos/2`}
          handler={() => tournamentOnClickHandler(event)}
        />
        <FormatBox
          title={'Liga única'}
          img={`${database}/tournaments/logos/9`}
          handler={() => tournamentOnClickHandler(event)}
        />
        <FormatBox
          title={'Liga con grupos + Playin + Playoffs'}
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
