import { useMediaQuery } from 'react-responsive'
import { StyledTable } from './styled'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ScoreBox from './../ScoreBox'

const PlayerStatsTable = ({ stats }) => {
  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  // const isSm = useMediaQuery({ query: "(min-width: 500px)" });
  const isXS = useMediaQuery({ query: '(min-width: 400px)' })

  console.log(stats)

  return (
    <StyledTable
      sx={{ minWidth: 300, maxWidth: 800, margin: '0.5rem auto' }}
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
          {isM && stats[0].streak && (
            <>
              <TableCell sx={{ fontWeight: 800, color: '#fff' }} align="center">
                Racha
              </TableCell>
            </>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {stats.map(
          ({ player, played, wins, draws, losses, points, streak }) => (
            <TableRow
              key={player.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                align="center"
                sx={{ fontWeight: 800, color: '#fff' }}
              >
                {player.name}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                align="center"
                sx={{ fontWeight: 800, color: '#fff' }}
              >
                {played}
              </TableCell>
              {isXS && (
                <>
                  <TableCell
                    component="th"
                    scope="row"
                    align="center"
                    sx={{ fontWeight: 800, color: '#fff' }}
                  >
                    {wins}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    align="center"
                    sx={{ fontWeight: 800, color: '#fff' }}
                  >
                    {draws}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    align="center"
                    sx={{ fontWeight: 800, color: '#fff' }}
                  >
                    {losses}
                  </TableCell>
                </>
              )}
              <TableCell
                component="th"
                scope="row"
                align="center"
                sx={{ fontWeight: 800, color: '#fff' }}
              >
                {points}
              </TableCell>
              {isM && streak && (
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  sx={{ fontWeight: 800, color: '#fff' }}
                >
                  <div className="streak">
                    {streak.map(
                      (
                        {
                          outcome,
                          playerP1,
                          teamP1,
                          scoreP1,
                          playerP2,
                          teamP2,
                          scoreP2,
                          date,
                        },
                        index,
                      ) => (
                        <ScoreBox
                          key={index}
                          result={outcome}
                          playerP1={playerP1}
                          teamP1={teamP1}
                          scoreP1={scoreP1}
                          playerP2={playerP2}
                          teamP2={teamP2}
                          scoreP2={scoreP2}
                          date={date}
                        />
                      ),
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ),
        )}
      </TableBody>
    </StyledTable>
  )
}

export default PlayerStatsTable
