import { useMediaQuery } from 'react-responsive'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { StyledTable } from './styled'

const MatchesTable = ({ data }) => {
  //   const isL = useMediaQuery({ query: "(min-width: 992px)" });
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  //   const isXS = useMediaQuery({ query: "(min-width: 400px)" });

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
        {data.map(
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
          }) => (
            <TableRow
              key={_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {isSm && (
                <>
                  <TableCell
                    sx={{ color: '#fff' }}
                    component="th"
                    scope="row"
                    align="center"
                  >
                    {updatedAt
                      ? new Date(updatedAt).toLocaleString()
                      : new Date(
                          parseInt(_id.substring(0, 8), 16) * 1000,
                        ).toLocaleString()}
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
                  >{`${tournament.name}`}</TableCell>
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
