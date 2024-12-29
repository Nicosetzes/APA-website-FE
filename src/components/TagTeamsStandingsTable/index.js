import TagTeamsScoreBox from '../TagTeamsScoreBox'
import { useMediaQuery } from 'react-responsive'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { StyledTable } from './styled'

// import { database } from '../../api'

const TagTeamsStandingsTable = ({ standings }) => {
  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  const isXS = useMediaQuery({ query: '(min-width: 400px)' })

  console.log(standings)

  return (
    <>
      <StyledTable
        sx={{ minWidth: 300, maxWidth: 1000, margin: '0.5rem auto' }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: '#262121' }}>
            <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
              {isL ? 'Posición' : 'Pos.'}
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
              {isL ? 'Jugador' : 'Jug.'}
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
              Racha
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
            {isL && (
              <>
                <TableCell
                  sx={{ color: '#fff', fontWeight: 800 }}
                  align="center"
                >
                  GF
                </TableCell>
                <TableCell
                  sx={{ color: '#fff', fontWeight: 800 }}
                  align="center"
                >
                  GC
                </TableCell>
              </>
            )}
            {isM && (
              <>
                <TableCell
                  sx={{ color: '#fff', fontWeight: 800 }}
                  align="center"
                >
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
          {standings.map(
            (
              {
                player,
                played,
                wins,
                draws,
                losses,
                goalsFor,
                goalsAgainst,
                scoringDifference,
                points,
                streak,
              },
              index,
            ) => (
              <TableRow
                key={player.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  <span style={{ cursor: 'pointer' }}>
                    {isM
                      ? player.name
                      : (
                          player.name[0] +
                          player.name[1] +
                          player.name[2]
                        ).toUpperCase()}
                  </span>
                </TableCell>
                <TableCell component="th" scope="row">
                  {streak.length && isM ? (
                    <div className="streak">
                      {streak.map(
                        (
                          {
                            outcome,
                            playerP1,
                            playerP2,
                            playerP3,
                            playerP4,
                            teamP1,
                            teamP2,
                            scoreP1,
                            scoreP2,
                            date,
                          },
                          index,
                        ) => (
                          <TagTeamsScoreBox
                            key={index}
                            result={outcome}
                            playerP1={playerP1}
                            playerP2={playerP2}
                            playerP3={playerP3}
                            playerP4={playerP4}
                            teamP1={teamP1}
                            teamP2={teamP2}
                            scoreP1={scoreP1}
                            scoreP2={scoreP2}
                            date={date}
                          />
                        ),
                      )}
                    </div>
                  ) : null}
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
    </>
  )
}

export default TagTeamsStandingsTable
