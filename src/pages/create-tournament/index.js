import { useState, useEffect } from 'react'
import { api, database } from './../../api'
import axios from 'axios'
import { Oval } from 'react-loader-spinner'
import { Link } from 'react-router-dom'

import FormatsContainer from './components/FormatsContainer'
import PreviousTournamentsContainer from './components/PreviousTournamentsContainer'

const CreateTournament = () => {
  const [tournamentData, setTournamentData] = useState()
  //   const [tournamentFormat, setTournamentFormat] = useState()

  const getTournamentData = () => {
    const players = axios.get(`${api}/users`)
    const leagues = axios.get(`${database}/leagues`)
    const previousTournaments = axios.get(`${database}/tournaments`)

    Promise.all([leagues, players, previousTournaments]).then((values) => {
      const data = values.map((response) => response.data)
      setTournamentData(data)
    })
  }

  useEffect(() => {
    getTournamentData()
  }, [])

  if (tournamentData) {
    const previousTournaments = tournamentData[2]
    console.log(previousTournaments)

    return (
      <>
        <FormatsContainer database={database} />

        <PreviousTournamentsContainer
          database={database}
          tournaments={previousTournaments}
        />
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
