import styled from 'styled-components'
import Table from '@mui/material/Table'

export const StyledCalculatorStandingsTable = styled(Table)`
  background-color: rgba(0, 74, 121, 1);
  border: var(--yellow-900) 3px solid;

  .MuiTableBody-root {
    .MuiTableRow-root {
      .MuiTableCell-root {
        color: #fff;
        font-family: 'Fira Sans', sans-serif;
        font-weight: 800;
        padding: 0.5rem 0;
        text-align: center;
        &:nth-child(2) {
          .teamAndLogoWrapper {
            align-items: center;
            display: flex;
            height: 100%;
            img {
              height: 25px;
              margin-right: 0.5rem;
              width: 25px;
            }
          }
        }
      }
    }
  }
`
