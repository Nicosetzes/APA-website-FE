import styled from 'styled-components'

export const StyledForm = styled.form`
  background-color: aliceblue;
  display: flex;
  flex-direction: column;
  .header {
    text-align: center;
  }
  .container__title {
    align-items: center;
    border: black 1px solid;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 1rem;
    padding: 0.75rem;
    input {
      margin: 1rem auto;
      text-align: center;
    }
  }
  .container__players {
    align-items: center;
    border: black 1px solid;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 2rem;
    padding: 0.75rem;
  }
  .container__teams {
    align-items: center;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;

    div {
      align-items: center;
      border: 0;
      border-radius: 10px;
      background-color: cornsilk;
      display: flex;
      height: 65px;
      justify-content: flex-start;
      max-width: 350px;
      padding: 0.5rem 0.25rem;
      &:nth-child(odd) {
        margin: 0.5rem auto 0.5rem 1.5rem;
      }
      &:nth-child(even) {
        margin: 0.5rem 1.5rem 0.5rem auto;
      }
      img {
        margin: 0 0.75rem;
        width: 50px;
      }
      input {
        margin: 0 0.75rem;
      }
    }
  }
`
