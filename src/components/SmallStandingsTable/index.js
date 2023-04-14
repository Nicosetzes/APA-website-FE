import { useMediaQuery } from 'react-responsive'
import { StyledSmallStandingsTable } from './styled'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { database } from './../../api'

const SmallStandingsTable = ({ standings, team }) => {
  const isL = useMediaQuery({ query: '(min-width: 600px)' })
  const isM = useMediaQuery({ query: '(min-width: 550px)' })
  const isSm = useMediaQuery({ query: '(min-width: 450px)' })

  const { id } = team

  return (
    <StyledSmallStandingsTable
      sx={{ minWidth: 300, maxWidth: 700 }}
      aria-label="simple table"
    >
      <TableHead>
        <TableRow>
          <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
            Pos.
          </TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
            Equipo
          </TableCell>
          {isSm && (
            <>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                Jug.
              </TableCell>
            </>
          )}
          <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
            PJ
          </TableCell>
          {isM && (
            <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
              PG
            </TableCell>
          )}
          {isL && (
            <>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                PE
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                PP
              </TableCell>
            </>
          )}
          <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
            Pts.
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {standings.map(
          ({ team, player, played, wins, draws, losses, points, position }) => (
            <TableRow
              key={team.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                backgroundColor: team.id == id && '#1f4e05',
              }}
            >
              <TableCell component="th" scope="row">
                {position}
              </TableCell>
              <TableCell component="th" scope="row">
                <div className="teamAndLogoWrapper">
                  <img src={`${database}/logos/${team.id}`} alt={team.name} />
                  {(team.name[0] + team.name[1] + team.name[2]).toUpperCase()}
                </div>
              </TableCell>
              {isSm && (
                <>
                  <TableCell component="th" scope="row">
                    <span>{player.name}</span>
                  </TableCell>
                </>
              )}
              <TableCell component="th" scope="row">
                {played}
              </TableCell>
              {isM && (
                <TableCell component="th" scope="row">
                  {wins}
                </TableCell>
              )}
              {isL && (
                <>
                  <TableCell component="th" scope="row">
                    {draws}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {losses}
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
    </StyledSmallStandingsTable>
  )
}

export default SmallStandingsTable
