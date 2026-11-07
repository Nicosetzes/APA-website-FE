// IMPORTANTE: este módulo importa `recharts` (~100 kB gzip). Solo se debe
// cargar con `React.lazy(() => import('../RatingHistoryChart'))` y no se
// reexporta desde `components/index.js`, para que quede en un chunk aparte.
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useMemo } from 'react'
import { formatRating } from 'utils/ratings'
import {
  REFERENCE_RATING,
  buildAxisTicks,
  buildChartRows,
  computeYDomain,
  describeChartForScreenReaders,
  describePointProbability,
  formatMatchDay,
  playerKey,
} from 'utils/ratingHistory'
import EloDelta from '../EloDelta'
import MatchResult from '../MatchResult'
import {
  ChartBox,
  ChartCard,
  EmptyChart,
  TooltipBox,
  TooltipDetail,
  TooltipMatch,
  TooltipOthers,
  TooltipPlayer,
  TooltipRow,
  TooltipTitle,
} from './styled'

export const RatingHistoryTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  const entries = payload
    .filter((entry) => typeof entry.value === 'number')
    .map((entry) => ({ ...entry, id: String(entry.dataKey).slice(2) }))
  const played = entries.filter((entry) => row.points?.[entry.id])
  const others = entries.filter((entry) => !row.points?.[entry.id])

  return (
    <TooltipBox>
      <TooltipTitle>
        {row.x === 0
          ? 'Inicio del período'
          : `Partido ${row.x}${row.t ? ` · ${formatMatchDay(row.t)}` : ''}`}
      </TooltipTitle>
      {played.map((entry) => {
        const point = row.points[entry.id]
        const chance = describePointProbability(point.probability)
        return (
          <TooltipMatch key={entry.id}>
            <TooltipPlayer $color={entry.color}>
              <span>{entry.name}</span>
              <span>
                {formatRating(point.rating)} (<EloDelta change={point.delta} />)
              </span>
            </TooltipPlayer>
            <MatchResult
              compact
              playerName={entry.name}
              opponentName={point.opponent.name}
              score={point.score}
              teams={point.teams}
              penalties={point.penalties}
            />
            {point.tournament && (
              <TooltipDetail>{point.tournament}</TooltipDetail>
            )}
            {chance && <TooltipDetail>{chance}</TooltipDetail>}
          </TooltipMatch>
        )
      })}
      {others.length > 0 && (
        <TooltipOthers>
          {others.map((entry) => (
            <TooltipRow key={entry.id} $color={entry.color}>
              <span>{entry.name}</span>
              <span>{formatRating(entry.value)}</span>
            </TooltipRow>
          ))}
        </TooltipOthers>
      )}
    </TooltipBox>
  )
}

const RatingHistoryChart = ({ data, selectedIds, colors }) => {
  const { rows, ticks, domain, description, chosen } = useMemo(() => {
    const chosenPlayers = data.players.filter(({ player }) =>
      selectedIds.includes(String(player.id)),
    )
    const chartRows = buildChartRows({
      timeline: data.matchesTimeline,
      players: data.players,
      selectedIds,
    })
    return {
      chosen: chosenPlayers,
      rows: chartRows,
      ticks: buildAxisTicks(data.matchesTimeline, data),
      domain: computeYDomain(chartRows, selectedIds),
      description: describeChartForScreenReaders({
        players: chosenPlayers,
        dateFrom: data.dateFrom,
        dateTo: data.dateTo,
        matchesInPeriod: data.matchesInPeriod,
      }),
    }
  }, [data, selectedIds])

  const labelsByX = new Map(ticks.map(({ x, label }) => [x, label]))

  return (
    <ChartCard>
      {chosen.length === 0 ? (
        <EmptyChart>
          Elegí al menos un jugador para ver su evolución en el gráfico.
        </EmptyChart>
      ) : (
        <ChartBox role="img" aria-label={description}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={rows}
              margin={{ top: 8, right: 16, bottom: 18, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                type="number"
                dataKey="x"
                domain={[0, Math.max(data.matchesTimeline.length, 1)]}
                ticks={ticks.map(({ x }) => x)}
                tickFormatter={(x) => labelsByX.get(x) ?? ''}
                interval={0}
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                label={{
                  value: 'Partidos del período',
                  position: 'insideBottom',
                  offset: -12,
                  fontSize: 12,
                }}
              />
              <YAxis
                domain={domain}
                width={48}
                tick={{ fontSize: 12 }}
                allowDecimals={false}
              />
              <ReferenceLine
                y={REFERENCE_RATING}
                stroke="#6b7280"
                strokeDasharray="6 4"
              />
              <Tooltip content={<RatingHistoryTooltip />} />
              {chosen.map(({ player }) => (
                <Line
                  key={player.id}
                  type="stepAfter"
                  dataKey={playerKey(player.id)}
                  name={player.name}
                  stroke={colors.get(String(player.id))}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
      )}
    </ChartCard>
  )
}

export default RatingHistoryChart
