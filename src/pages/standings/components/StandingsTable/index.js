import { useMediaQuery } from 'react-responsive'
import { StyledTable } from './styled'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ScoreBox from './../../../../components/ScoreBox'
import { database } from './../../../../api'

const StandingsTable = ({ tournament, format, standings, onHandle }) => {
  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  const isXS = useMediaQuery({ query: '(min-width: 400px)' })

  console.log(standings)
  console.log(format)

  return (
    <>
      <StyledTable
        sx={{ minWidth: 300, maxWidth: 1000, margin: '0.5rem auto' }}
        aria-label="simple table"
        playin={
          format == 'league_playin_playoff' ? true : undefined
        } /* Before I just had "format == 'league_playin_playoff", but React asked me to change it to the new version */
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
                streak,
                chances,
              },
              index,
            ) => (
              <TableRow
                key={team.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  <div
                    className="teamAndLogoWrapper"
                    onClick={() => onHandle(tournament, team.id)}
                  >
                    <img src={`${database}/logos/${team.id}`} alt={team.name} />
                    {isM
                      ? team.name
                      : (
                          team.name[0] +
                          team.name[1] +
                          team.name[2]
                        ).toUpperCase()}
                    {chances === false && (
                      <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                        *
                      </span>
                    )}
                    {streak && isM && (
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
                    )}
                  </div>
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  onClick={() => onHandle(tournament, player.id)}
                >
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
      {standings.filter(({ chances }) => chances === false).length ? (
        <div
          style={{
            display: 'flex',
            fontWeight: 700,
            margin: '1rem auto 2rem auto',
            maxWidth: '1000px',
            padding: '0 1rem',
          }}
        >
          <i>
            Equipos con asterisco en su nombre (*) han quedado fuera de la pelea
            por el campeonato/clasificación.
          </i>
        </div>
      ) : null}
    </>
  )
}

export default StandingsTable
