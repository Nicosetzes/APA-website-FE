import PersonIcon from '@mui/icons-material/Person'
import { StyledFaceToFaceTable } from './styled'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '../Tooltip'
import { database } from 'api'

const FaceToFaceTable = ({ stats }) => {
  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <StyledFaceToFaceTable
        sx={{ minWidth: 300, maxWidth: 1000, margin: '0.5rem auto' }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
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
              Mayor victoria
            </TableCell>
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
                  <div className="teamAndLogoWrapper">
                    <Tooltip title={bestWin.teamThatWon.name}>
                      <img
                        src={`${database}/logos/${bestWin.teamThatWon.id}`}
                        alt={bestWin.teamThatWon.name}
                      />
                    </Tooltip>{' '}
                    {bestWin.scoreFromTeamThatWon} -{' '}
                    {bestWin.scoreFromTeamThatLost}{' '}
                    <Tooltip title={bestWin.teamThatLost.name}>
                      <img
                        src={`${database}/logos/${bestWin.teamThatLost.id}`}
                        alt={bestWin.teamThatLost.name}
                      />
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </StyledFaceToFaceTable>
    </div>
  )
}

export default FaceToFaceTable
