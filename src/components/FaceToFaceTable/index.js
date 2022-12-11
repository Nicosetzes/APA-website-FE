import { useMediaQuery } from 'react-responsive'
import { StyledFaceToFaceTable } from './styled'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { database } from './../../api'

const FaceToFaceTable = ({ stats }) => {
  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  const isXS = useMediaQuery({ query: '(min-width: 400px)' })

  console.log(stats)

  return (
    <StyledFaceToFaceTable
      sx={{ minWidth: 300, maxWidth: 1000, margin: '0.5rem auto' }}
      aria-label="simple table"
    >
      <TableHead>
        <TableRow>
          <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
            Jugador
          </TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
            PJ
          </TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
            PG
          </TableCell>
          {isSm && (
            <>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                PE
              </TableCell>
            </>
          )}
          <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
            PP
          </TableCell>
          {isSm && (
            <>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                GF
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                GC
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                DIF
              </TableCell>
            </>
          )}
          {isL && (
            <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
              Mayor victoria
            </TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {stats.map(
          ({
            id,
            name,
            played,
            wins,
            draws,
            losses,
            goalsFor,
            goalsAgainst,
            scoringDifference,
            bestWin,
          }) => (
            <TableRow
              key={id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
              <TableCell component="th" scope="row">
                {played}
              </TableCell>
              <TableCell component="th" scope="row">
                {wins}
              </TableCell>
              {isSm && (
                <>
                  <TableCell component="th" scope="row">
                    {draws}
                  </TableCell>
                </>
              )}
              <TableCell component="th" scope="row">
                {losses}
              </TableCell>
              {isSm && (
                <>
                  <TableCell component="th" scope="row">
                    {goalsFor}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {goalsAgainst}
                  </TableCell>
                  <>
                    <TableCell component="th" scope="row">
                      {scoringDifference}
                    </TableCell>
                  </>
                </>
              )}
              {isL && (
                <TableCell component="th" scope="row">
                  <div className="teamAndLogoWrapper">
                    {bestWin.teamThatWon.name}
                    <img
                      src={`${database}/logos/${bestWin.teamThatWon.id}`}
                      alt={bestWin.teamThatWon.name}
                    />{' '}
                    {bestWin.scoreFromTeamThatWon} -{' '}
                    {bestWin.scoreFromTeamThatLost}{' '}
                    <img
                      src={`${database}/logos/${bestWin.teamThatLost.id}`}
                      alt={bestWin.teamThatLost.name}
                    />
                    {bestWin.teamThatLost.name}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ),
        )}
      </TableBody>
    </StyledFaceToFaceTable>
  )
}

export default FaceToFaceTable
