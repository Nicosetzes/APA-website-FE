import * as React from "react";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { StyledTable } from "./styled";
import { Oval } from "react-loader-spinner";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const Standings = () => {
  const isXL = useMediaQuery({ query: "(min-width: 1200px)" });
  const isL = useMediaQuery({ query: "(min-width: 992px)" });
  const isM = useMediaQuery({ query: "(min-width: 768px)" });
  const isSm = useMediaQuery({ query: "(min-width: 500px)" });
  const isXS = useMediaQuery({ query: "(min-width: 400px)" });
  // const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  // const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  // const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  const [tournaments, setTournaments] = useState("");

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
    getTournaments();
  }, []);

  const getTournaments = () => {
    axios
      .get(`${api}/standings`)
      .then((response) => {
        setTournaments(response.data);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  };

  if (tournaments) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {tournaments
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map((tournament) => (
            <TableContainer component={Paper} key={tournament.name}>
              <div className="title">{tournament.name}</div>
              <StyledTable
                sx={{ minWidth: 300, maxWidth: 1000, margin: "0.5rem auto" }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ color: "#fff", fontWeight: 800 }}
                      align="center"
                    >
                      {isL ? "Posición" : "Pos."}
                    </TableCell>
                    <TableCell
                      sx={{ color: "#fff", fontWeight: 800 }}
                      align="center"
                    >
                      Equipo
                    </TableCell>
                    <TableCell
                      sx={{ color: "#fff", fontWeight: 800 }}
                      align="center"
                    >
                      {isL ? "Jugador" : "Jug."}
                    </TableCell>
                    <TableCell
                      sx={{ color: "#fff", fontWeight: 800 }}
                      align="center"
                    >
                      PJ
                    </TableCell>
                    {isXS && (
                      <>
                        <TableCell
                          sx={{ color: "#fff", fontWeight: 800 }}
                          align="center"
                        >
                          PG
                        </TableCell>
                      </>
                    )}
                    {isSm && (
                      <>
                        <TableCell
                          sx={{ color: "#fff", fontWeight: 800 }}
                          align="center"
                        >
                          PE
                        </TableCell>
                        <TableCell
                          sx={{ color: "#fff", fontWeight: 800 }}
                          align="center"
                        >
                          PP
                        </TableCell>
                      </>
                    )}
                    {isM && (
                      <>
                        <TableCell
                          sx={{ color: "#fff", fontWeight: 800 }}
                          align="center"
                        >
                          GF
                        </TableCell>
                        <TableCell
                          sx={{ color: "#fff", fontWeight: 800 }}
                          align="center"
                        >
                          GC
                        </TableCell>
                        <TableCell
                          sx={{ color: "#fff", fontWeight: 800 }}
                          align="center"
                        >
                          DIF
                        </TableCell>
                      </>
                    )}
                    <TableCell
                      sx={{ color: "#fff", fontWeight: 800 }}
                      align="center"
                    >
                      {isL ? "Puntos" : "Pts."}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tournament.sortedStanding.map((team, teamIndex) => (
                    <TableRow
                      key={team.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {teamIndex + 1}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <div
                          className="teamAndLogoWrapper"
                          onClick={() =>
                            goToSpecificFixture(
                              tournament.tournamentId,
                              team.id
                            )
                          }
                        >
                          <img src={team.logo} alt={team.name} />
                          {isM ? team.team : team.teamCode}
                        </div>
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        onClick={() =>
                          goToSpecificFixture(
                            tournament.tournamentId,
                            team.player
                          )
                        }
                      >
                        {team.player}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {team.played}
                      </TableCell>
                      {isXS && (
                        <>
                          <TableCell component="th" scope="row">
                            {team.wins}
                          </TableCell>
                        </>
                      )}
                      {isSm && (
                        <>
                          <TableCell component="th" scope="row">
                            {team.draws}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {team.losses}
                          </TableCell>
                        </>
                      )}
                      {isM && (
                        <>
                          <TableCell component="th" scope="row">
                            {team.goalsFor}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {team.goalsAgainst}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {team.scoringDifference}
                          </TableCell>
                        </>
                      )}
                      <TableCell component="th" scope="row">
                        {team.points}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </StyledTable>
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
