import {
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import InputContainer from "./../InputContainer";
import { PropTypes } from "prop-types";

const Match = ({ match, handleSubmit }) => {
  const navigate = useNavigate();
  const playerParams = (param) => {
    return { player: param };
  };
  const teamParams = (param) => {
    return { team: param };
  };

  const goToSpecificFixture = (params) => {
    if (isNaN(Number(params))) {
      // El query es de player;
      navigate({
        pathname: ``,
        search: `?${createSearchParams(playerParams(params))}`,
      });
    } else {
      // El query es de team (numérico, es el id);
      navigate({
        pathname: ``,
        search: `?${createSearchParams(teamParams(params))}`,
      });
    }
  };

  return (
    <form
      className="match"
      data-player1={match.playerP1}
      data-player2={match.playerP2}
      data-team1={match.teamP1}
      data-team2={match.teamP2}
      data-id={match.matchId}
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <div className="match-info">
        <textarea
          name="teamP1"
          wrap="soft"
          className="match-info__team"
          value={match.teamP1}
          readOnly
        >
          {match.teamP1}
        </textarea>
        {/* <Route path={`/tournaments/62e0b0a53d86565327b95a82/fixture?team=${match.teamIdP1}`} element={<FixtureId />} /> className="logo-link"> */}
        <img
          src={match.teamLogoP1}
          alt={match.teamP1}
          className="match-info__logo"
          onClick={() =>
            goToSpecificFixture(match.teamIdP1)
          }
        />
        <input
          name="playerP1"
          className="match-info__player"
          value={match.playerP1}
          readOnly
          onClick={() =>
            goToSpecificFixture(match.playerP1)
          }
        />
      </div>
      <div className="match-score">
        <div className="match__container">
          <input
            name="scoreP1"
            className="match-score__goals"
            defaultValue={match.scoreP1}
          />
          <span className="match-score__versus">vs</span>
          <input
            name="scoreP2"
            className="match-score__goals"
            defaultValue={match.scoreP2}
          />
        </div>
        <InputContainer
          matchId={match.matchId}
          isFinished={match.scoreP1 !== undefined ? true : false}
        />
      </div>
      <div className="match-info">
        <textarea
          name="teamP2"
          wrap="soft"
          className="match-info__team"
          value={match.teamP2}
          readOnly
        >
          {match.teamP2}
        </textarea>
        <img src={match.teamLogoP2} alt={match.teamP2} className="match-info__logo" onClick={() =>
          goToSpecificFixture(match.teamIdP2)
        } />
        <input
          name="playerP2"
          className="match-info__player"
          value={match.playerP2}
          readOnly
          onClick={() =>
            goToSpecificFixture(match.playerP2)
          }
        />
      </div>
    </form>
  );
};

InputContainer.propTypes = {
  matchId: PropTypes.string,
  isFinished: PropTypes.bool,
};

export default Match;
