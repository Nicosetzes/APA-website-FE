import styled from 'styled-components'

export const StyledFinalistCard = styled.div`
  align-items: center;
  background-color: #323232;
  border: 0;
  color: #fff;
  display: flex;
  padding: 0.5rem;
  img {
    width: 150px;
  }
  .finalist {
    display: flex;
    flex-direction: column;
    margin-right: 1.5rem;
    .finalist-team {
      font-size: 1.75rem;
    }
    .finalist-player {
      font-size: 2.25rem;
      margin: 0.25rem 0 0.25rem auto;
    }
    .finalist-tournament {
      font-size: 1rem;
      margin: 0.25rem auto 0.25rem 0.25rem;
    }
  }
`
