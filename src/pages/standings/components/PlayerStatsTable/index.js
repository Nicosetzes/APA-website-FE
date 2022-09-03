import { useMediaQuery } from 'react-responsive'
import { StyledTable } from './styled'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

const PlayerStatsTable = ({ stats }) => {
  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  // const isM = useMediaQuery({ query: "(min-width: 768px)" });
  // const isSm = useMediaQuery({ query: "(min-width: 500px)" });
  const isXS = useMediaQuery({ query: '(min-width: 400px)' })

  return (
    <StyledTable
      sx={{ minWidth: 300, maxWidth: 1000, margin: '0.5rem auto' }}
      aria-label="simple table"
    >
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 800, color: '#fff' }} align="center">
            {isL ? 'Jugador' : 'J.'}
          </TableCell>
          <TableCell sx={{ fontWeight: 800, color: '#fff' }} align="center">
            PJ
          </TableCell>
          {isXS && (
            <>
              <TableCell sx={{ fontWeight: 800, color: '#fff' }} align="center">
                PG
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#fff' }} align="center">
                PE
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#fff' }} align="center">
                PP
              </TableCell>
            </>
          )}
          <TableCell sx={{ fontWeight: 800, color: '#fff' }} align="center">
            {isL ? 'Puntos' : 'Pts.'}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {stats.map((playerStats) => (
          <TableRow
            key={playerStats.player}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell
              component="th"
              scope="row"
              align="center"
              sx={{ fontWeight: 800, color: '#fff' }}
            >
              {playerStats.player}
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              align="center"
              sx={{ fontWeight: 800, color: '#fff' }}
            >
              {playerStats.totalMatches}
            </TableCell>
            {isXS && (
              <>
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  sx={{ fontWeight: 800, color: '#fff' }}
                >
                  {playerStats.totalWins}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  sx={{ fontWeight: 800, color: '#fff' }}
                >
                  {playerStats.totalDraws}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  sx={{ fontWeight: 800, color: '#fff' }}
                >
                  {playerStats.totalLosses}
                </TableCell>
              </>
            )}
            <TableCell
              component="th"
              scope="row"
              align="center"
              sx={{ fontWeight: 800, color: '#fff' }}
            >
              {playerStats.totalPoints}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </StyledTable>
  )
}

export default PlayerStatsTable
