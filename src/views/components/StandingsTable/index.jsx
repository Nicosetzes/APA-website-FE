import PersonIcon from '@mui/icons-material/Person'
import { ScoreBox } from 'views/components'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { database } from 'api'
import { formatTeamName } from 'utils'
import { StyledTable, TableTitle } from './styled'

const StandingsTable = ({ format, standings, title, tournament, onHandle }) => {
  return (
    <>
      <div
        style={{ maxHeight: 'fit-content', overflowX: 'auto', width: '100%' }}
      >
        {title && <TableTitle>{title}</TableTitle>}
        <StyledTable
          aria-label="simple table"
          format={format}
          sx={{ minWidth: 300, maxWidth: 1000, margin: '0 auto' }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: '#262121' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                POS
              </TableCell>
              <TableCell
                sx={{ color: '#fff', fontWeight: 800, verticalAlign: 'middle' }}
                align="center"
              >
                <SportsSoccerIcon sx={{ verticalAlign: 'middle' }} />
              </TableCell>
              <TableCell
                sx={{ color: '#fff', fontWeight: 800, verticalAlign: 'middle' }}
                align="center"
              >
                <PersonIcon sx={{ verticalAlign: 'middle' }} />
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                PJ
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                PG
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                PE
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                PP
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                GF
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                GC
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                DIF
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                PTS
              </TableCell>
              {!format.includes('best_thirds') && (
                <TableCell
                  sx={{
                    color: '#fff',
                    fontWeight: 800,
                    verticalAlign: 'middle',
                  }}
                  align="center"
                >
                  <ShowChartIcon sx={{ verticalAlign: 'middle' }} />
                </TableCell>
              )}
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
                  directlyQualified,
                  playinQualified,
                  eliminated,
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
                      onClick={
                        onHandle
                          ? () => onHandle(tournament, team.id)
                          : undefined
                      }
                    >
                      <img
                        src={`${database}/logos/${team.id}`}
                        alt={team.name}
                      />
                      {format.includes('best_thirds')
                        ? formatTeamName(team.name)
                        : team.name}
                      {directlyQualified && playinQualified && (
                        <span style={{ marginLeft: '0.5rem', fontWeight: 700 }}>
                          {' '}
                          (C)
                        </span>
                      )}
                      {!directlyQualified && playinQualified && (
                        <span style={{ marginLeft: '0.5rem', fontWeight: 700 }}>
                          {' '}
                          (P)
                        </span>
                      )}
                      {eliminated && (
                        <span style={{ marginLeft: '0.5rem', fontWeight: 700 }}>
                          {' '}
                          (x)
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    onClick={
                      onHandle
                        ? () => onHandle(tournament, player.id)
                        : undefined
                    }
                  >
                    <span style={{ cursor: 'pointer' }}>{player.name}</span>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {played}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {wins}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {draws}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {losses}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {goalsFor}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {goalsAgainst}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {scoringDifference}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {points}
                  </TableCell>
                  {!format.includes('best_thirds') && (
                    <TableCell component="th" scope="row">
                      {streak ? (
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
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ),
            )}
          </TableBody>
        </StyledTable>
      </div>

      {format == 'league' && (
        <div
          style={{
            display: 'flex',
            fontWeight: 700,
            margin: '1rem auto 2rem auto',
            maxWidth: '1000px',
            padding: '0 1rem',
          }}
        >
          <i>(x): fuera de la lucha por el título.</i>
        </div>
      )}

      {format == 'league_playin_playoff' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            fontWeight: 700,
            margin: '1rem auto 2rem auto',
            maxWidth: '1000px',
            padding: '0 1rem',
          }}
        >
          <span
            style={{
              margin: '0.25rem 0',
            }}
          >
            (C): clasificado de manera directa.
          </span>
          <span
            style={{
              margin: '0.25rem 0',
            }}
          >
            (P): clasificado al playin.
          </span>
          <span
            style={{
              margin: '0.25rem 0',
            }}
          >
            (x): eliminado.
          </span>
        </div>
      )}
    </>
  )
}

export default StandingsTable
