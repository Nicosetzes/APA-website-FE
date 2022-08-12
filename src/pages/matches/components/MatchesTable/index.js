import { useMediaQuery } from "react-responsive";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { StyledTable } from "./styled";

const MatchesTable = ({ data }) => {
  //   const isL = useMediaQuery({ query: "(min-width: 992px)" });
  const isM = useMediaQuery({ query: "(min-width: 768px)" });
  const isSm = useMediaQuery({ query: "(min-width: 500px)" });
  //   const isXS = useMediaQuery({ query: "(min-width: 400px)" });

  return (
    <StyledTable sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          {isSm && (
            <>
              <TableCell sx={{ color: "#000" }} align="center">
                Fecha
              </TableCell>
            </>
          )}
          {isM && (
            <>
              <TableCell sx={{ color: "#000" }} align="center">
                Torneo
              </TableCell>
            </>
          )}
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
            {isSm && (
              <>
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                >{`${new Date(
                  parseInt(match._id.substring(0, 8), 16) * 1000
                ).toLocaleString()}`}</TableCell>
              </>
            )}
            {isM && (
              <>
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                >{`${match.tournament.name}`}</TableCell>
              </>
            )}
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
    </StyledTable>
  );
};

export default MatchesTable;
