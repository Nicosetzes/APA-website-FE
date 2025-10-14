import styled from 'styled-components'

export const StyledStatsLayout = styled.div`
  background-color: var(--blue-900);
  padding: 2.5rem 0;
  .stats__teams {
    align-items: center;
    color: #fff;
    display: flex;
    flex-wrap: wrap;
    font-weight: 700;
    justify-content: center;
    margin: 0 auto;
    max-width: 600px;
    & > span {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 2rem;
      text-decoration: underline;
    }
    & > div {
      display: flex;
      flex-wrap: wrap;
      gap: 1.25rem;
      justify-content: center;
    }
    .teams__team {
      align-items: center;
      display: flex;
      & > span {
        text-align: center;
      }
      img {
        height: 40px;
        margin: 0 0.25rem;
        width: 40px;
      }
    }
  }
  .stats__container {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    max-width: 1366px;
    .stats__data {
      color: #fff;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin: 2rem auto;
      .data__card {
        align-items: center;
        background-color: #022f2a;
        border: var(--yellow-900) 3px solid;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0.75rem;
        max-width: 250px;
        padding: 1.75rem;
        width: 100%;
        .card__title {
          font-size: 1.5rem;
          text-align: center;
        }
        .card__value {
          font-size: 3.75rem;
          font-weight: 700;
        }
      }
    }
    .stats__matches {
      align-content: start;
      background-color: var(--blue-900);
      display: flex;
      flex-basis: ${(props) => `${props.isXL ? '75%' : 'auto'}`};
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;
    }
  }
`
