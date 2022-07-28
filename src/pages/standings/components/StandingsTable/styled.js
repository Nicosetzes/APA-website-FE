import styled from "styled-components";
import Table from "@mui/material/Table";

export const StyledTable = styled(Table)`
  background-color: #212529;

  .css-34nofg-MuiTableRow-root {
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6) {
      background-color: #007058;
      &:hover {
        background-color: #237c69;
      }
    }
    &:nth-child(7),
    &:nth-child(8) {
      background-color: #a1920a;
      &:hover {
        background-color: #b8ae58;
      }
    }
    &:nth-child(9),
    &:nth-child(10) {
      background-color: #75330c;
      &:hover {
        background-color: #8f5e42;
      }
    }
    .css-1ex1afd-MuiTableCell-root {
      color: #fff;
      font-weight: 800;
      text-align: center;
      &:nth-child(2) {
        .teamAndLogoWrapper {
          align-items: center;
          display: flex;
          height: 100%;
          a {
            align-items: center;
            display: flex;
            color: #fff;
            text-decoration: none;
          }
        }
      }
    }
    img {
      height: 25px;
      margin-right: 0.5rem;
      width: 25px;
    }
  }
`;
