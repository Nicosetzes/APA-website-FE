import styled from 'styled-components'

export const StyledStatsLayout = styled.div`
  background-color: #004a79;
  .stats__teams {
    align-items: center;
    color: #fff;
    display: flex;
    flex-wrap: wrap;
    font-weight: 700;
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
  .stats__container {
    display: flex;
    flex-direction: ${(props) => `${props.isXL ? 'row' : 'column'}`};
    .stats__data {
      color: #fff;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin: 0 auto;
      flex-basis: ${(props) => `${props.isXL ? '20%' : 'auto'}`};
      .data__card {
        align-items: center;
        background-color: #022f2a;
        border: #fff 1px solid;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0.75rem;
        padding: 1.75rem;
        width: 175px;
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
      background-color: #004a79;
      display: flex;
      flex-basis: ${(props) => `${props.isXL ? '75%' : 'auto'}`};
      flex-wrap: wrap;
      justify-content: center;
    }
  }
`
