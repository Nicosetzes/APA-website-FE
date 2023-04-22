import styled from 'styled-components'

export const StyledHome = styled.div`
  .container__presentation {
    align-items: center;
    background-image: ${(props) => `url(${props.presentationBackground})`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 89vh;
    isolation: isolate;
    position: relative;
    &::after {
      content: '';
      background-color: #004a79;
      mix-blend-mode: hard-light;
      position: absolute;
      inset: 0;
      z-index: -1;
    }
    .logo {
      margin: auto 0;
      width: 175px;
    }
    .container__coaches {
      display: flex;
      height: 200px;
      margin: 0 auto;
      position: relative;
      width: ${(props) => `${props.isM ? '700px' : '350px'}`};
      img {
        position: absolute;
        height: ${(props) => `${props.isM ? '250px' : '150px'}`};
        &:nth-child(1) {
          bottom: 0;
          left: 0px;
        }
        &:nth-child(2) {
          bottom: 0;
          left: ${(props) => `${props.isM ? '50px' : '5px'}`};
        }
        &:nth-child(3) {
          bottom: 0;
          left: ${(props) => `${props.isM ? '100px' : '20px'}`};
        }
        &:nth-child(4) {
          bottom: 0;
          left: ${(props) => `${props.isM ? '485px' : '215px'}`};
        }
        &:nth-child(5) {
          bottom: 0;
          left: ${(props) => `${props.isM ? '315px' : '125px'}`};
        }
      }
    }
  }
  .container__champion {
    align-items: center;
    background-image: ${(props) => `url(${props.championBackground})`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    /* background-size: ${(props) => `${props.isXL && 'cover'}`}; */
    display: flex;
    flex-direction: column;
    height: 100vh;
    isolation: isolate;
    justify-content: center;
    position: relative;
    &::after {
      content: '';
      background-color: #004a79;
      mix-blend-mode: hard-light;
      position: absolute;
      inset: 0;
      z-index: -1;
    }
    .champion-title {
      color: #fff;
      display: flex;
      font-size: 1rem;
      font-weight: 700;
      margin: 0.5rem auto;
    }
    .champion-player {
      color: #fff;
      display: flex;
      font-size: 2rem;
      font-weight: 700;
    }
    .champion-img {
      display: flex;
      margin: 0.75rem auto;
      img {
        height: 150px;
      }
    }
    .champion-team {
      align-items: center;
      display: flex;
      justify-content: center;
      span {
        color: #fff;
        display: flex;
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 0.5rem;
        text-align: center;
      }
      img {
        width: 50px;
      }
    }
    button {
      background: none;
      border: #f5d77f 2px solid;
      border-radius: 5px;
      color: #fff;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 700;
      margin: 1.25rem auto;
      padding: 0.5rem 2rem;
    }
  }
  .container__tournament {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 500px;
    .tournament-title {
      color: #004a79;
      display: flex;
      font-size: 1rem;
      font-weight: 700;
      margin: 0.5rem auto;
    }
    .tournament-img {
      display: flex;
      margin: 0.75rem auto;
      img {
        height: 250px;
      }
    }
    .tournament-name {
      align-items: center;
      color: #004a79;
      display: flex;
      font-size: 1.75rem;
      font-weight: 700;
      justify-content: center;
      margin: 0 0.5rem;
      text-align: center;
      width: 50%;
    }
    button {
      background: none;
      border: #f5d77f 2px solid;
      border-radius: 5px;
      color: #004a79;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 700;
      margin: 1.25rem auto;
      padding: 0.5rem 2rem;
    }
  }
`
