import { StyledTable } from './styled'
import { useMediaQuery } from 'react-responsive'
import { database } from './../../../../api'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

const GroupStandings = ({ teams }) => {
  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  const isXS = useMediaQuery({ query: '(min-width: 400px)' })

  console.log(teams)

  return (
    <StyledTable
      sx={{ minWidth: 300, maxWidth: 600, margin: '0.5rem auto' }}
      aria-label="simple table"
    >
      <TableHead>
        <TableRow>
          <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
            {isL ? 'Posición' : 'Pos.'}
          </TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
            Equipo
          </TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
            {isL ? 'Jugador' : 'Jug.'}
          </TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
            PJ
          </TableCell>
          {isXS && (
            <>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                PG
              </TableCell>
            </>
          )}
          {isSm && (
            <>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                PE
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                PP
              </TableCell>
            </>
          )}
          {isL && (
            <>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                GF
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                GC
              </TableCell>
            </>
          )}
          {isM && (
            <>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                DIF
              </TableCell>
            </>
          )}
          <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
            {isL ? 'Puntos' : 'Pts.'}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {teams.map(
          (
            {
              team,
              player,
              played,
              wins,
              draws,
              losses,
              goalsFor,
              goalsAgainst,
              scoringDifference,
              points,
            },
            index,
          ) => (
            <TableRow
              key={team.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell component="th" scope="row">
                <div
                  className="teamAndLogoWrapper"
                  // onClick={() => onHandle(tournament.tournamentId, team.id)}
                >
                  <img src={`${database}/logos/${team.id}`} alt={team.name} />
                  {isM
                    ? team.name
                    : (
                        team.name[0] +
                        team.name[1] +
                        team.name[2]
                      ).toUpperCase()}
                </div>
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                //   onClick={() => onHandle(tournament.tournamentId, team.player)}
              >
                {player.name}
              </TableCell>
              <TableCell component="th" scope="row">
                {played}
              </TableCell>
              {isXS && (
                <>
                  <TableCell component="th" scope="row">
                    {wins}
                  </TableCell>
                </>
              )}
              {isSm && (
                <>
                  <TableCell component="th" scope="row">
                    {draws}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {losses}
                  </TableCell>
                </>
              )}
              {isL && (
                <>
                  <TableCell component="th" scope="row">
                    {goalsFor}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {goalsAgainst}
                  </TableCell>
                </>
              )}
              {isM && (
                <>
                  <TableCell component="th" scope="row">
                    {scoringDifference}
                  </TableCell>
                </>
              )}
              <TableCell component="th" scope="row">
                {points}
              </TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </StyledTable>
  )
}

export default GroupStandings
