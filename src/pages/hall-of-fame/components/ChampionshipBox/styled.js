import styled from 'styled-components'
export const StyledChampionshipBox = styled.div`
  background-color: #004a79;
  border: #0d8499 3px solid;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1rem 0.5rem;
  max-width: 575px;
  width: 100%;
  &:hover {
    border: #d8a711 3px solid;
  }
  .showcase__header {
    display: flex;
    margin: 1rem 0;
    width: 100%;
    .showcase__header-title {
      background-color: #0d8499;
      color: #fff;
      font-size: 1.25rem;
      font-weight: 700;
      height: fit-content;
      text-align: center;
      text-transform: uppercase;
      width: 100%;
    }
  }
  .showcase__body {
    display: flex;
    margin: auto 0;
    .showcase__body-results {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      position: relative;
      width: 100%;
      img {
        height: 85px;
        width: 85px;
      }
      .showcase__body-info {
        display: flex;
        flex-direction: column;
        .showcase__body-info-title {
          color: #000;
          font-size: 1rem;
          font-weight: 700;
        }
        .showcase__body-info-team {
          color: #000;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0.5rem 0;
        }
        .showcase__body-info-user {
          color: #004a79;
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 2.5rem;
        }
      }
      .circle {
        border-radius: 50%;
        height: 6px;
        position: absolute;
        width: 6px;
      }
      .circle-champion {
        background-color: #daa813;
      }
      .circle-finalist {
        background-color: #61605f;
      }
      .circle-top-right {
        right: 0.25rem;
        top: 0.25rem;
      }
      .circle-bottom-right {
        right: 0.25rem;
        bottom: 0.25rem;
      }
      .circle-bottom-left {
        left: 0.25rem;
        bottom: 0.25rem;
      }
      .circle-top-left {
        left: 0.25rem;
        top: 0.25rem;
      }
      .showcase__body-champion,
      .showcase__body-finalist {
        display: flex;
        margin: 0 auto;
        max-width: 325px;
        padding: 0.5rem 0;
        position: relative;
        width: 100%;
        img {
          margin: auto auto auto 0;
        }
        .showcase__body-info {
          margin: auto;
        }
      }
      .showcase__body-champion {
        background-color: #f5d77f;
        border: #daa813 3.5px solid;
        margin: 0 auto auto auto;
      }
      .showcase__body-finalist {
        background-color: #c5c3c0;
        border: #61605f 3.5px solid;
        margin: auto auto 1rem auto;
      }
    }
    .showcase__body-trophy {
      display: flex;
      margin-bottom: 1rem;
      max-width: 225px;
      width: 100%;
      img {
        align-self: center;
        margin: auto;
        max-height: 300px;
        max-width: fit-content;
        width: 100%;
      }
    }
  }
`
