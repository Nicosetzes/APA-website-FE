import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import { apiClient } from 'api/axiosConfig'
import { sameTeamId } from 'utils/teamRef'
import { useState } from 'react'
import {
  InputContainer,
  MatchContainer,
  MatchDate,
  MatchHeader,
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
import { api, database } from 'api'
import { confirmDialog, toast } from 'utils/notifications'
import { formatDateTime } from 'utils/dates'
import {
  formatPlayedAt,
  getPlayedAt,
  getPlayedAtPrecision,
} from 'utils/playedAt'
import { useParams, useSearchParams } from 'react-router-dom'

const Match = ({ canMutate, match, getFixtureData, teamStats }) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const { tournament } = useParams()

  const {
    _id,
    group,
    played,
    playerP1,
    playerP2,
    scoreP1,
    scoreP2,
    teamP1,
    teamP2,
  } = match
  const playedAt = getPlayedAt(match)
  const [matchScore, setMatchScore] = useState({
    scoreP1: scoreP1,
    scoreP2: scoreP2,
  })

  const onHandleChange = (event) => {
    if (!canMutate) return

    const name = event.target.name
    const value = event.target.value
    setMatchScore((values) => ({ ...values, [name]: value }))
  }

  const handleMatchSubmit = async (event) => {
    event.preventDefault()
    if (!canMutate) return

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
      .then(() => {
        getFixtureData()
        toast.success({ title: 'Partido cargado con éxito' })
      })
      .catch((error) => toast.apiError(error))
  }

  const handleMatchRemoval = async () => {
    if (!canMutate) return

    if (scoreP1 == null || scoreP2 == null) {
      toast.error({
        text: 'No puede borrar partidos que no tengan el resultado cargado',
      })
      return
    }

    const confirmed = await confirmDialog({
      title: 'Eliminar',
      text: '¿Está seguro que desea eliminar este partido?',
      confirmText: 'Eliminar',
      cancelText: 'Volver',
      danger: true,
    })
    if (!confirmed) return

    try {
      await apiClient.put(
        `${api}/tournaments/${tournament}/matches/delete-game/${_id}`,
        {},
      )
      getFixtureData()
      toast.success({ title: 'Partido eliminado con éxito' })
    } catch (error) {
      toast.apiError(error)
    }
  }

  const onHandleTeamChange = (id) => {
    const group = searchParams.get('group')
    if (!group) setSearchParams({ team: id })
    else setSearchParams({ team: id, group })
  }

  const getPlayedMatches = (teamId) => {
    if (!teamStats) return null
    const stats = teamStats.find((stat) => sameTeamId(stat.teamId, teamId))
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
      {group ? <MatchHeader>{`Grupo ${group}`}</MatchHeader> : null}
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
              readOnly={!canMutate}
            />
            <VersusSpan>vs</VersusSpan>
            <ScoreInput
              name="scoreP2"
              value={matchScore.scoreP2 ?? ''}
              onChange={onHandleChange}
              readOnly={!canMutate}
            />
          </MatchContainer>
          {canMutate && (
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
          )}
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
      {played && playedAt ? (
        <MatchDate>
          {formatPlayedAt(playedAt, getPlayedAtPrecision(match)) ||
            formatDateTime(playedAt)}{' '}
        </MatchDate>
      ) : (
        <MatchDate>El partido aún no se ha jugado</MatchDate>
      )}
    </StyledMatch>
  )
}

export default Match
