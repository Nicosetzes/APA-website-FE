import styled from 'styled-components'

export const StyledStreakContainer = styled.div`
  border: black 1px solid;
  border-radius: 10px;
  display: flex;
  margin: 1.5rem auto 2rem auto;
  padding: 1rem 0.5rem 1.5rem 0.5rem;
  .card__streak {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .card__streak-player {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0.5rem;
    }
    .card__streak-outcome {
      display: grid;
      grid-template-rows: repeat(2, 1fr);
      grid-template-columns: repeat(5, 1fr);
    }
  }
`
