import styled from 'styled-components'

export const StyledChampionBox = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  margin: auto 1rem 2rem 1rem;
  padding: 1rem 1.5rem;
  width: 200px;
  .title {
    align-items: center;
    color: var(--orange-900);
    display: flex;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 auto 0 0;
    text-decoration: none;
    svg {
      margin: 0 0.25rem;
    }
  }
  .team {
    margin: 0.5rem auto;
  }
  .player {
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 2rem 0 auto;
  }
`
