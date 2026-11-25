import { useMemo, useState } from 'react'
import { buildPeriodRanking } from 'utils/ratingHistory'
import { ShortcutButton } from '../PeriodFilter/styled'
import { ColorDot, SummaryCard, SummaryTitle } from '../PeriodSummary/styled'
import {
  DifferenceBar,
  DifferenceCell,
  DifferenceFill,
  DifferenceValue,
  EmptyState,
  Explanation,
  MetricValue,
  PerformanceTable,
  Player,
  TableScroll,
  Toggle,
  ToggleLabel,
} from './styled'

const VIEWS = {
  all: 'all',
  knockouts: 'knockouts',
}

const OPTIONS = [
  { id: VIEWS.all, label: 'Todos los partidos' },
  { id: VIEWS.knockouts, label: 'Eliminatorias' },
]

const isMetric = (metric) =>
  Number.isInteger(metric?.matches) &&
  metric.matches > 0 &&
  Number.isFinite(metric.actualPercentage) &&
  Number.isFinite(metric.expectedPercentage) &&
  Number.isFinite(metric.differencePercentagePoints)

const getTrend = (value) => {
  if (value > 0) return 'up'
  if (value < 0) return 'down'
  return 'neutral'
}

const formatPercentage = (value) =>
  `${value.toLocaleString('es-AR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`

const formatDifference = (value) =>
  `${value > 0 ? '+' : ''}${value.toLocaleString('es-AR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} pp`

const PerformanceVsExpected = ({ players, colors }) => {
  const [view, setView] = useState(VIEWS.all)
  const ranking = useMemo(() => buildPeriodRanking(players), [players])
  const supportsPerformance = ranking.some(
    (row) => row.summary?.performanceVsExpected,
  )

  const rows = ranking
    .map((row) => ({
      ...row,
      metric: row.summary?.performanceVsExpected?.[view],
    }))
    .filter((row) => isMetric(row.metric))
  const scale = Math.max(
    ...rows.map((row) => Math.abs(row.metric.differencePercentagePoints)),
    0,
  )

  if (!supportsPerformance) return null

  return (
    <SummaryCard>
      <SummaryTitle>Rendimiento frente al pronóstico</SummaryTitle>
      <Explanation>
        Compara los resultados obtenidos con lo que el Rating APA esperaba antes
        de cada partido, según el nivel del rival y los equipos utilizados. La
        diferencia muestra cuántos puntos porcentuales rindió cada jugador por
        encima o por debajo del pronóstico.
      </Explanation>
      <Toggle role="group" aria-label="Partidos incluidos">
        <ToggleLabel aria-hidden="true">Ver:</ToggleLabel>
        {OPTIONS.map((option) => (
          <ShortcutButton
            key={option.id}
            type="button"
            $active={view === option.id}
            aria-pressed={view === option.id}
            onClick={() => setView(option.id)}
          >
            {option.label}
          </ShortcutButton>
        ))}
      </Toggle>
      {rows.length === 0 ? (
        <EmptyState>
          No hay partidos de eliminatorias en este ámbito.
        </EmptyState>
      ) : (
        <TableScroll>
          <PerformanceTable aria-label="Resultados obtenidos comparados con lo esperado">
            <thead>
              <tr>
                <th scope="col">Jugador</th>
                <th scope="col">Obtenido</th>
                <th scope="col">Esperado</th>
                <th scope="col">Diferencia</th>
                <th scope="col">Partidos</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const difference = row.metric.differencePercentagePoints
                const width =
                  scale === 0 ? 0 : (Math.abs(difference) / scale) * 50
                return (
                  <tr key={row.player.id}>
                    <Player scope="row">
                      <ColorDot
                        $color={colors.get(String(row.player.id))}
                        aria-hidden="true"
                      />
                      {row.player.name}
                    </Player>
                    <td>
                      <MetricValue>
                        {formatPercentage(row.metric.actualPercentage)}
                      </MetricValue>
                    </td>
                    <td>
                      <MetricValue>
                        {formatPercentage(row.metric.expectedPercentage)}
                      </MetricValue>
                    </td>
                    <td>
                      <DifferenceCell>
                        <DifferenceValue
                          $difference={difference}
                          data-trend={getTrend(difference)}
                        >
                          {formatDifference(difference)}
                        </DifferenceValue>
                        <DifferenceBar aria-hidden="true">
                          <DifferenceFill
                            $positive={difference >= 0}
                            $width={width}
                            $difference={difference}
                          />
                        </DifferenceBar>
                      </DifferenceCell>
                    </td>
                    <td>
                      <MetricValue>{row.metric.matches}</MetricValue>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </PerformanceTable>
        </TableScroll>
      )}
    </SummaryCard>
  )
}

export default PerformanceVsExpected
