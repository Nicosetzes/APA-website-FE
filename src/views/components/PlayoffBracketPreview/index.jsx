import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PlayoffBracketPreviewMatch from '../PlayoffBracketPreviewMatch'
import { cloudName } from 'api'
import {
  BracketArea,
  BracketSide,
  CenterIcon,
  CenterImage,
  CenterLine,
  RoundLabel,
  Wrapper,
} from './styled'

const getRoundLabel = (matchesCount) => {
  switch (matchesCount) {
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
      return 'Cruces'
  }
}

const PlayoffBracketPreview = ({ matches = [], cloudinaryId }) => {
  const half = Math.ceil(matches.length / 2)
  const sideA = matches.slice(0, half)
  const sideB = matches.slice(half)

  return (
    <Wrapper>
      <RoundLabel>{getRoundLabel(matches.length)}</RoundLabel>
      <BracketArea>
        <BracketSide>
          {sideA.map((match) => (
            <PlayoffBracketPreviewMatch
              key={match.playoff_id}
              side="left"
              {...match}
            />
          ))}
        </BracketSide>
        <CenterLine>
          <CenterIcon>
            {cloudinaryId ? (
              <CenterImage cloudName={cloudName} publicId={cloudinaryId} />
            ) : (
              <EmojiEventsIcon htmlColor="#ffc30b" fontSize="small" />
            )}
          </CenterIcon>
        </CenterLine>
        <BracketSide>
          {sideB.map((match) => (
            <PlayoffBracketPreviewMatch
              key={match.playoff_id}
              side="right"
              {...match}
            />
          ))}
        </BracketSide>
      </BracketArea>
    </Wrapper>
  )
}

export default PlayoffBracketPreview
