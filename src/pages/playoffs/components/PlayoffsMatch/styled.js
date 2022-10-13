import styled from 'styled-components'
export const StyledPlayoffsMatch = styled.form`
  background-color: #001a2a;
  display: flex;
  justify-content: center;
  margin: 1rem auto;
  width: 375px;
  .match__teams {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 80%;
    .match__teams-team {
      align-items: center;
      color: #fff;
      display: flex;
      height: 40px;
      margin: 0.5rem;
      .team-seed {
        background-color: #001a2a;
        border: beige 2px solid;
        color: #fff;
        font-size: 1.25rem;
        font-weight: 700;
        text-align: center;
        width: 35px;
      }
      .team-logo {
        margin: 0 0.5rem;
        width: 20px;
      }
      .team-name {
        align-items: center;
        display: flex;
        font-size: 0.8rem;
        .team-score {
          align-items: center;
          display: flex;
          font-size: 1.125rem;
          font-weight: 700;
          height: 40px;
          margin-right: 0.5rem;
        }
        div {
          align-items: center;
          display: flex;
          width: 90px;
          &:first-child {
            width: 100px;
          }
        }
        input {
          height: 30px;
          width: 25px;
          &:first-child {
            margin: 0 0.25rem 0 0.5rem;
          }
          &:last-child {
            margin: 0 0.25rem 0 0;
          }
        }
      }
      /* input {
      width: 20px;
    } */
    }
  }
  .match__confirmation {
    display: flex;
    input {
      margin: auto;
    }
  }
`
