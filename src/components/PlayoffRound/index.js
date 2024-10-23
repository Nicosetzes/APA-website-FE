import { useParams, useNavigate } from 'react-router-dom'
import { useLogin } from '../../context/LoginContext'
import PlayoffMatch from '../PlayoffMatch'
import { StyledPlayoffRound } from './styled'
import { api } from '../../api'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'

const PlayoffRound = ({ matches, round, getData }) => {
  const { tournament } = useParams()

  const MySwal = withReactContent(Swal)

  const navigate = useNavigate()

  const login = useLogin()
  const { setLoginStatus } = login

  const checkForNewPlayoffMatches = (round) => {
    axios
      .post(
        `${api}/tournaments/${tournament}/playoff/update`,
        {
          round,
        },
        {
          withCredentials: true,
          credentials: 'include',
        } /* Importante, sirve para incluir la cookie alojada en el navegador */,
      )
      .then(({ data }) => {
        console.log(data)
        const { matches, message } = data
        matches.length
          ? MySwal.fire({
              background: `rgba(28, 25, 25, 0.95)`,
              color: `#fff`,
              icon: 'success',
              iconColor: '#18890e',
              toast: true,
              title: `¡Éxito!`,
              position: 'top-end',
              showConfirmButton: false,
              text: message,
              timer: 2000,
              timerProgressBar: true,
              customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
              didOpen: (toast) => {
                // Vuelvo a traer la data de Playoffs, para mostrar la vista actualizada //
                getData()
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              },
            })
          : MySwal.fire({
              background: `rgba(28, 25, 25, 0.95)`,
              color: `#fff`,
              icon: 'info',
              iconColor: '#0a15d1',
              title: '¡Atención!',
              text: message,
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
              customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              },
            })
      })
      .catch(({ response }) => {
        const { data } = response
        const { auth, message } = data
        MySwal.fire({
          background: `rgba(28, 25, 25, 0.95)`,
          color: `#fff`,
          icon: 'error',
          iconColor: '#b30a0a',
          text: message,
          title: '¡Error!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
          didClose: () => {
            setLoginStatus((loginStatus) => ({
              ...loginStatus,
              status: auth,
            }))
            /* auth ==== false solo cuando el endpoint del BE corra el middleware isAuth() y este falle */
            /* Por lo tanto, redirijo a /users/login */
            auth === false &&
              navigate(
                {
                  pathname: `/users/login`,
                },
                {
                  state: { url: location.pathname },
                } /* Adjunto info de la ruta actual, para luego volver a ella en caso de login exitoso */,
              )
          },
        })
      })
  }

  return (
    <StyledPlayoffRound>
      <div
        style={{
          color: '#fff',
          display: 'flex',
          fontWeight: 700,
          justifyContent: 'center',
        }}
      >
        Ronda {round}
      </div>
      {matches.length
        ? matches.map(
            ({
              _id,
              playerP1,
              teamP1,
              seedP1,
              scoreP1,
              playerP2,
              teamP2,
              seedP2,
              scoreP2,
              played,
              outcome,
              valid,
            }) => (
              <PlayoffMatch
                key={_id}
                id={_id}
                playerP1={playerP1}
                teamP1={teamP1}
                seedP1={seedP1}
                scoreP1={scoreP1}
                playerP2={playerP2}
                teamP2={teamP2}
                seedP2={seedP2}
                scoreP2={scoreP2}
                played={played}
                outcome={outcome}
                getData={getData}
                valid={valid}
              />
            ),
          )
        : null}
      {round != 1 && (
        <button
          className="button-main"
          onClick={() => checkForNewPlayoffMatches(round)}
        >
          Actualizar partidos
        </button>
      )}
    </StyledPlayoffRound>
  )
}

export default PlayoffRound
