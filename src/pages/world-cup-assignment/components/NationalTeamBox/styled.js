import styled from 'styled-components'

export const StyledNationalTeamBox = styled.div`
  background-color: beige;
  display: flex;
  flex-direction: column;
  height: 250px;
  margin: 3rem;
  outline: darkblue 2px solid;
  padding: 0.5rem;
  width: 200px;
  .box__header {
    align-items: center;
    background-color: pink;
    display: flex;
    justify-content: space-between;
    width: 100%;
    .header-team {
      font-size: 1.25rem;
      font-style: italic;
      margin-left: 0.5rem;
    }
    .header-logo {
      height: 100px;
      width: 90px;
    }
  }
`
