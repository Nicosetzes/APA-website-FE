import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Oval } from "react-loader-spinner";

const Matches = () => {
  const api = "http://localhost:5000/api";

  const [query, setQuery] = useState("");
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${api}/matches?query=${query}`);
      setData(res.data);
    };
    if (query.length === 0 || query.length > 2) fetchData();
  }, [query]);

  console.log(data);

  if (data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <input
          className="search"
          placeholder="Buscar..."
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
        />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#000" }} align="center">
                  Fecha
                </TableCell>
                <TableCell sx={{ color: "#000" }} align="center">
                  Torneo
                </TableCell>
                <TableCell sx={{ color: "#000" }} align="center">
                  Equipo 1
                </TableCell>
                <TableCell sx={{ color: "#000" }} align="center">
                  Equipo 2
                </TableCell>
                <TableCell sx={{ color: "#000" }} align="center">
                  Resultado
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((match) => (
                <TableRow
                  key={match._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    align="center"
                  >{`${new Date(
                    parseInt(match._id.substring(0, 8), 16) * 1000
                  ).toLocaleString()}`}</TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    align="center"
                  >{`${match.tournament.name}`}</TableCell>
                  <TableCell component="th" scope="row" align="center">{`${
                    match.teamP1
                  } (${match.playerP1.toUpperCase()[0]}${
                    match.playerP1.toUpperCase()[1]
                  })`}</TableCell>
                  <TableCell component="th" scope="row" align="center">{`${
                    match.teamP2
                  } (${match.playerP2.toUpperCase()[0]}${
                    match.playerP2.toUpperCase()[1]
                  })`}</TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    align="center"
                  >{`${match.scoreP1} - ${match.scoreP2}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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

export default Matches;
