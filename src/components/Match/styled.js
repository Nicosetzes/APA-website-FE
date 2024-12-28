import styled from 'styled-components'

export const StyledMatch = styled.form`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin: 0.5rem;
  max-width: 400px;
  outline: #dc3545 3px solid;
  padding: 1rem 0;

  .match-view {
    align-items: center;
    display: flex;
    justify-content: space-evenly;
    .match-info {
      align-items: center;
      color: #000;
      display: flex;
      flex-direction: column;
      text-decoration: none;

      .match-info__player {
        border: 0;
        display: flex;
        flex-wrap: wrap;
        font-size: 0.875rem;
        font-weight: 800;
        justify-content: center;
        text-align: center;
        width: 50px;

        &:focus {
          outline: 0;
        }
      }

      .match-info__logo {
        cursor: pointer;
        margin-bottom: 1rem;
      }

      .match-info__team {
        border: 0;
        font-size: 0.875rem;
        font-weight: 800;
        resize: none;
        text-align: center;
        width: 100px;

        &:focus {
          outline: 0;
        }
      }

      img {
        max-height: 70px;
        max-width: 70px;
      }
    }

    .match-score {
      align-items: center;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: space-evenly;
      margin: auto 0 1rem 0;
      // width: 125px;

      .match-score__goals {
        border: 0;
        display: flex;
        font-size: 2.25rem;
        justify-content: center;
        text-align: center;
        width: 35px;

        /* Para retirar flechas en los input de tipo número */
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        &:focus {
          outline: 0;
        }
      }

      .match__container {
        align-items: center;
        display: flex;
        justify-content: center;
        width: 100%;
      }

      .input__container {
        align-items: center;
        display: flex;
        // flex-direction: column;
        justify-content: center;
        // padding: 0 0.125rem;

        .fixture-edit {
          background-color: #ff852d;
          border: 0;
          border-radius: 10px;
          color: #fff;
          font-size: 0.675rem;
          outline: #000 2px solid;
          padding: 0.25rem 0.5rem;
        }

        .fixture-delete {
          background-color: #ce0404;
          border: 0;
          border-radius: 10px;
          color: #fff;
          font-size: 0.675rem;
          margin-left: 0.375rem;
          outline: #000 2px solid;
          padding: 0.25rem 0.5rem;
        }
      }

      .fixture-submit {
        background-color: rgb(81, 179, 72);
        border: 0;
        border-radius: 10px;
        color: #fff;
        font-size: 0.675rem;
        outline: #000 2px solid;
        padding: 0.25rem 0.5rem;
      }

      .match-score__versus {
        font-size: 1rem;
      }

      input {
        font-size: 1rem;
      }
    }
  }
  .match-date {
    display: flex;
    font-size: 0.875rem;
    margin: 1rem 0 0 0;
  }
`
