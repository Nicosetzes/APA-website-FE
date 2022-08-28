import { useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useTournament } from './../../context/TournamentContext'
import FixtureContainer from './components/FixtureContainer'
import { api } from './../../api'
import axios from 'axios'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'

const FixtureId = () => {
  // const api = 'http://localhost:5000/api'

  const { id } = useParams()

  const navigate = useNavigate()

  let [searchParams, setSearchParams] = useSearchParams()

  let team = searchParams.get('team')
  let player = searchParams.get('player')

  const tournament = useTournament()

  useEffect(() => {
    const fetchData = async () => {
      console.log('Hago el fetch de data')
      if (team) {
        await axios
          .get(`${api}/tournaments/${id}/fixture?team=${team}`, {
            withCredentials: true,
            credentials: 'include',
          })
          .then((res) => {
            tournament.updateTournament(res.data)
          })
          .catch((err) => {
            console.log(err)
            navigate('/login') // TODO: Check why sometimes the code from the previous page persists on the new one //
          })
      }
      if (player) {
        await axios
          .get(`${api}/tournaments/${id}/fixture?player=${player}`, {
            withCredentials: true,
            credentials: 'include',
          })
          .then((res) => {
            tournament.updateTournament(res.data)
          })
          .catch((err) => {
            console.log(err)
            navigate('/login')
          })
      }
      if (!team && !player) {
        await axios
          .get(`${api}/tournaments/${id}/fixture`, {
            withCredentials: true,
            credentials: 'include',
          })
          .then((res) => {
            tournament.updateTournament(res.data)
          })
          .catch((err) => {
            console.log(err)
            navigate('/login')
          })
      }
    }
    fetchData()
  }, [team, player])

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {tournament.tournament && (
        <FixtureContainer
          tournament={tournament.tournament}
          handleSubmit={handleSubmit}
        />
      )}
    </motion.div>
  )
}

export default FixtureId
