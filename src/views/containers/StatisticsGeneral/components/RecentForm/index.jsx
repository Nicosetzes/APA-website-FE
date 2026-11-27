import { useMemo, useState } from 'react'
import { ShortcutButton } from '../PeriodFilter/styled'
import { ColorDot, SummaryCard, SummaryTitle } from '../PeriodSummary/styled'
import {
  AdjustmentValue,
  DifferenceValue,
  EmptyState,
  Explanation,
  MetricValue,
  PerformanceTable,
  Player,
  TableScroll,
  Toggle,
  ToggleLabel,
} from '../PerformanceVsExpected/styled'

const WINDOWS = [5, 10, 25]

const isMetric = (metric) => {
  if (!Number.isInteger(metric?.matches) || metric.matches < 0) return false
  if (
    !metric.record ||
    !['wins', 'draws', 'losses'].every((key) =>
      Number.isInteger(metric.record[key]),
    )
  ) {
    return false
  }
  if (metric.matches === 0) return true
  return [
    metric.actualPercentage,
    metric.expectedPercentage,
    metric.differencePercentagePoints,
    metric.ratingChange,
  ].every(Number.isFinite)
}

const formatPercentage = (value) =>
  Number.isFinite(value)
    ? `${value.toLocaleString('es-AR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}%`
    : '—'

const formatSigned = (value, suffix = '') =>
  Number.isFinite(value)
    ? `${value > 0 ? '+' : ''}${value.toLocaleString('es-AR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}${suffix}`
    : '—'

const trend = (value) => {
  if (value > 0) return 'up'
  if (value < 0) return 'down'
  return 'neutral'
}

const RecentForm = ({ players, colors }) => {
  const [windowSize, setWindowSize] = useState(5)
  const rows = useMemo(
    () =>
      (players ?? [])
        .map((row) => ({
          ...row,
          metric: row.recentForm?.[windowSize],
        }))
        .filter((row) => isMetric(row.metric)),
    [players, windowSize],
  )
  const incomplete = rows.filter((row) => row.metric.matches < windowSize)

  return (
    <SummaryCard>
      <SummaryTitle>Forma reciente</SummaryTitle>
      <Explanation>
        Compara lo obtenido con el pronóstico del Rating APA en los últimos
        partidos de cada jugador.
      </Explanation>
      <Toggle role="group" aria-label="Ventana de forma reciente">
        <ToggleLabel aria-hidden="true">Últimos:</ToggleLabel>
        {WINDOWS.map((size) => (
          <ShortcutButton
            key={size}
            type="button"
            $active={windowSize === size}
            aria-pressed={windowSize === size}
            onClick={() => setWindowSize(size)}
          >
            {size} partidos
          </ShortcutButton>
        ))}
      </Toggle>
      {rows.length === 0 ? (
        <EmptyState>No hay datos para esta ventana.</EmptyState>
      ) : (
        <>
          <TableScroll>
            <PerformanceTable aria-label="Forma reciente de los jugadores">
              <thead>
                <tr>
                  <th scope="col">Jugador</th>
                  <th scope="col">V/E/D</th>
                  <th scope="col">Obtenido</th>
                  <th scope="col">Esperado</th>
                  <th scope="col">Diferencia</th>
                  <th scope="col">Variación rating</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const { metric } = row
                  const difference = metric.differencePercentagePoints
                  const ratingChange = metric.ratingChange
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
                          {`${metric.record.wins}/${metric.record.draws}/${metric.record.losses}`}
                        </MetricValue>
                      </td>
                      <td>
                        <MetricValue>
                          {formatPercentage(metric.actualPercentage)}
                        </MetricValue>
                      </td>
                      <td>
                        <MetricValue>
                          {formatPercentage(metric.expectedPercentage)}
                        </MetricValue>
                      </td>
                      <td>
                        <DifferenceValue
                          $difference={difference}
                          data-trend={
                            Number.isFinite(difference)
                              ? trend(difference)
                              : undefined
                          }
                        >
                          {formatSigned(difference, ' pp')}
                        </DifferenceValue>
                      </td>
                      <td>
                        <AdjustmentValue $difference={ratingChange}>
                          {formatSigned(ratingChange)}
                        </AdjustmentValue>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </PerformanceTable>
          </TableScroll>
          {incomplete.length > 0 && (
            <EmptyState role="status">
              {incomplete.map(({ player, metric }) => (
                <span key={player.id}>
                  {player.name}: {metric.matches} de {windowSize} partidos.{' '}
                </span>
              ))}
            </EmptyState>
          )}
        </>
      )}
    </SummaryCard>
  )
}

export default RecentForm
