import styled from 'styled-components'

export const StyledForm = styled.form`
  background-color: aliceblue;
  display: flex;
  flex-direction: column;
  .form__first-division,
  .form__second-division {
    align-items: center;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    .header {
      text-align: center;
      width: 20%;
    }
    .first-division__leagues,
    .second-division__leagues {
      align-items: center;
      display: flex;
      flex-grow: 3;
      flex-wrap: wrap;
      justify-content: center;
      padding: 1rem 0.75rem;
      width: 60%;
      div {
        margin: 0.25rem;
      }
    }
    .first-division__leagues {
      background-color: aquamarine;
    }
    .second-division__leagues {
      background-color: antiquewhite;
    }
  }
  .form__submit {
    width: 75px;
  }
`
