import { database } from 'api'
import { useEffect } from 'react'
import {
  AssignmentCard,
  AssignmentGrid,
  AssignmentSection,
  ErrorMessage,
  GroupSelect,
  PlayerSelect,
  StepContainer,
  StepDescription,
  StepTitle,
  TeamInfo,
  TeamImage,
  TeamName,
} from '../styled'
import { Controller , useFormContext } from 'react-hook-form'

const StepAssignments = ({ players, format }) => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext()

  const selectedTeams = watch('selectedTeams') || []
  const selectedPlayers = watch('selectedPlayers') || []
  const teamAssignments = watch('teamAssignments') || []
  const teamsData = watch('teamsData') || [] // Get teams from form state

  console.log(teamsData)

  const hasGroups =
    format === 'league_playin_playoff' ||
    format === 'world_cup' ||
    format === 'champions_league'
  const groups = hasGroups
    ? format === 'league_playin_playoff'
      ? ['A', 'B']
      : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    : []

  useEffect(() => {
    // Initialize assignments if not already set
    if (teamAssignments.length === 0 && selectedTeams.length > 0) {
      const initialAssignments = selectedTeams.map((teamId) => {
        const teamData = teamsData.find(({ team }) => team.id === teamId)
        return {
          teamId,
          teamName: teamData?.team?.name || '',
          playerId: null,
          group: null,
        }
      })
      setValue('teamAssignments', initialAssignments)
    }
  }, [selectedTeams, teamAssignments.length, setValue, teamsData])

  const updateAssignment = (teamId, field, value) => {
    let updatedValue = value === '' ? null : value

    // If updating playerId, store the complete player object
    if (field === 'playerId' && updatedValue) {
      const player = availablePlayers.find((p) => p.id === updatedValue)
      updatedValue = player ? { id: player.id, name: player.name } : null
    }

    const updatedAssignments = teamAssignments.map((assignment) =>
      assignment.teamId === teamId
        ? { ...assignment, [field]: updatedValue }
        : assignment,
    )
    setValue('teamAssignments', updatedAssignments)
  }

  const getAssignment = (teamId) => {
    const assignment = teamAssignments.find((a) => a.teamId === teamId)
    return (
      assignment || {
        playerId: null,
        group: null,
      }
    )
  }

  const availablePlayers = players.filter((p) => selectedPlayers.includes(p.id))
  const selectedTeamsData = teamsData.filter(({ team }) =>
    selectedTeams.includes(team.id),
  )

  return (
    <StepContainer>
      <StepTitle>Asignar Jugadores y Grupos</StepTitle>
      <StepDescription>
        Asigna un jugador a cada equipo
        {hasGroups && ' y selecciona el grupo correspondiente'}
      </StepDescription>

      <Controller
        name="teamAssignments"
        control={control}
        rules={{
          validate: (value) => {
            if (!value || value.length === 0)
              return 'Debes asignar jugadores a los equipos'
            const allHavePlayers = value.every(
              (a) =>
                a.playerId &&
                (typeof a.playerId === 'object' ? a.playerId.id : a.playerId),
            )
            if (!allHavePlayers)
              return 'Todos los equipos deben tener un jugador asignado'
            if (hasGroups) {
              const allHaveGroups = value.every(
                (a) => a.group && a.group !== '',
              )
              if (!allHaveGroups)
                return 'Todos los equipos deben tener un grupo asignado'

              // Champions League validation: exactly 4 teams per group in all 8 groups
              if (format === 'champions_league') {
                const groupCounts = {}
                const allGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

                // Initialize all groups with 0
                allGroups.forEach((group) => {
                  groupCounts[group] = 0
                })

                // Count teams in each group
                value.forEach((assignment) => {
                  const group = assignment.group
                  if (group) {
                    groupCounts[group] = (groupCounts[group] || 0) + 1
                  }
                })

                // Check that all 8 groups have exactly 4 teams
                const invalidGroups = Object.entries(groupCounts).filter(
                  ([, count]) => count !== 4,
                )

                if (invalidGroups.length > 0) {
                  const groupsText = invalidGroups
                    .map(
                      ([group, count]) => `Grupo ${group} (${count} equipos)`,
                    )
                    .join(', ')
                  return `Champions League requiere exactamente 4 equipos en cada uno de los 8 grupos. ${groupsText}`
                }
              }
            }
            return true
          },
        }}
        render={() => (
          <AssignmentSection>
            <AssignmentGrid>
              {selectedTeamsData.map(({ team }) => {
                const assignment = getAssignment(team.id)
                return (
                  <AssignmentCard key={team.id}>
                    <TeamInfo>
                      <TeamImage
                        src={`${database}/logos/${team.id}`}
                        alt={team.name}
                      />
                      <TeamName>{team.name}</TeamName>
                    </TeamInfo>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            marginBottom: '0.25rem',
                            display: 'block',
                          }}
                        >
                          Jugador *
                        </label>
                        <PlayerSelect
                          value={assignment.playerId?.id || ''}
                          onChange={(e) =>
                            updateAssignment(
                              team.id,
                              'playerId',
                              e.target.value || null,
                            )
                          }
                        >
                          <option value="">Seleccionar jugador</option>
                          {availablePlayers.map((player) => (
                            <option key={player.id} value={player.id}>
                              {player.name}
                            </option>
                          ))}
                        </PlayerSelect>
                      </div>

                      {hasGroups && (
                        <div>
                          <label
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              marginBottom: '0.25rem',
                              display: 'block',
                            }}
                          >
                            Grupo *
                          </label>
                          <GroupSelect
                            value={assignment.group || ''}
                            onChange={(e) =>
                              updateAssignment(
                                team.id,
                                'group',
                                e.target.value || null,
                              )
                            }
                          >
                            <option value="">Seleccionar grupo</option>
                            {groups.map((group) => (
                              <option key={group} value={group}>
                                Grupo {group}
                              </option>
                            ))}
                          </GroupSelect>
                        </div>
                      )}
                    </div>
                  </AssignmentCard>
                )
              })}
            </AssignmentGrid>
          </AssignmentSection>
        )}
      />
      {errors.teamAssignments && (
        <ErrorMessage>{errors.teamAssignments.message}</ErrorMessage>
      )}
    </StepContainer>
  )
}

export default StepAssignments
