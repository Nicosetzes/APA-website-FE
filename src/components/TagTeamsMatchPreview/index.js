import { useParams, useNavigate } from 'react-router-dom'
import withReactContent from 'sweetalert2-react-content'
import { useLogin } from '../../context/LoginContext'
import { StyledTagTeamsMatchPreview } from './styled'
import IconButton from '@mui/material/IconButton'
import CheckIcon from '@mui/icons-material/Check'
import { useState, useEffect } from 'react'
import { api, database } from './../../api'
import { Oval } from 'react-loader-spinner'
import Swal from 'sweetalert2'
import axios from 'axios'

const TagTeamsMatchPreview = ({ getFixtureData, match }) => {
  const MySwal = withReactContent(Swal)

  const navigate = useNavigate()

  const login = useLogin()
  const { setLoginStatus } = login

  const { tournament } = useParams()

  console.log(match)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Agrego un delay de 3 segundos (suspenso)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // Evito fuga de memoria en el temporizador
    return () => clearTimeout(timer)
  }, [])

  const { playerP1, playerP2, playerP3, playerP4, teamP1, teamP2 } = match

  if (isLoading) {
    // Mostrar el spinner mientras se carga
    return (
      <div style={{ margin: 'auto', width: '100px' }}>
        <Oval
          height="80"
          width="80"
          radius="9"
          color="var(--green-900)"
          ariaLabel="three-dots-loading"
          $wrapperStyle
          $wrapperClass
        />
      </div>
    )
  }

  const handleTagTeamsMatchPreviewSubmit = async (event) => {
    event.preventDefault()

    const data = {
      playerP1,
      playerP2,
      playerP3,
      playerP4,
      teamP1,
      teamP2,
    }

    axios
      .post(
        `${api}/tournaments/${tournament}/matches/create-tag-teams-match/`,
        data,
        {
          withCredentials: true,
          credentials: 'include',
        } /* Importante, sirve para incluir la cookie alojada en el navegador */,
      )
      .then(({ data }) => {
        // ¿Debería hacer algo con data? //
        MySwal.fire({
          background: `rgba(28, 25, 25, 0.95)`,
          color: `#fff`,
          icon: 'success',
          iconColor: '#18890e',
          toast: true,
          title: `Partido generado con éxito`,
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
            // setLoginStatus((loginStatus) => ({
            //   ...loginStatus,
            //   status: auth,
            // }))
            /* auth ==== false solo cuando el endpoint del BE corra el middleware isAuth() y este falle */
            /* Por lo tanto, redirijo a /users/login */
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
                } /* Adjunto info de la ruta actual, para luego volver a ella en caso de login exitoso */,
              )
          },
        })
      })
  }

  return (
    <>
      <StyledTagTeamsMatchPreview
        className="match"
        onSubmit={(e) => {
          handleTagTeamsMatchPreviewSubmit(e)
        }}
      >
        <div className="match-view">
          <div className="match-info">
            <textarea
              name="teamP1"
              wrap="soft"
              className="match-info__team"
              value={teamP1.name || ''}
              readOnly
            >
              {teamP1.name}
            </textarea>

            <img
              src={`${database}/logos/${teamP1.id}`}
              alt={match.teamP1}
              className="match-info__logo"
            />
            <div style={{ display: 'flex' }}>
              <input
                name="playerP1"
                className="match-info__player"
                value={playerP1.name || ''}
                readOnly
              />
              {'+'}
              <input
                name="playerP2"
                className="match-info__player"
                value={playerP2.name || ''}
                readOnly
              />
            </div>
          </div>
          <div className="match-score">
            <div className="input__container">
              <IconButton type="submit" aria-label="check" color="success">
                <CheckIcon />
              </IconButton>
            </div>
          </div>
          <div className="match-info">
            <textarea
              name="teamP2"
              wrap="soft"
              className="match-info__team"
              value={teamP2.name || ''}
              readOnly
            >
              {teamP2.name}
            </textarea>
            <img
              src={`${database}/logos/${teamP2.id}`}
              alt={teamP2.name}
              className="match-info__logo"
            />
            <div style={{ display: 'flex' }}>
              <input
                name="playerP3"
                className="match-info__player"
                value={playerP3.name || ''}
                readOnly
              />
              {playerP4 && (
                <>
                  {'+'}
                  <input
                    name="playerP4"
                    className="match-info__player"
                    value={playerP4.name || ''}
                    readOnly
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </StyledTagTeamsMatchPreview>
    </>
  )
}

export default TagTeamsMatchPreview
