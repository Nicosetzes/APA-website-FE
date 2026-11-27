import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from 'api/axiosConfig'
import {
  DEFAULT_TOURNAMENT_METRIC,
  buildPlayerTournamentRows,
  buildTournamentPlayerRows,
  buildTournamentSummaries,
  formatTournamentMetric,
  formatTournamentRange,
  getTournamentMetricTrend,
  normalizeTournamentComparisons,
  sortTournamentRows,
} from 'utils/ratingTournaments'
import { Loader } from 'views/components'
import { Section, SectionTitle, SpinnerContainer } from '../../styled'
import { Notice, RetryButton } from '../RatingTab/styled'
import {
  CellValues,
  ComparisonName,
  EntityCell,
  FilterField,
  Filters,
  Intro,
  MissingValue,
  MobileSortControls,
  ModeSelector,
  NoComparable,
  NumericValue,
  PerformancesTable,
  PerformanceLine,
  Range,
  SampleTag,
  SortButton,
  SortIndicator,
  StatusMessage,
  Summaries,
  SummaryCard,
  SummaryExtremes,
  SummaryGroup,
  SummaryHeader,
  SummaryHint,
  SummaryMetrics,
  SummaryPlayer,
  SummaryValue,
  TableControls,
  TableScroll,
  TournamentDetailLink,
} from './styled'

const isAbortError = (err) =>
  err?.name === 'CanceledError' || err?.name === 'AbortError'

const DEFAULT_DIRECTIONS = {
  playerName: 'asc',
  tournamentName: 'asc',
  matches: 'desc',
  record: 'desc',
  ratingChange: 'desc',
  actualPercentage: 'desc',
  expectedPercentage: 'desc',
  differencePercentagePoints: 'desc',
  teamAdjustmentPercentagePoints: 'desc',
}

const METRIC_COLUMNS = [
  { key: 'matches', label: 'Partidos' },
  { key: 'record', label: 'V / E / D' },
  { key: 'ratingChange', label: 'Variación rating' },
  { key: 'actualPercentage', label: 'Obtenido' },
  { key: 'expectedPercentage', label: 'Esperado' },
  { key: 'differencePercentagePoints', label: 'Diferencia' },
  { key: 'teamAdjustmentPercentagePoints', label: 'Ajuste equipos' },
]

const formatPerformanceValue = (performance, metric) => {
  if (metric === 'matches') return String(performance.matches)
  if (metric === 'record') {
    return `${performance.record.wins} / ${performance.record.draws} / ${performance.record.losses}`
  }
  return formatTournamentMetric(performance[metric], metric)
}

const PerformanceValue = ({ performance, metric, playerName, showName }) => {
  if (!performance) {
    return (
      <PerformanceLine>
        {showName && <ComparisonName>{playerName}</ComparisonName>}
        <MissingValue>Sin actuación</MissingValue>
      </PerformanceLine>
    )
  }

  const trend = getTournamentMetricTrend(performance[metric], metric)
  return (
    <PerformanceLine>
      {showName && <ComparisonName>{playerName}</ComparisonName>}
      <NumericValue data-trend={trend} $trend={trend}>
        {formatPerformanceValue(performance, metric)}
      </NumericValue>
      {metric === 'matches' && !performance.comparable && (
        <SampleTag data-sample-status="not-comparable">
          Menos de 5; no comparable
        </SampleTag>
      )}
    </PerformanceLine>
  )
}

const TournamentsTab = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [requestId, setRequestId] = useState(0)
  const [mode, setMode] = useState('player')
  const [primaryPlayerId, setPrimaryPlayerId] = useState('')
  const [comparisonPlayerId, setComparisonPlayerId] = useState('')
  const [tournamentId, setTournamentId] = useState('')
  const [sort, setSort] = useState({
    key: DEFAULT_TOURNAMENT_METRIC,
    direction: 'desc',
  })

  const retry = useCallback(() => setRequestId((value) => value + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(false)

    apiClient
      .get('/ratings/tournaments', { signal: controller.signal })
      .then(({ data: response }) => {
        if (controller.signal.aborted) return
        setData(response.data ?? {})
        setLoading(false)
      })
      .catch((err) => {
        if (isAbortError(err) || controller.signal.aborted) return
        console.error(err)
        setError(true)
        setLoading(false)
      })

    return () => controller.abort()
  }, [requestId])

  const normalized = useMemo(() => normalizeTournamentComparisons(data), [data])
  const availableTournaments = useMemo(() => {
    const tournamentIds = new Set(
      normalized.performances.map(({ tournamentId: id }) => id),
    )
    return normalized.tournaments.filter(({ id }) => tournamentIds.has(id))
  }, [normalized.performances, normalized.tournaments])

  useEffect(() => {
    setPrimaryPlayerId((current) =>
      normalized.players.some(({ id }) => id === current)
        ? current
        : normalized.players[0]?.id ?? '',
    )
  }, [normalized.players])

  useEffect(() => {
    setTournamentId((current) =>
      availableTournaments.some(({ id }) => id === current)
        ? current
        : availableTournaments[0]?.id ?? '',
    )
  }, [availableTournaments])

  useEffect(() => {
    setComparisonPlayerId((current) =>
      current !== primaryPlayerId &&
      normalized.players.some(({ id }) => id === current)
        ? current
        : '',
    )
  }, [normalized.players, primaryPlayerId])

  const summaries = useMemo(
    () => buildTournamentSummaries(normalized.players, normalized.performances),
    [normalized.performances, normalized.players],
  )
  const primaryPlayer = normalized.players.find(
    ({ id }) => id === primaryPlayerId,
  )
  const comparisonPlayer = normalized.players.find(
    ({ id }) => id === comparisonPlayerId,
  )
  const selectedTournament = availableTournaments.find(
    ({ id }) => id === tournamentId,
  )
  const unsortedRows = useMemo(
    () =>
      mode === 'player'
        ? buildPlayerTournamentRows(
            normalized.performances,
            primaryPlayerId,
            comparisonPlayerId,
          )
        : buildTournamentPlayerRows(normalized.performances, tournamentId),
    [
      comparisonPlayerId,
      mode,
      normalized.performances,
      primaryPlayerId,
      tournamentId,
    ],
  )
  const rows = useMemo(
    () => sortTournamentRows(unsortedRows, sort),
    [sort, unsortedRows],
  )
  const columns = useMemo(
    () => [
      mode === 'player'
        ? { key: 'tournamentName', label: 'Torneo' }
        : { key: 'playerName', label: 'Jugador' },
      ...METRIC_COLUMNS,
    ],
    [mode],
  )

  const changeMode = (nextMode) => {
    setMode(nextMode)
    setSort({ key: DEFAULT_TOURNAMENT_METRIC, direction: 'desc' })
  }

  const changePrimaryPlayer = (nextPlayerId) => {
    setPrimaryPlayerId(nextPlayerId)
    if (nextPlayerId === comparisonPlayerId) setComparisonPlayerId('')
  }

  const changeSort = (key) => {
    setSort((current) => ({
      key,
      direction:
        current.key === key
          ? current.direction === 'asc'
            ? 'desc'
            : 'asc'
          : DEFAULT_DIRECTIONS[key],
    }))
  }

  const changeMobileSortKey = (key) => {
    setSort((current) =>
      current.key === key
        ? current
        : { key, direction: DEFAULT_DIRECTIONS[key] },
    )
  }

  if (loading && data === null) {
    return (
      <SpinnerContainer
        role="status"
        aria-label="Cargando comparación de torneos"
      >
        <Loader />
      </SpinnerContainer>
    )
  }

  if (error && data === null) {
    return (
      <div role="alert">
        <Notice $tone="error">
          No se pudo cargar la comparación de torneos.
        </Notice>
        <RetryButton type="button" onClick={retry}>
          Reintentar
        </RetryButton>
      </div>
    )
  }

  if (normalized.performances.length === 0) {
    return (
      <Section>
        <SectionTitle>Torneos</SectionTitle>
        <StatusMessage role="status">
          Todavía no hay actuaciones de torneos para comparar.
        </StatusMessage>
      </Section>
    )
  }

  const showComparison = mode === 'player' && Boolean(comparisonPlayerId)

  return (
    <Section aria-busy={loading}>
      <SectionTitle>Torneos</SectionTitle>
      <Intro>Compará actuaciones entre torneos.</Intro>

      <Summaries role="region" aria-label="Resumen de torneos por jugador">
        {summaries.map((summary, summaryIndex) => {
          const headingId = `tournament-summary-${summaryIndex}`
          return (
            <SummaryCard
              as="article"
              aria-labelledby={headingId}
              key={summary.playerId}
            >
              <SummaryHeader>
                <SummaryPlayer id={headingId}>
                  {summary.playerName}
                </SummaryPlayer>
                <SummaryHint>Solo torneos con al menos 5 partidos</SummaryHint>
              </SummaryHeader>
              <SummaryMetrics>
                {summary.metrics.map((metric) => (
                  <SummaryGroup key={metric.id}>
                    <h4>{metric.label}</h4>
                    {metric.high ? (
                      <SummaryExtremes>
                        <div>
                          <dt>{metric.highLabel}</dt>
                          <dd>
                            <SummaryValue
                              data-trend={getTournamentMetricTrend(
                                metric.high[metric.id],
                                metric.id,
                              )}
                              $trend={getTournamentMetricTrend(
                                metric.high[metric.id],
                                metric.id,
                              )}
                            >
                              {formatTournamentMetric(
                                metric.high[metric.id],
                                metric.id,
                              )}
                            </SummaryValue>
                            {metric.high.tournamentName}
                          </dd>
                        </div>
                        <div>
                          <dt>{metric.lowLabel}</dt>
                          <dd>
                            <SummaryValue
                              data-trend={getTournamentMetricTrend(
                                metric.low[metric.id],
                                metric.id,
                              )}
                              $trend={getTournamentMetricTrend(
                                metric.low[metric.id],
                                metric.id,
                              )}
                            >
                              {formatTournamentMetric(
                                metric.low[metric.id],
                                metric.id,
                              )}
                            </SummaryValue>
                            {metric.low.tournamentName}
                          </dd>
                        </div>
                      </SummaryExtremes>
                    ) : (
                      <NoComparable>Sin datos comparables</NoComparable>
                    )}
                  </SummaryGroup>
                ))}
              </SummaryMetrics>
            </SummaryCard>
          )
        })}
      </Summaries>

      <TableControls>
        <ModeSelector>
          <legend>Organizar tabla</legend>
          <label>
            <input
              type="radio"
              name="tournament-table-mode"
              value="player"
              checked={mode === 'player'}
              onChange={() => changeMode('player')}
            />
            <span>Por jugador</span>
          </label>
          <label>
            <input
              type="radio"
              name="tournament-table-mode"
              value="tournament"
              checked={mode === 'tournament'}
              onChange={() => changeMode('tournament')}
            />
            <span>Por torneo</span>
          </label>
        </ModeSelector>
        <Filters aria-label="Filtros de la tabla de torneos">
          {mode === 'player' ? (
            <>
              <FilterField htmlFor="tournaments-primary-player">
                <span>Jugador principal</span>
                <select
                  id="tournaments-primary-player"
                  required
                  value={primaryPlayerId}
                  onChange={(event) => changePrimaryPlayer(event.target.value)}
                >
                  {normalized.players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </FilterField>
              <FilterField htmlFor="tournaments-comparison-player">
                <span>Comparar con (opcional)</span>
                <select
                  id="tournaments-comparison-player"
                  value={comparisonPlayerId}
                  onChange={(event) =>
                    setComparisonPlayerId(event.target.value)
                  }
                >
                  <option value="">Sin comparación</option>
                  {normalized.players
                    .filter(({ id }) => id !== primaryPlayerId)
                    .map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                </select>
              </FilterField>
            </>
          ) : (
            <>
              <FilterField htmlFor="tournaments-tournament">
                <span>Torneo</span>
                <select
                  id="tournaments-tournament"
                  required
                  value={tournamentId}
                  onChange={(event) => setTournamentId(event.target.value)}
                >
                  {availableTournaments.map((tournament) => (
                    <option key={tournament.id} value={tournament.id}>
                      {tournament.name}
                    </option>
                  ))}
                </select>
              </FilterField>
              {selectedTournament && (
                <TournamentDetailLink
                  to={`/statistics?tournamentId=${encodeURIComponent(
                    selectedTournament.id,
                  )}`}
                >
                  Ver detalle en Rating APA
                </TournamentDetailLink>
              )}
            </>
          )}
        </Filters>
        <MobileSortControls data-mobile-sort-controls="true">
          <FilterField htmlFor="tournaments-mobile-sort">
            <span>Ordenar por</span>
            <select
              id="tournaments-mobile-sort"
              value={sort.key}
              onChange={(event) => changeMobileSortKey(event.target.value)}
            >
              {columns.map((column) => (
                <option key={column.key} value={column.key}>
                  {column.label}
                </option>
              ))}
            </select>
          </FilterField>
          <button
            type="button"
            data-sort-direction={sort.direction}
            aria-label={`Cambiar dirección de orden. Actual: ${
              sort.direction === 'asc' ? 'ascendente' : 'descendente'
            }`}
            onClick={() => changeSort(sort.key)}
          >
            {sort.direction === 'asc' ? 'Ascendente ▲' : 'Descendente ▼'}
          </button>
        </MobileSortControls>
      </TableControls>

      {rows.length === 0 ? (
        <StatusMessage role="status">
          No hay actuaciones para la selección actual.
        </StatusMessage>
      ) : (
        <TableScroll>
          <PerformancesTable aria-label="Comparación de actuaciones por torneo">
            <caption>
              {mode === 'player'
                ? `Torneos de ${primaryPlayer?.name ?? ''}`
                : `Participantes de ${selectedTournament?.name ?? ''}`}
            </caption>
            <thead>
              <tr>
                {columns.map((column) => {
                  const active = sort.key === column.key
                  const ariaSort = active
                    ? sort.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                  return (
                    <th key={column.key} scope="col" aria-sort={ariaSort}>
                      <SortButton
                        type="button"
                        aria-label={`Ordenar por ${column.label}`}
                        onClick={() => changeSort(column.key)}
                      >
                        <span>{column.label}</span>
                        <SortIndicator
                          aria-hidden="true"
                          data-sort-indicator={column.key}
                          $visible={active}
                        >
                          {active && sort.direction === 'asc' ? '▲' : '▼'}
                        </SortIndicator>
                      </SortButton>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  data-comparable={String(row.primary.comparable)}
                >
                  <EntityCell scope="row">
                    {mode === 'player' ? (
                      <>
                        <Link
                          to={`/statistics?tournamentId=${encodeURIComponent(
                            row.tournamentId,
                          )}`}
                        >
                          {row.tournamentName}
                        </Link>
                        <Range>{formatTournamentRange(row.tournament)}</Range>
                      </>
                    ) : (
                      row.playerName
                    )}
                  </EntityCell>
                  {METRIC_COLUMNS.map((column) => (
                    <td
                      key={column.key}
                      data-label={column.label}
                      data-metric={column.key}
                    >
                      <CellValues>
                        <PerformanceValue
                          performance={row.primary}
                          metric={column.key}
                          playerName={primaryPlayer?.name}
                          showName={showComparison}
                        />
                        {showComparison && (
                          <PerformanceValue
                            performance={row.comparison}
                            metric={column.key}
                            playerName={comparisonPlayer?.name}
                            showName
                          />
                        )}
                      </CellValues>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </PerformancesTable>
        </TableScroll>
      )}
    </Section>
  )
}

export default TournamentsTab
