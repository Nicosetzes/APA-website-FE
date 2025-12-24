import styled from 'styled-components'
import Table from '@mui/material/Table'

export const StyledTable = styled(Table)`
  background-color: rgba(0, 74, 121, 1);
  border: var(--yellow-900) 3px solid;

  .MuiTableBody-root {
    .MuiTableRow-root {
      &:hover {
        background-color: #306485;
      }
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4),
      &:nth-child(5),
      &:nth-child(6) {
        background-color: ${(props) =>
          `${props.playin ? '#007058' : 'rgba(0, 74, 121, 1)'}`};
        &:hover {
          background-color: ${(props) =>
            `${props.playin ? '#237c69' : '#306485'}`};
        }
      }
      &:nth-child(7),
      &:nth-child(8) {
        background-color: ${(props) =>
          `${props.playin ? '#a1920a' : 'rgba(0, 74, 121, 1)'}`};
        &:hover {
          background-color: ${(props) =>
            `${props.playin ? '#b8ae58' : '#306485'}`};
        }
      }
      &:nth-child(9),
      &:nth-child(10) {
        background-color: ${(props) =>
          `${props.playin ? '#75330c' : 'rgba(0, 74, 121, 1)'}`};
        &:hover {
          background-color: ${(props) =>
            `${props.playin ? '#8f5e42' : '#306485'}`};
        }
      }
      .MuiTableCell-root {
        color: #fff;
        font-family: 'Fira Sans', sans-serif;
        font-weight: 800;
        padding: 0.5rem 0;
        text-align: center;
        &:nth-child(2) {
          .teamAndLogoWrapper {
            align-items: center;
            cursor: pointer;
            display: flex;
            height: 100%;
            min-width: 160px;
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
      .streak {
        align-items: center;
        display: flex;
        justify-content: center;
        margin: 0 0.5rem;
      }
    }
  }
`
