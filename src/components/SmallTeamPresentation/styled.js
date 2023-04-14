import styled from 'styled-components'

export const StyledSmallTeamPresentation = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 0.75rem 0.5rem;
  width: 100%;
  .position {
    width: 125px;
    .position-pos {
      display: flex;
      font-size: 1.5rem;
      justify-content: center;
    }
    .position-value {
      display: flex;
      justify-content: flex-end;
      font-size: 5rem;
    }
  }
  .logo {
    img {
      width: 125px;
    }
  }
`
