import PlayoffMatch from '../../PlayoffMatch'
import { ConnectorDot } from '../../bracketConnectors'
import {
  CenterAbove,
  CenterBelow,
  CenterStack,
  RoundColumn,
  RoundName,
  RoundSlots,
  Slot,
  TieGroup,
} from './styled'

export const isTieDecided = (tie) =>
  Boolean(tie?.matches?.length) && tie.matches.every(({ played }) => played)

const getSlotPosition = (index, total) => {
  if (total === 1) return 'single'
  return index % 2 === 0 ? 'first' : 'second'
}

const PlayoffRound = ({
  canMutate,
  getData,
  name,
  ties = [],
  side = 'left',
  hasIncoming = false,
  incomingDone = [],
  isThisTheFinal = false,
  above = null,
  below = null,
}) => {
  const isCenter = side === 'center'
  const incomingEdges = isCenter ? ['left', 'right'] : [side]

  const matchesInColumn = ties.reduce((sum, t) => sum + t.matches.length, 0)
  const align = matchesInColumn > 1 ? 'start' : 'center'

  const renderTie = (tie) => (
    <TieGroup $legs={tie.matches.length}>
      {tie.matches.map(
        ({
          _id,
          playerP1,
          teamP1,
          seedP1,
          scoreP1,
          playerP2,
          teamP2,
          seedP2,
          scoreP2,
          played,
          outcome,
          valid,
        }) => (
          <PlayoffMatch
            canMutate={canMutate}
            key={_id}
            id={_id}
            playerP1={playerP1}
            teamP1={teamP1}
            seedP1={seedP1}
            scoreP1={scoreP1}
            playerP2={playerP2}
            teamP2={teamP2}
            seedP2={seedP2}
            scoreP2={scoreP2}
            played={played}
            outcome={outcome}
            getData={getData}
            valid={valid}
            isThisTheFinal={isThisTheFinal}
            side={side === 'right' ? 'right' : 'left'}
            align={align}
          />
        ),
      )}
    </TieGroup>
  )

  return (
    <RoundColumn $side={side}>
      <RoundName $highlight={isThisTheFinal}>{name}</RoundName>
      <RoundSlots>
        {ties.map((tie, index) => (
          <Slot
            key={tie.key}
            $side={side}
            $incoming={hasIncoming}
            $incomingDone={incomingDone[index]}
            $position={isCenter ? null : getSlotPosition(index, ties.length)}
            $done={isTieDecided(tie)}
          >
            {hasIncoming &&
              incomingEdges.map((edge) => (
                <ConnectorDot key={edge} $edge={edge} aria-hidden="true" />
              ))}
            {isCenter ? (
              <CenterStack>
                {above && <CenterAbove>{above}</CenterAbove>}
                {renderTie(tie)}
                {below && <CenterBelow>{below}</CenterBelow>}
              </CenterStack>
            ) : (
              renderTie(tie)
            )}
          </Slot>
        ))}
      </RoundSlots>
    </RoundColumn>
  )
}

export default PlayoffRound
