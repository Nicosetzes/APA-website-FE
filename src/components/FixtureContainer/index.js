import { StyledFixtureContainer } from './styled'
import TagTeamsMatch from '../TagTeamsMatch'
import Match from './../Match'

const FixtureContainer = ({
  format,
  getFixtureData,
  getStandingsData,
  matches,
}) => {
  console.log(format)

  console.log(matches)
  return (
    <>
      <StyledFixtureContainer>
        {format == 'tag_teams'
          ? matches.map((match) => (
              <TagTeamsMatch
                key={match._id}
                match={match}
                getFixtureData={getFixtureData}
                getStandingsData={getStandingsData}
              />
            ))
          : matches.map((match) => (
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
