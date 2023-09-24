import { useState } from 'react'
import {
  useParams,
  useSearchParams,
  useNavigate,
  createSearchParams,
} from 'react-router-dom'
import { useLogin } from '../../context/LoginContext'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'
import { api, database } from './../../api'
import TeamInformationModal from '../TeamInformationModal'
import BarChartIcon from '@mui/icons-material/BarChart'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const Match = ({ match, getFixtureData }) => {
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
      // The comparison with == checks for both null and undefined //
      MySwal.fire({
        background: `rgba(28, 25, 25, 0.95)`,
        color: `#fff`,
        icon: 'error',
        iconColor: '#b30a0a',
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

    axios
      .put(
        `${api}/tournaments/${tournament}/matches/update-game/${_id}`,
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

  const handleMatchRemoval = async () => {
    if (scoreP1 == null || scoreP2 == null) {
      // The comparison with == checks for both null and undefined //
      MySwal.fire({
        background: `rgba(28, 25, 25, 0.95)`,
        color: `#fff`,
        icon: 'error',
        iconColor: '#b30a0a',
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
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Volver',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `${api}/tournaments/${tournament}/matches/delete-game/${_id}`,
            _id /* Importante, debo adjuntar algo en la request, sino no toma la configuración de abajo (y por ende no incluye la cookie) */,
            {
              withCredentials: true,
              credentials: 'include',
            } /* Importante, sirve para incluir la cookie alojada en el navegador */,
          )
          .then(({ data }) => {
            console.log(data)
            MySwal.fire({
              background: `rgba(28, 25, 25, 0.95)`,
              color: `#fff`,
              icon: 'success',
              iconColor: '#18890e',
              toast: true,
              title: `Partido eliminado con éxito`,
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

  // const [teamInformation, setTeamInformation] = useState()

  const displayExtraInfoFromTeam = (id) => {
    const group = searchParams.get('group')

    MySwal.fire({
      background: 'rgba(0,74,121,0.8)',
      width: 600,
      showConfirmButton: false,
      showCloseButton: true,
      didOpen: () => {
        // `MySwal` is a subclass of `Swal` with all the same instance & static methods
        MySwal.showLoading()
        axios
          .get(`${api}/tournaments/${tournament}/teams/${id}?group=${group}`)
          .then(({ data }) => {
            MySwal.update({
              html: <TeamInformationModal teamInformation={data} />,
            })
          })
      },
      didRender: () => {
        MySwal.hideLoading()
      },
    })
  }

  const onHandleTeamChange = (id) => {
    const group = searchParams.get('group')
    if (!group) setSearchParams({ team: id })
    else setSearchParams({ team: id, group })
  }

  return (
    <form
      className="match"
      onSubmit={(e) => {
        handleMatchSubmit(e)
      }}
      style={{
        outline: played ? '#2aa723 3px solid' : '#dc3545 3px solid',
      }}
    >
      <div className="match-view">
        <div className="match-info">
          <BarChartIcon
            fontSize="medium"
            sx={{ cursor: 'pointer' }}
            onClick={() => displayExtraInfoFromTeam(teamP1.id)}
          />
          <textarea
            name="teamP1"
            wrap="soft"
            className="match-info__team"
            value={teamP1.name}
            readOnly
          >
            {teamP1.name}
          </textarea>

          <img
            src={`${database}/logos/${teamP1.id}`}
            alt={match.teamP1}
            className="match-info__logo"
            onClick={() => onHandleTeamChange(teamP1.id)}
          />
          <input
            name="playerP1"
            className="match-info__player"
            value={playerP1.name}
            readOnly
          />
        </div>
        <div className="match-score">
          <div className="match__container">
            <input
              name="scoreP1"
              className="match-score__goals"
              value={matchScore.scoreP1 ?? ''} // IMPORTANT // TODO: Handle react warning about not adding and onChange handler
              onChange={onHandleChange}
            />
            <span className="match-score__versus">vs</span>
            <input
              name="scoreP2"
              className="match-score__goals"
              value={matchScore.scoreP2 ?? ''} // IMPORTANT // TODO: Handle react warning about not adding and onChange handler
              onChange={onHandleChange}
            />
          </div>
          <div className="input__container">
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
          </div>
          {/* <InputContainer
          id={_id}
          isFinished={match.scoreP1 !== undefined ? true : false}
        /> */}
        </div>
        <div className="match-info">
          <BarChartIcon
            fontSize="medium"
            sx={{ cursor: 'pointer' }}
            onClick={() => displayExtraInfoFromTeam(teamP2.id)}
          />
          <textarea
            name="teamP2"
            wrap="soft"
            className="match-info__team"
            value={teamP2.name}
            readOnly
          >
            {teamP2.name}
          </textarea>
          <img
            src={`${database}/logos/${teamP2.id}`}
            alt={teamP2.name}
            className="match-info__logo"
            onClick={() => onHandleTeamChange(teamP2.id)}
          />
          <input
            name="playerP2"
            className="match-info__player"
            value={playerP2.name}
            readOnly
          />
        </div>
      </div>
      {updatedAt ? (
        <div className="match-date">
          Actualizado el: {updatedAt && new Date(updatedAt).toLocaleString()}{' '}
        </div>
      ) : (
        <div className="match-date">No hay fecha de actualización</div>
      )}
    </form>
  )
}

export default Match
