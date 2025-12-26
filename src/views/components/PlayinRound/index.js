import Swal from 'sweetalert2'
import { api } from 'api'
import { apiClient } from 'api/axiosConfig'
import { useLogin } from 'context/LoginContext'
import withReactContent from 'sweetalert2-react-content'
import { PlayinRoundContainer, RoundMatches, RoundName } from './styled'
import { PlayoffMatch, PrimaryLink } from 'views/components'
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

  let firstRoundMatchesCount = 0

  if (round === 1) {
    firstRoundMatchesCount = matches.length
  }

  console.log(firstRoundMatchesCount)

  return (
    <PlayinRoundContainer
      firstRoundMatchesCount={round === 1 ? firstRoundMatchesCount : null}
    >
      <RoundName>Ronda {round}</RoundName>
      <RoundMatches spread={round !== 1}>
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
      </RoundMatches>
      <PrimaryLink
        asButton
        text="Actualizar partidos"
        disabled={round === 1}
        onClick={() => checkForNewPlayinMatches(round)}
      />
    </PlayinRoundContainer>
  )
}

export default PlayinRound
