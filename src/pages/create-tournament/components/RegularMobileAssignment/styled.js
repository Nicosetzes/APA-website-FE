import styled from 'styled-components'

export const StyledMobileAssignment = styled.div`
  margin: 1rem 0;
  .container__players {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .players-box {
      align-items: center;
      display: flex;
      justify-content: center;
      margin: 0.25rem;
      padding: 0.25rem 0;
      width: 75px;
    }
    button {
      background-color: #022746;
      font-size: 0.9rem;
      margin: 1rem;
      padding: 0.75rem;
    }
  }
  .container__teams {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 auto;
    max-width: 900px;
    .teams-box {
      align-items: center;
      border: black 2px solid;
      display: flex;
      flex-direction: column;
      height: 120px;
      justify-content: center;
      margin: 0.25rem;
      padding: 0 0.75rem;
      select {
        height: 30px;
        margin: 0.75rem auto;
        min-width: 40px;
      }
      .teams-box-title {
      }
      .teams-box-logo {
        margin: 0 0.25rem;
        height: 30px;
        max-width: 30px;
      }
    }
  }
`
