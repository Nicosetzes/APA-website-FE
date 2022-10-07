import styled from 'styled-components'
import Table from '@mui/material/Table'

export const StyledTable = styled(Table)`
  background-color: #212529;

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
