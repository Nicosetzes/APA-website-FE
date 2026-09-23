import Swal from 'sweetalert2'
import { api } from 'api'
import { useParams } from 'react-router-dom'
import withReactContent from 'sweetalert2-react-content'
import { PlayoffMatch, PrimaryLink } from 'views/components'
import { PlayoffRoundContainer, RoundMatches, RoundName } from './styled'
import { apiClient, getApiErrorMessage } from 'api/axiosConfig'

const PlayoffRound = ({ matches, round, getData, isThisTheFinal }) => {
  const { tournament } = useParams()
  const MySwal = withReactContent(Swal)

  const checkForNewPlayoffMatches = (roundNumber) => {
    apiClient
      .post(`${api}/tournaments/${tournament}/playoff/update`, {
        round: roundNumber,
      })
      .then(({ data }) => {
        const { matches: newMatches, message } = data
        newMatches.length
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
              customClass: { timerProgressBar: 'toast-progress-dark' },
              didOpen: (toast) => {
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
              customClass: { timerProgressBar: 'toast-progress-dark' },
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              },
            })
      })
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

  const getRoundName = (matchesCount) => {
    switch (matchesCount) {
      case 16:
        return '16vos de final'
      case 8:
        return '8vos de final'
      case 4:
        return '4tos de final'
      case 2:
        return 'Semifinal'
      case 1:
        return 'Final'
      default:
        return `Ronda ${round}`
    }
  }

  return (
    <PlayoffRoundContainer
      firstRoundMatchesCount={round === 1 ? firstRoundMatchesCount : null}
    >
      <RoundName>{getRoundName(matches?.length)}</RoundName>
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
                  isThisTheFinal={isThisTheFinal}
                />
              ),
            )
          : null}
      </RoundMatches>
      <PrimaryLink
        asButton
        text="Actualizar partidos"
        disabled={round === 1}
        onClick={() => checkForNewPlayoffMatches(round)}
      />
    </PlayoffRoundContainer>
  )
}

export default PlayoffRound
