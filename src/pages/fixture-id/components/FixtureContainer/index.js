import { StyledFixtureContainer } from "./styled";
import Match from "./../Match";

const FixtureContainer = ({ tournament, handleSubmit }) => {
  return (
    <>
      <StyledFixtureContainer>
        {tournament.fixture.map((match, index) => (
          <Match key={index} match={match} handleSubmit={handleSubmit} />
        ))}
      </StyledFixtureContainer>
    </>
  );
};

export default FixtureContainer;
