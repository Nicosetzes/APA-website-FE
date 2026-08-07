import CelebrationAnimation from './../CelebrationAnimation'
import CheckIcon from '@mui/icons-material/Check'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import IconButton from '@mui/material/IconButton'
import { Loader } from 'views/components'
import { StyledPlayoffMatch } from './styled'
import Swal from 'sweetalert2'
import Tooltip from '../Tooltip'
import { apiClient } from 'api/axiosConfig'
import { useLogin } from 'context/LoginContext'
import { useState } from 'react'
import withReactContent from 'sweetalert2-react-content'
import { api, database } from 'api'
import { useNavigate, useParams } from 'react-router-dom'

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  const MySwal = withReactContent(Swal)

  const navigate = useNavigate()

  const login = useLogin()
  const { setLoginStatus } = login

  const { tournament } = useParams()

  const [matchScore, setMatchScore] = useState({})

  const toastConfig = {
    background: 'rgba(28, 25, 25, 0.95)',
    color: '#fff',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    customClass: {
      timerProgressBar: 'toast-progress-dark',
    },
  }

  const onHandleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setMatchScore((values) => ({ ...values, [name]: value }))
  }

  const handleMatchSubmit = async (isMatchValid) => {
    setIsSubmitting(true)
    const { scoreP1, penaltyScoreP1, scoreP2, penaltyScoreP2 } = matchScore

    if (
      scoreP1 == null ||
      scoreP1 === '' ||
      scoreP2 == null ||
      scoreP2 === ''
    ) {
      return console.log('Resultado incompleto')
    }

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

    try {
      const { data } = await apiClient.put(
        `${api}/tournaments/${tournament}/matches/update-game/${id}`,
        update,
      )

      console.log(data)

      await getData()

      if (isThisTheFinal) {
        setShowAnimation(true)
      }

      MySwal.fire({
        ...toastConfig,
        icon: 'success',
        iconColor: '#18890e',
        text: 'Resultado cargado con éxito',
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
      })
    } catch ({ response }) {
      const { auth, message } = response.data

      MySwal.fire({
        ...toastConfig,
        icon: 'error',
        iconColor: '#b30a0a',
        title: '¡Error!',
        text: message,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
        didClose: () => {
          setLoginStatus((loginStatus) => ({
            ...loginStatus,
            status: auth,
          }))

          if (auth === false) {
            navigate(
              {
                pathname: '/users/login',
              },
              {
                state: { url: location.pathname },
              },
            )
          }
        },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <StyledPlayoffMatch isThisTheFinal={isThisTheFinal}>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="container__team">
              <div className="team-seed">{seedP1 ? `${seedP1}.` : '?'}</div>
              <div className="team-logo">
                <img
                  alt={teamP1?.name || 'sitioapa logo'}
                  src={
                    teamP1?.id
                      ? `${database}/logos/${teamP1.id}`
                      : '/images/sitioapalogo.png'
                  }
                />
              </div>
              <div className="team-name">
                {teamP1?.name}{' '}
                {playerP1?.name ? (
                  `(${playerP1?.name[0]}${playerP1?.name[1].toUpperCase()})`
                ) : (
                  <>
                    <span>TBD</span>
                    <Tooltip title={'TBD = To Be Determined (pendiente)'}>
                      <HelpOutlineIcon
                        sx={{
                          fontSize: '1rem',
                          marginLeft: '0.25rem',
                          cursor: 'help',
                        }}
                      />
                    </Tooltip>
                  </>
                )}
              </div>
              {played ? (
                <div className="team-score">
                  {valid === false && outcome.teamThatWon?.id == teamP1.id && (
                    <>
                      <span>W/O</span>
                      <Tooltip title={'W/O = Walk Over (victoria automática)'}>
                        <HelpOutlineIcon
                          sx={{
                            fontSize: '1rem',
                            marginLeft: '0.25rem',
                            cursor: 'help',
                          }}
                        />
                      </Tooltip>
                    </>
                  )}
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
              <div className="team-seed">{seedP2 ? `${seedP2}.` : '?'}</div>
              <div className="team-logo">
                <img
                  src={
                    teamP2?.id
                      ? `${database}/logos/${teamP2.id}`
                      : '/images/sitioapalogo.png'
                  }
                  alt={teamP2?.name || 'sitioapa logo'}
                />
              </div>
              <div className="team-name">
                {teamP2?.name}{' '}
                {playerP2?.name ? (
                  `(${playerP2?.name[0]}${playerP2?.name[1].toUpperCase()})`
                ) : (
                  <>
                    <span>TBD</span>
                    <Tooltip title={'TBD = To Be Determined (pendiente)'}>
                      <HelpOutlineIcon
                        sx={{
                          fontSize: '1rem',
                          marginLeft: '0.25rem',
                          cursor: 'help',
                        }}
                      />
                    </Tooltip>
                  </>
                )}
              </div>
              {played ? (
                <div className="team-score">
                  {valid === false && outcome.teamThatWon?.id == teamP2.id && (
                    <>
                      <span>W/O</span>
                      <Tooltip title={'W/O = Walk Over (victoria automática)'}>
                        <HelpOutlineIcon
                          sx={{
                            fontSize: '1rem',
                            marginLeft: '0.25rem',
                            cursor: 'help',
                          }}
                        />
                      </Tooltip>
                    </>
                  )}
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

        {!played ? (
          <div className="match__confirmation">
            {isSubmitting ? (
              <div style={{ margin: 'auto' }}>
                <Loader />
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        ) : null}
      </StyledPlayoffMatch>
      {isThisTheFinal && showAnimation && (
        <CelebrationAnimation showAnimation={showAnimation} />
      )}
    </>
  )
}

export default PlayoffMatch
