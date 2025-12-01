import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { api, database } from '../../../api'
import {
  StepContainer,
  StepTitle,
  ConfirmationSection,
  ConfirmationItem,
  ConfirmationLabel,
  ConfirmationValue,
  TeamsList,
  TeamItem,
  TeamImage,
  SubmitButton,
} from './styled'

const MySwal = withReactContent(Swal)

const BracketPreview = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 1.5rem 0.5rem;
  background: rgba(245, 248, 250, 0.5);
  border-radius: 8px;
  margin-top: 1rem;
  justify-content: center;
  @media (max-width: 768px) {
    justify-content: start;
    gap: 1rem;
  }
`

const BracketColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 280px;

  @media (max-width: 768px) {
    min-width: 280px;
  }
`

const BracketColumnTitle = styled.h4`
  color: var(--blue-900);
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 0.75rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--blue-900);
`

const BracketMatchPreview = styled.div`
  background: white;
  border: 1px solid rgba(26, 61, 77, 0.2);
  border-radius: 6px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const BracketTeamPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(26, 61, 77, 0.05);
  border-radius: 4px;
`

const BracketTeamLogo = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`

const BracketTeamInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const BracketTeamName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--blue-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const BracketPlayerName = styled.div`
  font-size: 0.75rem;
  color: #666;
`

const MatchNumber = styled.div`
  font-size: 0.75rem;
  color: #999;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.25rem;
`

const FORMATS = {
  champions_league: 'Chempions',
  league: 'Liga Única',
  league_playin_playoff: 'Superliga APA',
  world_cup: 'Copa del Mundo',
  playoff: 'Playoffs',
}

const StepConfirmation = ({ players }) => {
  const { watch } = useFormContext()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tournamentName = watch('tournamentName')
  const format = watch('format')
  const selectedPlayers = watch('selectedPlayers') || []
  const selectedTeams = watch('selectedTeams') || []
  const teamAssignments = watch('teamAssignments') || []
  const playoffBracket = watch('playoffBracket') || []

  const hasGroups =
    format === 'league_playin_playoff' ||
    format === 'world_cup' ||
    format === 'champions_league'

  const isPlayoffs = format === 'playoff'

  const getPlayerName = (playerId) => {
    return players.find((p) => p.id === playerId)?.name || 'Desconocido'
  }

  const getTeamData = (teamId) => {
    const assignment = teamAssignments.find((a) => a.teamId === teamId)
    return {
      id: teamId,
      assignment,
    }
  }

  const getTeamsByGroup = () => {
    if (!hasGroups) return null

    const groups = {}
    teamAssignments.forEach((assignment) => {
      const group = assignment.group
      if (group) {
        if (!groups[group]) {
          groups[group] = []
        }
        groups[group].push(assignment)
      }
    })

    return Object.keys(groups)
      .sort()
      .map((groupKey) => ({
        group: groupKey,
        teams: groups[groupKey],
      }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Prepare data for API
      const tournamentPlayers = players.filter((p) =>
        selectedPlayers.includes(p.id),
      )

      let teams

      if (isPlayoffs) {
        teams = playoffBracket.flatMap((match) => {
          const teamsInMatch = []

          if (match.slot1) {
            teamsInMatch.push({
              team: {
                id: match.slot1.teamId,
                name: match.slot1.teamName,
              },
              player: match.slot1.playerId,
              playoff_id: match.playoff_id,
            })
          }

          if (match.slot2) {
            teamsInMatch.push({
              team: {
                id: match.slot2.teamId,
                name: match.slot2.teamName,
              },
              player: match.slot2.playerId,
              playoff_id: match.playoff_id,
            })
          }

          return teamsInMatch
        })
      } else {
        // For other formats, use team assignments
        teams = teamAssignments.map((assignment) => ({
          team: {
            id: assignment.teamId,
            name: assignment.teamName,
          },
          player: assignment.playerId, // Already contains { id, name }
          group: assignment.group,
        }))
      }

      const response = await axios.post(
        `${api}/tournaments`,
        {
          name: tournamentName,
          format,
          players: tournamentPlayers,
          teams,
        },
        {
          withCredentials: true,
          credentials: 'include',
        },
      )

      MySwal.fire({
        background: 'rgba(28, 25, 25, 0.95)',
        color: '#fff',
        icon: 'success',
        iconColor: '#18890e',
        toast: true,
        title: 'Torneo creado con éxito',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      }).then(() => {
        // navigate(`/tournaments/${response.data._id}`)
        console.log(response)
      })
    } catch (error) {
      console.error('Error creating tournament:', error)
      MySwal.fire({
        background: 'rgba(28, 25, 25, 0.95)',
        color: '#fff',
        icon: 'error',
        iconColor: '#b30a0a',
        title: 'Error al crear el torneo',
        text: error.response?.data?.message || 'Por favor intenta nuevamente',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
      setIsSubmitting(false)
    }
  }

  return (
    <StepContainer>
      <StepTitle>Confirmar Torneo</StepTitle>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
        Revisa los detalles del torneo antes de crearlo
      </p>

      <ConfirmationSection>
        <ConfirmationItem>
          <ConfirmationLabel>Nombre del Torneo:</ConfirmationLabel>
          <ConfirmationValue>{tournamentName}</ConfirmationValue>
        </ConfirmationItem>

        <ConfirmationItem>
          <ConfirmationLabel>Formato:</ConfirmationLabel>
          <ConfirmationValue>{FORMATS[format]}</ConfirmationValue>
        </ConfirmationItem>

        <ConfirmationItem>
          <ConfirmationLabel>
            Jugadores ({selectedPlayers.length}):
          </ConfirmationLabel>
          <ConfirmationValue>
            {selectedPlayers
              .map((playerId) => getPlayerName(playerId))
              .join(', ')}
          </ConfirmationValue>
        </ConfirmationItem>

        <ConfirmationItem>
          <ConfirmationLabel>
            Equipos ({selectedTeams.length}):
          </ConfirmationLabel>
          {isPlayoffs ? (
            <BracketPreview>
              {/* Left side - Matches 1-8 */}
              <BracketColumn>
                <BracketColumnTitle>Enfrentamientos 1-8</BracketColumnTitle>
                {playoffBracket.slice(0, 8).map((match) => (
                  <BracketMatchPreview key={match.playoff_id}>
                    <MatchNumber>Match {match.playoff_id}</MatchNumber>
                    {match.slot1 && (
                      <BracketTeamPreview>
                        <BracketTeamLogo
                          src={`${database}/logos/${match.slot1.teamId}`}
                          alt={match.slot1.teamName}
                        />
                        <BracketTeamInfo>
                          <BracketTeamName>
                            {match.slot1.teamName}
                          </BracketTeamName>
                          <BracketPlayerName>
                            {match.slot1.playerId?.name || 'Sin jugador'}
                          </BracketPlayerName>
                        </BracketTeamInfo>
                      </BracketTeamPreview>
                    )}
                    {match.slot2 && (
                      <BracketTeamPreview>
                        <BracketTeamLogo
                          src={`${database}/logos/${match.slot2.teamId}`}
                          alt={match.slot2.teamName}
                        />
                        <BracketTeamInfo>
                          <BracketTeamName>
                            {match.slot2.teamName}
                          </BracketTeamName>
                          <BracketPlayerName>
                            {match.slot2.playerId?.name || 'Sin jugador'}
                          </BracketPlayerName>
                        </BracketTeamInfo>
                      </BracketTeamPreview>
                    )}
                  </BracketMatchPreview>
                ))}
              </BracketColumn>

              {/* Right side - Matches 9-16 */}
              <BracketColumn>
                <BracketColumnTitle>Enfrentamientos 9-16</BracketColumnTitle>
                {playoffBracket.slice(8, 16).map((match) => (
                  <BracketMatchPreview key={match.playoff_id}>
                    <MatchNumber>Match {match.playoff_id}</MatchNumber>
                    {match.slot1 && (
                      <BracketTeamPreview>
                        <BracketTeamLogo
                          src={`${database}/logos/${match.slot1.teamId}`}
                          alt={match.slot1.teamName}
                        />
                        <BracketTeamInfo>
                          <BracketTeamName>
                            {match.slot1.teamName}
                          </BracketTeamName>
                          <BracketPlayerName>
                            {match.slot1.playerId?.name || 'Sin jugador'}
                          </BracketPlayerName>
                        </BracketTeamInfo>
                      </BracketTeamPreview>
                    )}
                    {match.slot2 && (
                      <BracketTeamPreview>
                        <BracketTeamLogo
                          src={`${database}/logos/${match.slot2.teamId}`}
                          alt={match.slot2.teamName}
                        />
                        <BracketTeamInfo>
                          <BracketTeamName>
                            {match.slot2.teamName}
                          </BracketTeamName>
                          <BracketPlayerName>
                            {match.slot2.playerId?.name || 'Sin jugador'}
                          </BracketPlayerName>
                        </BracketTeamInfo>
                      </BracketTeamPreview>
                    )}
                  </BracketMatchPreview>
                ))}
              </BracketColumn>
            </BracketPreview>
          ) : hasGroups ? (
            <div style={{ marginTop: '1rem' }}>
              {getTeamsByGroup()?.map(({ group, teams }) => (
                <div key={group} style={{ marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: 'var(--blue-900)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Grupo {group}
                  </div>
                  <TeamsList>
                    {teams.map((assignment) => (
                      <TeamItem key={assignment.teamId}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <TeamImage
                            src={`${database}/logos/${assignment.teamId}`}
                            alt="Team logo"
                          />
                          <span style={{ fontWeight: '500' }}>
                            {assignment?.teamName ||
                              `Equipo #${assignment.teamId}`}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                          {assignment?.playerId?.name || 'Sin asignar'}
                        </div>
                      </TeamItem>
                    ))}
                  </TeamsList>
                </div>
              ))}
            </div>
          ) : (
            <TeamsList>
              {selectedTeams.map((teamId) => {
                const { assignment } = getTeamData(teamId)
                return (
                  <TeamItem key={teamId}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <TeamImage
                        src={`${database}/logos/${teamId}`}
                        alt="Team logo"
                      />
                      <span style={{ fontWeight: '500' }}>
                        {assignment?.teamName || `Equipo #${teamId}`}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>
                      {assignment?.playerId?.name || 'Sin asignar'}
                    </div>
                  </TeamItem>
                )
              })}
            </TeamsList>
          )}
        </ConfirmationItem>
      </ConfirmationSection>

      <SubmitButton onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Creando Torneo...' : 'Crear Torneo'}
      </SubmitButton>
    </StepContainer>
  )
}

export default StepConfirmation
