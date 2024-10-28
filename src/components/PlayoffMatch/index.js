import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLogin } from '../../context/LoginContext'
import axios from 'axios'
import { api, database } from './../../api'
import { Oval } from 'react-loader-spinner'
import { StyledPlayoffMatch } from './styled'
import CheckIcon from '@mui/icons-material/Check'
import IconButton from '@mui/material/IconButton'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useMediaQuery } from 'react-responsive'
import CelebrationAnimation from './../CelebrationAnimation'

const PlayoffMatch = ({
  id,
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
  getData,
  valid,
  isThisTheFinal,
}) => {
  // const isL = useMediaQuery({ query: '(min-width: 992px)' })
  // const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  const isXS = useMediaQuery({ query: '(min-width: 375px)' })

  // Valor que cambiará a true cuando se cargue el partido de la final

  const [showAnimation, setShowAnimation] = useState(false)

  const MySwal = withReactContent(Swal)

  const navigate = useNavigate()

  const login = useLogin()
  const { setLoginStatus } = login

  const { tournament } = useParams()

  const [matchScore, setMatchScore] = useState({})

  const onHandleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setMatchScore((values) => ({ ...values, [name]: value }))
  }

  const handleMatchSubmit = async (isMatchValid) => {
    console.log('Cargo partido')
    const { scoreP1, penaltyScoreP1, scoreP2, penaltyScoreP2 } = matchScore
    if (scoreP1 == null || scoreP1 === '' || scoreP2 == null || scoreP2 === '')
      return console.log('Resultado incompleto')

    const update = {
      playerP1,
      teamP1,
      seedP1,
      scoreP1, // new value
      penaltyScoreP1, // new value
      playerP2,
      teamP2,
      seedP2,
      scoreP2, // new value
      penaltyScoreP2, // new value
      valid: isMatchValid === false ? false : undefined,
      isThisTheFinal,
    }

    axios
      .put(
        `${api}/tournaments/${tournament}/matches/update-game/${id}`,
        update,
        {
          withCredentials: true,
          credentials: 'include',
        } /* Importante, sirve para incluir la cookie alojada en el navegador */,
      )
      .then(({ data }) => {
        console.log(data)
        // Celebración cuando se carga el resultado de la final
        if (isThisTheFinal) {
          setShowAnimation(true)
        }

        MySwal.fire({
          background: `rgba(28, 25, 25, 0.95)`,
          color: `#fff`,
          icon: 'success',
          iconColor: '#18890e',
          toast: true,
          // title: `Resultado cargado con éxito`,
          position: 'top-end',
          showConfirmButton: false,
          text: 'Resultado cargado con éxito',
          timer: 2000,
          timerProgressBar: true,
          customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
          didOpen: (toast) => {
            // Vuelvo a traer la data de los partidos, para mostrar los partidos actualizados //
            getData()
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
    <>
      <StyledPlayoffMatch isThisTheFinal={isThisTheFinal}>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="container__team">
              <div className="team-seed">{seedP1}.</div>
              <div className="team-logo">
                <img src={`${database}/logos/${teamP1.id}`} />
              </div>
              <div className="team-name">
                {teamP1.name} ({playerP1.name[0]}
                {playerP1.name[1].toUpperCase()})
              </div>
              {played ? (
                <div className="team-score">
                  {valid === false &&
                    outcome.teamThatWon.id == teamP1.id &&
                    'W/O'}
                  {valid !== false && scoreP1}
                </div>
              ) : (
                <div className="team-inputs">
                  <input
                    name="scoreP1"
                    value={matchScore.scoreP1 || ''}
                    onChange={onHandleChange}
                  />
                  <input
                    name="penaltyScoreP1"
                    value={matchScore.penaltyScoreP1 || ''}
                    onChange={onHandleChange}
                    placeholder="PEN"
                  />
                </div>
              )}
              {outcome?.penalties && (
                <div className="team-penalties">
                  <span>
                    (
                    {outcome.teamThatWon.id == teamP1.id
                      ? outcome.scoreFromTeamThatWon
                      : outcome.scoreFromTeamThatLost}
                    )
                  </span>
                </div>
              )}
            </div>
            <div className="container__team">
              <div className="team-seed">{seedP2}.</div>
              <div className="team-logo">
                <img src={`${database}/logos/${teamP2.id}`} />
              </div>
              <div className="team-name">
                {teamP2.name} ({playerP2.name[0]}
                {playerP2.name[1].toUpperCase()})
              </div>
              {played ? (
                <div className="team-score">
                  {valid === false &&
                    outcome.teamThatWon.id == teamP2.id &&
                    'W/O'}
                  {valid !== false && scoreP2}
                </div>
              ) : (
                <div className="team-inputs">
                  <input
                    name="scoreP2"
                    value={matchScore.scoreP2 || ''}
                    onChange={onHandleChange}
                  />
                  <input
                    name="penaltyScoreP2"
                    value={matchScore.penaltyScoreP2 || ''}
                    onChange={onHandleChange}
                    placeholder="PEN"
                  />
                </div>
              )}
              {outcome?.penalties && (
                <div className="team-penalties">
                  <span>
                    (
                    {outcome.teamThatWon.id == teamP2.id
                      ? outcome.scoreFromTeamThatWon
                      : outcome.scoreFromTeamThatLost}
                    )
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {!played && (
          <div className="match__confirmation">
            <IconButton
              type="submit"
              sx={{ color: '#09d514' }}
              onClick={() => handleMatchSubmit()}
            >
              <CheckIcon />
            </IconButton>
            <IconButton
              type="submit"
              sx={{ color: '#e1dd28', flexDirection: 'column' }}
              onClick={() => handleMatchSubmit(false)}
            >
              <CheckIcon />
              <span style={{ fontSize: 13 }}>SIM</span>
            </IconButton>
          </div>
        )}
      </StyledPlayoffMatch>
      {isThisTheFinal && showAnimation && (
        <CelebrationAnimation showAnimation={showAnimation} />
      )}
    </>
  )
}

export default PlayoffMatch
