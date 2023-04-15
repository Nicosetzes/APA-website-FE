import styled from 'styled-components'
import Table from '@mui/material/Table'

export const StyledTable = styled(Table)`
  background-color: #004a79;
  border: #d8a711 3px solid;
  .MuiTableHead-root {
    background-color: #1a1a2c;
  }
  .MuiTableBody-root {
    background-color: #0d3d3e;
    .streak {
      align-items: center;
      display: flex;
      justify-content: center;
      margin: 0 0.5rem;
    }
  }
`
