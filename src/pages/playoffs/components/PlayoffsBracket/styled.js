import styled from 'styled-components'

export const StyledPlayoffsContainer = styled.div`
  background-color: #003545;
  border: 0;
  display: flex;
  justify-content: space-between;
  overflow-x: auto;
  padding: 0.5rem;
  .playoff__container-left,
  .playoff__container-right {
    display: flex;
    flex-wrap: nowrap;
    height: 500px;
    .playoff__first-round {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .playoff__second-round {
      justify-content: center;
      display: flex;
      flex-direction: column;
      height: 100%;
      .match {
        margin: auto 0 auto 0;
        /* position: relative;
        &::before {
          content: '';
          display: inline-block;
          width: 200px;
          height: 200px;
          background-image: url('/bracket.png');
          background-size: 200px;
          position: absolute;
        } */
      }
    }
    .playoff__third-round {
      justify-content: center;
      display: flex;
      flex-direction: column;
      height: 100%;
      .match {
        margin: auto 0;
      }
    }
  }
  .playoff__container-right {
    flex-direction: row-reverse;
    .match-team {
      justify-content: flex-end;
      .match-team-seed {
        order: 3;
      }
      .match-team-logo {
        order: 2;
      }
      .match-team-name {
        order: 1;
        text-align: right;
      }
    }
  }
  .playoff__container-center {
    display: flex;
    flex-direction: column;
    margin: 5rem 0.25rem;
    .match {
      background-color: #3c6562;
      margin-bottom: auto;
    }
  }
  .brackets {
    display: flex;
    flex-direction: column;
    &.two {
      img {
        height: 145px;
        width: 25px;
        &:first-child {
          margin: auto 0;
        }
        &:last-child {
          margin: auto 0;
        }
      }
    }
    &.reverse {
      transform: rotate(180deg);
    }
    &.one {
      img {
        height: 275px;
        margin: auto 0;
        /* transform: rotate(180deg); */
        width: 25px;
      }
    }
  }
  .match {
    background-color: #001a2a;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 1rem auto;
    width: 175px;
    .match-team {
      align-items: center;
      color: #fff;
      display: flex;
      height: 30px;
      margin: 0.5rem;
      .match-team-seed {
        background-color: #001a2a;
        border: beige 2px solid;
        color: #fff;
        font-size: 1.25rem;
        font-weight: 700;
        text-align: center;
        width: 15%;
      }
      .match-team-logo {
        margin: 0 0.5rem;
        width: 20px;
      }
      .match-team-name {
        font-size: 0.8rem;
      }
    }
  }
`
