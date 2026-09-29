import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PlayoffRound, { isTieDecided } from './PlayoffRound'
import StarIcon from '@mui/icons-material/Star'
import { useMemo } from 'react'
import useDragScroll from 'hooks/useDragScroll'
import {
  BracketArea,
  CenterImage,
  Podium,
  PodiumCircle,
  PodiumPlayer,
  PodiumTitle,
  Wrapper,
} from './styled'
import { cloudName, database } from 'api'

// playoff_id ranges for each round, per tournament format
const ROUNDS_BY_FORMAT = {
  playoff: [
    [1, 16],
    [17, 24],
    [25, 28],
    [29, 30],
    [31, 31],
  ],
  world_cup_2026: [
    [1, 16],
    [17, 24],
    [25, 28],
    [29, 30],
    [31, 31],
  ],
  // Two-legged ties: every round (except the final) has 2 matches per tie
  champions_league: [
    [1, 16],
    [17, 24],
    [25, 28],
    [29, 29],
  ],
  league_playin_playoff: [
    [1, 8],
    [9, 12],
    [13, 14],
    [15, 15],
  ],
}

const TWO_LEGGED_FORMATS = ['champions_league']

const range = (min, max) =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i)

const buildPlaceholder = (playoffId) => ({
  _id: `preview-${playoffId}`,
  playoff_id: playoffId,
  playerP1: null,
  teamP1: null,
  seedP1: null,
  scoreP1: null,
  playerP2: null,
  teamP2: null,
  seedP2: null,
  scoreP2: null,
  played: false,
  outcome: null,
  valid: false,
})

const getTieName = (tiesCount) => {
  switch (tiesCount) {
    case 16:
      return '16vos de final'
    case 8:
      return '8vos de final'
    case 4:
      return '4tos de final'
    case 2:
      return 'Semifinal'
    case 1:
      return 'Final'
    default:
      return 'Ronda'
  }
}

const teamsKey = ({ teamP1, teamP2 }) =>
  teamP1?.id && teamP2?.id ? [teamP1.id, teamP2.id].sort().join('|') : null

const groupIntoTies = (matches, legs) => {
  if (legs === 1) {
    return matches.map((match) => ({ key: match._id, matches: [match] }))
  }

  const ties = []
  const byTeams = new Map()
  const pending = []

  matches.forEach((match) => {
    const key = teamsKey(match)
    if (key && byTeams.has(key)) {
      byTeams.get(key).matches.push(match)
      return
    }
    const tie = { key: match._id, matches: [match] }
    ties.push(tie)
    if (key) byTeams.set(key, tie)
    else pending.push(tie)
  })

  for (let i = 0; i + 1 < pending.length; i += 2) {
    pending[i].matches.push(...pending[i + 1].matches)
    ties.splice(ties.indexOf(pending[i + 1]), 1)
  }

  return ties
}

const buildRounds = (format, matches = []) => {
  const ranges =
    ROUNDS_BY_FORMAT[format] || ROUNDS_BY_FORMAT.league_playin_playoff
  const matchById = new Map(
    (Array.isArray(matches) ? matches : []).map((m) => [
      Number(m.playoff_id),
      m,
    ]),
  )
  const isTwoLegged = TWO_LEGGED_FORMATS.includes(format)

  return ranges.map(([min, max], index) => {
    const isFinal = index === ranges.length - 1
    const roundMatches = range(min, max).map(
      (id) => matchById.get(id) || buildPlaceholder(id),
    )
    const ties = groupIntoTies(roundMatches, isTwoLegged && !isFinal ? 2 : 1)

    return {
      round: index + 1,
      isFinal,
      name: getTieName(ties.length),
      ties,
    }
  })
}

const splitInHalves = (ties) => {
  const half = Math.ceil(ties.length / 2)
  return [ties.slice(0, half), ties.slice(half)]
}

const Champion = ({ finalMatch, cloudinaryId }) => {
  const winner = finalMatch?.outcome?.teamThatWon

  return (
    <Podium>
      <PodiumCircle $size={winner ? 125 : 175}>
        {winner ? (
          <img
            src={`${database}/logos/${winner.id}`}
            alt={winner.name || 'Campeón'}
          />
        ) : cloudinaryId ? (
          <CenterImage cloudName={cloudName} publicId={cloudinaryId} />
        ) : (
          <EmojiEventsIcon htmlColor="#ffc30b" fontSize="large" />
        )}
      </PodiumCircle>
      {winner && (
        <>
          <PodiumTitle>
            Campeón <StarIcon htmlColor="#ffc30b" fontSize="small" />
          </PodiumTitle>
          <PodiumPlayer>{finalMatch.outcome.playerThatWon?.name}</PodiumPlayer>
        </>
      )}
    </Podium>
  )
}

const Finalist = ({ finalMatch }) => {
  const loser = finalMatch?.outcome?.teamThatLost
  if (!loser) return null

  return (
    <Podium>
      <PodiumTitle $silver>
        Finalista <StarIcon htmlColor="#b3b3b3" fontSize="small" />
      </PodiumTitle>
      <PodiumCircle $size={90} $silver>
        <img
          src={`${database}/logos/${loser.id}`}
          alt={loser.name || 'Finalista'}
        />
      </PodiumCircle>
      <PodiumPlayer $silver>
        {finalMatch.outcome.playerThatLost?.name}
      </PodiumPlayer>
    </Podium>
  )
}

const PlayoffBracket = ({
  canMutate,
  cloudinaryId,
  format,
  getData,
  matches,
}) => {
  const dragScrollRef = useDragScroll()
  const rounds = useMemo(() => buildRounds(format, matches), [format, matches])
  const finalRound = rounds[rounds.length - 1]
  const sideRounds = rounds.slice(0, -1)
  const finalMatch = finalRound?.ties[0]?.matches[0]

  const getHalf = (round, side) => {
    const [leftTies, rightTies] = splitInHalves(round.ties)
    return side === 'left' ? leftTies : rightTies
  }

  const renderSide = (side) => {
    const columns = sideRounds.map((round, index) => {
      const ties = getHalf(round, side)
      const feeders = index > 0 ? getHalf(sideRounds[index - 1], side) : []

      const incomingDone = ties.map((_, tieIndex) => ({
        [side]:
          isTieDecided(feeders[tieIndex * 2]) ||
          isTieDecided(feeders[tieIndex * 2 + 1]),
      }))

      return (
        <PlayoffRound
          key={`${side}-${round.round}`}
          canMutate={canMutate}
          getData={getData}
          name={round.name}
          ties={ties}
          side={side}
          hasIncoming={index > 0}
          incomingDone={incomingDone}
        />
      )
    })

    return side === 'left' ? columns : columns.reverse()
  }

  const lastSideRound = sideRounds[sideRounds.length - 1]
  const finalIncomingDone = lastSideRound
    ? [
        {
          left: getHalf(lastSideRound, 'left').some(isTieDecided),
          right: getHalf(lastSideRound, 'right').some(isTieDecided),
        },
      ]
    : []

  if (!finalRound) return null

  return (
    <Wrapper ref={dragScrollRef}>
      <BracketArea>
        {renderSide('left')}
        <PlayoffRound
          canMutate={canMutate}
          getData={getData}
          name={finalRound.name}
          ties={finalRound.ties}
          side="center"
          hasIncoming={rounds.length > 1}
          incomingDone={finalIncomingDone}
          isThisTheFinal
          above={
            <Champion finalMatch={finalMatch} cloudinaryId={cloudinaryId} />
          }
          below={<Finalist finalMatch={finalMatch} />}
        />
        {renderSide('right')}
      </BracketArea>
    </Wrapper>
  )
}

export default PlayoffBracket
