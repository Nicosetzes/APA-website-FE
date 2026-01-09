import { StyledFixtureContainer } from './styled'
import Match from './../Match'

const FixtureContainer = ({ format, getFixtureData, matches, teamStats }) => {
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
            teamStats={teamStats}
          />
        ))}
      </StyledFixtureContainer>
    </>
  )
}

export default FixtureContainer
