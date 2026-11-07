import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { Link } from 'react-router-dom'
import { Rank } from '../../styled'
import EloDelta from '../EloDelta'
import MatchResult from '../MatchResult'
import {
  ChangeValue,
  MatchesNote,
  PeakValue,
  PlayerCell,
  PlayerNameText,
  ProvisionalTag,
  RatingValue,
  RatingsTable as Table,
  TableScroll,
} from '../RatingsTable/styled'
import {
  ColorDot,
  DebutTag,
  PositionCell,
  SummaryCard,
  SummaryTitle,
  UpsetBlock,
  UpsetCard,
  UpsetEmpty,
  UpsetGrid,
  UpsetLabel,
  UpsetLink,
  UpsetMeta,
  UpsetPlayer,
} from './styled'
import { describeRatingChange, formatRating } from 'utils/ratings'
import {
  REFERENCE_RATING,
  buildPeriodRanking,
  buildUpsetMatchesLink,
  describeUpsetProbability,
  formatMatchDay,
  resolveUpsetRatingChange,
} from 'utils/ratingHistory'

const ARROW_ICONS = {
  up: <ArrowDropUpIcon aria-hidden="true" />,
  down: <ArrowDropDownIcon aria-hidden="true" />,
}

const describePositionChange = (change) => {
  if (typeof change !== 'number' || change === 0) return null
  return {
    trend: change > 0 ? 'up' : 'down',
    value: Math.abs(change),
    label: `${change > 0 ? 'Subió' : 'Bajó'} ${Math.abs(change)} ${
      Math.abs(change) === 1 ? 'lugar' : 'lugares'
    } en el ranking`,
  }
}

const Upset = ({ kind, playerId, playerName, upset, scopeLabel }) => {
  const won = kind === 'won'
  const label = won ? 'Mayor upset' : 'Peor upset'
  if (!upset) {
    return (
      <UpsetBlock $kind={kind}>
        <UpsetLabel>{label}</UpsetLabel>
        <UpsetEmpty>Sin upsets en el {scopeLabel}</UpsetEmpty>
      </UpsetBlock>
    )
  }
  const link = buildUpsetMatchesLink(playerId, upset)
  const chance = describeUpsetProbability(kind, upset.probability)
  const ratingChange = resolveUpsetRatingChange(kind, upset)
  return (
    <UpsetBlock $kind={kind}>
      <UpsetLabel>{label}</UpsetLabel>
      <MatchResult
        playerName={playerName}
        opponentName={upset.opponent.name}
        score={upset.score}
        teams={upset.teams}
      />
      <UpsetMeta>
        {chance && `${chance} · `}
        {ratingChange !== null && (
          <>
            <EloDelta change={ratingChange} /> ·{' '}
          </>
        )}
        {formatMatchDay(upset.t)}
      </UpsetMeta>
      {link && (
        <UpsetLink>
          <Link to={link}>Ver partido</Link>
        </UpsetLink>
      )}
    </UpsetBlock>
  )
}

const formatPosition = (position) =>
  typeof position === 'number' ? `${position}°` : '—'

const PeriodSummary = ({ players, colors, mode = 'period' }) => {
  const ranking = buildPeriodRanking(players)
  if (ranking.length === 0) return null
  const isTournament = mode === 'tournament'
  const scopeLabel = isTournament ? 'torneo' : 'período'

  return (
    <>
      <SummaryCard>
        <SummaryTitle>Ranking del {scopeLabel}</SummaryTitle>
        <TableScroll>
          <Table
            aria-label={`Ranking de jugadores por variación de Elo en el ${scopeLabel}`}
          >
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col" style={{ textAlign: 'left' }}>
                  Jugador
                </th>
                <th scope="col">Elo inicial</th>
                <th scope="col">Elo final</th>
                <th scope="col">Variación</th>
                <th scope="col">Mín.</th>
                <th scope="col">Máx.</th>
                <th scope="col">V/E/D</th>
                {!isTournament && <th scope="col">Posición</th>}
              </tr>
            </thead>
            <tbody>
              {ranking.map((row) => {
                const change = describeRatingChange(row.summary.ratingChange)
                const position = describePositionChange(
                  row.summary.positionChange,
                )
                const { wins, draws, losses } = row.summary.record
                return (
                  <tr key={row.player.id}>
                    <td>
                      <div
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <Rank $rank={row.rank}>{row.rank}</Rank>
                      </div>
                    </td>
                    <PlayerCell scope="row">
                      <ColorDot
                        $color={colors.get(String(row.player.id))}
                        aria-hidden="true"
                      />
                      <PlayerNameText>{row.player.name}</PlayerNameText>
                      {row.start === null && <DebutTag>Debut</DebutTag>}
                      {row.summary.provisional && (
                        <ProvisionalTag>Provisorio</ProvisionalTag>
                      )}
                      <MatchesNote>
                        {row.summary.matchesInPeriod}{' '}
                        {row.summary.matchesInPeriod === 1
                          ? 'partido'
                          : 'partidos'}
                      </MatchesNote>
                    </PlayerCell>
                    <td>
                      <PeakValue>
                        {formatRating(
                          row.start ? row.start.rating : REFERENCE_RATING,
                        )}
                      </PeakValue>
                    </td>
                    <td>
                      <RatingValue>{formatRating(row.end.rating)}</RatingValue>
                    </td>
                    <td>
                      <ChangeValue $trend={change.trend}>
                        {ARROW_ICONS[change.trend]}
                        {change.text}
                      </ChangeValue>
                    </td>
                    <td>
                      <PeakValue>
                        {formatRating(row.summary.min.rating)}
                      </PeakValue>
                    </td>
                    <td>
                      <PeakValue>
                        {formatRating(row.summary.max.rating)}
                      </PeakValue>
                    </td>
                    <td>
                      <PeakValue>{`${wins}/${draws}/${losses}`}</PeakValue>
                    </td>
                    {!isTournament && (
                      <td>
                        <PositionCell>
                          <PeakValue>
                            {formatPosition(row.summary.position)}
                          </PeakValue>
                          {position && (
                            <ChangeValue
                              $trend={position.trend}
                              aria-label={position.label}
                              title={position.label}
                            >
                              {ARROW_ICONS[position.trend]}
                              {position.value}
                            </ChangeValue>
                          )}
                        </PositionCell>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </TableScroll>
      </SummaryCard>
      <SummaryCard>
        <SummaryTitle>Upsets del {scopeLabel}</SummaryTitle>
        <UpsetGrid>
          {ranking.map((row) => (
            <UpsetCard key={row.player.id}>
              <UpsetPlayer>
                <ColorDot
                  $color={colors.get(String(row.player.id))}
                  aria-hidden="true"
                />
                {row.player.name}
              </UpsetPlayer>
              <Upset
                kind="won"
                playerId={row.player.id}
                playerName={row.player.name}
                upset={row.summary.biggestUpsetWon}
                scopeLabel={scopeLabel}
              />
              <Upset
                kind="lost"
                playerId={row.player.id}
                playerName={row.player.name}
                upset={row.summary.worstUpsetLost}
                scopeLabel={scopeLabel}
              />
            </UpsetCard>
          ))}
        </UpsetGrid>
      </SummaryCard>
    </>
  )
}

export default PeriodSummary
