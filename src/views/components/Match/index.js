import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import {
  InputContainer,
  MatchContainer,
  MatchDate,
  MatchInfo,
  MatchScore,
  MatchView,
  PlayerInput,
  PlayedMatchesCount,
  ScoreInput,
  StyledMatch,
  TeamLogo,
  TeamTextarea,
  VersusSpan,
} from './styled'
import Swal from 'sweetalert2'
import { apiClient } from 'api/axiosConfig'
import { useLogin } from 'context/LoginContext'
import { useState } from 'react'
import withReactContent from 'sweetalert2-react-content'
import { api, database } from 'api'
import { format, parseISO } from 'date-fns'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

const Match = ({ match, getFixtureData, teamStats }) => {
  const MySwal = withReactContent(Swal)

  const [searchParams, setSearchParams] = useSearchParams()

  const navigate = useNavigate()

  const login = useLogin()
  const { setLoginStatus } = login

  const { tournament } = useParams()

  const {
    playerP1,
    playerP2,
    teamP1,
    teamP2,
    scoreP1,
    scoreP2,
    played,
    _id,
    updatedAt,
    createdAt,
  } = match
  const [matchScore, setMatchScore] = useState({
    scoreP1: scoreP1,
    scoreP2: scoreP2,
  })

  const onHandleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setMatchScore((values) => ({ ...values, [name]: value }))
  }

  const handleMatchSubmit = async (event) => {
    event.preventDefault()
    const { scoreP1, scoreP2 } = matchScore
    if (
      scoreP1 == null ||
      scoreP1 === '' ||
      scoreP2 == null ||
      scoreP2 === ''
    ) {
      MySwal.fire({
        background: `rgba(28, 25, 25, 0.95)`,
        color: `#fff`,
        icon: 'error',
        iconColor: 'var(--red-700)',
        text: `Resultado incompleto, intente nuevamente`,
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
      })
      return
    }

    const data = {
      playerP1,
      playerP2,
      teamP1,
      teamP2,
      scoreP1,
      scoreP2,
    }

    apiClient
      .put(`${api}/tournaments/${tournament}/matches/update-game/${_id}`, data)
      .then(({ data }) => {
        // ¿Debería hacer algo con data? //
        MySwal.fire({
          background: `rgba(28, 25, 25, 0.95)`,
          color: `#fff`,
          icon: 'success',
          iconColor: 'var(--green-900)',
          toast: true,
          title: `Partido cargado con éxito`,
          position: 'top-end',
          showConfirmButton: false,
          text: 'Aguarde unos instantes...',
          timer: 2000,
          timerProgressBar: true,
          customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
          didOpen: (toast) => {
            // Vuelvo a traer los partidos del fixture, para mostrar los partidos actualizados sin recargar la página //
            getFixtureData()
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
          iconColor: 'var(--red-700)',
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

  const handleMatchRemoval = async () => {
    if (scoreP1 == null || scoreP2 == null) {
      MySwal.fire({
        background: `rgba(28, 25, 25, 0.95)`,
        color: `#fff`,
        icon: 'error',
        iconColor: 'var(--red-700)',
        title: '¡Error!',
        text: `No puede borrar partidos que no tengan el resultado cargado`,
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
      })
      return
    }

    Swal.fire({
      title: 'Eliminar',
      html: `¿Está seguro que desea eliminar este partido?`,
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: 'var(--red-700)',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Volver',
    }).then((result) => {
      if (result.isConfirmed) {
        apiClient
          .put(
            `${api}/tournaments/${tournament}/matches/delete-game/${_id}`,
            {},
          )
          .then(({ data }) => {
            console.log(data)
            MySwal.fire({
              background: `rgba(28, 25, 25, 0.95)`,
              color: `#fff`,
              icon: 'success',
              iconColor: 'var(--green-900)',
              toast: true,
              title: `Partido eliminado con éxito`,
              position: 'top-end',
              showConfirmButton: false,
              text: 'Aguarde unos instantes...',
              timer: 2000,
              timerProgressBar: true,
              customClass: { timerProgressBar: 'toast-progress-dark' },
              didOpen: (toast) => {
                getFixtureData()
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
              iconColor: 'var(--red-700)',
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
    })
  }

  const onHandleTeamChange = (id) => {
    const group = searchParams.get('group')
    if (!group) setSearchParams({ team: id })
    else setSearchParams({ team: id, group })
  }

  const getPlayedMatches = (teamId) => {
    if (!teamStats) return null
    const stats = teamStats.find((stat) => stat.teamId === teamId)
    return stats ? `${stats.playedMatches}/${stats.totalMatches}` : null
  }

  return (
    <StyledMatch
      onSubmit={(e) => {
        handleMatchSubmit(e)
      }}
      style={{
        outline: played
          ? 'var(--green-900) 3px solid'
          : 'var(--red-700) 3px solid',
      }}
    >
      <MatchView>
        <MatchInfo>
          {getPlayedMatches(teamP1.id) !== null && (
            <PlayedMatchesCount>
              {getPlayedMatches(teamP1.id)}
            </PlayedMatchesCount>
          )}
          <TeamTextarea name="teamP1" wrap="soft" value={teamP1.name} readOnly>
            {teamP1.name}
          </TeamTextarea>

          <TeamLogo
            src={`${database}/logos/${teamP1.id}`}
            alt={match.teamP1}
            onClick={() => onHandleTeamChange(teamP1.id)}
          />
          <PlayerInput name="playerP1" value={playerP1.name} readOnly />
        </MatchInfo>
        <MatchScore>
          <MatchContainer>
            <ScoreInput
              name="scoreP1"
              value={matchScore.scoreP1 ?? ''}
              onChange={onHandleChange}
            />
            <VersusSpan>vs</VersusSpan>
            <ScoreInput
              name="scoreP2"
              value={matchScore.scoreP2 ?? ''}
              onChange={onHandleChange}
            />
          </MatchContainer>
          <InputContainer>
            <IconButton type="submit" aria-label="edit" color="success">
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleMatchRemoval()}
              aria-label="delete"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </InputContainer>
        </MatchScore>
        <MatchInfo>
          {getPlayedMatches(teamP2.id) !== null && (
            <PlayedMatchesCount>
              {getPlayedMatches(teamP2.id)}
            </PlayedMatchesCount>
          )}
          <TeamTextarea name="teamP2" wrap="soft" value={teamP2.name} readOnly>
            {teamP2.name}
          </TeamTextarea>
          <TeamLogo
            src={`${database}/logos/${teamP2.id}`}
            alt={teamP2.name}
            onClick={() => onHandleTeamChange(teamP2.id)}
          />
          <PlayerInput name="playerP2" value={playerP2.name} readOnly />
        </MatchInfo>
      </MatchView>
      {updatedAt && updatedAt !== createdAt ? (
        <MatchDate>
          Actualizado el:{' '}
          {updatedAt && format(parseISO(updatedAt), 'dd/MM/yyyy hh:mm:ss a')}{' '}
        </MatchDate>
      ) : (
        <MatchDate>El partido aún no se ha jugado</MatchDate>
      )}
    </StyledMatch>
  )
}

export default Match
