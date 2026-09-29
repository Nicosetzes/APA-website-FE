import CelebrationAnimation from './../CelebrationAnimation'
import CheckIcon from '@mui/icons-material/Check'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import IconButton from '@mui/material/IconButton'
import { Loader } from 'views/components'
import { StyledPlayoffMatch } from './styled'
import Tooltip from '../Tooltip'
import { apiClient } from 'api/axiosConfig'
import { toast } from 'utils/notifications'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { api, database } from 'api'

const PlayoffMatch = ({
  canMutate,
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
  side = 'left',
  align = 'center',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  const { tournament } = useParams()

  const [matchScore, setMatchScore] = useState({})

  const onHandleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setMatchScore((values) => ({ ...values, [name]: value }))
  }

  const handleMatchSubmit = async (isMatchValid) => {
    if (!canMutate) return

    const { scoreP1, penaltyScoreP1, scoreP2, penaltyScoreP2 } = matchScore

    if (
      scoreP1 == null ||
      scoreP1 === '' ||
      scoreP2 == null ||
      scoreP2 === ''
    ) {
      toast.error({ text: 'Resultado incompleto, intente nuevamente' })
      return
    }

    setIsSubmitting(true)

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
    }

    try {
      await apiClient.put(
        `${api}/tournaments/${tournament}/matches/update-game/${id}`,
        update,
      )

      getData()

      if (isThisTheFinal) {
        setShowAnimation(true)
      }

      toast.success({ title: 'Resultado cargado con éxito' })
    } catch (error) {
      toast.apiError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <StyledPlayoffMatch
        isThisTheFinal={isThisTheFinal}
        $side={side}
        $align={align}
      >
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
                    <span className="team-walkover">
                      W/O
                      <Tooltip title={'W/O = Walk Over (victoria automática)'}>
                        <HelpOutlineIcon
                          sx={{
                            fontSize: '1rem',
                            marginLeft: '0.15rem',
                            cursor: 'help',
                          }}
                        />
                      </Tooltip>
                    </span>
                  )}
                  {valid !== false && scoreP1}
                </div>
              ) : canMutate ? (
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
              ) : (
                <div className="team-score">-</div>
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
                    <span className="team-walkover">
                      W/O
                      <Tooltip title={'W/O = Walk Over (victoria automática)'}>
                        <HelpOutlineIcon
                          sx={{
                            fontSize: '1rem',
                            marginLeft: '0.15rem',
                            cursor: 'help',
                          }}
                        />
                      </Tooltip>
                    </span>
                  )}
                  {valid !== false && scoreP2}
                </div>
              ) : canMutate ? (
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
              ) : (
                <div className="team-score">-</div>
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

        {!played && canMutate ? (
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
