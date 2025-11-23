import { useMediaQuery } from 'react-responsive'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { StyledTable } from './styled'
import { format, parseISO } from 'date-fns'

const MatchesTable = ({ matches }) => {
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 500px)' })

  return (
    <StyledTable sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          {isSm && (
            <>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }} align="center">
                Fecha
              </TableCell>
            </>
          )}
          {isM && (
            <>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }} align="center">
                Torneo
              </TableCell>
            </>
          )}
          {isSm && (
            <>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }} align="center">
                Tipo
              </TableCell>
            </>
          )}
          <TableCell sx={{ color: '#fff', fontWeight: 700 }} align="center">
            Equipo 1
          </TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 700 }} align="center">
            Equipo 2
          </TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 700 }} align="center">
            Resultado
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
              {isSm && (
                <>
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
                </>
              )}
              {isM && (
                <>
                  <TableCell
                    sx={{ color: '#fff' }}
                    component="th"
                    scope="row"
                    align="center"
                  >{`${tournament.name || '-'}`}</TableCell>
                </>
              )}
              {isSm && (
                <>
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
                      sx={{ color: '#fff' }}
                      component="th"
                      scope="row"
                      align="center"
                    >{`${'P-off'}`}</TableCell>
                  )}
                  {type == 'regular' && (
                    <TableCell
                      sx={{ color: '#fff' }}
                      component="th"
                      scope="row"
                      align="center"
                    >{`${'Reg'}`}</TableCell>
                  )}
                </>
              )}
              {teamP1.name ? (
                <TableCell
                  sx={{ color: '#fff' }}
                  component="th"
                  scope="row"
                  align="center"
                >{`${teamP1.name} (${playerP1.name.toUpperCase()[0]}${
                  playerP1.name.toUpperCase()[1]
                })`}</TableCell>
              ) : (
                <TableCell
                  sx={{ color: '#fff' }}
                  component="th"
                  scope="row"
                  align="center"
                >{`${teamP1} (${playerP1.name.toUpperCase()[0]}${
                  playerP1.name.toUpperCase()[1]
                })`}</TableCell>
              )}
              {teamP2.name ? (
                <TableCell
                  sx={{ color: '#fff' }}
                  component="th"
                  scope="row"
                  align="center"
                >{`${teamP2.name} (${playerP2.name.toUpperCase()[0]}${
                  playerP2.name.toUpperCase()[1]
                })`}</TableCell>
              ) : (
                <TableCell
                  sx={{ color: '#fff' }}
                  component="th"
                  scope="row"
                  align="center"
                >{`${teamP2} (${playerP2.name.toUpperCase()[0]}${
                  playerP2.name.toUpperCase()[1]
                })`}</TableCell>
              )}

              <TableCell
                sx={{ color: '#fff' }}
                component="th"
                scope="row"
                align="center"
              >{`${scoreP1.toString()} - ${scoreP2.toString()}`}</TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </StyledTable>
  )
}

export default MatchesTable
