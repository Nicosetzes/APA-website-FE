import styled from 'styled-components'

export const StyledAssignment = styled.div`
  margin: 1rem 0;
  .container__players {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .players-box {
      align-items: center;
      display: flex;
      justify-content: center;
      margin: 0.25rem;
      padding: 0.25rem 0;
      width: 75px;
    }
    button {
      background-color: #022746;
      font-size: 0.9rem;
      margin: 1rem;
      padding: 0.75rem;
    }
  }
  .container__teams {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 auto;
    max-width: 900px;
    .teams-box {
      align-items: center;
      border: black 2px solid;
      display: flex;
      justify-content: center;
      margin: 0.25rem;
      padding: 0.25rem 0;
      width: 75px;
      &.draggable {
        cursor: grab;
      }
      .teams-box-title {
      }
      .teams-box-logo {
        margin: 0 0.25rem;
        height: 30px;
        max-width: 30px;
      }
    }
  }
  .container__groups {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 auto;
    max-width: 1300px;
    .groups-box {
      align-content: center;
      border: black 2px solid;
      display: flex;
      height: 500px;
      flex-direction: column;
      flex-wrap: wrap;
      height: fit-content;
      margin: 1rem 0.25rem;
      min-height: 180px;
      width: 200px;
      .groups-box-title {
        font-weight: 700;
        margin: 0.5rem auto;
      }
      .groups-box-subtitle {
        font-size: 0.85rem;
        font-weight: 400;
        margin: 0.5rem auto;
        padding: 0 0.5rem;
        text-align: center;
        &.bottom {
          margin: auto 0 0.5rem 0;
        }
      }
      .groups-box-teams {
        display: flex;
        /* flex-direction: column; */
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
        div {
          align-items: center;
          cursor: pointer;
          display: flex;
          justify-content: center;
          margin: 0.25rem;
          width: 75px;
          img {
            height: 30px;
            margin: 0.25rem;
            max-width: 30px;
          }
        }
      }
    }
  }
`
