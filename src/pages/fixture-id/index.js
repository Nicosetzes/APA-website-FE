import Navbar from "./../../views/containers/Header/Navbar";
import { StyledFixtureContainer } from "./styled"
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const FixtureId = () => {

  const api = "http://localhost:5000/api"

  let { tournamentId } = useParams();

  const [tournament, setTournament] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${api}/fixture/${tournamentId}`);
      setTournament(res.data);
    };
    fetchData();
  }, []);

  console.log(tournament);

  return (
    <>
      <Navbar />
      <StyledFixtureContainer>
        {tournament && tournament.fixture.map((match, index) =>
          <div className="match" key={index}>
            <div className="match-info">
              <textarea name="teamP1" wrap="soft" className="match-info__team" value={match.teamP1} readOnly>{match.teamP1}</textarea>
              <Link to="" className="logo-link">
                <img src={match.teamLogoP1} alt={match.teamP1} />
              </Link>
              <Link to="" className="player-link">
                <input name="playerP1" className="match-info__player" value={match.playerP1} readOnly />
              </Link>
            </div>
            <div className="match-score">
              <div className="match__container">
                <input name="scoreP1" className="match-score__goals" value={match.scoreP1} />
                <span className="match-score__versus">vs</span>
                <input name="scoreP2" className="match-score__goals" value={match.scoreP2} />
              </div>
              <div className="input__container">
                <input type="submit" value="" className="fixture-edit" />
                <input type="submit" value="" className="fixture-delete" name="fixture-delete" />
              </div>
            </div>
            <div className="match-info">
              <textarea name="teamP2" wrap="soft" className="match-info__team" value={match.teamP2} readOnly>{match.teamP2}</textarea>
              <Link to="" className="logo-link">
                <img src={match.teamLogoP2} alt={match.teamP2} />
              </Link>
              <Link to="" className="player-link">
                <input name="playerP2" className="match-info__player" value={match.playerP2} readOnly />
              </Link>
            </div>
          </div>
        )}
      </StyledFixtureContainer>
    </>
  );
}

export default FixtureId; 