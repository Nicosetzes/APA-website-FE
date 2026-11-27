import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Loader } from 'views/components'
import { apiClient } from 'api/axiosConfig'
import { database } from 'api'
import { formatDate } from 'utils/dates'
import { formatPlayedAt } from 'utils/playedAt'
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
import { Tabs, Tooltip } from 'views/components'
import {
  HeadToHeadTab,
  RatingTab,
  RecentFormTab,
  RecordsTab,
  SurprisesTab,
  TeamsTab,
  TournamentsTab,
} from './components'
import {
  formatRating,
  indexRatingsByPlayer,
  orderByRating,
} from 'utils/ratings'
import { RATING_TAB_PARAMS } from 'utils/ratingHistory'
import {
  OBSOLETE_UPSETS_TAB_PARAMS,
  UPSETS_TAB_PARAMS,
} from 'utils/ratingUpsets'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const DEFAULT_TAB = 'rating'
const TAB_IDS = [
  DEFAULT_TAB,
  'tournaments',
  'recent-form',
  'head-to-head',
  'surprises',
  'records',
  'players',
  'teams',
  'leaderboards',
]

const HEAD_TO_HEAD_TAB_PARAMS = [
  'playerA',
  'playerB',
  'h2hStage',
  'h2hTournamentId',
  'h2hPeriod',
  'h2hDateFrom',
  'h2hDateTo',
]

const STATISTICS_ENDPOINTS = {
  players: '/statistics/players',
  leaderboards: '/statistics/leaderboards',
  records: '/statistics/records',
}

const isAbortError = (err) =>
  err?.name === 'CanceledError' || err?.name === 'AbortError'

const StatisticsGeneral = () => {
  const [stats, setStats] = useState({})
  const [loadedSections, setLoadedSections] = useState([])
  const [ratings, setRatings] = useState()
  // Reinados en el #1 (`/ratings/reigns`, pestaña Récords). `undefined`: sin
  // pedir; `null`: falló (los récords se muestran igual, sin esa tarjeta).
  const [reigns, setReigns] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const tabParam = searchParams.get('tab')
  const activeTab = TAB_IDS.includes(tabParam) ? tabParam : DEFAULT_TAB

  // La pestaña activa vive en la URL (`tab`; ausente = Rating APA). Al
  // cambiar de pestaña se descartan los filtros de la de Rating APA.
  const handleTabChange = (id) => {
    const params = new URLSearchParams(searchParams)
    RATING_TAB_PARAMS.forEach((name) => params.delete(name))
    if (id !== 'head-to-head') {
      HEAD_TO_HEAD_TAB_PARAMS.forEach((name) => params.delete(name))
    }
    OBSOLETE_UPSETS_TAB_PARAMS.forEach((name) => params.delete(name))
    if (id !== 'surprises') {
      UPSETS_TAB_PARAMS.forEach((name) => params.delete(name))
    }
    if (id === DEFAULT_TAB) params.delete('tab')
    else params.set('tab', id)
    setSearchParams(params)
  }

  useEffect(() => {
    const statsEndpoint = STATISTICS_ENDPOINTS[activeTab]
    const needsRatings = activeTab === DEFAULT_TAB || activeTab === 'players'
    const shouldLoadStats = statsEndpoint && !loadedSections.includes(activeTab)
    const shouldLoadRatings = needsRatings && ratings === undefined
    const shouldLoadReigns = activeTab === 'records' && reigns === undefined
    if (!shouldLoadStats && !shouldLoadRatings && !shouldLoadReigns) {
      setLoading(false)
      return undefined
    }

    const controller = new AbortController()
    const requests = []
    setLoading(true)
    setError(null)

    if (shouldLoadStats) {
      requests.push(
        apiClient
          .get(statsEndpoint, { signal: controller.signal })
          .then(({ data }) => ({ type: 'stats', section: activeTab, data })),
      )
    }
    if (shouldLoadRatings) {
      requests.push(
        apiClient
          .get('/ratings', { signal: controller.signal })
          .then(({ data }) => ({ type: 'ratings', data: data.data }))
          .catch((err) => {
            if (isAbortError(err)) throw err
            console.error(err)
            return { type: 'ratings', data: null }
          }),
      )
    }

    if (shouldLoadReigns) {
      requests.push(
        apiClient
          .get('/ratings/reigns', { signal: controller.signal })
          .then(({ data }) => ({ type: 'reigns', data: data.data ?? null }))
          .catch((err) => {
            if (isAbortError(err)) throw err
            console.error(err)
            return { type: 'reigns', data: null }
          }),
      )
    }
    Promise.all(requests)
      .then((results) => {
        if (controller.signal.aborted) return
        results.forEach((result) => {
          if (result.type === 'stats') {
            setStats((current) => ({ ...current, ...result.data }))
            setLoadedSections((current) =>
              current.includes(result.section)
                ? current
                : [...current, result.section],
            )
          }
          if (result.type === 'ratings') setRatings(result.data)
          if (result.type === 'reigns') setReigns(result.data)
        })
        setLoading(false)
      })
      .catch((err) => {
        if (isAbortError(err) || controller.signal.aborted) return
        console.error(err)
        setError('No se pudieron cargar las estadísticas')
        setLoading(false)
      })

    return () => controller.abort()
  }, [activeTab, loadedSections, ratings, reigns])

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

  const ratingsByPlayer = indexRatingsByPlayer(ratings ?? [])
  const orderedPlayers = orderByRating(stats?.players ?? [], ratings ?? [])

  const PlayersTab = () => (
    <Section>
      <SectionTitle>Estadísticas por Jugador</SectionTitle>
      <PlayersGrid>
        {orderedPlayers.map((player) => (
          <PlayerCard key={player.player.id}>
            <PlayerName>{player.player.name}</PlayerName>
            {ratingsByPlayer.has(String(player.player.id)) && (
              <StatRow>
                <StatLabel>Elo</StatLabel>
                <StatValue>
                  {formatRating(
                    ratingsByPlayer.get(String(player.player.id)).rating,
                  )}
                </StatValue>
              </StatRow>
            )}
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
                            formatDate(match.date)}
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
        Partidos de eliminación
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

  const loadingContent = (
    <SpinnerContainer role="status" aria-label="Cargando estadísticas">
      <Loader />
    </SpinnerContainer>
  )
  const errorContent = (
    <div
      role="alert"
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
  const withStats = (content, section) =>
    loadedSections.includes(section)
      ? content
      : error
      ? errorContent
      : loadingContent

  const tabs = [
    {
      id: DEFAULT_TAB,
      label: 'Rating APA',
      content:
        ratings !== undefined ? (
          <RatingTab ratings={ratings} />
        ) : error ? (
          errorContent
        ) : (
          loadingContent
        ),
    },
    {
      id: 'tournaments',
      label: 'Torneos',
      content: <TournamentsTab />,
    },
    {
      id: 'recent-form',
      label: 'Forma reciente',
      content: <RecentFormTab />,
    },
    {
      id: 'head-to-head',
      label: 'Mano a mano',
      content: <HeadToHeadTab />,
    },
    {
      id: 'surprises',
      label: 'Sorpresas',
      content: <SurprisesTab />,
    },
    {
      id: 'records',
      label: 'Récords',
      content: withStats(
        <RecordsTab
          records={stats?.records}
          activeStreaks={stats?.activeStreaks}
          reigns={reigns}
        />,
        'records',
      ),
    },
    {
      id: 'players',
      label: 'Jugadores',
      content: withStats(
        <>
          <PlayersTab />
          <DecisiveMatchesTab />
        </>,
        'players',
      ),
    },
    {
      id: 'teams',
      label: 'Equipos',
      content: <TeamsTab />,
    },
    {
      id: 'leaderboards',
      label: 'Clasificaciones',
      content: withStats(<LeaderboardsTab />, 'leaderboards'),
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-busy={loading}
    >
      <Tabs
        tabs={tabs}
        defaultTab={DEFAULT_TAB}
        activeTab={activeTab}
        onChange={handleTabChange}
      />
    </motion.div>
  )
}

export default StatisticsGeneral
