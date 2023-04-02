import styled from 'styled-components'

export const StyledLeaguesBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1.5rem;
  padding: 0.75rem;
  .leagues-box-title {
    font-weight: 700;
    margin: 1.5rem auto;
  }
  .leagues-box-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .teams-container {
    background-color: lightgray;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .teams-container-team {
      height: 40px;
      margin: 1rem;
      text-align: center;
      width: 150px;
    }
  }
`
