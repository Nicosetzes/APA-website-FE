import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  createSearchParams,
  useParams,
} from 'react-router-dom'
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
    navigate(
      {
        pathname: `/tournaments/${id}/matches`,
        search: `?${createSearchParams(
          isNaN(Number(params)) ? playerParams(params) : teamParams(params),
        )}`,
      },
      // { state: { hola: 'hola' } }, // Send information from origin to destination //
    )
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
    const { name, sortedStandings } = tournamentsData[0] // Index 0 because of the order in which I invoked the promises call in Promise.all //
    const playerStats = tournamentsData[1]

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            margin: '1rem 1rem 0 auto',
            textAlign: 'center',
          }}
        >
          {name}
        </div>
        <div style={{ display: 'flex' }}>
          <Link
            to={`/tournaments/${tournament}/matches`}
            style={{
              color: '#004a79',
              fontSize: '1.5rem',
              margin: '1rem 1rem 1rem auto',
            }}
          >
            Ir a Fixture
          </Link>
        </div>
        <TableContainer component={Paper}>
          <StandingsTable
            tournament={tournament}
            standings={sortedStandings}
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
