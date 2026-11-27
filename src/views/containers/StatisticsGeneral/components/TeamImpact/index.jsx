import { useMemo } from 'react'
import { buildPeriodRanking } from 'utils/ratingHistory'
import { ColorDot, SummaryCard, SummaryTitle } from '../PeriodSummary/styled'
import {
  EmptyState,
  Explanation,
  ImpactTable,
  MetricValue,
  Player,
  QualityBadge,
  Sample,
  TableScroll,
} from './styled'

const QUALITY_LABELS = {
  small: 'Pequeña',
  acceptable: 'Aceptable',
  stable: 'Estable',
}

const isMetric = (metric) =>
  Number.isInteger(metric?.matches) &&
  metric.matches > 0 &&
  Number.isInteger(metric.totalMatches) &&
  metric.totalMatches >= metric.matches &&
  QUALITY_LABELS[metric.sampleQuality] &&
  Number.isFinite(metric.playerRatingExpectedPercentage) &&
  Number.isFinite(metric.teamAdjustmentPercentagePoints) &&
  Number.isFinite(metric.finalExpectedPercentage) &&
  Number.isFinite(metric.actualPercentage) &&
  Number.isFinite(metric.differencePercentagePoints)

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

const TeamImpact = ({ players, colors }) => {
  const ranking = useMemo(() => buildPeriodRanking(players), [players])
  const supportsTeamImpact = ranking.some((row) => row.summary?.teamImpact)
  const rows = ranking.map((row) => ({
    ...row,
    metric: row.summary?.teamImpact,
  }))
  const hasMetrics = rows.some((row) => isMetric(row.metric))

  if (!supportsTeamImpact) return null

  return (
    <SummaryCard>
      <SummaryTitle>Impacto de los equipos</SummaryTitle>
      <Explanation>
        Separa la expectativa que surge del rating de los jugadores del ajuste
        por la fuerza de los equipos. El pronóstico final combina ambas partes y
        se compara con el resultado obtenido.
      </Explanation>
      {!hasMetrics ? (
        <EmptyState role="status">
          No hay partidos con datos de fuerza de ambos equipos en este ámbito.
        </EmptyState>
      ) : (
        <TableScroll>
          <ImpactTable aria-label="Descomposición del impacto de los equipos">
            <thead>
              <tr>
                <th scope="col">Jugador</th>
                <th scope="col">Rating de jugadores</th>
                <th scope="col">Ajuste por equipos</th>
                <th scope="col">Pronóstico final</th>
                <th scope="col">Obtenido</th>
                <th scope="col">Diferencia</th>
                <th scope="col">Muestra</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const valid = isMetric(row.metric)
                const metric = row.metric
                return (
                  <tr key={row.player.id} data-player-id={row.player.id}>
                    <Player scope="row">
                      <ColorDot
                        $color={colors.get(String(row.player.id))}
                        aria-hidden="true"
                      />
                      {row.player.name}
                    </Player>
                    <td data-metric="player-rating">
                      <MetricValue>
                        {valid
                          ? formatPercentage(
                              metric.playerRatingExpectedPercentage,
                            )
                          : '—'}
                      </MetricValue>
                    </td>
                    <td data-metric="team-adjustment">
                      <MetricValue
                        $difference={metric?.teamAdjustmentPercentagePoints}
                      >
                        {valid
                          ? formatDifference(
                              metric.teamAdjustmentPercentagePoints,
                            )
                          : '—'}
                      </MetricValue>
                    </td>
                    <td data-metric="final-prediction">
                      <MetricValue>
                        {valid
                          ? formatPercentage(metric.finalExpectedPercentage)
                          : '—'}
                      </MetricValue>
                    </td>
                    <td data-metric="actual">
                      <MetricValue>
                        {valid
                          ? formatPercentage(metric.actualPercentage)
                          : '—'}
                      </MetricValue>
                    </td>
                    <td data-metric="difference">
                      <MetricValue
                        $difference={metric?.differencePercentagePoints}
                      >
                        {valid
                          ? formatDifference(metric.differencePercentagePoints)
                          : '—'}
                      </MetricValue>
                    </td>
                    <td data-metric="sample">
                      <Sample data-sample-size={metric?.matches ?? 0}>
                        {metric
                          ? `${metric.matches}/${metric.totalMatches}`
                          : '—'}
                        {valid && (
                          <QualityBadge
                            $quality={metric.sampleQuality}
                            data-quality={metric.sampleQuality}
                            aria-label={`Calidad de muestra: ${QUALITY_LABELS[
                              metric.sampleQuality
                            ].toLowerCase()}`}
                          >
                            {QUALITY_LABELS[metric.sampleQuality]}
                          </QualityBadge>
                        )}
                      </Sample>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </ImpactTable>
        </TableScroll>
      )}
    </SummaryCard>
  )
}

export default TeamImpact
