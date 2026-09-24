import Swal from 'sweetalert2'
import { api } from 'api'
import { useParams } from 'react-router-dom'
import withReactContent from 'sweetalert2-react-content'
import { PlayinRoundContainer, RoundMatches, RoundName } from './styled'
import { PlayoffMatch, PrimaryLink } from 'views/components'
import { apiClient, getApiErrorMessage } from 'api/axiosConfig'

const PlayinRound = ({ canMutate, matches, round, getData }) => {
  const { tournament } = useParams()
  const MySwal = withReactContent(Swal)

  const checkForNewPlayinMatches = (roundNumber) => {
    if (!canMutate) return

    apiClient
      .post(`${api}/tournaments/${tournament}/playin/update`, {
        round: roundNumber,
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
          customClass: { timerProgressBar: 'toast-progress-dark' },
          didOpen: (toast) => {
            getData()
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
        }),
      )
      .catch((error) => {
        const message = getApiErrorMessage(
          error,
          'No se pudo conectar con el servidor',
        )
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
          customClass: { timerProgressBar: 'toast-progress-dark' },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
        })
      })
  }

  const firstRoundMatchesCount = round === 1 ? matches.length : 0

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
                  canMutate={canMutate}
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
      {canMutate && (
        <PrimaryLink
          asButton
          text="Actualizar partidos"
          disabled={round === 1}
          onClick={() => checkForNewPlayinMatches(round)}
        />
      )}
    </PlayinRoundContainer>
  )
}

export default PlayinRound
