import CelebrationAnimation from './../CelebrationAnimation'
import CheckIcon from '@mui/icons-material/Check'
import IconButton from '@mui/material/IconButton'
import { StyledPlayoffMatch } from './styled'
import Swal from 'sweetalert2'
import { apiClient } from 'api/axiosConfig'
import { useLogin } from 'context/LoginContext'
import { useState } from 'react'
import withReactContent from 'sweetalert2-react-content'
import { api, database } from 'api'
import { useParams, useNavigate } from 'react-router-dom'

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
      scoreP1,
      penaltyScoreP1,
      playerP2,
      teamP2,
      seedP2,
      scoreP2,
      penaltyScoreP2,
      valid: isMatchValid === false ? false : undefined,
      isThisTheFinal,
    }

    apiClient
      .put(`${api}/tournaments/${tournament}/matches/update-game/${id}`, update)
      .then(({ data }) => {
        console.log(data)
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
          customClass: { timerProgressBar: 'toast-progress-dark' },
          didOpen: (toast) => {
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
          customClass: { timerProgressBar: 'toast-progress-dark' },
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
                    outcome.teamThatWon?.id == teamP1.id &&
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
                    outcome.teamThatWon?.id == teamP2.id &&
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
