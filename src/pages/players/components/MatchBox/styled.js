import styled from 'styled-components'

export const StyledMatchBox = styled.div`
  align-items: center;
  align-self: center;
  background-color: #131429;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1rem;
  max-width: 225px;
  padding: 0.5rem;
  width: 100%;
  .match__info {
    color: #fff;
    display: flex;
    .info__score {
      display: flex;
      font-size: 1.125rem;
      font-weight: 700;
      & > div {
        align-items: center;
        border: #31313f 1px solid;
        color: #31313f;
        display: flex;
        justify-content: center;
        width: 1.5rem;
      }
    }
    .info__team {
      align-items: center;
      display: flex;
      margin: 0 0.5rem;
      width: 75px;
      & > span {
        margin: 0 0.25rem;
      }
      & > img {
        height: 45px;
        width: 45px;
      }
    }
  }
  .match__date {
    color: #fff;
    font-size: 0.875rem;
  }
`
