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
    height: calc(100vh - 110px);
    isolation: isolate;
    position: relative;
    &::after {
      content: '';
      background-color: var(--blue-900);
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
      height: ${(props) => `${props.isM ? '300px' : '200px'}`};
      margin: 0 auto;
      position: relative;
      overflow-x: hidden;
      width: ${(props) => `${props.isM ? '750px' : '300px'}`};
      img {
        position: absolute;
        height: ${(props) => `${props.isM ? '250px' : '125px'}`};
        &:nth-child(1) {
          bottom: 0;
          left: ${(props) => `${props.isM ? '0' : '-12.5px'}`};
        }
        &:nth-child(2) {
          bottom: 0;
          left: ${(props) => `${props.isM ? '50px' : '0px'}`};
        }
        &:nth-child(3) {
          bottom: 0;
          left: ${(props) => `${props.isM ? '100px' : '12.5px'}`};
        }
        &:nth-child(4) {
          bottom: 0;
          left: ${(props) => `${props.isM ? '500px' : '195px'}`};
        }
        &:nth-child(5) {
          bottom: 0;
          left: ${(props) => `${props.isM ? '315px' : '110px'}`};
        }
      }
    }
  }
  .container__accolades {
    align-items: center;
    background-image: ${(props) => `url(${props.championBackground})`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    isolation: isolate;
    justify-content: center;
    padding: 1.5rem 0.5rem;
    position: relative;
    width: 100%;
    &::after {
      content: '';
      background-color: var(--blue-900);
      mix-blend-mode: hard-light;
      position: absolute;
      inset: 0;
      z-index: -1;
    }
    .box__champion {
      align-items: center;
      border: #fff 2px solid;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin: 0 auto;
      padding: 1.75rem 0.75rem;
      @media (min-width: 400px) {
        padding: 2rem;
      }
      .champion-title {
        color: #fff;
        display: flex;
        font-size: 1rem;
        font-weight: 700;
        margin: 0.5rem auto;
      }
      .champion-tournament {
        color: #fff;
        display: flex;
        font-size: 2rem;
        font-weight: 700;
        text-align: center;
      }
      .champion-img {
        display: flex;
        img {
          height: 150px;
        }
      }
      .champion-player {
        align-items: center;
        display: flex;
        justify-content: center;
        span {
          color: #fff;
          display: flex;
          font-size: 1.5rem;
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
        border: var(--orange-900) 2px solid;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
        font-size: 0.75rem;
        font-weight: 700;
        margin: 1.25rem auto;
        padding: 0.5rem 2rem;
      }
    }
  }
  .container__recap {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem 1rem;
    .recap-title {
      color: var(--blue-900);
      font-size: 1.5rem;
      font-weight: 700;
    }
    .recap-select {
      background: none;
      border: var(--orange-900) 2px solid;
      border-radius: 5px;
      color: var(--blue-900);
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 700;
      padding: 0.5rem 1rem;
    }
    .recap-status {
      color: var(--blue-900);
      display: flex;
      justify-content: center;
      padding: 1rem;
    }
    .recap-status--error {
      color: crimson;
    }
    .recap-card {
      border: var(--blue-900) 2px solid;
      border-radius: 5px;
      max-width: 700px;
      padding: 1.25rem;
      width: 100%;
    }
    .recap-meta {
      color: var(--orange-900);
      font-size: 0.875rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }
    .recap-text {
      color: var(--blue-900);
      line-height: 1.5;
      overflow-wrap: anywhere;
      h1,
      h2,
      h3 {
        line-height: 1.25;
        margin: 1.25rem 0 0.5rem;
      }
      h1 {
        font-size: 1.5rem;
        margin-top: 0;
      }
      h2 {
        font-size: 1.25rem;
      }
      h3 {
        font-size: 1.05rem;
      }
      p {
        margin: 0.5rem 0;
      }
      ul,
      ol {
        margin: 0.5rem 0;
        padding-left: 1.5rem;
      }
      hr {
        border: 0;
        border-top: var(--orange-900) 1px solid;
        margin: 1rem 0;
      }
    }
  }
  .container__tournament {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 500px;
    .tournament-title {
      color: var(--blue-900);
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
        max-width: 100%;
      }
    }
    .tournament-name {
      align-items: center;
      color: var(--blue-900);
      display: flex;
      font-size: 1rem;
      font-weight: 700;
      justify-content: center;
      margin: 0 0.5rem;
      text-align: center;
      width: 50%;
    }
    button {
      background: none;
      border: var(--orange-900) 2px solid;
      border-radius: 5px;
      color: var(--blue-900);
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 700;
      margin: 1.25rem auto;
      padding: 0.5rem 2rem;
    }
  }
`
