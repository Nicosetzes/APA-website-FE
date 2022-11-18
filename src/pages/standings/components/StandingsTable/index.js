import { useMediaQuery } from 'react-responsive'
import { StyledTable } from './styled'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ScoreBox from './../../../../components/ScoreBox'
import { database } from './../../../../api'

const StandingsTable = ({ tournament, onHandle }) => {
  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  const isXS = useMediaQuery({ query: '(min-width: 400px)' })

  return (
    <StyledTable
      sx={{ minWidth: 300, maxWidth: 1000, margin: '0.5rem auto' }}
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
        {tournament.map((team, teamIndex) => (
          <TableRow
            key={team.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {teamIndex + 1}
            </TableCell>
            <TableCell component="th" scope="row">
              <div
                className="teamAndLogoWrapper"
                onClick={() => onHandle(tournament.tournamentId, team.id)}
              >
                <img src={`${database}/logos/${team.id}`} alt={team.name} />
                {isM ? team.team : team.teamCode}
                {isM && (
                  <div className="streak">
                    {team.streak.map(
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
                )}
              </div>
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              onClick={() => onHandle(tournament.tournamentId, team.player)}
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
            {isL && (
              <>
                <TableCell component="th" scope="row">
                  {team.goalsFor}
                </TableCell>
                <TableCell component="th" scope="row">
                  {team.goalsAgainst}
                </TableCell>
              </>
            )}
            {isM && (
              <>
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
  )
}

export default StandingsTable
