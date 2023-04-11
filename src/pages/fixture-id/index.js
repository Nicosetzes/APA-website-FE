import { useState, useEffect } from 'react'
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { useFixture } from '../../context/FixtureContext'
import FixtureContainer from './components/FixtureContainer'
import { api, database } from './../../api'
import axios from 'axios'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { Oval } from 'react-loader-spinner'

const FixtureId = () => {
  const location = useLocation()

  console.log(location.state)

  const { tournament } = useParams()

  // const navigate = useNavigate()

  const fixture = useFixture()

  const [searchParams] = useSearchParams()
  // console.log(searchParams.get('player')) // ▶ URLSearchParams {}
  const teamQuery = searchParams.get('team') // ▶ URLSearchParams {}

  // const [players, setPlayers] = useState()

  // console.log(players)

  const getFixtureData = () => {
    const playersFromTournament = axios.get(
      `${api}/tournaments/${tournament}/players`,
      {
        withCredentials: true,
        credentials: 'include',
      },
    )

    const allMatches = axios.get(`${api}/tournaments/${tournament}/matches`, {
      withCredentials: true,
      credentials: 'include',
    })

    Promise.all([playersFromTournament, allMatches]).then((values) => {
      const data = values.map((response) => response.data)
      console.log(data)
      fixture.updatePlayersFromTournament(data[0])
      console.log(data[0])
      console.log(data[1])
      fixture.updateFixture(data[1])
      fixture.updateOriginalFixture(data[1])
    })
  }

  useEffect(() => {
    getFixtureData()
  }, [])

  const { selectedTeam } = fixture

  const [switchState, setSwitchState] = useState({})

  const handleSwitchChange = (event) => {
    setSwitchState({
      ...switchState,
      [event.target.name]: event.target.checked,
    })
  }

  useEffect(() => {
    if (fixture.fixture) {
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

      if (!activeSwitches.length && !selectedTeam) {
        console.log('Jugadores: no / equipo: no')
        fixture.updateFixture(fixture.originalFixture)
        console.log(fixture.fixture)
      }

      if (!activeSwitches.length && selectedTeam) {
        console.log('Jugadores: no / equipo: sí')
        const matches = fixture.originalFixture
        const filteredFixture = matches.filter(
          ({ teamP1, teamP2 }) =>
            teamP1.id == (selectedTeam || teamQuery) ||
            teamP2.id == (selectedTeam || teamQuery),
        )
        console.log(filteredFixture)
        fixture.updateFixture(filteredFixture)
        console.log(filteredFixture.length)
      }

      if (activeSwitches.length === 1 && !selectedTeam) {
        console.log('Jugadores: 1 / equipo: no')
        const [{ player }] = activeSwitches
        const matches = fixture.originalFixture
        console.log(player)
        console.log(matches[0].playerP2.id)
        const filteredFixture = matches.filter(
          ({ playerP1, playerP2 }) =>
            playerP1.id == player || playerP2.id == player,
        )
        fixture.updateFixture(filteredFixture)
        console.log(filteredFixture.length)
      }

      if (activeSwitches.length === 1 && selectedTeam) {
        console.log('Jugadores: 1 / equipo: sí')
        const [{ player }] = activeSwitches
        const matches = fixture.originalFixture
        const filteredFixture = matches.filter(
          ({ playerP1, playerP2, teamP1, teamP2 }) =>
            (teamP1.id == selectedTeam || teamP2.id == selectedTeam) &&
            (playerP1.id === player || playerP2.id === player),
        )
        fixture.updateFixture(filteredFixture)
        console.log(filteredFixture.length)
      }

      if (activeSwitches.length === 2 && !selectedTeam) {
        console.log('Jugadores: 2 / equipo: no')
        const [switchP1, switchP2] = activeSwitches
        const matches = fixture.originalFixture
        const filteredFixture = matches.filter(
          ({ playerP1, playerP2 }) =>
            (playerP1.id === switchP1.player &&
              playerP2.id === switchP2.player) ||
            (playerP1.id === switchP2.player &&
              playerP2.id === switchP1.player),
        )
        fixture.updateFixture(filteredFixture)
        console.log(filteredFixture.length)
      }

      if (activeSwitches.length === 2 && selectedTeam) {
        console.log('Jugadores: 2 / equipo: sí')
        const [switchP1, switchP2] = activeSwitches
        const matches = fixture.originalFixture
        const filteredFixture = matches.filter(
          ({ playerP1, playerP2, teamP1, teamP2 }) =>
            (teamP1.id == selectedTeam || teamP2.id == selectedTeam) &&
            ((playerP1.id === switchP1.player &&
              playerP2.id === switchP2.player) ||
              (playerP1.id === switchP2.player &&
                playerP2.id === switchP1.player)),
        )
        fixture.updateFixture(filteredFixture)
        console.log(filteredFixture.length)
      }

      if (activeSwitches.length === 3 && !selectedTeam) {
        console.log('Jugadores: 3 / equipo: no')
        const [switchP1, switchP2, switchP3] = activeSwitches
        const matches = fixture.originalFixture
        const filteredFixture = matches.filter(
          ({ playerP1, playerP2 }) =>
            (playerP1.id === switchP1.player &&
              playerP2.id === switchP2.player) ||
            (playerP1.id === switchP2.player &&
              playerP2.id === switchP1.player) ||
            (playerP1.id === switchP1.player &&
              playerP2.id === switchP3.player) ||
            (playerP1.id === switchP3.player &&
              playerP2.id === switchP1.player) ||
            (playerP1.id === switchP2.player &&
              playerP2.id === switchP3.player) ||
            (playerP1.id === switchP3.player &&
              playerP2.id === switchP2.player),
        )
        fixture.updateFixture(filteredFixture)
        console.log(filteredFixture.length)
      }

      if (activeSwitches.length === 3 && selectedTeam) {
        console.log('Jugadores: 3 / equipo: sí')
        const [switchP1, switchP2, switchP3] = activeSwitches
        const matches = fixture.originalFixture
        const filteredFixture = matches.filter(
          ({ playerP1, playerP2, teamP1, teamP2 }) =>
            (teamP1.id == selectedTeam || teamP2.id == selectedTeam) &&
            ((playerP1.id === switchP1.player &&
              playerP2.id === switchP2.player) ||
              (playerP1.id === switchP2.player &&
                playerP2.id === switchP1.player) ||
              (playerP1.id === switchP1.player &&
                playerP2.id === switchP3.player) ||
              (playerP1.id === switchP3.player &&
                playerP2.id === switchP1.player) ||
              (playerP1.id === switchP2.player &&
                playerP2.id === switchP3.player) ||
              (playerP1.id === switchP3.player &&
                playerP2.id === switchP2.player)),
        )
        fixture.updateFixture(filteredFixture)
        console.log(filteredFixture.length)
      }
    }
  }, [switchState, selectedTeam])

  const resetTeamFilter = () => {
    fixture.updateSelectedTeam() // Elimino el equipo seleccionado (si hay) //
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    let scoreP1FromInput = event.target[2].value
    let scoreP2FromInput = event.target[3].value
    if (!scoreP1FromInput.length || !scoreP2FromInput.length) {
      Swal.fire({
        title: 'Error!',
        html: `Uno de los resultados no fue cargado. <br>
						Intente nuevamente`,
        color: '#000',
        background: 'rgb(240 240 245)',
        icon: 'error',
        confirmButtonText: 'Volver',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      })
      return
    }

    const scoreP1 = Number(scoreP1FromInput)
    const scoreP2 = Number(scoreP2FromInput)
    const playerP1 = event.target.getAttribute('data-player1')
    const playerP2 = event.target.getAttribute('data-player2')
    const teamP1 = event.target.getAttribute('data-team1')
    const teamP2 = event.target.getAttribute('data-team2')
    const matchId = event.target.getAttribute('data-id')

    const data = {
      playerP1,
      playerP2,
      scoreP1,
      scoreP2,
      teamP1,
      teamP2,
      matchId,
    }

    if (!matchId) {
      // It's a POST request //
      Swal.fire({
        title: 'Partido cargado con éxito',
        html: `Aguarde unos instantes...`,
        color: '#000',
        background: 'rgb(240 240 245)',
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      })
    }

    if (matchId) {
      // It's a PUT request //
      Swal.fire({
        title: 'Partido editado con éxito',
        html: `Aguarde unos instantes...`,
        color: '#000',
        background: 'rgb(240 240 245)',
        icon: 'warning',
        timer: 3000,
        timerProgressBar: true,
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      })
      axios
        .put(`${api}/tournaments/${tournament}/update-game/${matchId}`, data)
        .then((response) => {
          // let {isUpdated} = response.data; // Podría usarlo para alertar un error al modificar
          let { updatedTournament } = response.data
          fixture.updateFixture(updatedTournament)
        })
    }
  }

  if (fixture.fixture) {
    const { playersFromTournament } = fixture
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div style={{ display: 'flex' }}>
          <Link
            to={`/tournaments/${tournament}/standings`}
            style={{
              color: '#004a79',
              fontSize: '1.5rem',
              margin: '1rem 1rem 0 auto',
            }}
          >
            Clasificación
          </Link>
        </div>

        <FormGroup sx={{ alignItems: 'center' }}>
          <div style={{ margin: '1.5rem' }}>Filtrar partidos</div>
          <div>
            {playersFromTournament.map(({ name, id }) => (
              <FormControlLabel
                key={id}
                control={
                  <Switch
                    size="small"
                    color="warning"
                    checked={switchState.name}
                    onChange={handleSwitchChange}
                    name={id}
                  />
                }
                label={name}
              />
            ))}
          </div>
          <div>
            {selectedTeam && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '1rem auto 0 auto',
                }}
              >
                Equipo seleccionado:{' '}
                <img
                  src={`${database}/logos/${selectedTeam}`}
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

        {fixture.fixture && (
          <FixtureContainer
            matches={fixture.fixture}
            handleSubmit={handleSubmit}
          />
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
