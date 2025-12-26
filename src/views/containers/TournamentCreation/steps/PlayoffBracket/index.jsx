import { useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { database } from 'api'
import {
  StepContainer,
  StepTitle,
  StepDescription,
  ErrorMessage,
} from './styled'
import {
  BracketContainer,
  BracketColumn,
  BracketColumnTitle,
  BracketMatch,
  BracketSlot,
  TeamSlotCard,
  TeamSlotImage,
  TeamSlotInfo,
  TeamSlotName,
  PlayerSelect,
  RemoveButton,
} from './styled'

const StepPlayoffBracket = ({ players }) => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext()

  const selectedPlayers = watch('selectedPlayers') || []
  const teamsData = watch('teamsData') || []
  const playoffBracket = watch('playoffBracket') || []

  const availablePlayers = players.filter((p) => selectedPlayers.includes(p.id))

  console.log(availablePlayers)

  // Initialize bracket with 16 matches (32 slots) if empty
  useEffect(() => {
    if (playoffBracket.length === 0 && teamsData.length > 0) {
      const initialBracket = Array.from({ length: 16 }, (_, i) => ({
        playoff_id: i + 1,
        slot1: null, // { teamId, teamName, playerId: { id, name } }
        slot2: null,
      }))
      setValue('playoffBracket', initialBracket)
    }
  }, [playoffBracket.length, teamsData.length, setValue])

  const updateSlot = (matchIndex, slotKey, teamId, playerId) => {
    console.log('updateSlot called:', { matchIndex, slotKey, teamId, playerId })
    const updatedBracket = [...playoffBracket]

    if (!teamId) {
      // Remove team from slot
      updatedBracket[matchIndex][slotKey] = null
    } else {
      const teamData = teamsData.find(({ team }) => team.id === teamId)
      let playerData = null

      if (playerId) {
        const player = availablePlayers.find((p) => p.id === playerId)
        console.log('Found player:', player)
        playerData = player ? { id: player.id, name: player.name } : null
      }

      updatedBracket[matchIndex][slotKey] = {
        teamId,
        teamName: teamData?.team?.name || '',
        playerId: playerData,
      }
      console.log('Updated slot:', updatedBracket[matchIndex][slotKey])
    }

    setValue('playoffBracket', updatedBracket, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const getAvailableTeams = () => {
    // Teams that haven't been placed in the bracket yet
    const placedTeamIds = playoffBracket
      .flatMap((match) => [match.slot1?.teamId, match.slot2?.teamId])
      .filter(Boolean)

    return teamsData.filter(({ team }) => !placedTeamIds.includes(team.id))
  }

  const getTeamSelectOptions = (currentTeamId) => {
    const availableTeams = getAvailableTeams()
    const currentTeam = currentTeamId
      ? teamsData.find(({ team }) => team.id === currentTeamId)
      : null

    // Include current team in options even if it's placed
    const options = currentTeam
      ? [currentTeam, ...availableTeams]
      : availableTeams

    return options
  }

  const renderMatch = (match) => {
    const globalIndex = playoffBracket.findIndex(
      (m) => m.playoff_id === match.playoff_id,
    )

    return (
      <BracketMatch key={match.playoff_id}>
        {/* Slot 1 */}
        <BracketSlot>
          {match.slot1 ? (
            <TeamSlotCard>
              <TeamSlotImage
                src={`${database}/logos/${match.slot1.teamId}`}
                alt={match.slot1.teamName}
              />
              <TeamSlotInfo>
                <TeamSlotName>{match.slot1.teamName}</TeamSlotName>
                <PlayerSelect
                  value={match.slot1.playerId?.id || ''}
                  onChange={(e) => {
                    const selectedPlayerId = e.target.value
                    updateSlot(
                      globalIndex,
                      'slot1',
                      match.slot1.teamId,
                      selectedPlayerId,
                    )
                  }}
                >
                  <option value="">Jugador</option>
                  {availablePlayers.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </PlayerSelect>
              </TeamSlotInfo>
              <RemoveButton
                onClick={() => updateSlot(globalIndex, 'slot1', null)}
              >
                ×
              </RemoveButton>
            </TeamSlotCard>
          ) : (
            <PlayerSelect
              value=""
              onChange={(e) => {
                const teamId = parseInt(e.target.value)
                if (teamId) updateSlot(globalIndex, 'slot1', teamId, null)
              }}
            >
              <option value="">Seleccionar equipo</option>
              {getTeamSelectOptions().map(({ team }) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </PlayerSelect>
          )}
        </BracketSlot>

        {/* Slot 2 */}
        <BracketSlot>
          {match.slot2 ? (
            <TeamSlotCard>
              <TeamSlotImage
                src={`${database}/logos/${match.slot2.teamId}`}
                alt={match.slot2.teamName}
              />
              <TeamSlotInfo>
                <TeamSlotName>{match.slot2.teamName}</TeamSlotName>
                <PlayerSelect
                  value={match.slot2.playerId?.id || ''}
                  onChange={(e) => {
                    const selectedPlayerId = e.target.value || null
                    updateSlot(
                      globalIndex,
                      'slot2',
                      match.slot2.teamId,
                      selectedPlayerId,
                    )
                  }}
                >
                  <option value="">Jugador</option>
                  {availablePlayers.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </PlayerSelect>
              </TeamSlotInfo>
              <RemoveButton
                onClick={() => updateSlot(globalIndex, 'slot2', null)}
              >
                ×
              </RemoveButton>
            </TeamSlotCard>
          ) : (
            <PlayerSelect
              value=""
              onChange={(e) => {
                const teamId = parseInt(e.target.value)
                if (teamId) updateSlot(globalIndex, 'slot2', teamId, null)
              }}
            >
              <option value="">Seleccionar equipo</option>
              {getTeamSelectOptions().map(({ team }) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </PlayerSelect>
          )}
        </BracketSlot>
      </BracketMatch>
    )
  }

  return (
    <StepContainer>
      <StepTitle>Bracket de Playoffs</StepTitle>
      <StepDescription>
        Coloca los 32 equipos en los 16 enfrentamientos de la primera ronda y
        asigna jugadores a cada equipo
      </StepDescription>

      <Controller
        name="playoffBracket"
        control={control}
        rules={{
          validate: (value) => {
            if (!value || value.length !== 16) {
              return 'Error en la configuración del bracket'
            }

            // Check all 32 slots are filled
            const totalSlots = value.reduce((count, match) => {
              return count + (match.slot1 ? 1 : 0) + (match.slot2 ? 1 : 0)
            }, 0)

            if (totalSlots !== 32) {
              return `Debes colocar los 32 equipos en el bracket. Actualmente: ${totalSlots} equipos`
            }

            // Check all teams have players assigned
            const teamsWithoutPlayers = []
            value.forEach((match, idx) => {
              if (
                match.slot1 &&
                (!match.slot1.playerId || !match.slot1.playerId.id)
              ) {
                teamsWithoutPlayers.push(`Match ${idx + 1} - Slot 1`)
              }
              if (
                match.slot2 &&
                (!match.slot2.playerId || !match.slot2.playerId.id)
              ) {
                teamsWithoutPlayers.push(`Match ${idx + 1} - Slot 2`)
              }
            })

            if (teamsWithoutPlayers.length > 0) {
              console.log('Teams without players:', teamsWithoutPlayers)
              console.log('Bracket data:', JSON.stringify(value, null, 2))
              return 'Todos los equipos deben tener un jugador asignado'
            }

            return true
          },
        }}
        render={() => (
          <BracketContainer>
            {/* Left side - Matches 1-8 */}
            <BracketColumn>
              <BracketColumnTitle>Primera Ronda (1-8)</BracketColumnTitle>
              {playoffBracket.slice(0, 8).map((match) => renderMatch(match))}
            </BracketColumn>

            {/* Right side - Matches 9-16 */}
            <BracketColumn>
              <BracketColumnTitle>Primera Ronda (9-16)</BracketColumnTitle>
              {playoffBracket.slice(8, 16).map((match) => renderMatch(match))}
            </BracketColumn>
          </BracketContainer>
        )}
      />

      {errors.playoffBracket && (
        <ErrorMessage>{errors.playoffBracket.message}</ErrorMessage>
      )}

      <div
        style={{
          marginTop: '1rem',
          color: 'var(--blue-900)',
          fontSize: '0.875rem',
        }}
      >
        Equipos restantes: {getAvailableTeams().length}
      </div>
    </StepContainer>
  )
}

export default StepPlayoffBracket
