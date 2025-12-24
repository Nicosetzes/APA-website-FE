import styled from 'styled-components'
import Table from '@mui/material/Table'

export const StyledTable = styled(Table)`
  background: rgba(0, 74, 121, 1);
  border: var(--orange-900) 2px solid;
  margin: 0 auto;
  max-width: 1200px;
  .MuiTable-root {
    .MuiTableCell-root {
      color: #fff;
    }
  }
  .tournament-link {
    color: #fff;
    cursor: pointer;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
    }
  }
`
