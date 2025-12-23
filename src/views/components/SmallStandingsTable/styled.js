import styled from 'styled-components'
import Table from '@mui/material/Table'

export const StyledSmallStandingsTable = styled(Table)`
  background: rgba(0, 74, 121, 1);
  border: #ffdf21 2px solid;
  margin: 0.25rem 0 0 0;
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
            a {
              align-items: center;
              display: flex;
              color: #fff;
              text-decoration: none;
            }
          }
        }
      }
    }
  }
`
