import * as React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, createSearchParams, useParams } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import PlayerStatsTable from './../../components/PlayerStatsTable'
import { api } from './../../api'
import { Oval } from 'react-loader-spinner'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import StandingsTable from './components/StandingsTable'

const Standings = () => {
  const [tournamentsData, setTournamentsData] = useState('')

  const { tournament } = useParams()

  // const api = 'http://localhost:5000/api'

  const navigate = useNavigate()
  const playerParams = (param) => {
    return { player: param }
  }
  const teamParams = (param) => {
    return { team: param }
  }

  const goToSpecificFixture = (id, params) => {
    if (isNaN(Number(params))) {
      // El query es de player;
      navigate({
        pathname: `/tournaments/${id}/fixture`,
        search: `?${createSearchParams(playerParams(params))}`,
      })
    } else {
      // El query es de team (numérico, es el id);
      navigate({
        pathname: `/tournaments/${id}/fixture`,
        search: `?${createSearchParams(teamParams(params))}`,
      })
    }
  }

  const getTournamentsData = () => {
    const standings = axios.get(
      `${api}/tournaments/${tournament}/standings/table`,
    )
    const playerInfoFromTournament = axios.get(
      `${api}/tournaments/${tournament}/standings/player-info`,
    )

    Promise.all([standings, playerInfoFromTournament]).then((values) => {
      const data = values.map((response) => response.data)
      setTournamentsData(data)
    })
  }

  useEffect(() => {
    getTournamentsData()
  }, [])

  console.log(tournamentsData)

  if (tournamentsData) {
    const { name, tournamentId, sortedStandings } = tournamentsData[0] // Index 0 because of the order in which I invoked the promises call in Promise.all //
    const playerStats = tournamentsData[1]

    console.log(playerStats)

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <TableContainer component={Paper}>
          <div className="title">{name}</div>
          <StandingsTable
            tournament={sortedStandings}
            onHandle={goToSpecificFixture}
          />
          <PlayerStatsTable stats={playerStats} />
        </TableContainer>
      </motion.div>
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

export default Standings
