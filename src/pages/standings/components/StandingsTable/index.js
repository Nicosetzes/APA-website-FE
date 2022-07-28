import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios'
import { StyledTable } from './styled';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StandingsTable = () => {

  const [tournaments, setTournaments] = useState("");

  const api = `https://apa-website-be.herokuapp.com/api`;

  useEffect(() => {
    getTournaments();
  }, []);

  const getTournaments = () => {
    axios.get(`${api}/standings`)
      .then((response) => {
        const allTournaments = response.data;
        setTournaments(allTournaments);
      })
      .catch(err => {
        console.log(`Error: ${err}`);
      })
  };

  if (tournaments) {

    return (
      <>
        {tournaments.sort((a, b) => a.name > b.name ? 1 : -1).map(tournament =>
          <TableContainer component={Paper} key={tournament.name}>
            <div className='title'>{tournament.name}</div>
            <StyledTable sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: 800 }} align="center">Pos</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 800 }} align="center">Equipo</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 800 }} align="center">Jugador</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 800 }} align="center">PJ</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 800 }} align="center">PG</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 800 }} align="center">PE</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 800 }} align="center">PP</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 800 }} align="center">GF</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 800 }} align="center">GC</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 800 }} align="center">DIF</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 800 }} align="center">Pts.</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tournament.sortedStanding.map((team, teamIndex) =>
                  <TableRow
                    key={team.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {teamIndex + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className='teamAndLogoWrapper'>
                        <Link to="/">
                          <img src={team.logo} alt={team.name} />
                        </Link>
                        <Link to="/">{team.team}</Link>
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {team.player}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {team.played}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {team.wins}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {team.draws}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {team.losses}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {team.goalsFor}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {team.goalsAgainst}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {team.scoringDifference}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {team.points}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </StyledTable>
          </TableContainer>
        )}
      </>
    )
  }
  else {
    return (
      <div>CARGANDO</div>
    )
  };
}

export default StandingsTable;