import styled from 'styled-components'
export const StyledChampionshipBox = styled.div`
  background-color: #004a79;
  display: flex;
  flex-direction: column;
  height: 400px;
  margin: 1rem 0.5rem;
  outline: #0d8499 3px solid;
  width: 550px;
  .showcase__header {
    display: flex;
    width: 100%;
    .showcase__header-title {
      background-color: #0d8499;
      color: #fff;
      font-size: 1.25rem;
      font-weight: 700;
      height: fit-content;
      margin: 1rem 0;
      text-align: center;
      text-transform: uppercase;
      width: 100%;
    }
  }
  .showcase__body {
    display: flex;
    justify-content: space-between;
    height: 90%;
    .showcase__body-champion,
    .showcase__body-finalist {
      align-items: center;
      display: flex;
      height: 150px;
      justify-content: space-evenly;
      margin: auto 0.5rem;
      position: relative;
      width: 250px;
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
    }
    .showcase__body-champion {
      background-color: #f5d77f;
      border: #daa813 3.5px solid;
    }
    .showcase__body-finalist {
      background-color: #c5c3c0;
      border: #61605f 3.5px solid;
    }
  }
`
