import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
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

const FORMATS = {
  champions_league: 'Chempions',
  league: 'Liga Única',
  league_playin_playoff: 'Superliga APA',
  world_cup: 'Copa del Mundo',
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

  const hasGroups =
    format === 'league_playin_playoff' ||
    format === 'world_cup' ||
    format === 'champions_league'

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
      const teams = teamAssignments.map((assignment) => ({
        team: {
          id: assignment.teamId,
          name: assignment.teamName,
        },
        player: assignment.playerId, // Already contains { id, name }
        group: assignment.group,
      }))

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
        navigate(`/tournaments/${response.data._id}`)
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
          {hasGroups ? (
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
