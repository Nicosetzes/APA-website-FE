import { cloudName } from 'api'
import { apiClient, getApiErrorMessage } from 'api/axiosConfig'
import { Image } from 'cloudinary-react'
import { Loader } from 'views/components'
import { SectionTitle } from '../../styled'
import {
  buildGlobalUpsetMatchesLink,
  buildUpsetsApiParams,
  describeGlobalUpsetProbability,
  formatGlobalUpsetDate,
  formatGlobalUpsetPenalties,
  formatGlobalUpsetRatingChange,
  formatGlobalUpsetScore,
  getUpsetTypeLabel,
  parseUpsetsFilters,
  updateUpsetsSearchParams,
} from 'utils/ratingUpsets'
import { teamAbbreviation, teamLogoUrl } from 'utils/teams'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ContextCell,
  FilterField,
  Filters,
  ImageFallback,
  Intro,
  MatchIdentity,
  MatchLink,
  Position,
  Probability,
  RatingChange,
  ResultsSummary,
  RetryButton,
  Score,
  StateBox,
  Table,
  TableContainer,
  TeamIdentity,
  TournamentDetails,
  TournamentVisual,
  UpsetsSection,
} from './styled'

const EMPTY_PAYLOAD = { total: 0, players: [], tournaments: [], upsets: [] }
const MAX_ROWS = 10

const isAbortError = (error) =>
  error?.name === 'CanceledError' || error?.name === 'AbortError'

const safeName = (value, fallback) =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback

const TeamBadge = ({ team }) => {
  const [broken, setBroken] = useState(false)
  const name = safeName(team?.name, 'Equipo sin registrar')
  const hasId = team?.id !== null && team?.id !== undefined

  if (!hasId || broken) {
    return (
      <ImageFallback role="img" aria-label={`Escudo no disponible de ${name}`}>
        {teamAbbreviation(team?.name) || '?'}
      </ImageFallback>
    )
  }

  return (
    <img
      src={teamLogoUrl(team.id)}
      alt={`Escudo de ${name}`}
      onError={() => setBroken(true)}
    />
  )
}

const TournamentBadge = ({ tournament, name }) => {
  const [broken, setBroken] = useState(false)
  const label = safeName(name, 'torneo sin registrar')

  if (!tournament?.cloudinary_id || broken) {
    return (
      <ImageFallback role="img" aria-label={`Imagen no disponible de ${label}`}>
        T
      </ImageFallback>
    )
  }

  return (
    <Image
      cloudName={cloudName}
      publicId={tournament.cloudinary_id}
      alt={`Imagen de ${label}`}
      onError={() => setBroken(true)}
    />
  )
}

const GlobalUpsets = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [payload, setPayload] = useState(null)
  const [tournamentsById, setTournamentsById] = useState(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retry, setRetry] = useState(0)
  const filters = useMemo(
    () => parseUpsetsFilters(searchParams),
    [searchParams],
  )

  useEffect(() => {
    const normalized = updateUpsetsSearchParams(searchParams, {})
    if (normalized.toString() !== searchParams.toString()) {
      setSearchParams(normalized, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const updateFilter = useCallback(
    (name, value) => {
      setSearchParams(updateUpsetsSearchParams(searchParams, { [name]: value }))
    },
    [searchParams, setSearchParams],
  )

  useEffect(() => {
    const controller = new AbortController()

    apiClient
      .get('/tournaments', { signal: controller.signal })
      .then(({ data }) => {
        if (controller.signal.aborted) return
        setTournamentsById(
          new Map(
            (Array.isArray(data) ? data : []).map((tournament) => [
              String(tournament._id),
              tournament,
            ]),
          ),
        )
      })
      .catch((requestError) => {
        if (isAbortError(requestError) || controller.signal.aborted) return
        setTournamentsById(new Map())
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    apiClient
      .get('/ratings/upsets', {
        params: buildUpsetsApiParams(filters),
        signal: controller.signal,
      })
      .then(({ data }) => {
        if (controller.signal.aborted) return
        setPayload(data?.data || EMPTY_PAYLOAD)
        setLoading(false)
      })
      .catch((requestError) => {
        if (isAbortError(requestError) || controller.signal.aborted) return
        setError(
          getApiErrorMessage(
            requestError,
            'No se pudieron cargar las mayores sorpresas',
          ),
        )
        setLoading(false)
      })

    return () => controller.abort()
  }, [filters, retry])

  const players = payload?.players || []
  const tournaments = payload?.tournaments || []
  const upsets = (payload?.upsets || []).slice(0, MAX_ROWS)

  return (
    <UpsetsSection aria-labelledby="global-upsets-title">
      <SectionTitle id="global-upsets-title">Mayores sorpresas</SectionTitle>
      <Intro>
        {filters.perspective === 'against'
          ? 'Derrotas ante rivales que tenían menos chances previas, desde la más improbable.'
          : 'Victorias de quienes tenían menos chances previas, desde la más improbable.'}
      </Intro>

      <Filters aria-label="Filtros de mayores sorpresas">
        <FilterField>
          <span>Desde</span>
          <input
            type="date"
            value={filters.dateFrom}
            max={filters.dateTo || undefined}
            onChange={(event) => updateFilter('dateFrom', event.target.value)}
          />
        </FilterField>
        <FilterField>
          <span>Hasta</span>
          <input
            type="date"
            value={filters.dateTo}
            min={filters.dateFrom || undefined}
            onChange={(event) => updateFilter('dateTo', event.target.value)}
          />
        </FilterField>
        <FilterField>
          <span>Torneo</span>
          <select
            value={filters.tournamentId}
            onChange={(event) =>
              updateFilter('tournamentId', event.target.value)
            }
          >
            <option value="">Todos</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name || 'Torneo sin nombre'}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField>
          <span>Jugador involucrado</span>
          <select
            value={filters.playerId}
            onChange={(event) => updateFilter('playerId', event.target.value)}
          >
            <option value="">Todos</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField>
          <span>Perspectiva</span>
          <select
            value={filters.perspective}
            disabled={!filters.playerId}
            onChange={(event) =>
              updateFilter('perspective', event.target.value)
            }
          >
            <option value="for">A favor</option>
            <option value="against">En contra</option>
          </select>
        </FilterField>
        <FilterField>
          <span>Fase</span>
          <select
            value={filters.type}
            onChange={(event) => updateFilter('type', event.target.value)}
          >
            <option value="">Todas</option>
            <option value="regular">Fase regular</option>
            <option value="playin">Play-in</option>
            <option value="playoff">Playoff</option>
          </select>
        </FilterField>
        <FilterField>
          <span>Penales</span>
          <select
            value={filters.penalties}
            onChange={(event) => updateFilter('penalties', event.target.value)}
          >
            <option value="all">Todos</option>
            <option value="exclude">Excluir</option>
            <option value="only">Solo penales</option>
          </select>
        </FilterField>
      </Filters>

      {loading ? (
        <StateBox role="status" aria-label="Cargando mayores sorpresas">
          <Loader />
        </StateBox>
      ) : error ? (
        <StateBox role="alert">
          <span>{error}</span>
          <RetryButton
            type="button"
            onClick={() => setRetry((value) => value + 1)}
          >
            Reintentar
          </RetryButton>
        </StateBox>
      ) : upsets.length === 0 ? (
        <StateBox>No hay sorpresas para estos filtros.</StateBox>
      ) : (
        <>
          <ResultsSummary aria-live="polite">
            Mostrando {upsets.length} de {payload.total}
          </ResultsSummary>
          <TableContainer>
            <Table aria-label="Ranking de mayores sorpresas">
              <thead>
                <tr>
                  <th scope="col">Posición</th>
                  <th scope="col">Partido</th>
                  <th scope="col">Marcador</th>
                  <th scope="col">Probabilidad</th>
                  <th scope="col">Variación</th>
                  <th scope="col">Contexto</th>
                </tr>
              </thead>
              <tbody>
                {upsets.map((upset, index) => {
                  const penalties = formatGlobalUpsetPenalties(upset)
                  const ratingChange = formatGlobalUpsetRatingChange(
                    upset.ratingChange,
                  )
                  const matchLink = buildGlobalUpsetMatchesLink(upset)
                  const tournamentName = safeName(
                    upset.tournament?.name,
                    'Sin torneo',
                  )
                  const tournament =
                    upset.tournamentId === null ||
                    upset.tournamentId === undefined
                      ? null
                      : tournamentsById.get(String(upset.tournamentId))

                  return (
                    <tr key={upset.matchId}>
                      <td>
                        <Position aria-label={`Posición ${index + 1}`}>
                          {index + 1}
                        </Position>
                      </td>
                      <td>
                        <MatchIdentity>
                          <TeamIdentity>
                            <TeamBadge team={upset.teams?.winner} />
                            <span>
                              <strong>{upset.winner?.name || '-'}</strong>
                              <small>
                                {safeName(
                                  upset.teams?.winner?.name,
                                  'Equipo sin registrar',
                                )}
                              </small>
                            </span>
                          </TeamIdentity>
                          <span aria-hidden="true">vs.</span>
                          <TeamIdentity>
                            <TeamBadge team={upset.teams?.loser} />
                            <span>
                              <strong>{upset.loser?.name || '-'}</strong>
                              <small>
                                {safeName(
                                  upset.teams?.loser?.name,
                                  'Equipo sin registrar',
                                )}
                              </small>
                            </span>
                          </TeamIdentity>
                        </MatchIdentity>
                      </td>
                      <td>
                        <Score>
                          {formatGlobalUpsetScore(upset)}
                          {penalties && <small>pen. {penalties}</small>}
                        </Score>
                      </td>
                      <td>
                        <Probability
                          $negative={filters.perspective === 'against'}
                        >
                          {describeGlobalUpsetProbability(
                            upset,
                            filters.perspective,
                          )}
                        </Probability>
                      </td>
                      <td>
                        <RatingChange $trend={ratingChange.trend}>
                          {ratingChange.text}
                        </RatingChange>
                      </td>
                      <td>
                        <ContextCell>
                          <TournamentVisual>
                            <TournamentBadge
                              tournament={tournament}
                              name={tournamentName}
                            />
                          </TournamentVisual>
                          <TournamentDetails>
                            <strong>{tournamentName}</strong>
                            <span>{getUpsetTypeLabel(upset.type)}</span>
                            <time dateTime={upset.playedAt || undefined}>
                              {formatGlobalUpsetDate(upset)}
                            </time>
                            {matchLink && (
                              <MatchLink
                                to={matchLink}
                                aria-label={`Ver el partido entre ${upset.winner.name} y ${upset.loser.name}`}
                              >
                                Ver partido
                              </MatchLink>
                            )}
                          </TournamentDetails>
                        </ContextCell>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </UpsetsSection>
  )
}

export default GlobalUpsets
