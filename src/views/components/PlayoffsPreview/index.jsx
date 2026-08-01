import { MatchPreview } from 'views/components'
import {
  PlayoffsPreviewContainer,
  PlayoffsSide,
  PlayoffsSideHeader,
} from './styled'

const PlayoffsPreview = ({ matches = [] }) => {
  const half = Math.ceil(matches.length / 2)
  const sideA = matches.slice(0, half)
  const sideB = matches.slice(half)

  return (
    <PlayoffsPreviewContainer>
      <PlayoffsSide>
        <PlayoffsSideHeader>Lado A</PlayoffsSideHeader>
        {sideA.map(
          ({
            playerP1,
            playerP2,
            playoff_id,
            seedP1,
            seedP2,
            teamP1,
            teamP2,
          }) => {
            return (
              <MatchPreview
                key={playoff_id}
                playerP1={playerP1}
                playerP2={playerP2}
                seedP1={seedP1}
                seedP2={seedP2}
                teamP1={teamP1}
                teamP2={teamP2}
              />
            )
          },
        )}
      </PlayoffsSide>
      <PlayoffsSide>
        <PlayoffsSideHeader>Lado B</PlayoffsSideHeader>
        {sideB.map(
          ({
            playerP1,
            playerP2,
            playoff_id,
            seedP1,
            seedP2,
            teamP1,
            teamP2,
          }) => {
            return (
              <MatchPreview
                key={playoff_id}
                playerP1={playerP1}
                playerP2={playerP2}
                seedP1={seedP1}
                seedP2={seedP2}
                teamP1={teamP1}
                teamP2={teamP2}
              />
            )
          },
        )}
      </PlayoffsSide>
    </PlayoffsPreviewContainer>
  )
}

export default PlayoffsPreview
