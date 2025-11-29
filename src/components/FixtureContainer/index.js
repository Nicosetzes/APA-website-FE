import { StyledFixtureContainer } from './styled'
import Match from './../Match'

const FixtureContainer = ({ format, getFixtureData, matches }) => {
  console.log(format)

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
