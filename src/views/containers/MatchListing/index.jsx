import ComparisonFilter from './ComparisonFilter'
import DateFilter, { DateFilterProvider } from './DateFilter'
import Pagination from '@mui/material/Pagination'
import { api } from 'api'
import { motion } from 'framer-motion'
import useDebouncedParam from './useDebouncedParam'
import { useMediaQuery } from 'react-responsive'
import { useSearchParams } from 'react-router-dom'
import {
  ClearButton,
  ErrorMessage,
  FilterCard,
  FilterGrid,
  FilterHint,
  FilterSection,
  FilterSectionTitle,
  FormGroup,
  PaginationWrapper,
  PageContainer,
  ResultsBadge,
  ResultsHeader,
  StyledSelect,
} from './styled'
import { MatchesTable, PageLoader } from 'views/components'
import TeamAutocomplete, { normalizeTeamSearch } from './TeamAutocomplete'
import { apiClient, getApiErrorMessage } from 'api/axiosConfig'
import { useCallback, useEffect, useState } from 'react'

const isEmptyFilter = (value) => !value || value === 'all'

const FILTER_DEPENDENCIES = [
  {
    param: 'player1',
    isActive: (value) => !isEmptyFilter(value),
    dependents: [
      'outcome',
      'player1GoalsOp',
      'player1GoalsVal',
      'player1ConcededOp',
      'player1ConcededVal',
      'player1Team',
      'opponentTeam',
      'player2',
    ],
  },
  {
    param: 'type',
    isActive: (value) => value === 'playoff',
    dependents: ['playoffRound'],
  },
]

const PLAYOFF_ROUNDS = [
  { value: 'round_of_32', label: '16vos de final' },
  { value: 'round_of_16', label: '8vos de final' },
  { value: 'quarterfinal', label: '4tos de final' },
  { value: 'semifinal', label: 'Semifinal' },
  { value: 'final', label: 'Final' },
]

const MatchListing = () => {
  const isXS = useMediaQuery({ query: '(min-width: 375px)' })
  const [searchParams, setSearchParams] = useSearchParams()

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [players, setPlayers] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [teams, setTeams] = useState([])
  const [dateResetKey, setDateResetKey] = useState(0)

  const getParam = (key, fallback = '') => searchParams.get(key) || fallback

  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const player1 = getParam('player1')
  const player2 = getParam('player2')
  const outcome = getParam('outcome', 'all')
  const tournamentId = getParam('tournamentId')
  const type = getParam('type', 'all')
  const playoffRound = getParam('playoffRound', 'all')
  const dateFrom = getParam('dateFrom')
  const dateTo = getParam('dateTo')

  const hasPlayer1 = !isEmptyFilter(player1)
  const isPlayoff = type === 'playoff'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersRes, tournamentsRes] = await Promise.all([
          apiClient.get(`${api}/users`),
          apiClient.get(`${api}/tournaments?legacy=false`),
        ])
        setPlayers(playersRes.data)
        setTournaments(tournamentsRes.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }
    fetchData()

    apiClient
      .get(`${api}/matches/teams`)
      .then(({ data }) => setTeams(Array.isArray(data) ? data : []))
      .catch(() => setTeams([]))
  }, [])

  const updateFilters = useCallback(
    (newFilters) => {
      const params = new URLSearchParams(searchParams)
      const filters = { ...newFilters }

      if (!('page' in filters)) {
        params.set('page', '1')
      }

      FILTER_DEPENDENCIES.forEach(({ param, isActive, dependents }) => {
        if (param in filters && !isActive(filters[param])) {
          dependents.forEach((key) => {
            delete filters[key]
            params.delete(key)
          })
        }
      })

      Object.entries(filters).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== '' &&
          value !== 'all'
        ) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })

      setSearchParams(params)
    },
    [searchParams, setSearchParams],
  )

  const debounced = (paramKey, options = {}) => ({
    paramKey,
    paramValue: getParam(paramKey),
    updateFilters,
    ...options,
  })

  const [teamInput, setTeamInput] = useDebouncedParam(
    debounced('teamName', { normalize: normalizeTeamSearch }),
  )
  const [goalDiffInput, setGoalDiffInput] = useDebouncedParam(
    debounced('goalDiffVal'),
  )
  const [totalGoalsInput, setTotalGoalsInput] = useDebouncedParam(
    debounced('totalGoalsVal'),
  )
  const [player1GoalsInput, setPlayer1GoalsInput] = useDebouncedParam(
    debounced('player1GoalsVal', { enabled: hasPlayer1 }),
  )
  const [player1ConcededInput, setPlayer1ConcededInput] = useDebouncedParam(
    debounced('player1ConcededVal', { enabled: hasPlayer1 }),
  )
  const [player1TeamInput, setPlayer1TeamInput] = useDebouncedParam(
    debounced('player1Team', {
      normalize: normalizeTeamSearch,
      enabled: hasPlayer1,
    }),
  )
  const [opponentTeamInput, setOpponentTeamInput] = useDebouncedParam(
    debounced('opponentTeam', {
      normalize: normalizeTeamSearch,
      enabled: hasPlayer1,
    }),
  )

  const handleClearFilters = () => {
    const inputResetters = [
      setTeamInput,
      setGoalDiffInput,
      setTotalGoalsInput,
      setPlayer1GoalsInput,
      setPlayer1ConcededInput,
      setPlayer1TeamInput,
      setOpponentTeamInput,
    ]
    inputResetters.forEach((reset) => reset(''))
    // Remonta los pickers: descarta lo tipeado a medias que no llegó a la URL.
    setDateResetKey((key) => key + 1)
    setSearchParams(new URLSearchParams({ page: '1' }))
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    const currentParams = new URLSearchParams(searchParams)
    currentParams.set('page', String(page))

    apiClient
      .get(`${api}/matches?${currentParams.toString()}`)
      .then(({ data }) => setData(data))
      .catch((err) => {
        setData(null)
        setError(getApiErrorMessage(err, 'No se pudieron cargar los partidos'))
      })
      .finally(() => setLoading(false))
  }, [page, searchParams])

  const handlePageChange = (event, value) => {
    updateFilters({ page: value })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageContainer>
        <FilterCard>
          <FilterSection>
            <FilterSectionTitle>Jugador</FilterSectionTitle>
            <FilterHint>
              {hasPlayer1
                ? 'Los filtros de esta sección se aplican desde el punto de vista del jugador elegido. Con un rival, "Goles en contra" son los goles del rival.'
                : 'Elegí un jugador para habilitar el resto de los filtros de esta sección.'}
            </FilterHint>
            <FilterGrid>
              <FormGroup>
                <label htmlFor="player1">Jugador</label>
                <StyledSelect
                  id="player1"
                  value={player1}
                  onChange={(e) => updateFilters({ player1: e.target.value })}
                >
                  <option value="all">Todos</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </StyledSelect>
              </FormGroup>
              <FormGroup>
                <label htmlFor="player2">Rival</label>
                <StyledSelect
                  disabled={!hasPlayer1}
                  id="player2"
                  value={player2}
                  onChange={(e) => updateFilters({ player2: e.target.value })}
                >
                  <option value="all">Todos</option>
                  {players
                    .filter((p) => p.id !== player1)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </StyledSelect>
              </FormGroup>
              <FormGroup>
                <label htmlFor="outcomeFilter">Resultado</label>
                <StyledSelect
                  disabled={!hasPlayer1}
                  id="outcomeFilter"
                  value={outcome}
                  onChange={(e) => updateFilters({ outcome: e.target.value })}
                >
                  <option value="all">Todos</option>
                  <option value="win">Victoria</option>
                  <option value="winIncludingPenalties">
                    Victoria (incl. penales)
                  </option>
                  <option value="draw">Empate</option>
                  <option value="loss">Derrota</option>
                  <option value="penalties">Penales</option>
                </StyledSelect>
              </FormGroup>
              <ComparisonFilter
                id="player1GoalsVal"
                label="Goles a favor"
                disabled={!hasPlayer1}
                op={getParam('player1GoalsOp', 'gte')}
                value={player1GoalsInput}
                max="24"
                onOpChange={(value) => updateFilters({ player1GoalsOp: value })}
                onValueChange={setPlayer1GoalsInput}
              />
              <ComparisonFilter
                id="player1ConcededVal"
                label="Goles en contra"
                disabled={!hasPlayer1}
                op={getParam('player1ConcededOp', 'gte')}
                value={player1ConcededInput}
                max="24"
                onOpChange={(value) =>
                  updateFilters({ player1ConcededOp: value })
                }
                onValueChange={setPlayer1ConcededInput}
              />
              <TeamAutocomplete
                id="player1Team"
                label="Equipo del jugador"
                disabled={!hasPlayer1}
                teams={teams}
                value={player1TeamInput}
                onChange={setPlayer1TeamInput}
              />
              <TeamAutocomplete
                id="opponentTeam"
                label="Equipo contrario"
                disabled={!hasPlayer1}
                teams={teams}
                value={opponentTeamInput}
                onChange={setOpponentTeamInput}
              />
            </FilterGrid>
          </FilterSection>
          <FilterSection>
            <FilterSectionTitle>Partido</FilterSectionTitle>
            <FilterGrid>
              <FormGroup>
                <label htmlFor="tournamentFilter">Torneo</label>
                <StyledSelect
                  id="tournamentFilter"
                  value={tournamentId}
                  onChange={(e) =>
                    updateFilters({ tournamentId: e.target.value })
                  }
                >
                  <option value="all">Todos los torneos</option>
                  {tournaments.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </StyledSelect>
              </FormGroup>
              <FormGroup>
                <label htmlFor="typeFilter">Tipo de partido</label>
                <StyledSelect
                  id="typeFilter"
                  value={type}
                  onChange={(e) => updateFilters({ type: e.target.value })}
                >
                  <option value="all">Todos</option>
                  <option value="regular">Regular</option>
                  <option value="knockout">Eliminatoria</option>
                  <option value="playin">Playin</option>
                  <option value="playoff">Playoff</option>
                </StyledSelect>
              </FormGroup>
              <FormGroup>
                <label htmlFor="playoffRoundFilter">Ronda de playoff</label>
                <StyledSelect
                  id="playoffRoundFilter"
                  disabled={!isPlayoff}
                  title={
                    isPlayoff ? undefined : 'Elegí el tipo de partido Playoff'
                  }
                  value={playoffRound}
                  onChange={(e) =>
                    updateFilters({ playoffRound: e.target.value })
                  }
                >
                  <option value="all">
                    {isPlayoff ? 'Todas' : 'Requiere Playoff'}
                  </option>
                  {PLAYOFF_ROUNDS.map((round) => (
                    <option key={round.value} value={round.value}>
                      {round.label}
                    </option>
                  ))}
                </StyledSelect>
              </FormGroup>
              <TeamAutocomplete
                id="teamSearch"
                label="Equipo (cualquiera)"
                teams={teams}
                value={teamInput}
                onChange={setTeamInput}
              />
              <ComparisonFilter
                id="goalDiffVal"
                label="Diferencia de goles"
                op={getParam('goalDiffOp', 'gte')}
                value={goalDiffInput}
                onOpChange={(value) => updateFilters({ goalDiffOp: value })}
                onValueChange={setGoalDiffInput}
              />
              <ComparisonFilter
                id="totalGoalsVal"
                label="Goles totales"
                op={getParam('totalGoalsOp', 'gte')}
                value={totalGoalsInput}
                max="48"
                placeholder="Ej. 5"
                onOpChange={(value) => updateFilters({ totalGoalsOp: value })}
                onValueChange={setTotalGoalsInput}
              />
            </FilterGrid>
          </FilterSection>
          <FilterSection>
            <FilterSectionTitle>Período de Fecha</FilterSectionTitle>
            <DateFilterProvider>
              <FilterGrid>
                <DateFilter
                  key={`dateFrom-${dateResetKey}`}
                  id="dateFrom"
                  label="Desde"
                  value={dateFrom}
                  onChange={(value) => updateFilters({ dateFrom: value })}
                />
                <DateFilter
                  key={`dateTo-${dateResetKey}`}
                  id="dateTo"
                  label="Hasta"
                  value={dateTo}
                  onChange={(value) => updateFilters({ dateTo: value })}
                />

                <ClearButton onClick={handleClearFilters}>
                  Limpiar Filtros
                </ClearButton>
              </FilterGrid>
            </DateFilterProvider>
          </FilterSection>
        </FilterCard>
        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
        {loading ? (
          <PageLoader />
        ) : (
          <>
            <ResultsHeader>
              <span>
                Partidos encontrados: <strong>{data?.totalMatches || 0}</strong>
              </span>
              <ResultsBadge>
                Página {page} de {data?.totalPages || 1}
              </ResultsBadge>
            </ResultsHeader>
            <MatchesTable matches={data?.matches || []} />
            <PaginationWrapper>
              <Pagination
                count={data?.totalPages || 0}
                page={page}
                onChange={handlePageChange}
                variant="outlined"
                color="secondary"
                size={!isXS ? 'small' : 'medium'}
              />
            </PaginationWrapper>
          </>
        )}
      </PageContainer>
    </motion.div>
  )
}

export default MatchListing
