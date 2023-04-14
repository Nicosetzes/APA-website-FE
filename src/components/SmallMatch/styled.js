import styled from 'styled-components'

export const StyledSmallMatch = styled.div`
  background-color: rgba(0, 74, 121, 1);
  border: #ffdf21 2px solid;
  display: flex;
  flex-direction: column;
  margin: 0.25rem;
  padding: 0.75rem;
  width: 180px;
  .match-info {
    .match-info-team {
      font-size: 0.75rem;
    }
    .match-info-logo {
      img {
        width: 40px;
      }
    }
    .match-info-player {
      font-size: 0.5rem;
    }
  }
  .match-score {
    align-items: center;
    display: flex;
    .match-score-goals {
      font-size: 2rem;
      margin: auto 0.5rem;
    }
    .match-score-versus {
      font-size: 0.75rem;
    }
  }
`
