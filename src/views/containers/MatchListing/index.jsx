import Pagination from '@mui/material/Pagination'
import { api } from 'api'
import { apiClient } from 'api/axiosConfig'
import { motion } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'
import { useSearchParams } from 'react-router-dom'
import {
  ClearButton,
  FilterCard,
  FilterGrid,
  FilterSectionTitle,
  FormGroup,
  InlineInputs,
  PaginationWrapper,
  PageContainer,
  ResultsBadge,
  ResultsHeader,
  StyledInput,
  StyledSelect,
} from './styled'
import { MatchesTable, PageLoader } from 'views/components'
import { useCallback, useEffect, useState } from 'react'

const MatchListing = () => {
  const isXS = useMediaQuery({ query: '(min-width: 375px)' })
  const [searchParams, setSearchParams] = useSearchParams()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [players, setPlayers] = useState([])
  const [tournaments, setTournaments] = useState([])

  const page = Number(searchParams.get('page')) || 0
  const teamName = searchParams.get('teamName') || ''
  const player1 = searchParams.get('player1') || ''
  const player2 = searchParams.get('player2') || ''
  const tournamentId = searchParams.get('tournamentId') || ''
  const type = searchParams.get('type') || 'all'
  const outcome = searchParams.get('outcome') || 'all'
  const goalDiffOp = searchParams.get('goalDiffOp') || 'gte'
  const goalDiffVal = searchParams.get('goalDiffVal') || ''
  const dateFrom = searchParams.get('dateFrom') || ''
  const dateTo = searchParams.get('dateTo') || ''

  // Estados locales para los campos de texto con debounce
  const [teamInput, setTeamInput] = useState(teamName)
  const [goalDiffValInput, setGoalDiffValInput] = useState(goalDiffVal)

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
  }, [])

  const updateFilters = useCallback(
    (newFilters) => {
      const params = new URLSearchParams(searchParams)

      if (!('page' in newFilters)) {
        params.set('page', '0')
      }

      if (
        'player1' in newFilters &&
        (!newFilters.player1 || newFilters.player1 === 'all')
      ) {
        delete newFilters.player2
        delete newFilters.outcome
        params.delete('player2')
        params.delete('outcome')
      }

      Object.entries(newFilters).forEach(([key, value]) => {
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

  const handleClearFilters = () => {
    setTeamInput('')
    setGoalDiffValInput('')
    setSearchParams(new URLSearchParams({ page: '0' }))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (teamInput !== teamName) {
        updateFilters({ teamName: teamInput.length > 2 ? teamInput : '' })
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [teamInput, teamName, updateFilters])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (goalDiffValInput !== goalDiffVal) {
        updateFilters({ goalDiffVal: goalDiffValInput })
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [goalDiffValInput, goalDiffVal, updateFilters])

  useEffect(() => {
    setLoading(true)
    const currentParams = new URLSearchParams(searchParams)

    apiClient
      .get(`${api}/matches?${currentParams.toString()}`)
      .then(({ data }) => setData(data))
      .catch((err) => console.error('Error cargando partidos:', err))
      .finally(() => setLoading(false))
  }, [searchParams])

  const handlePageChange = (event, value) => {
    updateFilters({ page: value - 1 })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageContainer>
        <FilterCard>
          <div>
            <FilterSectionTitle>Búsqueda General</FilterSectionTitle>
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
                <label htmlFor="outcomeFilter">Resultado (J1)</label>
                <StyledSelect
                  disabled={!player1}
                  id="outcomeFilter"
                  value={outcome}
                  onChange={(e) => updateFilters({ outcome: e.target.value })}
                >
                  <option value="all">Todos</option>
                  <option value="win">Victoria</option>
                  <option value="draw">Empate</option>
                  <option value="loss">Derrota</option>
                  <option value="penalties">Penales</option>
                </StyledSelect>
              </FormGroup>
              <FormGroup>
                <label htmlFor="player2">Rival</label>
                <StyledSelect
                  disabled={!player1}
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
            </FilterGrid>
          </div>
          <div>
            <FilterSectionTitle>Búsqueda específica</FilterSectionTitle>
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
                <label htmlFor="teamSearch">Equipo</label>
                <StyledInput
                  id="teamSearch"
                  placeholder="Ej. Brazil, Morocco..."
                  value={teamInput}
                  onChange={(e) => setTeamInput(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="goalDiffVal">Diferencia de Goles</label>
                <InlineInputs>
                  <StyledSelect
                    value={goalDiffOp}
                    onChange={(e) =>
                      updateFilters({ goalDiffOp: e.target.value })
                    }
                  >
                    <option value="gte">≥ (Mayor o igual)</option>
                    <option value="lte">≤ (Menor o igual)</option>
                    <option value="eq">= (Igual a)</option>
                  </StyledSelect>
                  <StyledInput
                    id="goalDiffVal"
                    type="number"
                    min="0"
                    placeholder="Ej. 2"
                    value={goalDiffValInput}
                    onChange={(e) => setGoalDiffValInput(e.target.value)}
                  />
                </InlineInputs>
              </FormGroup>
            </FilterGrid>
          </div>
          <div>
            <FilterSectionTitle>Período de Fecha</FilterSectionTitle>
            <FilterGrid>
              <FormGroup>
                <label htmlFor="dateFrom">Desde</label>
                <StyledInput
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => updateFilters({ dateFrom: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="dateTo">Hasta</label>
                <StyledInput
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => updateFilters({ dateTo: e.target.value })}
                />
              </FormGroup>

              <ClearButton onClick={handleClearFilters}>
                Limpiar Filtros
              </ClearButton>
            </FilterGrid>
          </div>
        </FilterCard>
        {loading ? (
          <PageLoader />
        ) : (
          <>
            <ResultsHeader>
              <span>
                Partidos encontrados: <strong>{data?.totalMatches || 0}</strong>
              </span>
              <ResultsBadge>
                Página {page + 1} de {data?.totalPages || 1}
              </ResultsBadge>
            </ResultsHeader>
            <MatchesTable matches={data?.matches || []} />
            <PaginationWrapper>
              <Pagination
                count={data?.totalPages || 0}
                page={page + 1}
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
