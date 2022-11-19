import { useState, useEffect } from 'react'
import { api, database } from './../../api'
import axios from 'axios'
import CountryContainer from './components/CountryContainer'
import { Oval } from 'react-loader-spinner'
import { Link } from 'react-router-dom'

const CreateTournament = () => {
  const [tournamentData, setTournamentData] = useState()

  const getTournamentData = () => {
    const players = axios.get(`${api}/users`)
    const leagues = axios.get(`${database}/leagues`)

    Promise.all([players, leagues]).then((values) => {
      const data = values.map((response) => response.data)
      setTournamentData(data)
    })
  }

  useEffect(() => {
    getTournamentData()
  }, [])

  if (tournamentData) {
    const players = tournamentData[0]
    const countries = tournamentData[1]

    return (
      <>
        <div
          style={{
            display: 'flex',
            margin: '2rem auto',
            justifyContent: 'center',
          }}
        >
          <Link to={`world-cup`} style={{ fontSize: '1.25rem' }}>
            Generar Copa del Mundo 2022
          </Link>
        </div>
        <div
          style={{
            display: 'flex',
            margin: '2rem auto',
            justifyContent: 'center',
          }}
        >
          Crear torneo
        </div>
        <CountryContainer countries={countries} players={players} />
      </>
    )
  } else {
    return (
      <div style={{ margin: 'auto', width: '100px' }}>
        <Oval
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="three-dots-loading"
          $wrapperStyle
          $wrapperClass
        />
      </div>
    )
  }
}

export default CreateTournament
