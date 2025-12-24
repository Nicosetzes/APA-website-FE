import styled from 'styled-components'
import Table from '@mui/material/Table'

export const StyledFaceToFaceTable = styled(Table)`
  background-color: #212529;
  .MuiTableBody-root {
    .MuiTableRow-root {
      &:nth-child(1),
      &:nth-child(2) {
        background-color: #007058;
        .teamAndLogoWrapper {
          align-items: center;
          display: flex;
          justify-content: center;
          min-width: 125px;
          img {
            height: 25px;
            margin: 0 0.25rem;
            width: 25px;
          }
        }

        &:hover {
          background-color: #237c69;
        }
      }
      .MuiTableCell-root {
        color: #fff;
        font-family: 'Fira Sans', sans-serif;
        font-weight: 800;
        padding: 0.5rem 0;
        text-align: center;
      }
    }
  }
`
