import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { database } from 'api'
import { apiClient, getApiErrorMessage } from 'api/axiosConfig'
import {
  getPeriodOptions,
  getShortcutRange,
  getTodayArgentina,
} from 'utils/ratingHistory'
import { Loader } from 'views/components'
import { SpinnerContainer } from '../../styled'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  AllMatchesLink,
  BackButton,
  BestWinCard,
  BestWinCompact,
  BestWins,
  ComparisonBar,
  ComparisonSide,
  DetailPanel,
  EmptyState,
  ErrorState,
  FilterBar,
  HeadToHeadSection,
  MatchItem,
  MatchList,
  Metric,
  MetricsGrid,
  PairCard,
  PairGrid,
  PairPlayer,
  PairSummary,
  ScoreCenter,
  Scoreboard,
  SelectField,
  TeamScore,
} from './styled'

const isAbortError = (error) =>
  error?.name === 'CanceledError' || error?.name === 'AbortError'

const STAGE_LABELS = {
  regular: 'Fase regular',
  playin: 'Play-in',
  playoff: 'Playoffs',
}

const ROUND_LABELS = {
  round_of_32: '16avos de final',
  round_of_16: 'Octavos de final',
  quarterfinal: 'Cuartos de final',
  semifinal: 'Semifinal',
  final: 'Final',
}

const PERIOD_SLUGS = [
  'ultimo-mes',
  'ultimos-3-meses',
  'ultimos-6-meses',
  'ultimo-anio',
  'todo',
]

const signed = (value) => `${value > 0 ? '+' : ''}${value}`
const formatRound = (round) => ROUND_LABELS[round] || round

const formatDisplayDate = (value) => {
  if (!value) return value
  const approximate = value.startsWith('aprox. ')
  const raw = approximate ? value.slice(7) : value
  const parts = raw.split('-')
  const formatted =
    parts.length === 3
      ? `${parts[2]}-${parts[1]}-${parts[0]}`
      : parts.length === 2
      ? `${parts[1]}-${parts[0]}`
      : raw
  return approximate ? `aprox. ${formatted}` : formatted
}

const resultLabel = (streak) => {
  if (!streak) return 'Sin racha actual'
  if (streak.result === 'draw')
    return `${streak.count} ${streak.count === 1 ? 'empate' : 'empates'}`
  return `${streak.player}: ${streak.count} ${
    streak.count === 1 ? 'victoria' : 'victorias'
  }`
}

const TeamLogo = ({ id, name }) =>
  id === null || id === undefined ? null : (
    <img
      src={`${database}/logos/${id}`}
      alt={`Escudo de ${name || 'equipo'}`}
    />
  )

const SummaryBestWin = ({ label, win }) => (
  <BestWinCompact>
    <span>{label}</span>
    {win ? (
      <TeamScore>
        <TeamLogo id={win.winnerTeam?.id} name={win.winnerTeam?.name} />
        <strong>{win.score}</strong>
        <TeamLogo id={win.loserTeam?.id} name={win.loserTeam?.name} />
      </TeamScore>
    ) : (
      <strong>Sin victorias</strong>
    )}
  </BestWinCompact>
)

const DetailBestWin = ({ player, win }) => (
  <BestWinCard>
    <span>Mayor victoria de {player}</span>
    {win ? (
      <>
        <TeamScore>
          <TeamLogo id={win.winnerTeamId} name={win.winnerTeam} />
          <strong>{win.score}</strong>
          <TeamLogo id={win.loserTeamId} name={win.loserTeam} />
        </TeamScore>
        <small>
          {[win.winnerTeam, win.tournament, formatDisplayDate(win.playedOn)]
            .filter(Boolean)
            .join(' · ')}
        </small>
      </>
    ) : (
      <strong>Sin victorias</strong>
    )}
  </BestWinCard>
)

const HeadToHeadTab = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [summary, setSummary] = useState(null)
  const [summaryError, setSummaryError] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)
  const [tournaments, setTournaments] = useState([])

  const playerA = searchParams.get('playerA') || ''
  const playerB = searchParams.get('playerB') || ''
  const stage = searchParams.get('h2hStage') || ''
  const tournamentId = searchParams.get('h2hTournamentId') || ''
  const periodSlug = searchParams.get('h2hPeriod') || 'todo'
  const dateFrom = searchParams.get('h2hDateFrom') || ''
  const dateTo = searchParams.get('h2hDateTo') || ''
  const hasSelectedPair = Boolean(playerA && playerB && playerA !== playerB)

  const today = getTodayArgentina()
  const periodOptions = useMemo(() => {
    const { shortcuts, years } = getPeriodOptions(today)
    const visibleShortcuts = shortcuts.filter(
      ({ slug }) => PERIOD_SLUGS.includes(slug) && slug !== 'todo',
    )
    const allHistory = shortcuts.find(({ slug }) => slug === 'todo')
    return [allHistory, ...visibleShortcuts, ...years].filter(Boolean)
  }, [today])

  const setFilters = useCallback(
    (changes) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(changes).forEach(([key, value]) => {
        if (value) params.set(key, value)
        else params.delete(key)
      })
      setSearchParams(params)
    },
    [searchParams, setSearchParams],
  )

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      apiClient.get('/statistics/head-to-head', {
        signal: controller.signal,
      }),
      apiClient
        .get('/tournaments', { signal: controller.signal })
        .catch((error) => {
          if (isAbortError(error)) throw error
          return { data: [] }
        }),
    ])
      .then(([summaryResponse, tournamentsResponse]) => {
        setSummary(summaryResponse.data)
        setTournaments(tournamentsResponse.data || [])
        setSummaryError(null)
      })
      .catch((error) => {
        if (isAbortError(error)) return
        setSummaryError(
          getApiErrorMessage(error, 'No se pudo cargar el historial APA'),
        )
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!hasSelectedPair) {
      setDetail(null)
      setDetailError(null)
      return undefined
    }

    const controller = new AbortController()
    setDetailLoading(true)
    setDetailError(null)

    apiClient
      .get(
        `/statistics/head-to-head/${encodeURIComponent(
          playerA,
        )}/${encodeURIComponent(playerB)}`,
        {
          params: {
            stage: stage || undefined,
            tournamentId: tournamentId || undefined,
            dateFrom: dateFrom || undefined,
            dateTo: dateTo || undefined,
            limit: 10,
          },
          signal: controller.signal,
        },
      )
      .then(({ data }) => {
        setDetail(data)
        setDetailLoading(false)
      })
      .catch((error) => {
        if (isAbortError(error)) return
        setDetailError(
          getApiErrorMessage(error, 'No se pudo cargar este enfrentamiento'),
        )
        setDetailLoading(false)
      })

    return () => controller.abort()
  }, [hasSelectedPair, playerA, playerB, stage, tournamentId, dateFrom, dateTo])

  const selectPair = (pair) =>
    setFilters({
      playerA: pair.playerA.id,
      playerB: pair.playerB.id,
      h2hStage: '',
      h2hTournamentId: '',
      h2hPeriod: '',
      h2hDateFrom: '',
      h2hDateTo: '',
    })

  const clearPair = () =>
    setFilters({
      playerA: '',
      playerB: '',
      h2hStage: '',
      h2hTournamentId: '',
      h2hPeriod: '',
      h2hDateFrom: '',
      h2hDateTo: '',
    })

  const selectPeriod = (slug) => {
    const range = slug === 'todo' ? null : getShortcutRange(slug, today)
    setFilters({
      h2hPeriod: slug === 'todo' ? '' : slug,
      h2hDateFrom: range?.dateFrom || '',
      h2hDateTo: range?.dateTo || '',
    })
  }

  if (summaryError) {
    return <ErrorState role="alert">{summaryError}</ErrorState>
  }

  if (!summary) {
    return (
      <SpinnerContainer role="status" aria-label="Cargando historial APA">
        <Loader />
      </SpinnerContainer>
    )
  }

  return (
    <HeadToHeadSection>
      <h2>Historial APA</h2>

      {!hasSelectedPair ? (
        <>
          <PairGrid>
            {summary.pairs.map((pair) => (
              <PairCard
                type="button"
                key={`${pair.playerA.id}-${pair.playerB.id}`}
                onClick={() => selectPair(pair)}
                aria-label={`Ver historial entre ${pair.playerA.name} y ${pair.playerB.name}`}
              >
                <PairSummary>
                  <PairPlayer>
                    <h3>{pair.playerA.name}</h3>
                    <strong>{pair.playerAWins}</strong>
                    <span>victorias</span>
                    <small>
                      {pair.playerAGoals} GF · DIF{' '}
                      {signed(pair.playerAGoalDifference)}
                    </small>
                  </PairPlayer>
                  <div className="pair-card__center">
                    <strong>{pair.matches}</strong>
                    <span>{pair.matches === 1 ? 'partido' : 'partidos'}</span>
                    <small>{pair.draws} empates</small>
                  </div>
                  <PairPlayer>
                    <h3>{pair.playerB.name}</h3>
                    <strong>{pair.playerBWins}</strong>
                    <span>victorias</span>
                    <small>
                      {pair.playerBGoals} GF · DIF{' '}
                      {signed(pair.playerBGoalDifference)}
                    </small>
                  </PairPlayer>
                </PairSummary>
                <div className="pair-card__best-wins">
                  <SummaryBestWin
                    label={`Mayor victoria de ${pair.playerA.name}`}
                    win={pair.bestWin.playerA}
                  />
                  <SummaryBestWin
                    label={`Mayor victoria de ${pair.playerB.name}`}
                    win={pair.bestWin.playerB}
                  />
                </div>
                <div className="pair-card__link">
                  Ver historial <ArrowForwardIcon />
                </div>
              </PairCard>
            ))}
          </PairGrid>
        </>
      ) : (
        <>
          <BackButton type="button" onClick={clearPair}>
            <ArrowBackIcon /> Todos los cruces
          </BackButton>

          <FilterBar>
            <SelectField>
              <span>Tipo de partido</span>
              <select
                value={stage}
                onChange={(event) =>
                  setFilters({ h2hStage: event.target.value })
                }
              >
                <option value="">Todos</option>
                {Object.entries(STAGE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </SelectField>
            <SelectField>
              <span>Torneo</span>
              <select
                value={tournamentId}
                onChange={(event) =>
                  setFilters({ h2hTournamentId: event.target.value })
                }
              >
                <option value="">Todos</option>
                {tournaments.map((tournament) => (
                  <option key={tournament._id} value={tournament._id}>
                    {tournament.name}
                  </option>
                ))}
              </select>
            </SelectField>
            <SelectField>
              <span>Período</span>
              <select
                value={periodSlug}
                onChange={(event) => selectPeriod(event.target.value)}
              >
                {periodOptions.map((option) => (
                  <option key={option.slug} value={option.slug}>
                    {option.label}
                  </option>
                ))}
              </select>
            </SelectField>
          </FilterBar>

          {detailLoading && !detail ? (
            <SpinnerContainer
              role="status"
              aria-label="Cargando enfrentamiento"
            >
              <Loader />
            </SpinnerContainer>
          ) : detailError ? (
            <ErrorState role="alert">{detailError}</ErrorState>
          ) : detail?.record ? (
            <DetailPanel $loading={detailLoading}>
              <Scoreboard>
                <ComparisonSide>
                  <h3>{detail.players.playerA.name}</h3>
                  <strong>{detail.record.playerAWins}</strong>
                  <span>victorias</span>
                  <small>
                    {detail.record.playerAGoals} GF · DIF{' '}
                    {signed(
                      detail.record.playerAGoals - detail.record.playerBGoals,
                    )}
                  </small>
                </ComparisonSide>
                <ScoreCenter>
                  <strong>{detail.record.draws}</strong>
                  <span>empates</span>
                  <small>{detail.record.matches} partidos</small>
                </ScoreCenter>
                <ComparisonSide>
                  <h3>{detail.players.playerB.name}</h3>
                  <strong>{detail.record.playerBWins}</strong>
                  <span>victorias</span>
                  <small>
                    {detail.record.playerBGoals} GF · DIF{' '}
                    {signed(
                      detail.record.playerBGoals - detail.record.playerAGoals,
                    )}
                  </small>
                </ComparisonSide>
              </Scoreboard>

              <ComparisonBar
                $left={
                  detail.record.matches
                    ? (detail.record.playerAWins / detail.record.matches) * 100
                    : 0
                }
                $draw={
                  detail.record.matches
                    ? (detail.record.draws / detail.record.matches) * 100
                    : 0
                }
                aria-label="Proporción de resultados"
              />

              <MetricsGrid>
                <Metric>
                  <span>Goles</span>
                  <strong>
                    {detail.record.playerAGoals} – {detail.record.playerBGoals}
                  </strong>
                </Metric>
                <Metric>
                  <span>Tandas de penales</span>
                  <strong>
                    {detail.record.shootouts.playerAWon} –{' '}
                    {detail.record.shootouts.playerBWon}
                  </strong>
                </Metric>
                <Metric>
                  <span>Racha actual</span>
                  <strong>{resultLabel(detail.streak)}</strong>
                </Metric>
                <Metric>
                  <span>Período registrado</span>
                  <strong>
                    {formatDisplayDate(detail.firstMatchOn) || '—'} /{' '}
                    {formatDisplayDate(detail.lastMatchOn) || '—'}
                  </strong>
                </Metric>
              </MetricsGrid>

              <BestWins>
                <DetailBestWin
                  player={detail.players.playerA.name}
                  win={detail.bestWin.playerA}
                />
                <DetailBestWin
                  player={detail.players.playerB.name}
                  win={detail.bestWin.playerB}
                />
              </BestWins>

              {detail.lastMatches.length > 0 ? (
                <>
                  <h3>Últimos enfrentamientos</h3>
                  <MatchList>
                    {detail.lastMatches.map((match) => (
                      <MatchItem key={match.matchId}>
                        <div className="match-item__team match-item__team--left">
                          <TeamLogo
                            id={match.playerA.teamId}
                            name={match.playerA.team}
                          />
                          <strong>{match.playerA.team || 'Equipo'}</strong>
                          <span>{match.playerA.goals}</span>
                        </div>
                        <div className="match-item__meta">
                          <strong>{match.tournament || 'Partido APA'}</strong>
                          <div className="match-item__context">
                            {match.playedOn && (
                              <span>{formatDisplayDate(match.playedOn)}</span>
                            )}
                            {formatRound(match.round) && (
                              <span>{formatRound(match.round)}</span>
                            )}
                          </div>
                          {match.ratingChange && (
                            <div className="match-item__rating">
                              <span>
                                {match.ratingChange.playerA > 0 ? '+' : ''}
                                {match.ratingChange.playerA}
                              </span>
                              <small>Rating</small>
                              <span>
                                {match.ratingChange.playerB > 0 ? '+' : ''}
                                {match.ratingChange.playerB}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="match-item__team match-item__team--right">
                          <span>{match.playerB.goals}</span>
                          <strong>{match.playerB.team || 'Equipo'}</strong>
                          <TeamLogo
                            id={match.playerB.teamId}
                            name={match.playerB.team}
                          />
                        </div>
                      </MatchItem>
                    ))}
                  </MatchList>
                  {detail.viewPath && (
                    <AllMatchesLink as={Link} to={detail.viewPath}>
                      Ver todos los partidos
                    </AllMatchesLink>
                  )}
                </>
              ) : (
                <EmptyState>
                  No hay partidos para los filtros elegidos.
                </EmptyState>
              )}
            </DetailPanel>
          ) : (
            <EmptyState>No se encontró este enfrentamiento.</EmptyState>
          )}
        </>
      )}
    </HeadToHeadSection>
  )
}

export default HeadToHeadTab
