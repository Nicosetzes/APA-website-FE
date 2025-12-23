import { useState, useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import styled from 'styled-components'
import axios from 'axios'
import { database } from 'api'
import {
  StepContainer,
  StepTitle,
  StepDescription,
  LeaguesGrid,
  LeagueCard,
  LeagueName,
  CountryName,
  TeamsSection,
  TeamsSectionTitle,
  TeamsGrid,
  TeamCard,
  TeamImage,
  TeamName,
  ErrorMessage,
  Badge,
} from './styled'

const SelectAllButton = styled.button`
  padding: 0.5rem 1rem;
  background: var(--blue-900);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #0d2b3a;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`

const StepLeagues = ({ leagues }) => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext()

  const [availableTeams, setAvailableTeams] = useState([])
  const selectedLeagues = watch('selectedLeagues') || []
  const selectedTeams = watch('selectedTeams') || []
  const format = watch('format')

  useEffect(() => {
    const fetchTeams = async () => {
      if (selectedLeagues.length === 0) {
        setAvailableTeams([])
        setValue('teamsData', [])
        return
      }

      try {
        const teamPromises = selectedLeagues.map((leagueId) =>
          axios.get(`${database}/leagues/${leagueId}/teams`),
        )
        const responses = await Promise.all(teamPromises)
        const allTeams = responses.flatMap((res) => res.data)
        setAvailableTeams(allTeams)
      } catch (error) {
        console.error('Error fetching teams:', error)
      }
    }

    fetchTeams()
  }, [selectedLeagues, setValue])

  // Update teamsData whenever selectedTeams changes
  useEffect(() => {
    const selectedTeamsData = availableTeams.filter(({ team }) =>
      selectedTeams.includes(team.id),
    )
    setValue('teamsData', selectedTeamsData)
  }, [selectedTeams, availableTeams, setValue])

  const selectAllTeamsFromLeague = (leagueId) => {
    const teamsFromLeague = availableTeams
      .filter(({ league }) => league.id === leagueId)
      .map(({ team }) => team.id)

    const newSelectedTeams = [
      ...new Set([...selectedTeams, ...teamsFromLeague]),
    ]
    setValue('selectedTeams', newSelectedTeams)
  }

  const deselectAllTeamsFromLeague = (leagueId) => {
    const teamsFromLeague = availableTeams
      .filter(({ league }) => league.id === leagueId)
      .map(({ team }) => team.id)

    const newSelectedTeams = selectedTeams.filter(
      (teamId) => !teamsFromLeague.includes(teamId),
    )
    setValue('selectedTeams', newSelectedTeams)
  }

  const getLeagueTeamsCount = (leagueId) => {
    return availableTeams.filter(({ league }) => league.id === leagueId).length
  }

  const getSelectedLeagueTeamsCount = (leagueId) => {
    const teamsFromLeague = availableTeams
      .filter(({ league }) => league.id === leagueId)
      .map(({ team }) => team.id)

    return teamsFromLeague.filter((teamId) => selectedTeams.includes(teamId))
      .length
  }

  return (
    <StepContainer>
      <StepTitle>Seleccionar Ligas y Equipos</StepTitle>
      <StepDescription>
        Primero elige las ligas y luego selecciona los equipos participantes
      </StepDescription>

      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          <h3
            style={{ margin: 0, fontSize: '1.25rem', color: 'var(--blue-900)' }}
          >
            Ligas Disponibles
          </h3>
          {selectedLeagues.length > 0 && (
            <Badge>
              {selectedLeagues.length} seleccionada
              {selectedLeagues.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <Controller
          name="selectedLeagues"
          control={control}
          rules={{
            validate: (value) =>
              value?.length >= 1 || 'Debes seleccionar al menos 1 liga',
          }}
          render={({ field }) => (
            <LeaguesGrid>
              {leagues.map((league) => {
                const isSelected = field.value?.includes(league.id)
                return (
                  <LeagueCard
                    key={league.id}
                    $selected={isSelected}
                    onClick={() => {
                      const currentValue = field.value || []
                      if (isSelected) {
                        const newLeagues = currentValue.filter(
                          (id) => id !== league.id,
                        )
                        field.onChange(newLeagues)
                        // Remove teams from this league
                        const teamsToRemove = availableTeams
                          .filter((team) => team.league.id === league.id)
                          .map((team) => team.id)
                        setValue(
                          'selectedTeams',
                          selectedTeams.filter(
                            (id) => !teamsToRemove.includes(id),
                          ),
                        )
                      } else {
                        field.onChange([...currentValue, league.id])
                      }
                    }}
                  >
                    <LeagueName>{league.name}</LeagueName>
                    <CountryName>
                      {league.country} {`(${league.year})`}
                    </CountryName>
                  </LeagueCard>
                )
              })}
            </LeaguesGrid>
          )}
        />
        {errors.selectedLeagues && (
          <ErrorMessage>{errors.selectedLeagues.message}</ErrorMessage>
        )}
      </div>

      {availableTeams.length > 0 && (
        <TeamsSection>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <TeamsSectionTitle>Equipos Disponibles</TeamsSectionTitle>
            {selectedTeams.length > 0 && (
              <Badge $variant="success">
                {selectedTeams.length} seleccionado
                {selectedTeams.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <Controller
            name="selectedTeams"
            control={control}
            rules={{
              validate: (value) => {
                if (!value || value.length < 2) {
                  return 'Debes seleccionar al menos 2 equipos'
                }
                if (format === 'champions_league' && value.length < 32) {
                  return `Champions League requiere 32 equipos (4 por cada uno de los 8 grupos). Actualmente: ${value.length} equipos`
                }
                if (format === 'playoff' && value.length !== 32) {
                  return `Playoffs requiere exactamente 32 equipos. Actualmente: ${value.length} equipos`
                }
                return true
              },
            }}
            render={({ field }) => (
              <>
                {selectedLeagues.map((leagueId) => {
                  const league = leagues.find((l) => l.id === leagueId)
                  const leagueTeams = availableTeams
                    .filter(({ league }) => league.id === leagueId)
                    .sort((a, b) => (a.team.name > b.team.name ? 1 : -1))

                  const allSelected =
                    getSelectedLeagueTeamsCount(leagueId) ===
                    getLeagueTeamsCount(leagueId)

                  if (leagueTeams.length === 0) return null

                  return (
                    <div key={leagueId} style={{ marginBottom: '2rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '1rem',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                          }}
                        >
                          <h4 style={{ margin: 0, color: 'var(--blue-900)' }}>
                            {league?.name || 'Liga'}
                          </h4>
                          <Badge>
                            {getSelectedLeagueTeamsCount(leagueId)} /{' '}
                            {getLeagueTeamsCount(leagueId)}
                          </Badge>
                        </div>
                        <SelectAllButton
                          type="button"
                          onClick={() => {
                            if (allSelected) {
                              deselectAllTeamsFromLeague(leagueId)
                            } else {
                              selectAllTeamsFromLeague(leagueId)
                            }
                          }}
                        >
                          {allSelected
                            ? 'Deseleccionar Todos'
                            : 'Seleccionar Todos'}
                        </SelectAllButton>
                      </div>
                      <TeamsGrid>
                        {leagueTeams.map(({ team }) => {
                          const isSelected = field.value?.includes(team.id)
                          return (
                            <TeamCard
                              key={team.id}
                              $selected={isSelected}
                              onClick={() => {
                                const currentValue = field.value || []
                                if (isSelected) {
                                  field.onChange(
                                    currentValue.filter((id) => id !== team.id),
                                  )
                                } else {
                                  field.onChange([...currentValue, team.id])
                                }
                              }}
                            >
                              <TeamImage
                                src={`${database}/logos/${team.id}`}
                                alt={team.name}
                              />
                              <TeamName>{team.name}</TeamName>
                            </TeamCard>
                          )
                        })}
                      </TeamsGrid>
                    </div>
                  )
                })}
              </>
            )}
          />
          {errors.selectedTeams && (
            <ErrorMessage>{errors.selectedTeams.message}</ErrorMessage>
          )}
        </TeamsSection>
      )}
    </StepContainer>
  )
}

export default StepLeagues
