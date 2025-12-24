import { apiClient } from 'api/axiosConfig'
import PlayoffMatch from '../PlayoffMatch'
import { StyledPlayinRound } from './styled'
import Swal from 'sweetalert2'
import { api } from 'api'
import { useLogin } from 'context/LoginContext'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate, useParams } from 'react-router-dom'

const PlayinRound = ({ matches, round, getData }) => {
  const { tournament } = useParams()

  const MySwal = withReactContent(Swal)

  const navigate = useNavigate()

  const login = useLogin()
  const { setLoginStatus } = login

  const checkForNewPlayinMatches = (round) => {
    apiClient
      .post(`${api}/tournaments/${tournament}/playin/update`, {
        round,
      })
      .then(({ data }) =>
        MySwal.fire({
          background: `rgba(28, 25, 25, 0.95)`,
          color: `#fff`,
          icon: 'success',
          iconColor: '#18890e',
          toast: true,
          title: `¡Éxito!`,
          position: 'top-end',
          showConfirmButton: false,
          text: `Se han generado nuevos partidos (${data.length})`,
          timer: 2000,
          timerProgressBar: true,
          customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
          didOpen: (toast) => {
            // Vuelvo a traer la data de los partidos del playin, para mostrar los partidos actualizados //
            getData()
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
        }),
      )
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
            auth === false &&
              navigate(
                {
                  pathname: `/users/login`,
                },
                {
                  state: { url: location.pathname },
                },
              )
          },
        })
      })
  }

  return (
    <StyledPlayinRound>
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
          onClick={() => checkForNewPlayinMatches(round)}
        >
          Actualizar partidos
        </button>
      )}
    </StyledPlayinRound>
  )
}

export default PlayinRound
