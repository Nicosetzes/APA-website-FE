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
      &:nth-of-type(1),
      &:nth-of-type(2) {
        background-color: ${(props) =>
          `${
            props.format.includes('playin') ||
            props.format.includes('world_cup')
              ? '#007058'
              : 'rgba(0, 74, 121, 1)'
          }`};
        &:hover {
          background-color: ${(props) =>
            `${
              props.format.includes('playin') ||
              props.format.includes('world_cup')
                ? '#237c69'
                : '#306485'
            }`};
        }
      }
      ,
      &:nth-of-type(3) {
        background-color: ${(props) =>
          `${
            props.format === 'world_cup_2026'
              ? '#a1920a'
              : props.format.includes('playin')
              ? '#007058'
              : 'rgba(0, 74, 121, 1)'
          }`};
        &:hover {
          background-color: ${(props) =>
            `${
              props.format === 'world_cup_2026'
                ? '#b8ae58'
                : props.format.includes('playin')
                ? '#237c69'
                : '#306485'
            }`};
        }
      }
      ,
      &:nth-of-type(4) {
        background-color: ${(props) =>
          `${
            props.format.includes('playin') ? '#007058' : 'rgba(0, 74, 121, 1)'
          }`};
        &:hover {
          background-color: ${(props) =>
            `${props.format.includes('playin') ? '#237c69' : '#306485'}`};
        }
      }
      ,
      &:nth-of-type(5),
      &:nth-of-type(6) {
        background-color: ${(props) =>
          `${
            props.format.includes('playin') ? '#007058' : 'rgba(0, 74, 121, 1)'
          }`};
        &:hover {
          background-color: ${(props) =>
            `${props.format.includes('playin') ? '#237c69' : '#306485'}`};
        }
      }
      &:nth-of-type(7),
      &:nth-of-type(8) {
        background-color: ${(props) =>
          `${
            props.format.includes('playin') ? '#a1920a' : 'rgba(0, 74, 121, 1)'
          }`};
        &:hover {
          background-color: ${(props) =>
            `${props.format.includes('playin') ? '#b8ae58' : '#306485'}`};
        }
      }
      &:nth-of-type(9),
      &:nth-of-type(10) {
        background-color: ${(props) =>
          `${
            props.format.includes('playin') ? '#75330c' : 'rgba(0, 74, 121, 1)'
          }`};
        &:hover {
          background-color: ${(props) =>
            `${props.format.includes('playin') ? '#8f5e42' : '#306485'}`};
        }
      }
      ,
      &:nth-of-type(11),
      &:nth-of-type(12),
      &:nth-of-type(13),
      &:nth-of-type(14),
      &:nth-of-type(15) {
        background-color: rgba(0, 74, 121, 1);
        &:hover {
          background-color: #306485;
        }
      }
      ,
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
