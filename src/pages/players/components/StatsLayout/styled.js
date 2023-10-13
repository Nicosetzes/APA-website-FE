import styled from 'styled-components'

export const StyledStatsLayout = styled.div`
  .stats__matches {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .stats__teams {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .teams__team {
      align-items: center;
      display: flex;
      margin: 1rem;
      img {
        height: 40px;
        margin: 0 0.25rem;
        width: 40px;
      }
    }
  }
`
