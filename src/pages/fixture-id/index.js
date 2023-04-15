import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
// import { useFixture } from '../../context/FixtureContext'
import FixtureContainer from './components/FixtureContainer'
import { api, database } from './../../api'
import axios from 'axios'
import { motion } from 'framer-motion'
import BreadCrumbsMUI from './../../components/BreadCrumbsMUI'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Pagination from '@mui/material/Pagination'
import Switch from '@mui/material/Switch'
import { Oval } from 'react-loader-spinner'

const FixtureId = () => {
  // const isL = useMediaQuery({ query: '(min-width: 992px)' })
  // const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  const isXS = useMediaQuery({ query: '(min-width: 375px)' })

  const location = useLocation()

  const initialPlayer = location?.state?.player

  const [switchState, setSwitchState] = useState(
    initialPlayer ? [initialPlayer] : [],
  )

  useEffect(() => {
    const arrayOfKeys = Object.keys(switchState)
    const arrayOfValues = Object.values(switchState)
    let activeSwitches = arrayOfValues
      .map((state, index) => {
        return {
          index,
          state,
          player: arrayOfKeys[index],
        }
      })
      .filter(({ state }) => state)

    console.log(activeSwitches)
  }, [switchState])

  console.log(switchState)

  const handleSwitchChange = (event) => {
    const team = searchParams.get('team')
    team ? setSearchParams({ page: 0, team }) : setSearchParams({ page: 0 })
    // I set current page to 0 //
    event.target.checked
      ? setSwitchState([...switchState, event.target.name])
      : setSwitchState((currentState) =>
          currentState.filter((id) => id !== event.target.name),
        )
  }

  const [searchParams, setSearchParams] = useSearchParams()

  const handlePageChange = (event, value) => {
    // Second param (value) is the page that's been clicked! //
    const team = searchParams.get('team')
    team
      ? setSearchParams({ page: Number(value) - 1, team })
      : setSearchParams({ page: Number(value) - 1 })
    // If I don't do it like this, the team and player params are erased //
  }

  const { tournament } = useParams()

  const [data, setData] = useState()

  const getFixtureData = () => {
    const playersFromTournament = axios.get(
      `${api}/tournaments/${tournament}/players`,
    )

    const page = searchParams.get('page')
    const team = searchParams.get('team')

    let allMatches

    if (page && team)
      allMatches = axios.get(
        `${api}/tournaments/${tournament}/fixture?page=${page}&team=${team}`,
        {
          params: {
            players: `${switchState.length ? JSON.stringify(switchState) : ``}`,
          },
        },
      )
    else if (page && !team) {
      allMatches = axios.get(
        `${api}/tournaments/${tournament}/fixture?page=${page}`,
        {
          params: {
            players: `${switchState.length ? JSON.stringify(switchState) : ``}`,
          },
        },
      )
    } else if (!page && team) {
      allMatches = axios.get(
        `${api}/tournaments/${tournament}/fixture?team=${team}`,
        {
          params: {
            players: `${switchState.length ? JSON.stringify(switchState) : ``}`,
          },
        },
      )
    } else {
      allMatches = axios.get(`${api}/tournaments/${tournament}/fixture`, {
        params: {
          players: `${switchState.length ? JSON.stringify(switchState) : ``}`,
        },
      })
    }

    Promise.all([playersFromTournament, allMatches]).then((values) => {
      const data = values.map((response) => response.data)
      setData(data)
    })
  }

  useEffect(() => {
    console.log('me ejecuto')
    getFixtureData()
  }, [searchParams, switchState])

  // const { selectedTeam } = fixture

  const resetTeamFilter = () => {
    setSearchParams({})
  }

  if (data) {
    console.log(data)
    const players = data[0]
    const { matches } = data[1]
    const matchesFromDB = matches.matches
    const { totalPages, currentPage } = matches
    const tournamentFromDB = data[1].tournament
    const { name } = tournamentFromDB

    const breadCrumbsLinks = [
      { name: 'Home', route: '' },
      { name: 'Torneos', route: 'tournaments' },
      {
        name: `${name}`,
        route: `tournaments/${tournament}`,
      },
      {
        name: 'Fixture',
        route: `tournaments/${tournament}/fixture`,
      },
    ]

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <BreadCrumbsMUI links={breadCrumbsLinks} />
        <div style={{ display: 'flex' }}>
          <Link
            to={`/tournaments/${tournament}/standings`}
            style={{
              color: '#004a79',
              fontSize: '1.5rem',
              margin: '1rem 1rem 0 auto',
            }}
          >
            Ir a Clasificación
          </Link>
        </div>

        <FormGroup sx={{ alignItems: 'center' }}>
          <div style={{ margin: '1.5rem' }}>Filtrar por jugador (máx 2)</div>
          <div
            style={{
              display: 'flex',
              flexDirection: isSm ? 'row' : 'column',
              flexWrap: 'wrap',
              justifyContent: 'center',
              margin: '0 1.5rem',
            }}
          >
            {players.map(({ name, id }) => (
              <FormControlLabel
                key={id}
                control={
                  <Switch
                    disabled={
                      switchState.length === 2 && !switchState.includes(id)
                        ? true
                        : false
                    }
                    size="small"
                    color="warning"
                    checked={switchState.includes(id)}
                    onChange={handleSwitchChange}
                    name={id}
                  />
                }
                label={name}
              />
            ))}
          </div>
          <div>
            {searchParams.get('team') && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '1rem auto 0 auto',
                }}
              >
                Equipo seleccionado:{' '}
                <img
                  src={`${database}/logos/${searchParams.get('team')}`}
                  style={{ width: '25px', margin: '0 0.5rem 0 0.5rem' }}
                />
                <button
                  style={{
                    padding: '0.25rem 0.75rem',
                    border: '#004a79 1px solid',
                    borderRadius: 10,
                  }}
                  onClick={() => resetTeamFilter()}
                >
                  Limpiar
                </button>
              </div>
            )}
          </div>
        </FormGroup>

        {matchesFromDB && (
          <>
            <FixtureContainer matches={matchesFromDB} />
            <Pagination
              count={totalPages}
              page={Number(searchParams.get('page')) + 1}
              name={'page'}
              onChange={handlePageChange}
              variant="outlined"
              color="secondary"
              size={!isXS ? 'small' : 'medium'}
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '0.75rem 0.5rem',
              }}
            />
          </>
        )}
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

export default FixtureId
