import PlayoffMatch from '../PlayoffMatch'
import { useParams } from 'react-router-dom'
import { StyledPlayinRound } from './styled'
import { api } from '../../api'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'

const PlayinRound = ({ matches, round }) => {
  const { tournament } = useParams()

  const MySwal = withReactContent(Swal)

  const checkForNewPlayinMatches = (round) => {
    axios
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
          title: `Se han generado nuevos partidos (${data.length})`,
          position: 'top-end',
          showConfirmButton: false,
          text: 'Aguarde unos instantes...',
          timer: 1500,
          timerProgressBar: true,
          customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
          didClose: () => {
            window.location.reload(true) // TODO: Cambiar por algo que sea más React-style //
          },
        }),
      )
      .catch(({ response }) => {
        const { data } = response
        MySwal.fire({
          background: `rgba(28, 25, 25, 0.95)`,
          color: `#fff`,
          icon: 'info',
          iconColor: '#0a15d1',
          text: data.message,
          title: '¡Atención!',
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
  }

  console.log(matches)
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
              outcome,
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
                outcome={outcome}
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
