import styled from 'styled-components'

export const StyledPlayoffsContainer = styled.div`
  border: 0;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  .playoff__container-left,
  .playoff__container-right {
    width: 250px;
    .match {
      background-color: #001a2a;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 1rem auto;
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
      }
    }
  }
  .playoff__container-right {
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
      }
    }
  }
`
