import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import PlayerStatsTable from "./components/PlayerStatsTable";
import { Oval } from "react-loader-spinner";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import StandingsTable from "./components/StandingsTable";

const Standings = () => {
  const [tournamentsData, setTournamentsData] = useState("");

  const api = "http://localhost:5000/api";

  const navigate = useNavigate();
  const playerParams = (param) => {
    return { player: param };
  };
  const teamParams = (param) => {
    return { team: param };
  };

  const goToSpecificFixture = (id, params) => {
    if (isNaN(Number(params))) {
      // El query es de player;
      navigate({
        pathname: `/tournaments/${id}/fixture`,
        search: `?${createSearchParams(playerParams(params))}`,
      });
    } else {
      // El query es de team (numérico, es el id);
      navigate({
        pathname: `/tournaments/${id}/fixture`,
        search: `?${createSearchParams(teamParams(params))}`,
      });
    }
  };

  useEffect(() => {
    getTournamentsData();
  }, []);

  const getTournamentsData = () => {
    const standings = axios.get(`${api}/standings`);
    const playerInfoFromTournament = axios.get(`${api}/standings/player-info`);

    Promise.all([standings, playerInfoFromTournament]).then((values) => {
      const data = values.map((response) => response.data);
      setTournamentsData(data);
    });
  };

  console.log(tournamentsData);

  if (tournamentsData) {
    const standings = tournamentsData[0]; // Index 0 because of the order in which I invoked the promises call in Promise.all //
    const playerStats = tournamentsData[1];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {standings
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map((tournament) => (
            <TableContainer component={Paper} key={tournament.name}>
              <div className="title">{tournament.name}</div>
              <StandingsTable
                tournament={tournament}
                onHandle={goToSpecificFixture}
              />
              <PlayerStatsTable
                stats={playerStats
                  .filter((stats) => stats.tournament === tournament.name)
                  .sort((a, b) => (a.totalPoints > b.totalPoints ? -1 : 1))}
              />
            </TableContainer>
          ))}
      </motion.div>
    );
  } else {
    return (
      <div style={{ margin: "auto", width: "100px" }}>
        <Oval
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="three-dots-loading"
          $wrapperStyle
          $wrapperClass
        />
      </div>
    );
  }
};

export default Standings;
