import styled from 'styled-components'

export const StyledPlayoffMatch = styled.div`
  background-color: rgb(0, 26, 42);
  display: flex;
  flex-direction: row;
  margin: 0.25rem;
  padding: 0 0.5rem;
  min-width: 210px;
  .container__team {
    align-items: center;
    display: flex;
    .team-seed {
      align-items: center;
      color: #fff;
      display: flex;
      font-weight: 700;
      height: 40px;
      margin: 0.5rem;
      width: 20px;
    }
    .team-logo {
      img {
        width: 25px;
      }
    }
    .team-name {
      align-items: center;
      color: #fff;
      display: flex;
      font-size: 0.8rem;
      height: 40px;
      margin: 0 0.5rem;
      width: 125px;
    }
    .team-user {
      align-items: center;
      color: #fff;
      display: flex;
      font-size: 0.8rem;
      height: 40px;
      margin: 0.5rem;
    }
    .team-score,
    .team-penalties {
      color: #fff;
      font-weight: 700;
    }
    .team-score {
      margin: 0 0 0 0.5rem;
    }
    .team-penalties {
      margin: 0 0.25rem;
    }
    .team-inputs {
      display: flex;
      input {
        height: 1.5rem;
        width: 1.5rem;
      }
    }
  }
  .match__confirmation {
    display: flex;
    margin: auto 0.5rem;
    input {
      margin: auto;
    }
  }
`
