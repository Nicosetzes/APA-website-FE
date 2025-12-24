import PersonIcon from '@mui/icons-material/Person'
import { ScoreBox } from 'views/components'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import { StyledTable } from './styled'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

const PlayerStatsTable = ({ stats }) => {
  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <StyledTable
        sx={{ minWidth: 300, maxWidth: 800, margin: '0.5rem auto' }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ fontWeight: 800, color: '#fff', verticalAlign: 'middle' }}
              align="center"
            >
              <PersonIcon sx={{ verticalAlign: 'middle' }} />
            </TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#fff' }} align="center">
              PJ
            </TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#fff' }} align="center">
              PG
            </TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#fff' }} align="center">
              PE
            </TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#fff' }} align="center">
              PP
            </TableCell>
            {stats[0].effectiveness && (
              <TableCell sx={{ fontWeight: 800, color: '#fff' }} align="center">
                % EF
              </TableCell>
            )}
            <TableCell sx={{ fontWeight: 800, color: '#fff' }} align="center">
              PTS
            </TableCell>
            {stats[0].streak && (
              <TableCell
                sx={{ fontWeight: 800, color: '#fff', verticalAlign: 'middle' }}
                align="center"
              >
                <ShowChartIcon sx={{ verticalAlign: 'middle' }} />
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.map(
            ({
              player,
              played,
              wins,
              draws,
              losses,
              effectiveness,
              points,
              streak,
            }) => (
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
                {stats[0].effectiveness && (
                  <TableCell
                    sx={{ fontWeight: 800, color: '#fff' }}
                    align="center"
                  >
                    {effectiveness}
                  </TableCell>
                )}
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  sx={{ fontWeight: 800, color: '#fff' }}
                >
                  {points}
                </TableCell>
                {streak && (
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
    </div>
  )
}

export default PlayerStatsTable
