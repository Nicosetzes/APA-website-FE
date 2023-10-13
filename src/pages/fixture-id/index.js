import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
  useNavigate,
} from 'react-router-dom'
// import { useFixture } from '../../context/FixtureContext'
import FixtureContainer from './../../components/FixtureContainer'
import { api, database } from './../../api'
import axios from 'axios'
import { motion } from 'framer-motion'
import BreadCrumbsMUI from './../../components/BreadCrumbsMUI'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Pagination from '@mui/material/Pagination'
import Switch from '@mui/material/Switch'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Oval } from 'react-loader-spinner'

const FixtureId = () => {
  // const isL = useMediaQuery({ query: '(min-width: 992px)' })
  // const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 600px)' })
  const isXS = useMediaQuery({ query: '(min-width: 375px)' })

  const MySwal = withReactContent(Swal)

  const { tournament } = useParams()

  const [searchParams, setSearchParams] = useSearchParams()

  const location = useLocation()

  const initialPlayer = location?.state?.player

  const [switchState, setSwitchState] = useState(
    initialPlayer ? [initialPlayer] : [],
  )

  const handleSwitchChange = (event) => {
    const team = searchParams.get('team')
    const group = searchParams.get('group')
    // I set current page to 0 //
    if (!team && !group) setSearchParams({ page: 0 })
    else if (team && !group) setSearchParams({ page: 0, team })
    else if (!team && group) setSearchParams({ page: 0, group })
    else setSearchParams({ page: 0, team, group })

    event.target.checked
      ? setSwitchState([...switchState, event.target.name])
      : setSwitchState((currentState) =>
          currentState.filter((id) => id !== event.target.name),
        )
  }

  const [tournamentData, setTournamentData] = useState()

  const getTournamentData = () => {
    console.log('Traigo la data del torneo')
    axios
      .get(`${api}/tournaments/${tournament}`)
      .then(({ data }) => setTournamentData(data))
  }

  useEffect(() => {
    getTournamentData()
  }, [])

  const [fixtureData, setFixtureData] = useState()

  const getFixtureData = () => {
    console.log('Traigo el fixture del torneo')

    const page = searchParams.get('page')
    const team = searchParams.get('team')
    const group = searchParams.get('group')

    let allMatches

    if (!page && !team && !group)
      allMatches = axios.get(`${api}/tournaments/${tournament}/fixture`, {
        params: {
          players: `${switchState.length ? JSON.stringify(switchState) : ``}`,
        },
      })
    else if (page && !team && !group)
      allMatches = axios.get(
        `${api}/tournaments/${tournament}/fixture?page=${page}`,
        {
          params: {
            players: `${switchState.length ? JSON.stringify(switchState) : ``}`,
          },
        },
      )
    else if (!page && team && !group)
      allMatches = axios.get(
        `${api}/tournaments/${tournament}/fixture?team=${team}`,
        {
          params: {
            players: `${switchState.length ? JSON.stringify(switchState) : ``}`,
          },
        },
      )
    else if (!page && !team && group)
      allMatches = axios.get(
        `${api}/tournaments/${tournament}/fixture?group=${group}`,
        {
          params: {
            players: `${switchState.length ? JSON.stringify(switchState) : ``}`,
          },
        },
      )
    else if (page && team && !group)
      allMatches = axios.get(
        `${api}/tournaments/${tournament}/fixture?page=${page}&team=${team}`,
        {
          params: {
            players: `${switchState.length ? JSON.stringify(switchState) : ``}`,
          },
        },
      )
    else if (page && !team && group) {
      allMatches = axios.get(
        `${api}/tournaments/${tournament}/fixture?page=${page}&group=${group}`,
        {
          params: {
            players: `${switchState.length ? JSON.stringify(switchState) : ``}`,
          },
        },
      )
    } else if (!page && team && group) {
      allMatches = axios.get(
        `${api}/tournaments/${tournament}/fixture?team=${team}&group=${group}`,
        {
          params: {
            players: `${switchState.length ? JSON.stringify(switchState) : ``}`,
          },
        },
      )
    } else {
      allMatches = axios.get(
        `${api}/tournaments/${tournament}/fixture?page=${page}&team=${team}&group=${group}`,
        {
          params: {
            players: `${switchState.length ? JSON.stringify(switchState) : ``}`,
          },
        },
      )
    }

    allMatches.then(({ data }) => {
      setFixtureData(data)
    })
  }

  useEffect(() => {
    getFixtureData()
  }, [searchParams, switchState])

  const handlePageChange = (event, value) => {
    // Second param (value) is the page that's been clicked! //
    const team = searchParams.get('team')
    const group = searchParams.get('group')
    if (!team && !group) setSearchParams({ page: Number(value) - 1 })
    else if (team && !group) setSearchParams({ page: Number(value) - 1, team })
    else if (!team && group) setSearchParams({ page: Number(value) - 1, group })
    else setSearchParams({ page: Number(value) - 1, team, group })
  }

  const onHandleGroupChange = (group) => {
    const page = searchParams.get('page')
    const team = searchParams.get('team')

    if (!page && !team) setSearchParams({ group })
    else if (!page && team) setSearchParams({ team: team, group })
    else if (page && !team) setSearchParams({ page: page, group })
    else setSearchParams({ page: page, team: team, group })
  }

  const resetTeamFilter = () => {
    const group = searchParams.get('group')
    group ? setSearchParams({ group: group }) : setSearchParams({})
  }

  const fixtureGeneration = (group = null) => {
    axios
      .post(
        `${api}/tournaments/${tournament}/fixture`,
        {
          group,
        },
        {
          withCredentials: true,
          credentials: 'include',
        } /* Importante, sirve para incluir la cookie alojada en el navegador */,
      )
      .then(({ data }) => {
        console.log(data)
        MySwal.fire({
          background: `rgba(28, 25, 25, 0.95)`,
          color: `#fff`,
          icon: 'success',
          iconColor: '#18890e',
          toast: true,
          title: `Fixture ${
            group ? `para la zona ${group}` : `del torneo`
          } creado con éxito`,
          position: 'top-end',
          showConfirmButton: false,
          text: 'Aguarde unos instantes...',
          timer: 1500,
          timerProgressBar: true,
          customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
          didOpen: (toast) => {
            // Traigo nuevamente la data, para mostrarla sin necesidad de refrescar la página //
            getFixtureData()
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  if (tournamentData && fixtureData) {
    console.log(tournamentData)
    console.log(fixtureData)
    const { name, players, groups } = tournamentData
    const {
      matches,
      amountOfNotPlayedMatches,
      amountOfTotalMatches,
      totalPages,
      currentPage,
    } = fixtureData

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
          {groups.length ? (
            <div
              style={{
                alignItems: 'center',
                border: 'black 3px solid',
                display: 'flex',
                fontSize: '1.5rem',
                fontWeight: 700,
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
              flexDirection: isSm ? 'column' : 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              margin: '0 1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: isSm ? 'row' : 'column',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                margin: isSm ? '1rem 1.5rem' : '0 1.5rem',
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  margin: isSm ? '0' : '0 auto',
                  padding: '0.75rem',
                }}
              >
                Jugadores
              </div>
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
            <div
              style={{
                border: '#ffdf21 2px solid',
                color: '#004a79',
                fontSize: '1.125rem',
                fontWeight: 700,
                margin: '1rem auto',
                padding: '0.75em 1em',
                textAlign: 'center',
              }}
            >
              {amountOfNotPlayedMatches} partidos restantes de{' '}
              {amountOfTotalMatches} en TOTAL
            </div>
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

        {matches.length ? (
          <>
            <FixtureContainer
              matches={matches}
              getFixtureData={getFixtureData}
            />
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
        ) : searchParams.get('team') ? (
          <div
            style={{
              display: 'flex',
              fontSize: '1.125rem',
              fontWeight: 700,
              justifyContent: 'center',
              margin: '1.5rem 0',
            }}
          >
            No existen partidos con los filtros seleccionados
          </div>
        ) : (
          <div
            style={{
              alignItems: 'center',
              border: '#004a79 3px solid',
              display: 'flex',
              flexDirection: 'column',
              margin: '2rem auto',
              padding: '1.5rem 1.75rem',
              width: 'fit-content',
            }}
          >
            {groups.length ? (
              <>
                <div style={{ fontSize: '1.25rem' }}>
                  La zona{' '}
                  <span style={{ color: '#004a79', fontWeight: '700' }}>
                    {searchParams.get('group') || 'A'}
                  </span>{' '}
                  aun no cuenta con partidos
                </div>
                <div style={{ margin: '0.5rem auto' }}>¿Desea generarlos?</div>
                <button
                  className="button-main"
                  onClick={() =>
                    fixtureGeneration(searchParams.get('group') || 'A')
                  }
                >
                  Generar partidos
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: '1.25rem' }}>
                  El torneo{' '}
                  <span style={{ color: '#004a79', fontWeight: '700' }}>
                    {name}
                  </span>{' '}
                  aun no cuenta con partidos
                </div>
                <div style={{ margin: '0.5rem auto' }}>¿Desea generarlos?</div>
                <button
                  className="button-main"
                  onClick={() => fixtureGeneration()}
                >
                  Generar partidos
                </button>
              </>
            )}
          </div>
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
