import styled from 'styled-components'
export const StyledTeamRankings = styled.div`
  align-items: center;
  background-color: rgba(0, 74, 121);
  color: #fff;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1rem 0.5rem;
  max-width: 700px;
  padding: 1rem 0;
  .title,
  .subtitle {
    font-weight: 700;
    margin: 0.75rem auto;
  }
  .subtitle {
    font-size: 1.25rem;
  }
  .container__rankings {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    .rankings__row {
      align-items: center;
      border-top: #d8a711 2px solid;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      padding: 1.25rem 0.75rem;
      .row__team {
        align-content: center;
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        min-width: 250px;
        .row__position {
          display: flex;
          flex-direction: column;
          .position-pos {
          }
          .position-number {
            font-size: 4rem;
            font-weight: 600;
          }
        }
        & > img {
          width: 100px;
        }
      }
      .row__stats {
        display: flex;
        flex-direction: column;
        .stats-title {
          font-size: 1.25rem;
          font-weight: 700;
          text-align: center;
          span {
            &:nth-of-type(2) {
              color: #f5d77f;
            }
          }
          & > div {
            color: #cbb51b;
            font-size: 1rem;
          }
        }
        .stats-numbers {
          display: flex;
          flex-direction: column;
          .numbers-row {
            margin: 0.5rem 0;
            span {
              &:nth-of-type(2) {
                font-weight: 700;
                text-decoration: underline;
              }
            }
          }
        }
      }
    }
  }
`
