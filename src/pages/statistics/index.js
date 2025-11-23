import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { api } from './../../api'
import axios from 'axios'
import PageLoader from '../../components/PageLoader'
import { Oval } from 'react-loader-spinner'
import { format, parseISO } from 'date-fns'
import {
  HeaderContainer,
  Header,
  Title,
  Section,
  SectionTitle,
  SectionSubtitle,
  PlayersGrid,
  PlayerCard,
  PlayerName,
  StatRow,
  StatLabel,
  StatValue,
  StreakBadge,
  RecentMatches,
  RecentMatchDot,
  LeaderboardsGrid,
  LeaderboardCard,
  LeaderboardTitle,
  LeaderboardItem,
  Rank,
  LeaderboardPlayerName,
  LeaderboardValue,
  RecordsGrid,
  RecordCard,
  RecordTitle,
  RecordValue,
  RecordDetail,
  RecordHolders,
  HolderBadge,
  SpinnerContainer,
} from './styled'

const Statistics = () => {
  const [stats, setStats] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getStatistics = useCallback(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    axios
      .get(`${api}/statistics`, { signal: controller.signal })
      .then(({ data }) => {
        setStats(data)
        setLoading(false)
      })
      .catch((err) => {
        if (axios.isCancel?.(err) || err?.name === 'CanceledError') return
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
    if (type === 'W') return 'Victorias'
    if (type === 'D') return 'Empates'
    return 'Derrotas'
  }

  const getRecordLabel = (key) => {
    const labels = {
      highest_scoring_difference_match: 'Mayor diferencia de goles',
      highest_total_goals_match: 'Más goles en un partido',
      most_clean_sheets_in_a_row: 'Con valla invicta',
      most_consecutive_matches_scoring_1_plus_goals: 'Convirtiendo (+1 gol)',
      most_consecutive_matches_scoring_2_plus_goals: 'Convirtiendo (+2 goles)',
      most_consecutive_matches_scoring_3_plus_goals: 'Convirtiendo (+3 goles)',
      most_wins_in_a_row: 'Con victoria',
      most_draws_in_a_row: 'Con empate',
      most_losses_in_a_row: 'Con derrota',
    }
    return labels[key] || key
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

  if (loading) {
    return (
      <SpinnerContainer>
        <Oval
          height="80"
          width="80"
          color="var(--green-900)"
          ariaLabel="loading"
        />
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
    const { players, leaderboards, records } = stats

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <HeaderContainer>
          <Header>
            <Title>Estadísticas Generales</Title>
          </Header>

          {/* Players Section */}
          <Section>
            <SectionTitle>Estadísticas por Jugador</SectionTitle>
            <PlayersGrid>
              {players?.map((player) => (
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
                          {getStreakLabel(player.current_streak.type)}
                        </StreakBadge>
                      </div>
                    </div>
                  )}
                  {player.recent && player.recent.length > 0 && (
                    <RecentMatches title="Últimos resultados">
                      {player.recent.map((match, idx) => (
                        <RecentMatchDot
                          key={idx}
                          $outcome={match.outcome}
                          title={`${match.playerP1.name} (${
                            match.teamP1.name
                          }) ${match.scoreP1}-${match.scoreP2} ${
                            match.playerP2.name
                          } (${match.teamP2.name})
${match.tournament}
${format(parseISO(match.date), 'dd/MM/yyyy')}`}
                        />
                      ))}
                    </RecentMatches>
                  )}
                </PlayerCard>
              ))}
            </PlayersGrid>
          </Section>

          {/* Leaderboards Section */}
          <Section>
            <SectionTitle>Clasificaciones</SectionTitle>
            <LeaderboardsGrid>
              {leaderboards &&
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
                  .filter((key) => leaderboards[key])
                  .map((key) => {
                    const board = leaderboards[key]
                    return (
                      <LeaderboardCard key={key}>
                        <LeaderboardTitle>
                          {getLeaderboardLabel(key)}
                        </LeaderboardTitle>
                        {board.map((item, idx) => (
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
                              {key === 'effectiveness' ||
                              key.includes('Percentage')
                                ? '%'
                                : ''}
                            </LeaderboardValue>
                          </LeaderboardItem>
                        ))}
                      </LeaderboardCard>
                    )
                  })}
            </LeaderboardsGrid>
          </Section>

          {/* Match Records Section */}
          <Section>
            <SectionTitle>Récords de Partidos</SectionTitle>
            <RecordsGrid>
              {records &&
                Object.entries(records)
                  .filter(
                    ([key]) =>
                      key === 'highest_scoring_difference_match' ||
                      key === 'highest_total_goals_match',
                  )
                  .map(([key, record]) => (
                    <RecordCard key={key}>
                      <RecordTitle>{getRecordLabel(key)}</RecordTitle>
                      <RecordValue>
                        {record.count || record.diff || record.total}
                      </RecordValue>
                      {record.match && (
                        <RecordDetail>
                          <div>
                            <strong>{record.match.player1}</strong> (
                            {record.match.team1})
                          </div>
                          <div
                            style={{
                              fontSize: '1.1rem',
                              fontWeight: 700,
                              margin: '0.25rem 0',
                            }}
                          >
                            {record.match.score}
                          </div>
                          <div>
                            <strong>{record.match.player2}</strong> (
                            {record.match.team2})
                          </div>
                          <div
                            style={{
                              marginTop: '0.5rem',
                              fontSize: '0.85rem',
                              opacity: 0.8,
                            }}
                          >
                            {record.match.tournament}
                          </div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                            {format(parseISO(record.match.date), 'dd/MM/yyyy')}
                          </div>
                        </RecordDetail>
                      )}
                    </RecordCard>
                  ))}
            </RecordsGrid>
          </Section>

          {/* Streak Records Section */}
          <Section>
            <SectionTitle>Récords de Rachas</SectionTitle>
            <SectionSubtitle>Partidos consecutivos</SectionSubtitle>
            <RecordsGrid>
              {records &&
                Object.entries(records)
                  .filter(
                    ([key]) =>
                      key !== 'highest_scoring_difference_match' &&
                      key !== 'highest_total_goals_match',
                  )
                  .map(([key, record]) => {
                    // Find the oldest date (first to reach the record)
                    const oldestHolder = record.players?.reduce(
                      (oldest, current) => {
                        if (!oldest.date) return current
                        if (!current.date) return oldest
                        return new Date(current.date) < new Date(oldest.date)
                          ? current
                          : oldest
                      },
                      record.players[0],
                    )

                    return (
                      <RecordCard key={key}>
                        <RecordTitle>{getRecordLabel(key)}</RecordTitle>
                        <RecordValue>
                          {record.count || record.diff || record.total}
                        </RecordValue>
                        {oldestHolder?.date && (
                          <div
                            style={{
                              fontSize: '0.85rem',
                              opacity: 0.7,
                              textAlign: 'center',
                              marginTop: '0.25rem',
                            }}
                          >
                            {format(parseISO(oldestHolder.date), 'dd/MM/yyyy')}
                            {record.players.length > 1 &&
                              ` (${oldestHolder.name})`}
                          </div>
                        )}
                        {record.players && record.players.length > 0 && (
                          <RecordHolders>
                            {record.players.map((p) => (
                              <HolderBadge key={p.id} $isCurrent={p.is_current}>
                                {p.name} {p.is_current && '(Actual)'}
                              </HolderBadge>
                            ))}
                          </RecordHolders>
                        )}
                      </RecordCard>
                    )
                  })}
            </RecordsGrid>
          </Section>
        </HeaderContainer>
      </motion.div>
    )
  } else {
    return <PageLoader />
  }
}

export default Statistics
