import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useTournament } from './../../context/TournamentContext'
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
  const { id } = useParams()

  const navigate = useNavigate()

  const tournament = useTournament()

  useEffect(() => {
    const fetchData = async () => {
      console.log('Hago el fetch de data')
      await axios
        .get(`${api}/tournaments/${id}/fixture`, {
          withCredentials: true,
          credentials: 'include',
        })
        .then(({ data }) => {
          tournament.updateTournament({ ...data })
          tournament.updateOriginalTournament({ ...data })
        })
        .catch((err) => {
          console.log(err)
          navigate('/')
        })
    }
    fetchData()
  }, [])

  const { selectedTeam } = tournament

  const [switchState, setSwitchState] = useState({})

  const handleSwitchChange = (event) => {
    setSwitchState({
      ...switchState,
      [event.target.name]: event.target.checked,
    })
  }

  useEffect(() => {
    if (tournament.tournament) {
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
        tournament.updateTournament({ ...tournament.originalTournament })
        console.log(tournament.tournament.fixture.length)
      }

      if (!activeSwitches.length && selectedTeam) {
        console.log('Jugadores: no / equipo: sí')
        const { fixture } = tournament.originalTournament
        const filteredFixture = fixture.filter(
          (match) =>
            match.teamIdP1 == selectedTeam || match.teamIdP2 == selectedTeam,
        )
        console.log(filteredFixture)
        tournament.updateTournament({
          ...tournament.originalTournament,
          fixture: filteredFixture,
        })
        console.log(filteredFixture.length)
      }

      if (activeSwitches.length === 1 && !selectedTeam) {
        console.log('Jugadores: 1 / equipo: no')
        const [{ player }] = activeSwitches
        const { fixture } = tournament.originalTournament
        const filteredFixture = fixture.filter(
          (match) => match.playerP1 === player || match.playerP2 === player,
        )
        tournament.updateTournament({
          ...tournament.originalTournament,
          fixture: filteredFixture,
        })
        console.log(filteredFixture.length)
      }

      if (activeSwitches.length === 1 && selectedTeam) {
        console.log('Jugadores: 1 / equipo: sí')
        const [{ player }] = activeSwitches
        const { fixture } = tournament.originalTournament
        const filteredFixture = fixture.filter(
          (match) =>
            (match.teamIdP1 == selectedTeam ||
              match.teamIdP2 == selectedTeam) &&
            (match.playerP1 === player || match.playerP2 === player),
        )
        tournament.updateTournament({
          ...tournament.originalTournament,
          fixture: filteredFixture,
        })
        console.log(filteredFixture.length)
      }

      if (activeSwitches.length === 2 && !selectedTeam) {
        console.log('Jugadores: 2 / equipo: no')
        const [switchP1, switchP2] = activeSwitches
        const { fixture } = tournament.originalTournament
        const filteredFixture = fixture.filter(
          (match) =>
            (match.playerP1 === switchP1.player &&
              match.playerP2 === switchP2.player) ||
            (match.playerP1 === switchP2.player &&
              match.playerP2 === switchP1.player),
        )
        tournament.updateTournament({
          ...tournament.originalTournament,
          fixture: filteredFixture,
        })
        console.log(filteredFixture.length)
      }

      if (activeSwitches.length === 2 && selectedTeam) {
        console.log('Jugadores: 2 / equipo: sí')
        const [switchP1, switchP2] = activeSwitches
        const { fixture } = tournament.originalTournament
        const filteredFixture = fixture.filter(
          (match) =>
            (match.teamIdP1 == selectedTeam ||
              match.teamIdP2 == selectedTeam) &&
            ((match.playerP1 === switchP1.player &&
              match.playerP2 === switchP2.player) ||
              (match.playerP1 === switchP2.player &&
                match.playerP2 === switchP1.player)),
        )
        tournament.updateTournament({
          ...tournament.originalTournament,
          fixture: filteredFixture,
        })
        console.log(filteredFixture.length)
      }

      if (activeSwitches.length === 3 && !selectedTeam) {
        console.log('Jugadores: 3 / equipo: no')
        const [switchP1, switchP2, switchP3] = activeSwitches
        const { fixture } = tournament.originalTournament
        const filteredFixture = fixture.filter(
          (match) =>
            (match.playerP1 === switchP1.player &&
              match.playerP2 === switchP2.player) ||
            (match.playerP1 === switchP2.player &&
              match.playerP2 === switchP1.player) ||
            (match.playerP1 === switchP1.player &&
              match.playerP2 === switchP3.player) ||
            (match.playerP1 === switchP3.player &&
              match.playerP2 === switchP1.player) ||
            (match.playerP1 === switchP2.player &&
              match.playerP2 === switchP3.player) ||
            (match.playerP1 === switchP3.player &&
              match.playerP2 === switchP2.player),
        )
        tournament.updateTournament({
          ...tournament.originalTournament,
          fixture: filteredFixture,
        })
        console.log(filteredFixture.length)
      }

      if (activeSwitches.length === 3 && selectedTeam) {
        console.log('Jugadores: 3 / equipo: sí')
        const [switchP1, switchP2, switchP3] = activeSwitches
        const { fixture } = tournament.originalTournament
        const filteredFixture = fixture.filter(
          (match) =>
            (match.teamIdP1 == selectedTeam ||
              match.teamIdP2 == selectedTeam) &&
            ((match.playerP1 === switchP1.player &&
              match.playerP2 === switchP2.player) ||
              (match.playerP1 === switchP2.player &&
                match.playerP2 === switchP1.player) ||
              (match.playerP1 === switchP1.player &&
                match.playerP2 === switchP3.player) ||
              (match.playerP1 === switchP3.player &&
                match.playerP2 === switchP1.player) ||
              (match.playerP1 === switchP2.player &&
                match.playerP2 === switchP3.player) ||
              (match.playerP1 === switchP3.player &&
                match.playerP2 === switchP2.player)),
        )
        tournament.updateTournament({
          ...tournament.originalTournament,
          fixture: filteredFixture,
        })
        console.log(filteredFixture.length)
      }
    }
  }, [switchState, selectedTeam])

  const resetTeamFilter = () => {
    tournament.updateSelectedTeam() // Elimino el equipo seleccionado (si hay) //
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
      axios
        .post(`${api}/tournaments/${id}/upload-game/`, data)
        .then((response) => {
          // let {isUpdated} = response.data; // Podría usarlo para alertar un error al modificar
          let { updatedTournament } = response.data
          tournament.updateTournament(updatedTournament)
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
        .put(`${api}/tournaments/${id}/update-game/${matchId}`, data)
        .then((response) => {
          // let {isUpdated} = response.data; // Podría usarlo para alertar un error al modificar
          let { updatedTournament } = response.data
          tournament.updateTournament(updatedTournament)
        })
    }
  }

  if (tournament.tournament) {
    const { players } = tournament.tournament

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <FormGroup sx={{ alignItems: 'center' }}>
          <div style={{ margin: '1.5rem' }}>Filtrar partidos</div>
          <div>
            {players.map(({ name, id }) => (
              <FormControlLabel
                key={id}
                control={
                  <Switch
                    size="small"
                    color="warning"
                    checked={switchState.name}
                    onChange={handleSwitchChange}
                    name={name}
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

        {tournament.tournament && (
          <FixtureContainer
            tournament={tournament.tournament}
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
