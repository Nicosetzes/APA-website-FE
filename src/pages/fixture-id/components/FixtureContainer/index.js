import { StyledFixtureContainer } from './styled'
import Match from './../../../../components/Match'

const FixtureContainer = ({ matches }) => {
  console.log(matches)
  return (
    <>
      <StyledFixtureContainer>
        {matches.map((match) => (
          <Match key={match._id} match={match} />
        ))}
      </StyledFixtureContainer>
    </>
  )
}

export default FixtureContainer
