// IMPORTANTE: este módulo importa `recharts` (~100 kB gzip). Solo se debe
// cargar con `React.lazy(() => import('../RatingHistoryChart'))` y no se
// reexporta desde `components/index.js`, para que quede en un chunk aparte.
import {
  CartesianGrid,
  Customized,
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
  MARK_LANE_HEIGHT,
  REFERENCE_RATING,
  assignMarkLanes,
  buildAxisTicks,
  buildChartRows,
  computeYDomain,
  describeChartForScreenReaders,
  describeMarkTitle,
  describePointProbability,
  fitMarkLabel,
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

const MARGIN_TOP = 8
const BAR_HEIGHT = MARK_LANE_HEIGHT - 2
const MIN_BAR_WIDTH = 3
const BAR_PADDING = 4
const EMPTY_MARKS = []

export const TournamentMarks = ({ tournamentMarks, xAxisMap, offset }) => {
  const scale = xAxisMap && Object.values(xAxisMap)[0]?.scale
  if (!scale || !offset || !tournamentMarks?.length) return null
  const bottom = offset.top + offset.height

  return (
    <g className="tournament-marks">
      {tournamentMarks.map((mark) => {
        const startX = scale(mark.fromX)
        const endX = scale(mark.toX)
        const hasLane = mark.lane !== null
        const barY = hasLane
          ? MARGIN_TOP / 2 + mark.lane * MARK_LANE_HEIGHT
          : offset.top - 6
        const barHeight = hasLane ? BAR_HEIGHT : 4
        const barWidth = Math.max(endX - startX, MIN_BAR_WIDTH)
        const label = hasLane
          ? fitMarkLabel(mark.name, barWidth - BAR_PADDING * 2)
          : ''
        const line = (x, dash) => (
          <line
            x1={x}
            x2={x}
            y1={barY + barHeight}
            y2={bottom}
            stroke={mark.color}
            strokeWidth={1}
            strokeOpacity={0.7}
            strokeDasharray={dash}
          />
        )
        return (
          <g key={mark.id} className="tournament-mark">
            <title>{describeMarkTitle(mark)}</title>
            {line(startX, '4 3')}
            {mark.toX !== mark.fromX && line(endX, '1.5 3')}
            <rect
              className="tournament-mark-bar"
              x={startX}
              y={barY}
              width={barWidth}
              height={barHeight}
              rx={2}
              fill={mark.color}
              fillOpacity={0.9}
            />
            {label && (
              <text
                x={startX + BAR_PADDING}
                y={barY + BAR_HEIGHT - 3.5}
                fontSize={11}
                fill="#fff"
                pointerEvents="none"
              >
                {label}
              </text>
            )}
          </g>
        )
      })}
    </g>
  )
}

export const RatingHistoryTooltip = ({ active, payload, mode }) => {
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
          ? `Inicio del ${mode === 'tournament' ? 'torneo' : 'período'}`
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

const RatingHistoryChart = ({
  data,
  selectedIds,
  colors,
  marks = EMPTY_MARKS,
  mode = 'period',
}) => {
  const isTournament = mode === 'tournament'
  const { rows, ticks, domain, description, chosen, laidOutMarks, lanes } =
    useMemo(() => {
      const chosenPlayers = data.players.filter(({ player }) =>
        selectedIds.includes(String(player.id)),
      )
      const chartRows = buildChartRows({
        timeline: data.matchesTimeline,
        players: data.players,
        selectedIds,
      })
      const placed = assignMarkLanes(marks)
      return {
        chosen: chosenPlayers,
        rows: chartRows,
        ticks: buildAxisTicks(data.matchesTimeline, data),
        domain: computeYDomain(chartRows, selectedIds),
        laidOutMarks: placed.marks,
        lanes: placed.lanes,
        description: describeChartForScreenReaders({
          players: chosenPlayers,
          dateFrom: data.dateFrom,
          dateTo: data.dateTo,
          matchesInPeriod: data.matchesInPeriod,
          marks,
          tournamentName: isTournament
            ? data.scope?.tournament?.name ?? null
            : null,
        }),
      }
    }, [data, selectedIds, marks, isTournament])

  const labelsByX = new Map(ticks.map(({ x, label }) => [x, label]))

  return (
    <ChartCard>
      {chosen.length === 0 ? (
        <EmptyChart>
          Elegí al menos un jugador para ver su evolución en el gráfico.
        </EmptyChart>
      ) : (
        <ChartBox
          role="img"
          aria-label={description}
          $extraHeight={lanes * MARK_LANE_HEIGHT}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={rows}
              margin={{
                top: MARGIN_TOP + lanes * MARK_LANE_HEIGHT,
                right: 16,
                bottom: 18,
                left: 0,
              }}
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
                  value: isTournament
                    ? 'Partidos del torneo'
                    : 'Partidos del período',
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
              {laidOutMarks.length > 0 && (
                <Customized
                  component={<TournamentMarks tournamentMarks={laidOutMarks} />}
                />
              )}
              <Tooltip content={<RatingHistoryTooltip mode={mode} />} />
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
