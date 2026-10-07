import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Loader } from 'views/components'
import { apiClient } from 'api/axiosConfig'
import { database } from 'api'
import { motion } from 'framer-motion'
import {
  EmptyMessage,
  LeaderboardCard,
  LeaderboardsGrid,
  LeaderboardItem,
  LeaderboardPlayerName,
  LeaderboardTitle,
  LeaderboardValue,
  PlayerCard,
  PlayersGrid,
  PlayerName,
  Rank,
  RecentMatches,
  RecentMatchDot,
  Section,
  SectionTitle,
  SpinnerContainer,
  StatLabel,
  StatRow,
  StatValue,
  StreakBadge,
} from './styled'
import { PageLoader, Tabs, Tooltip } from 'views/components'
import { RecordsTab } from './components'
import { format, parseISO } from 'date-fns'
import { formatPlayedAt } from 'utils/playedAt'
import { useCallback, useEffect, useState } from 'react'

const StatisticsGeneral = () => {
  const [stats, setStats] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getStatistics = useCallback(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    apiClient
      .get('/statistics', { signal: controller.signal })
      .then(({ data }) => {
        setStats(data)
        setLoading(false)
      })
      .catch((err) => {
        if (err?.name === 'CanceledError' || err?.name === 'AbortError') return
        console.error(err)
        setError('No se pudieron cargar las estadísticas')
        setLoading(false)
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const cleanup = getStatistics()
    return cleanup
  }, [getStatistics])

  const getStreakLabel = (type) => {
    if (type === 'W') return 'Victoria'
    if (type === 'D') return 'Empate'
    return 'Derrota'
  }

  const getLeaderboardLabel = (key) => {
    const labels = {
      wins: 'Victorias',
      effectiveness: 'Efectividad',
      goalsFor: 'Goles a favor',
      cleanSheets: 'Vallas invictas',
      winPercentage: 'Victorias (%)',
      lossPercentage: 'Derrotas (%)',
      goalsForPerMatch: 'Goles a favor por partido',
      goalsAgainstPerMatch: 'Goles en contra por partido',
      cleanSheetsPercentage: 'Vallas invictas (%)',
      penaltyWins: 'Victorias por penales',
      winsWithUniqueTeams: 'Victorias con equipos únicos',
      matchesScoring3PlusGoals: 'Partidos convirtiendo +3 goles',
    }
    return labels[key] || key
  }

  const PlayersTab = () => (
    <Section>
      <SectionTitle>Estadísticas por Jugador</SectionTitle>
      <PlayersGrid>
        {stats?.players?.map((player) => (
          <PlayerCard key={player.player.id}>
            <PlayerName>{player.player.name}</PlayerName>
            <StatRow>
              <StatLabel>Partidos</StatLabel>
              <StatValue>{player.totalMatches}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Victorias</StatLabel>
              <StatValue>{player.wins}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Empates</StatLabel>
              <StatValue>{player.draws}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Derrotas</StatLabel>
              <StatValue>{player.losses}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Goles a favor</StatLabel>
              <StatValue>{player.goalsFor}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Goles en contra</StatLabel>
              <StatValue>{player.goalsAgainst}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Diferencia</StatLabel>
              <StatValue>
                {player.scoringDifference > 0 ? '+' : ''}
                {player.scoringDifference}
              </StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Efectividad</StatLabel>
              <StatValue>{player.effectiveness.toFixed(2)}%</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Vallas invictas</StatLabel>
              <StatValue>{player.cleanSheets}</StatValue>
            </StatRow>
            {player.current_streak && (
              <div style={{ marginTop: '0.75rem' }}>
                <div
                  style={{
                    color: 'rgba(0, 0, 0, 0.6)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    textAlign: 'center',
                  }}
                >
                  Racha actual
                </div>
                <div style={{ textAlign: 'center' }}>
                  <StreakBadge $type={player.current_streak.type}>
                    {player.current_streak.length}{' '}
                    {`${getStreakLabel(player.current_streak.type)}${
                      player.current_streak.length > 1 ? 's' : ''
                    }`}
                  </StreakBadge>
                </div>
              </div>
            )}
            {player.recent && player.recent.length > 0 && (
              <RecentMatches title="Últimos resultados">
                {player.recent.map((match, idx) => (
                  <Tooltip
                    key={idx}
                    title={
                      <>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            justifyContent: 'center',
                          }}
                        >
                          <img
                            src={`${database}/logos/${match.teamP1.id}`}
                            alt={match.teamP1.name}
                            style={{ width: '20px', height: '20px' }}
                          />
                          {match.playerP1.name} ({match.teamP1.name}){' '}
                          <strong>
                            {match.scoreP1}-{match.scoreP2}
                          </strong>{' '}
                          {match.playerP2.name} ({match.teamP2.name})
                          <img
                            src={`${database}/logos/${match.teamP2.id}`}
                            alt={match.teamP2.name}
                            style={{ width: '20px', height: '20px' }}
                          />
                        </div>
                        <div
                          style={{
                            marginTop: '0.25rem',
                            fontSize: '0.7rem',
                            opacity: 0.8,
                          }}
                        >
                          {match.tournament}
                        </div>
                        <div
                          style={{
                            fontSize: '0.7rem',
                            opacity: 0.7,
                            textAlign: 'right',
                          }}
                        >
                          {formatPlayedAt(match.date, match.datePrecision) ||
                            format(parseISO(match.date), 'dd/MM/yyyy')}
                        </div>
                      </>
                    }
                  >
                    <RecentMatchDot $outcome={match.outcome} />
                  </Tooltip>
                ))}
              </RecentMatches>
            )}
          </PlayerCard>
        ))}
      </PlayersGrid>
    </Section>
  )

  const LeaderboardsTab = () => (
    <Section>
      <SectionTitle>Clasificaciones</SectionTitle>
      <LeaderboardsGrid>
        {stats?.leaderboards &&
          [
            'wins',
            'effectiveness',
            'goalsFor',
            'winsWithUniqueTeams',
            'winPercentage',
            'lossPercentage',
            'goalsForPerMatch',
            'goalsAgainstPerMatch',
            'cleanSheets',
            'cleanSheetsPercentage',
            'matchesScoring3PlusGoals',
            'penaltyWins',
          ]
            .filter((key) => stats.leaderboards[key])
            .map((key) => {
              const board = stats.leaderboards[key]
              return (
                <LeaderboardCard key={key}>
                  <LeaderboardTitle>
                    {getLeaderboardLabel(key)}
                  </LeaderboardTitle>
                  {board.length === 0 ? (
                    <EmptyMessage>
                      Requiere al menos un partido jugado.
                    </EmptyMessage>
                  ) : (
                    board.map((item, idx) => (
                      <LeaderboardItem key={item.player.id} $rank={idx + 1}>
                        <Rank $rank={idx + 1}>{idx + 1}</Rank>
                        <LeaderboardPlayerName>
                          {item.player.name}
                        </LeaderboardPlayerName>
                        <LeaderboardValue>
                          {item[key] !== undefined
                            ? key === 'effectiveness' ||
                              key.includes('PerMatch')
                              ? typeof item[key] === 'number'
                                ? item[key].toFixed(2)
                                : item[key]
                              : item[key]
                            : '-'}
                          {key === 'effectiveness' || key.includes('Percentage')
                            ? '%'
                            : ''}
                        </LeaderboardValue>
                      </LeaderboardItem>
                    ))
                  )}
                </LeaderboardCard>
              )
            })}
      </LeaderboardsGrid>
    </Section>
  )

  const DecisiveMatchesTab = () => (
    <Section>
      <SectionTitle>
        Partidos Decisivos
        <Tooltip title="Partidos de eliminatoria (Playin / Playoffs)">
          <HelpOutlineIcon
            sx={{
              fontSize: '1rem',
              marginLeft: '0.5rem',
              cursor: 'pointer',
              verticalAlign: 'middle',
              opacity: 0.7,
            }}
          />
        </Tooltip>
      </SectionTitle>
      <PlayersGrid>
        {stats?.decisiveMatchesStats?.map((player) => (
          <PlayerCard key={player.player.id}>
            <PlayerName>{player.player.name}</PlayerName>
            <StatRow>
              <StatLabel>Partidos</StatLabel>
              <StatValue>{player.played}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Victorias</StatLabel>
              <StatValue>{player.wins}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Empates</StatLabel>
              <StatValue>{player.draws}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Derrotas</StatLabel>
              <StatValue>{player.losses}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Goles a favor</StatLabel>
              <StatValue>{player.goalsFor}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Goles en contra</StatLabel>
              <StatValue>{player.goalsAgainst}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Diferencia</StatLabel>
              <StatValue>
                {player.goalDifference > 0 ? '+' : ''}
                {player.goalDifference}
              </StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>% Victorias</StatLabel>
              <StatValue>{player.winPercentage.toFixed(2)}%</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Victorias por penales</StatLabel>
              <StatValue>{player.penaltyWins}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Derrotas por penales</StatLabel>
              <StatValue>{player.penaltyLosses}</StatValue>
            </StatRow>
          </PlayerCard>
        ))}
      </PlayersGrid>
    </Section>
  )

  if (loading) {
    return (
      <SpinnerContainer>
        <Loader />
      </SpinnerContainer>
    )
  }

  if (error) {
    return (
      <div
        style={{
          color: 'crimson',
          display: 'flex',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        {error}
      </div>
    )
  }

  if (stats) {
    const tabs = [
      {
        id: 'players',
        label: 'Jugadores',
        content: <PlayersTab />,
      },
      {
        id: 'decisive',
        label: 'Partidos Decisivos',
        content: <DecisiveMatchesTab />,
      },
      {
        id: 'leaderboards',
        label: 'Clasificaciones',
        content: <LeaderboardsTab />,
      },
      {
        id: 'records',
        label: 'Récords',
        content: (
          <RecordsTab
            records={stats.records}
            activeStreaks={stats.activeStreaks}
          />
        ),
      },
    ]

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Tabs tabs={tabs} defaultTab="players" />
      </motion.div>
    )
  } else {
    return <PageLoader />
  }
}

export default StatisticsGeneral
