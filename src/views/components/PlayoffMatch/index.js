import CelebrationAnimation from './../CelebrationAnimation'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import IconButton from '@mui/material/IconButton'
import { Loader } from 'views/components'
import { StyledPlayoffMatch } from './styled'
import Tooltip from '../Tooltip'
import { apiClient } from 'api/axiosConfig'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { api, database } from 'api'
import { confirmDialog, toast } from 'utils/notifications'

const PlayoffMatch = ({
  canMutate,
  canDelete = true,
  id,
  leg,
  isSeriesLeg = false,
  series,
  mutation,
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
  const [matchScore, setMatchScore] = useState({})
  const { tournament } = useParams()

  const hasCompetitors = Boolean(
    teamP1 &&
      playerP1 &&
      seedP1 != null &&
      seedP1 !== '' &&
      teamP2 &&
      playerP2 &&
      seedP2 != null &&
      seedP2 !== '',
  )
  const legIsReady = Number(leg) !== 2 || series?.status !== 'awaiting_leg1'
  const canEdit = canMutate && mutation?.canEditResult !== false
  const canDeleteResult = canDelete && mutation?.canDeleteResult !== false
  const canEnterResult = canEdit && hasCompetitors && legIsReady

  const scoresAreComplete =
    matchScore.scoreP1 !== undefined &&
    matchScore.scoreP1 !== '' &&
    matchScore.scoreP2 !== undefined &&
    matchScore.scoreP2 !== ''
  const showPenaltyInputs =
    !isSeriesLeg &&
    scoresAreComplete &&
    Number(matchScore.scoreP1) === Number(matchScore.scoreP2)
  const p1IsSeriesWinner =
    series?.winnerTeamId != null &&
    String(series.winnerTeamId) === String(teamP1?.id)
  const p2IsSeriesWinner =
    series?.winnerTeamId != null &&
    String(series.winnerTeamId) === String(teamP2?.id)
  const getPenaltyScore = (teamId) => {
    if (!outcome?.penalties || outcome?.teamThatWon?.id == null) return null

    return String(outcome.teamThatWon.id) === String(teamId)
      ? outcome.scoreFromTeamThatWon
      : outcome.scoreFromTeamThatLost
  }
  const penaltyScoreP1 = getPenaltyScore(teamP1?.id)
  const penaltyScoreP2 = getPenaltyScore(teamP2?.id)

  const onHandleChange = (event) => {
    const { name, value } = event.target
    setMatchScore((values) => {
      const next = { ...values, [name]: value }
      if (
        ['scoreP1', 'scoreP2'].includes(name) &&
        next.scoreP1 !== undefined &&
        next.scoreP1 !== '' &&
        next.scoreP2 !== undefined &&
        next.scoreP2 !== '' &&
        Number(next.scoreP1) !== Number(next.scoreP2)
      ) {
        delete next.penaltyScoreP1
        delete next.penaltyScoreP2
      }
      return next
    })
  }

  const handleMatchSubmit = async (isMatchValid) => {
    if (!canEnterResult) return

    const { scoreP1, scoreP2 } = matchScore
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
      playerP2,
      teamP2,
      seedP2,
      scoreP2,
      ...(showPenaltyInputs
        ? {
            penaltyScoreP1: matchScore.penaltyScoreP1,
            penaltyScoreP2: matchScore.penaltyScoreP2,
          }
        : {}),
      ...(series && { expectedSeriesRevision: series.revision }),
      valid: isMatchValid === false ? false : undefined,
    }

    try {
      await apiClient.put(
        `${api}/tournaments/${tournament}/matches/update-game/${id}`,
        update,
      )
      await getData()
      if (isThisTheFinal) setShowAnimation(true)
      toast.success({ title: 'Resultado cargado con éxito' })
    } catch (error) {
      if (error.response?.status === 409) {
        setMatchScore({})
        await getData()
      }
      toast.apiError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!canMutate || !canDeleteResult || !series) return
    const confirmed = await confirmDialog({
      title: '¿Eliminar resultado?',
      text: 'Se borrará el resultado y también un desempate pendiente derivado de esta serie.',
      confirmText: 'Sí, eliminar',
      danger: true,
    })
    if (!confirmed) return

    setIsSubmitting(true)
    try {
      await apiClient.put(
        `${api}/tournaments/${tournament}/matches/delete-game/${id}`,
        { expectedSeriesRevision: series.revision },
      )
      await getData()
      toast.success({ title: 'Resultado eliminado con éxito' })
    } catch (error) {
      if (error.response?.status === 409) {
        setMatchScore({})
        await getData()
      }
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
        data-leg={leg}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              className="container__team"
              data-series-winner={p1IsSeriesWinner || undefined}
            >
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
                  {valid === false && outcome?.teamThatWon?.id == teamP1?.id && (
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
                  {valid !== false && (
                    <span className="team-score-value">
                      {scoreP1}
                      {penaltyScoreP1 != null && (
                        <sup className="penalty-score">{penaltyScoreP1}</sup>
                      )}
                    </span>
                  )}
                </div>
              ) : hasCompetitors ? (
                <div className="team-inputs">
                  <input
                    disabled={!canEnterResult}
                    name="scoreP1"
                    value={matchScore.scoreP1 || ''}
                    onChange={onHandleChange}
                  />
                  {showPenaltyInputs && (
                    <input
                      name="penaltyScoreP1"
                      value={matchScore.penaltyScoreP1 || ''}
                      onChange={onHandleChange}
                      placeholder="PEN"
                    />
                  )}
                </div>
              ) : (
                <div className="team-score">-</div>
              )}
            </div>
            <div
              className="container__team"
              data-series-winner={p2IsSeriesWinner || undefined}
            >
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
                  {valid === false && outcome?.teamThatWon?.id == teamP2?.id && (
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
                  {valid !== false && (
                    <span className="team-score-value">
                      {scoreP2}
                      {penaltyScoreP2 != null && (
                        <sup className="penalty-score">{penaltyScoreP2}</sup>
                      )}
                    </span>
                  )}
                </div>
              ) : hasCompetitors ? (
                <div className="team-inputs">
                  <input
                    disabled={!canEnterResult}
                    name="scoreP2"
                    value={matchScore.scoreP2 || ''}
                    onChange={onHandleChange}
                  />
                  {showPenaltyInputs && (
                    <input
                      name="penaltyScoreP2"
                      value={matchScore.penaltyScoreP2 || ''}
                      onChange={onHandleChange}
                      placeholder="PEN"
                    />
                  )}
                </div>
              ) : (
                <div className="team-score">-</div>
              )}
            </div>
          </div>
        </div>

        {!played && hasCompetitors && canMutate ? (
          <div className="match__confirmation">
            {isSubmitting ? (
              <div style={{ margin: 'auto' }}>
                <Loader />
              </div>
            ) : (
              <>
                <IconButton
                  aria-label="Confirmar resultado"
                  disabled={!canEnterResult}
                  type="button"
                  sx={{
                    color: '#09d514',
                    '&.Mui-disabled': { color: '#94a3b8' },
                  }}
                  onClick={() => handleMatchSubmit()}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  aria-label="Confirmar resultado simulado"
                  disabled={!canEnterResult}
                  type="button"
                  sx={{
                    color: '#e1dd28',
                    flexDirection: 'column',
                    '&.Mui-disabled': { color: '#94a3b8' },
                  }}
                  onClick={() => handleMatchSubmit(false)}
                >
                  <CheckIcon />
                  <span style={{ fontSize: 13 }}>SIM</span>
                </IconButton>
              </>
            )}
          </div>
        ) : null}
        {played && canMutate && series && (
          <Tooltip title="Eliminar resultado">
            <span className="match__deletion">
              <IconButton
                type="button"
                aria-label="Eliminar resultado"
                disabled={isSubmitting || !canDeleteResult}
                sx={{
                  color: '#ef4444',
                  '&.Mui-disabled': { color: 'rgba(255, 255, 255, 0.3)' },
                }}
                onClick={handleDelete}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </StyledPlayoffMatch>
      {isThisTheFinal && showAnimation && (
        <CelebrationAnimation showAnimation={showAnimation} />
      )}
    </>
  )
}

export default PlayoffMatch
