import { useState } from 'react'
// import { useMediaQuery } from 'react-responsive'
import { database } from './../../api'
import { StyledFormatsContainer } from './styled'
import TournamentSettings from './components/TournamentSettings'
import tagTeamsImage from './../../images/leo.png'

const CreateTournament = () => {
  // const isXL = useMediaQuery({ query: '(min-width: 1200px)' })
  // const isL = useMediaQuery({ query: '(min-width: 992px)' })
  // const isM = useMediaQuery({ query: '(min-width: 768px)' })
  // const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  // const isXS = useMediaQuery({ query: '(min-width: 350px)' })

  const [tournamentFormat, setTournamentFormat] = useState()

  return (
    <>
      <div
        style={{
          display: 'flex',
          fontWeight: 700,
          justifyContent: 'center',
          margin: '1.5rem',
          textDecoration: 'underline',
        }}
      >
        Elija el formato deseado
      </div>
      <StyledFormatsContainer>
        <div
          className="format__container"
          onClick={() => setTournamentFormat('league')}
        >
          <div className="formats__box-title">Liga única</div>
          <img src={`${database}/tournaments/logos/1`} />
        </div>
        <div
          className="format__container"
          onClick={() => setTournamentFormat('league_playin_playoff')}
        >
          <div className="formats__box-title">Superliga APA</div>
          <img src={`${database}/tournaments/logos/8`} />
        </div>
        <div
          className="format__container"
          onClick={() => setTournamentFormat('world_cup')}
        >
          <div className="formats__box-title">Copa del Mundo</div>
          <img src={`${database}/tournaments/logos/2`} />
        </div>
        <div
          className="format__container"
          onClick={() => setTournamentFormat('champions_league')}
        >
          <div className="formats__box-title">
            <i>Chempions</i>
          </div>
          <img src={`${database}/tournaments/logos/5`} />
        </div>
        <div
          className="format__container"
          onClick={() => setTournamentFormat('tag_teams')}
        >
          <div className="formats__box-title">Torneo de duplas</div>
          <img src={tagTeamsImage} />
        </div>
      </StyledFormatsContainer>
      {tournamentFormat && <TournamentSettings format={tournamentFormat} />}
    </>
  )
}

export default CreateTournament
