import { StyledFixtureContainer } from './styled'
import Match from './../Match'

const FixtureContainer = ({ matches, getFixtureData }) => {
  console.log(matches)
  return (
    <>
      <StyledFixtureContainer>
        {matches.map((match) => (
          <Match
            key={match._id}
            match={match}
            getFixtureData={getFixtureData}
          />
        ))}
      </StyledFixtureContainer>
    </>
  )
}

export default FixtureContainer
