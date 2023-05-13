import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { api, database } from './../../api'
import { StyledFormatsContainer } from './styled'
import TournamentSettings from './components/TournamentSettings'
import axios from 'axios'
import { Oval } from 'react-loader-spinner'
import { Link } from 'react-router-dom'

const CreateTournament = () => {
  const isXL = useMediaQuery({ query: '(min-width: 1200px)' })
  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  const isXS = useMediaQuery({ query: '(min-width: 350px)' })

  const [tournamentFormat, setTournamentFormat] = useState()

  return (
    <>
      <StyledFormatsContainer>
        <div
          className="format__container"
          onClick={() => setTournamentFormat('world_cup')}
        >
          <div className="formats__box-title">Copa del Mundo</div>
          <img src={`${database}/tournaments/logos/2`} />
        </div>
        <div
          className="format__container"
          onClick={() => setTournamentFormat('league')}
        >
          <div className="formats__box-title">Liga única</div>
          <img src={`${database}/tournaments/logos/1`} />
        </div>
        <div
          className="format__container"
          onClick={() => setTournamentFormat('playoff')}
        >
          <div className="formats__box-title">Playoffs</div>
          <img src={`${database}/tournaments/logos/4`} />
        </div>
        <div
          className="format__container"
          onClick={() => setTournamentFormat('league_playin_playoff')}
        >
          <div className="formats__box-title">
            Liga con grupos + Playin + Playoffs
          </div>
          <img src={`${database}/tournaments/logos/8`} />
        </div>
      </StyledFormatsContainer>
      {tournamentFormat && <TournamentSettings format={tournamentFormat} />}
    </>
  )
}

export default CreateTournament
