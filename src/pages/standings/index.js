import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import PlayerStatsTable from './../../components/PlayerStatsTable'
import BreadCrumbsMUI from './../../components/BreadCrumbsMUI'
import TableContainer from '@mui/material/TableContainer'
import StandingsTable from './components/StandingsTable'
import { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner'
import Paper from '@mui/material/Paper'
import { motion } from 'framer-motion'
import { api } from './../../api'
import * as React from 'react'
import axios from 'axios'

const Standings = () => {
  const [tournamentData, setTournamentData] = useState()

  const [searchParams, setSearchParams] = useSearchParams()

  // const { state } = useLocation()

  const [tournamentGroups, setTournamentGroups] = useState([])

  const { tournament } = useParams()

  const navigate = useNavigate()

  const playerParams = (param) => {
    return { player: param }
  }
  const teamParams = (param) => {
    return { team: param }
  }

  const goToSpecificFixture = (id, params) => {
    if (isNaN(Number(params)))
      // El param es de jugador (id) //
      return navigate(
        {
          pathname: `/tournaments/${id}/fixture`,
        },
        { state: playerParams(params) }, // Send information about player id from origin to destination //
      )
    else
      return navigate({
        pathname: `/tournaments/${id}/fixture`,
        search: `?${createSearchParams(teamParams(params))}`,
      })
  }

  const onHandleGroupChange = (group) => {
    setSearchParams({ group })
  }

  const getTournamentData = () => {
    const group = searchParams.get('group')

    const tournamentInfo = axios.get(`${api}/tournaments/${tournament}`)

    let standings
    let playerInfo

    if (group) {
      // Hay un grupo seleccionado //
      standings = axios.get(
        `${api}/tournaments/${tournament}/standings/table?group=${group}`,
      )
      playerInfo = axios.get(
        `${api}/tournaments/${tournament}/standings/player-info?group=${group}`,
      )
    } else {
      // No hay grupos seleccionadps //
      standings = axios.get(`${api}/tournaments/${tournament}/standings/table`)
      playerInfo = axios.get(
        `${api}/tournaments/${tournament}/standings/player-info`,
      )
    }

    Promise.all([tournamentInfo, standings, playerInfo]).then((values) => {
      const data = values.map((response) => response.data)
      setTournamentData(data)
    })
  }

  useEffect(() => {
    console.log('me ejecuté')
    getTournamentData()
  }, [searchParams])

  console.log(tournamentData)

  if (tournamentData) {
    const { name, format, groups } = tournamentData[0]
    const { activeGroup, standings } = tournamentData[1] // Index 0 because of the order in which I invoked the promises call in Promise.all //
    const playerStats = tournamentData[2]

    const breadCrumbsLinks = [
      { name: 'Home', route: '' },
      { name: 'Torneos', route: 'tournaments' },
      {
        name: `${name}`,
        route: `tournaments/${tournament}`,
      },
      {
        name: 'Clasificación',
        route: `tournaments/${tournament}/standings`,
      },
    ]

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <BreadCrumbsMUI links={breadCrumbsLinks} />
        <div
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            margin: '1rem 1rem 0 auto',
            textAlign: 'center',
          }}
        >
          <div>{name}</div>
          {groups.length ? (
            <div
              style={{
                alignItems: 'center',
                border: 'black 2px solid',
                display: 'flex',
                margin: '0.75rem auto',
                padding: '0.5rem 1rem',
                width: 'fit-content',
              }}
            >
              Grupos:{' '}
              {groups.map((group) => (
                <span
                  key={group}
                  onClick={() => onHandleGroupChange(group)}
                  style={{
                    color:
                      (group == 'A' && !searchParams.get('group')) ||
                      group == searchParams.get('group')
                        ? 'green'
                        : 'red',
                    cursor: 'pointer',
                    fontSize: '1.75rem',
                    margin: '0 0.5rem',
                    textDecoration:
                      (group == 'A' && !searchParams.get('group')) ||
                      group == searchParams.get('group')
                        ? 'underline'
                        : 'none',
                  }}
                >
                  {group}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div style={{ display: 'flex' }}>
          <Link
            to={`/tournaments/${tournament}/fixture`}
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
            format={format}
            standings={standings}
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
