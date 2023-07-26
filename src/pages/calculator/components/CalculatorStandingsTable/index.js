import { useMediaQuery } from 'react-responsive'
import { StyledCalculatorStandingsTable } from './styled'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { database } from './../../../../api'

const CalculatorStandingsTable = ({ standings, calculatorTeams }) => {
  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  const isXS = useMediaQuery({ query: '(min-width: 400px)' })

  const sortedStandings = standings.sort((a, b) => {
    if (a.points > b.points) return -1
    if (a.points < b.points) return 1
  })

  return (
    <>
      <StyledCalculatorStandingsTable
        sx={{ minWidth: 300, maxWidth: 1000, margin: '0.5rem auto' }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: '#262121' }}>
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
                <TableCell
                  sx={{ color: '#fff', fontWeight: 800 }}
                  align="center"
                >
                  PG
                </TableCell>
              </>
            )}
            {isSm && (
              <>
                <TableCell
                  sx={{ color: '#fff', fontWeight: 800 }}
                  align="center"
                >
                  PE
                </TableCell>
                <TableCell
                  sx={{ color: '#fff', fontWeight: 800 }}
                  align="center"
                >
                  PP
                </TableCell>
              </>
            )}
            <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
              {isL ? 'Puntos' : 'Pts.'}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedStandings.map(
            ({ team, player, played, wins, draws, losses, points }, index) => (
              <TableRow
                key={team.id}
                sx={{
                  backgroundColor: calculatorTeams.filter(
                    (calculatorTeam) => calculatorTeam.team.id == team.id,
                  ).length
                    ? '#312b5a'
                    : 'rgba(0, 74, 121, 1)',
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  <div className="teamAndLogoWrapper">
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
                <TableCell component="th" scope="row">
                  <span style={{ cursor: 'pointer' }}>{player.name}</span>
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
                <TableCell component="th" scope="row">
                  {points}
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </StyledCalculatorStandingsTable>
    </>
  )
}

export default CalculatorStandingsTable
