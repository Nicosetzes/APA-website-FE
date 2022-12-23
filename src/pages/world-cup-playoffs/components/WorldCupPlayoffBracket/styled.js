import styled from 'styled-components'

export const StyledPlayoffsContainer = styled.div`
  align-items: center;
  background-color: #003545;
  border: 0;
  display: flex;
  height: 1000px;
  justify-content: start;
  overflow-x: auto;
  padding: 0.5rem;
  .playoff__first-round {
    display: flex;
    flex-direction: column;
    height: 100%;
    .match {
      margin: auto 0.5rem auto 0;
    }
  }
  .playoff__second-round {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    .match {
      margin: auto 0.5rem auto 0;
    }
  }
  .playoff__third-round {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    .match {
      margin: auto 0.5rem auto 0;
    }
  }
  .playoff__last-round {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    .match {
      margin: 4rem 0.5rem 4rem 0;
    }
    .playoff__champion {
      display: flex;
      margin: auto 0 0 0;
      padding: 0.5rem;
    }
    .playoff__finalist {
      margin: 0 0.5rem auto 0;
    }
  }
  .brackets {
    display: flex;
    flex-direction: column;
    height: 100%;
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
`
