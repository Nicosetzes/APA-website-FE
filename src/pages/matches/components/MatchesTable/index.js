import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import { StyledTable } from './styled'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { database } from 'api'
import { format, parseISO } from 'date-fns'

const MatchesTable = ({ matches }) => {
  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <StyledTable
        sx={{ minWidth: 300 }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ color: '#fff', fontWeight: 700, minWidth: '200px' }}
              align="center"
            >
              Fecha
            </TableCell>
            <TableCell
              sx={{ color: '#fff', fontWeight: 700, minWidth: '275px' }}
              align="center"
            >
              Torneo
            </TableCell>
            <TableCell
              sx={{ color: '#fff', fontWeight: 700, minWidth: '80px' }}
              align="center"
            >
              Tipo
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }} align="center">
              <SportsSoccerIcon sx={{ verticalAlign: 'middle' }} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {matches.map(
            ({
              _id,
              updatedAt,
              tournament,
              playerP1,
              teamP1,
              scoreP1,
              playerP2,
              teamP2,
              scoreP2,
              type,
            }) => (
              <TableRow
                key={_id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell
                  sx={{ color: '#fff' }}
                  component="th"
                  scope="row"
                  align="center"
                >
                  {updatedAt &&
                  updatedAt !== '2023-03-30T23:22:00.005Z' &&
                  updatedAt !== '2023-03-30T23:21:44.961Z' &&
                  updatedAt !== '2023-03-30T22:51:17.806Z'
                    ? format(parseISO(updatedAt), 'dd/MM/yyyy hh:mm:ss a')
                    : format(
                        new Date(parseInt(_id.substring(0, 8), 16) * 1000),
                        'dd/MM/yyyy hh:mm:ss a',
                      )}
                </TableCell>
                <TableCell
                  sx={{ color: '#fff' }}
                  component="th"
                  scope="row"
                  align="center"
                >
                  <a
                    className="tournament-link"
                    href={`/tournaments/${tournament.id}`}
                  >{`${tournament.name || '-'}`}</a>
                </TableCell>
                {type == 'playin' && (
                  <TableCell
                    sx={{ color: '#fff' }}
                    component="th"
                    scope="row"
                    align="center"
                  >{`${'P-in'}`}</TableCell>
                )}
                {type == 'playoff' && (
                  <TableCell
                    align="center"
                    component="th"
                    scope="row"
                    sx={{ color: '#fff' }}
                  >
                    {`${'P-off'}`}
                  </TableCell>
                )}
                {type == 'regular' && (
                  <TableCell
                    sx={{ color: '#fff' }}
                    component="th"
                    scope="row"
                    align="center"
                  >{`${'Reg'}`}</TableCell>
                )}
                <TableCell
                  sx={{ color: '#fff' }}
                  component="th"
                  scope="row"
                  align="center"
                >
                  <div
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'center',
                      minWidth: '250px',
                    }}
                  >
                    {teamP1.name && (
                      <img
                        src={`${database}/logos/${teamP1.id}`}
                        alt={teamP1.name}
                        style={{ width: '20px', height: '20px' }}
                      />
                    )}
                    <span>
                      {teamP1.name
                        ? teamP1.name.substring(0, 3).toUpperCase()
                        : teamP1}{' '}
                      ({playerP1.name.toUpperCase()[0]}
                      {playerP1.name.toUpperCase()[1]})
                    </span>
                    <strong>
                      {scoreP1} - {scoreP2}
                    </strong>
                    <span>
                      ({playerP2.name.toUpperCase()[0]}
                      {playerP2.name.toUpperCase()[1]}){' '}
                      {teamP2.name
                        ? teamP2.name.substring(0, 3).toUpperCase()
                        : teamP2}
                    </span>
                    {teamP2.name && (
                      <img
                        src={`${database}/logos/${teamP2.id}`}
                        alt={teamP2.name}
                        style={{ width: '20px', height: '20px' }}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </StyledTable>
    </div>
  )
}

export default MatchesTable
