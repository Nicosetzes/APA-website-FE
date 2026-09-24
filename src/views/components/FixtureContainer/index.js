import { StyledFixtureContainer } from './styled'
import Match from './../Match'

const FixtureContainer = ({
  canMutate,
  format,
  getFixtureData,
  matches,
  teamStats,
}) => {
  console.log(format)

  console.log(matches)
  return (
    <>
      <StyledFixtureContainer>
        {matches.map((match) => (
          <Match
            canMutate={canMutate}
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
