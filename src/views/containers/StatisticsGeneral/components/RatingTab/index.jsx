import { Suspense, lazy, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import useRatingHistory from 'hooks/useRatingHistory'
import {
  buildPlayerColors,
  getShortcutRange,
  getTodayArgentina,
  parsePlayersParam,
  resolvePeriod,
  resolveSelection,
  serializePlayersParam,
} from 'utils/ratingHistory'
import { EmptyMessage, Section, SectionTitle } from '../../styled'
import PeriodFilter from '../PeriodFilter'
import PeriodSummary from '../PeriodSummary'
import PlayerPicker from '../PlayerPicker'
import RatingsTable from '../RatingsTable'
import { Content, Notice, RetryButton } from './styled'

// El gráfico arrastra Recharts (~100 kB gzip): se carga recién al abrir la
// pestaña y no se importa de forma estática en ningún otro lado.
const RatingHistoryChart = lazy(() => import('../RatingHistoryChart'))

const RatingTab = ({ ratings }) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const today = getTodayArgentina()
  const period = resolvePeriod(
    {
      dateFrom: searchParams.get('dateFrom') || '',
      dateTo: searchParams.get('dateTo') || '',
    },
    today,
  )
  const isReady = period.status === 'ok'
  const { data, loading, error, retry } = useRatingHistory({
    dateFrom: isReady ? period.dateFrom : '',
    dateTo: isReady ? period.dateTo : '',
  })

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

  const selectShortcut = (slug) => {
    const range = getShortcutRange(slug, today)
    if (!range) return
    const params = new URLSearchParams(searchParams)
    params.set('dateFrom', range.dateFrom)
    params.set('dateTo', range.dateTo)
    setSearchParams(params)
  }

  const changeDate = (key, value) => {
    const range = {
      dateFrom: period.dateFrom,
      dateTo: period.dateTo,
      [key]: value,
    }
    const params = new URLSearchParams(searchParams)
    ;['dateFrom', 'dateTo'].forEach((name) => {
      if (range[name]) params.set(name, range[name])
      else params.delete(name)
    })
    setSearchParams(params)
  }

  const changeSelection = (ids) => {
    const params = new URLSearchParams(searchParams)
    params.delete('players')
    serializePlayersParam(ids).forEach((id) => params.append('players', id))
    // La selección no es navegación: no llena el historial del navegador.
    setSearchParams(params, { replace: true })
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
    if (!data) {
      return <Notice role="status">Cargando evolución del rating…</Notice>
    }
    if (data.matchesInPeriod === 0 || data.players.length === 0) {
      return (
        <Content $loading={loading} aria-busy={loading}>
          <Notice>No hay partidos en este período.</Notice>
        </Content>
      )
    }
    return (
      <Content $loading={loading} aria-busy={loading}>
        <PlayerPicker
          players={pickerPlayers}
          colors={colors}
          selectedIds={selectedIds}
          onChange={changeSelection}
        />
        <Suspense fallback={<Notice role="status">Cargando gráfico…</Notice>}>
          <RatingHistoryChart
            data={data}
            selectedIds={selectedIds}
            colors={colors}
          />
        </Suspense>
        <PeriodSummary players={data.players} colors={colors} />
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
        slug={period.slug}
        dateFrom={period.dateFrom}
        dateTo={period.dateTo}
        onShortcut={selectShortcut}
        onDateChange={changeDate}
      />
      {renderHistory()}
    </Section>
  )
}

export default RatingTab
