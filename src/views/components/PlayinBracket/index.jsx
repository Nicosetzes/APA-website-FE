import { ConnectorDot } from '../bracketConnectors'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PlayoffMatch from '../PlayoffMatch'
import useDragScroll from 'hooks/useDragScroll'
import {
  CenterTitle,
  Cell,
  Grid,
  Legend,
  LegendItem,
  PassLine,
  QualifiedCard,
  QualifiedInfo,
  QualifiedLabel,
  QualifiedName,
  QualifiedPlayer,
  RoundName,
  TournamentLogo,
  Wrapper,
  ZoneTitle,
} from './styled'
import { cloudName, database } from 'api'

const ZONES = [
  {
    name: 'A',
    side: 'left',
    top: 1,
    bottom: 2,
    second: 5,
    cols: { r1: 1, r2: 2, qualified: 3 },
  },
  {
    name: 'B',
    side: 'right',
    top: 3,
    bottom: 4,
    second: 6,
    cols: { r1: 6, r2: 5, qualified: 4 },
  },
]

const ROW_TOP = 3
const ROW_BOTTOM = 4
const ROW_MIDDLE = '3 / 5'

const buildPlaceholder = (playoffId) => ({
  _id: `preview-${playoffId}`,
  playoff_id: playoffId,
  playerP1: null,
  teamP1: null,
  seedP1: '?',
  scoreP1: null,
  playerP2: null,
  teamP2: null,
  seedP2: '?',
  scoreP2: null,
  played: false,
  outcome: null,
  valid: false,
})

const Qualified = ({ match, label, edge }) => {
  const team = match?.outcome?.teamThatWon
  const player = match?.outcome?.playerThatWon

  return (
    <QualifiedCard $filled={Boolean(team)} $edge={edge}>
      {team ? (
        <img src={`${database}/logos/${team.id}`} alt={team.name} />
      ) : (
        <EmojiEventsIcon htmlColor="rgba(255, 255, 255, 0.35)" />
      )}
      <QualifiedInfo>
        <QualifiedLabel>{label}</QualifiedLabel>
        <QualifiedName>{team?.name || 'Por definir'}</QualifiedName>
        {player?.name && <QualifiedPlayer>{player.name}</QualifiedPlayer>}
      </QualifiedInfo>
    </QualifiedCard>
  )
}

const PlayinBracket = ({ canMutate, cloudinaryId, getData, matches = [] }) => {
  const dragScrollRef = useDragScroll()
  const matchById = new Map(
    (Array.isArray(matches) ? matches : []).map((m) => [
      Number(m.playoff_id),
      m,
    ]),
  )
  const getMatch = (id) => matchById.get(id) || buildPlaceholder(id)

  const renderMatch = (match, side, align = 'center') => (
    <PlayoffMatch
      canMutate={canMutate}
      id={match._id}
      playerP1={match.playerP1}
      teamP1={match.teamP1}
      seedP1={match.seedP1}
      scoreP1={match.scoreP1}
      playerP2={match.playerP2}
      teamP2={match.teamP2}
      seedP2={match.seedP2}
      scoreP2={match.scoreP2}
      played={match.played}
      outcome={match.outcome}
      getData={getData}
      valid={match.valid}
      side={side}
      align={align}
    />
  )

  const renderZone = ({ name, side, top, bottom, second, cols }) => {
    const topMatch = getMatch(top)
    const bottomMatch = getMatch(bottom)
    const secondMatch = getMatch(second)

    const inner = side === 'left' ? 'right' : 'left'
    const outer = side === 'left' ? 'left' : 'right'
    const secondReady = Boolean(topMatch.played && bottomMatch.played)
    const firstCol = Math.min(cols.r1, cols.r2)

    return [
      <ZoneTitle key={`${name}-title`} $col={`${firstCol} / span 2`} $row={1}>
        Zona {name}
      </ZoneTitle>,
      <RoundName key={`${name}-r1`} $col={cols.r1} $row={2}>
        Ronda 1
      </RoundName>,
      <RoundName key={`${name}-r2`} $col={cols.r2} $row={2}>
        Ronda 2
      </RoundName>,

      <Cell
        key={`${name}-top`}
        $col={cols.r1}
        $row={ROW_TOP}
        $edge={inner}
        $out={{
          type: 'split',
          done: topMatch.played,
          loserDone: topMatch.played,
        }}
      >
        {renderMatch(topMatch, side, 'start')}
      </Cell>,

      <Cell
        key={`${name}-bottom`}
        $col={cols.r1}
        $row={ROW_BOTTOM}
        $edge={inner}
        $out={{ type: 'join', done: bottomMatch.played }}
      >
        {renderMatch(bottomMatch, side, 'start')}
      </Cell>,

      <PassLine
        key={`${name}-pass`}
        $col={cols.r2}
        $row={ROW_TOP}
        $done={topMatch.played}
      />,

      <Cell
        key={`${name}-second`}
        $col={cols.r2}
        $row={ROW_MIDDLE}
        $edge={inner}
        $in={{ edge: outer, done: secondReady }}
        $out={{ type: 'straight', done: secondMatch.played }}
      >
        <ConnectorDot $edge={outer} aria-hidden="true" />
        {renderMatch(secondMatch, side)}
      </Cell>,

      <Cell
        key={`${name}-q1`}
        $col={cols.qualified}
        $row={ROW_TOP}
        $in={{ edge: outer, done: topMatch.played }}
      >
        <ConnectorDot $edge={outer} aria-hidden="true" />
        <Qualified match={topMatch} label={`Zona ${name} · 1°`} edge={inner} />
      </Cell>,

      <Cell
        key={`${name}-q2`}
        $col={cols.qualified}
        $row={ROW_MIDDLE}
        $in={{ edge: outer, done: secondMatch.played }}
      >
        <ConnectorDot $edge={outer} aria-hidden="true" />
        <Qualified
          match={secondMatch}
          label={`Zona ${name} · 2°`}
          edge={inner}
        />
      </Cell>,
    ]
  }

  return (
    <Wrapper ref={dragScrollRef}>
      <Grid>
        <CenterTitle $col="3 / span 2" $row="1 / span 2">
          {cloudinaryId ? (
            <TournamentLogo
              cloudName={cloudName}
              publicId={cloudinaryId}
              alt=""
              aria-hidden="true"
            />
          ) : (
            <EmojiEventsIcon htmlColor="#ffc30b" fontSize="small" />
          )}
          Clasificados
          {cloudinaryId ? (
            <TournamentLogo
              cloudName={cloudName}
              publicId={cloudinaryId}
              alt=""
              aria-hidden="true"
            />
          ) : (
            <EmojiEventsIcon htmlColor="#ffc30b" fontSize="small" />
          )}
        </CenterTitle>
        {ZONES.map(renderZone)}
        <Legend $col="3 / span 2" $row={5}>
          <LegendItem>Ganador</LegendItem>
          <LegendItem $dashed>Perdedor</LegendItem>
        </Legend>
      </Grid>
    </Wrapper>
  )
}

export default PlayinBracket
