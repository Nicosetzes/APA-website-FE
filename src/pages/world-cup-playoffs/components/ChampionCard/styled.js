import styled from 'styled-components'

export const StyledChampionCard = styled.div`
  align-items: center;
  background-color: #424015;
  border: 0;
  color: #fff;
  display: flex;
  padding: 0.5rem;
  img {
    width: 150px;
  }
  .champion {
    display: flex;
    flex-direction: column;
    margin-right: 1.5rem;
    .champion-team {
      font-size: 1.75rem;
    }
    .champion-player {
      font-size: 2.25rem;
      margin: 0.25rem 0 0.25rem auto;
    }
    .champion-tournament {
      font-size: 1rem;
      margin: 0.25rem auto 0.25rem 0.25rem;
    }
  }
`
