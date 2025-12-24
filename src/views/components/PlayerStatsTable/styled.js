import styled from 'styled-components'
import Table from '@mui/material/Table'

export const StyledTable = styled(Table)`
  background-color: var(--blue-900);
  border: var(--orange-900) 3px solid;
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
