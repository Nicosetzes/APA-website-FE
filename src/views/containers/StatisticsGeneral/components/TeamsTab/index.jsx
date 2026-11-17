import { database } from 'api'
import { apiClient, getApiErrorMessage } from 'api/axiosConfig'
import { Loader } from 'views/components'
import { SpinnerContainer } from '../../styled'
import { useEffect, useState } from 'react'
import {
  EmptyState,
  Leaderboard,
  LeaderboardHeader,
  Rank,
  Stat,
  TeamIdentity,
  TeamRow,
  TeamsGrid,
  TeamsSection,
} from './styled'

const isAbortError = (error) =>
  error?.name === 'CanceledError' || error?.name === 'AbortError'

const TeamLeaderboard = ({ title, description, rows, campaign }) => (
  <Leaderboard>
    <LeaderboardHeader>
      <h3>{title}</h3>
      <p>{description}</p>
    </LeaderboardHeader>
    {rows.length === 0 ? (
      <EmptyState>No hay datos suficientes.</EmptyState>
    ) : (
      rows.map((row, index) => (
        <TeamRow key={`${row.team.id}-${row.player?.id || 'all'}-${index}`}>
          <Rank>{index + 1}</Rank>
          <TeamIdentity>
            <img
              src={`${database}/logos/${row.team.id}`}
              alt={`Escudo de ${row.team.name}`}
            />
            <div>
              <strong>{row.team.name}</strong>
              {campaign && (
                <span>
                  {[row.player?.name, row.tournament?.name]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              )}
            </div>
          </TeamIdentity>
          <Stat>
            <strong>{campaign ? `${row.effectiveness}%` : row.points}</strong>
            <span>{campaign ? 'efectividad' : 'puntos'}</span>
          </Stat>
          <Stat $secondary>
            <strong>{row.played}</strong>
            <span>partidos</span>
          </Stat>
        </TeamRow>
      ))
    )}
  </Leaderboard>
)

const TeamsTab = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    apiClient
      .get('/statistics/teams', { signal: controller.signal })
      .then(({ data: responseData }) => {
        setData(responseData)
        setError(null)
      })
      .catch((requestError) => {
        if (isAbortError(requestError)) return
        setError(
          getApiErrorMessage(
            requestError,
            'No se pudieron cargar las estadísticas de equipos',
          ),
        )
      })
    return () => controller.abort()
  }, [])

  if (error) return <EmptyState $error>{error}</EmptyState>
  if (!data) {
    return (
      <SpinnerContainer
        role="status"
        aria-label="Cargando estadísticas de equipos"
      >
        <Loader />
      </SpinnerContainer>
    )
  }

  return (
    <TeamsSection>
      <h2>Equipos</h2>
      <TeamsGrid>
        <TeamLeaderboard
          title="Equipos históricos"
          description="Mayor cantidad de puntos acumulados."
          rows={data.completeStatsByTotalPoints || []}
        />
        <TeamLeaderboard
          title="Mejores campañas"
          description="Jugador y equipo con al menos diez partidos en un torneo."
          rows={data.completeStatsByEffectiveness || []}
          campaign
        />
      </TeamsGrid>
    </TeamsSection>
  )
}

export default TeamsTab
