import styled from 'styled-components'

export const StyledMatchBox = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1rem;
  max-width: 225px;
  padding: 0.5rem;
  width: 100%;
  .match__info {
    display: flex;
    .info__team,
    .info__score {
      align-items: center;
      display: flex;
      margin: 0 0.5rem;
    }
    .info__team {
      & > span {
        margin: 0 0.25rem;
      }
      & > img {
        height: 30px;
        width: 30px;
      }
    }
    .info__score {
      font-size: 1.25rem;
    }
  }
  .match__date {
    font-size: 0.875rem;
  }
`
