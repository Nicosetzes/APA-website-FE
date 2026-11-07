import { Suspense, lazy, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import useActiveTournaments from 'hooks/useActiveTournaments'
import useRatingHistory from 'hooks/useRatingHistory'
import {
  buildActiveMarks,
  buildPlayerColors,
  formatDay,
  getShortcutRange,
  getTodayArgentina,
  parsePlayersParam,
  parseTournamentParam,
  resolvePeriod,
  resolveSelection,
  serializePlayersParam,
} from 'utils/ratingHistory'
import TournamentSelect, {
  ALL_TOURNAMENTS,
} from 'views/containers/TournamentSelect'
import { Loader } from 'views/components'
import {
  EmptyMessage,
  Section,
  SectionTitle,
  SpinnerContainer,
} from '../../styled'
import PeriodFilter from '../PeriodFilter'
import PeriodSummary from '../PeriodSummary'
import PlayerPicker from '../PlayerPicker'
import RatingsTable from '../RatingsTable'
import {
  Content,
  Notice,
  RetryButton,
  TournamentHeading,
  TournamentMeta,
  TournamentTitle,
} from './styled'

// El gráfico arrastra Recharts (~100 kB gzip): se carga recién al abrir la
// pestaña y no se importa de forma estática en ningún otro lado.
const RatingHistoryChart = lazy(() => import('../RatingHistoryChart'))

const EMPTY_MARKS = []

const DIMMED_NOTE =
  'El período no aplica mientras hay un torneo elegido. Elegí un período para volver.'
const TOURNAMENTS_ERROR =
  'No se pudo cargar la lista de torneos; el filtro por torneo no está disponible.'

const RatingTab = ({ ratings }) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const tournamentId = parseTournamentParam(searchParams.get('tournamentId'))
  const isTournamentMode = tournamentId !== ''
  const mode = isTournamentMode ? 'tournament' : 'period'

  const today = getTodayArgentina()
  const period = resolvePeriod(
    {
      dateFrom: searchParams.get('dateFrom') || '',
      dateTo: searchParams.get('dateTo') || '',
    },
    today,
  )
  const isReady = isTournamentMode || period.status === 'ok'
  const requestsPeriod = isReady && !isTournamentMode
  const { data, loading, error, retry } = useRatingHistory({
    dateFrom: requestsPeriod ? period.dateFrom : '',
    dateTo: requestsPeriod ? period.dateTo : '',
    tournamentId,
  })
  const activeTournaments = useActiveTournaments()

  // Los ids son de Mongo (sin comas): se resume el param en un string para que
  // la selección solo se recalcule cuando cambia `players` o los datos.
  const playersParam = searchParams.getAll('players').join(',')
  const selectedIds = useMemo(
    () =>
      resolveSelection(
        parsePlayersParam(playersParam ? playersParam.split(',') : []),
        data?.players ?? [],
      ),
    [playersParam, data],
  )

  const colors = useMemo(
    () =>
      buildPlayerColors([
        ...(ratings ?? []).map((row) => row.player.id),
        ...(data?.players ?? []).map(({ player }) => player.id),
      ]),
    [ratings, data],
  )

  const pickerPlayers = useMemo(
    () =>
      (data?.players ?? []).map(({ player }) => ({
        id: String(player.id),
        name: player.name,
      })),
    [data],
  )

  // Marcas de inicio/fin: solo en modo período y solo de los torneos activos.
  // Con datos de un torneo (o de un BE sin `tournaments`) no hay marcas.
  const marks = useMemo(
    () =>
      isTournamentMode || data?.scope?.type === 'tournament'
        ? EMPTY_MARKS
        : buildActiveMarks(data?.tournaments, activeTournaments.tournaments),
    [isTournamentMode, data, activeTournaments.tournaments],
  )

  const updateParams = (change) => {
    const params = new URLSearchParams(searchParams)
    change(params)
    setSearchParams(params)
  }

  const selectTournament = (id) =>
    updateParams((params) => {
      if (!id || id === ALL_TOURNAMENTS) {
        params.delete('tournamentId')
        return
      }
      params.set('tournamentId', id)
      params.delete('dateFrom')
      params.delete('dateTo')
    })

  const selectShortcut = (slug) => {
    const range = getShortcutRange(slug, today)
    if (!range) return
    updateParams((params) => {
      params.delete('tournamentId')
      params.set('dateFrom', range.dateFrom)
      params.set('dateTo', range.dateTo)
    })
  }

  const changeDate = (key, value) => {
    const range = {
      dateFrom: period.dateFrom,
      dateTo: period.dateTo,
      [key]: value,
    }
    updateParams((params) => {
      params.delete('tournamentId')
      ;['dateFrom', 'dateTo'].forEach((name) => {
        if (range[name]) params.set(name, range[name])
        else params.delete(name)
      })
    })
  }

  const changeSelection = (ids) => {
    const params = new URLSearchParams(searchParams)
    params.delete('players')
    serializePlayersParam(ids).forEach((id) => params.append('players', id))
    // La selección no es navegación: no llena el historial del navegador.
    setSearchParams(params, { replace: true })
  }

  // Los datos de la otra modalidad (período <-> torneo) que quedan mientras se
  // pide la nueva no se muestran como si fueran de la actual.
  const isStale =
    data !== null &&
    (isTournamentMode
      ? data.scope?.type !== 'tournament' ||
        String(data.scope.tournament?.id) !== tournamentId
      : data.scope?.type === 'tournament')

  const listedTournament = activeTournaments.tournaments.find(
    (tournament) => String(tournament._id) === tournamentId,
  )
  const scopedTournament =
    data?.scope?.type === 'tournament' &&
    String(data.scope.tournament?.id) === tournamentId
      ? data.scope.tournament
      : null
  const tournamentName =
    scopedTournament?.name || listedTournament?.name || 'Torneo'

  // El selector se ofrece si /tournaments respondió con torneos y, cuando ya hay
  // datos de período, el BE los acompaña con `tournaments` (si no, no soporta el
  // filtro por torneo).
  const supportsTournaments = data === null || Array.isArray(data.tournaments)
  const showTournamentSelect =
    activeTournaments.status === 'ok' &&
    activeTournaments.tournaments.length > 0 &&
    supportsTournaments

  const renderTournamentSelect = () => {
    if (!showTournamentSelect) return null
    const extraOption =
      isTournamentMode && !listedTournament
        ? scopedTournament?.name
          ? `${scopedTournament.name} (fuera de la lista)`
          : 'Torneo no disponible'
        : undefined
    return (
      <TournamentSelect
        id="rating-tournament"
        label="Torneo"
        value={tournamentId || ALL_TOURNAMENTS}
        tournaments={activeTournaments.tournaments}
        onChange={selectTournament}
        extraOption={extraOption}
      />
    )
  }

  const renderTournamentHeading = () => {
    const matches = data.matchesInPeriod
    const details = [
      data.dateFrom && data.dateTo
        ? `Del ${formatDay(data.dateFrom)} al ${formatDay(data.dateTo)}`
        : null,
      matches > 0
        ? `${matches} ${matches === 1 ? 'partido' : 'partidos'}`
        : null,
    ].filter(Boolean)
    return (
      <TournamentHeading>
        <TournamentTitle>Torneo: {tournamentName}</TournamentTitle>
        {details.length > 0 && (
          <TournamentMeta>{details.join(' · ')}</TournamentMeta>
        )}
      </TournamentHeading>
    )
  }

  const renderHistory = () => {
    if (!isReady) {
      return <Notice role="status">{period.message}</Notice>
    }
    if (error) {
      return (
        <div role="alert">
          <Notice $tone="error">{error}</Notice>
          <RetryButton type="button" onClick={retry}>
            Reintentar
          </RetryButton>
        </div>
      )
    }
    if (!data || (isStale && loading)) {
      return (
        <SpinnerContainer role="status" aria-label="Cargando">
          <Loader />
        </SpinnerContainer>
      )
    }
    if (data.matchesInPeriod === 0 || data.players.length === 0) {
      return (
        <Content $loading={loading} aria-busy={loading}>
          {isTournamentMode && renderTournamentHeading()}
          <Notice>
            {isTournamentMode
              ? 'No hay partidos de este torneo.'
              : 'No hay partidos en este período.'}
          </Notice>
        </Content>
      )
    }
    return (
      <Content $loading={loading} aria-busy={loading}>
        {isTournamentMode && renderTournamentHeading()}
        <PlayerPicker
          players={pickerPlayers}
          colors={colors}
          selectedIds={selectedIds}
          onChange={changeSelection}
        />
        <Suspense
          fallback={
            <SpinnerContainer role="status" aria-label="Cargando">
              <Loader />
            </SpinnerContainer>
          }
        >
          <RatingHistoryChart
            data={data}
            selectedIds={selectedIds}
            colors={colors}
            marks={marks}
            mode={mode}
          />
        </Suspense>
        <PeriodSummary players={data.players} colors={colors} mode={mode} />
      </Content>
    )
  }

  return (
    <Section>
      {ratings === null ? (
        <EmptyMessage style={{ marginBottom: '2rem' }}>
          No se pudo cargar el ranking Elo.
        </EmptyMessage>
      ) : (
        <RatingsTable ratings={ratings} />
      )}
      <SectionTitle>Evolución del Rating APA</SectionTitle>
      <PeriodFilter
        today={today}
        slug={isTournamentMode ? '' : period.slug}
        dateFrom={isTournamentMode ? '' : period.dateFrom}
        dateTo={isTournamentMode ? '' : period.dateTo}
        onShortcut={selectShortcut}
        onDateChange={changeDate}
        dimmed={isTournamentMode}
        dimmedNote={DIMMED_NOTE}
        tournamentSelect={renderTournamentSelect()}
        tournamentsError={
          activeTournaments.status === 'error' ? TOURNAMENTS_ERROR : null
        }
      />
      {renderHistory()}
    </Section>
  )
}

export default RatingTab
