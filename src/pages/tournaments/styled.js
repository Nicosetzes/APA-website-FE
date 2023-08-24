import styled from 'styled-components'
export const StyledTournamentsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .container__card {
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 0.5rem;
    outline: #d8a711 2px solid;
    padding: 0.75rem;
    width: 350px;
    /* margin: 0 0.75rem;
    max-width: 200px; */
    a {
      display: flex;
      text-decoration: none;
    }
    img {
      height: 300px;
    }
    .container__card-name {
      color: #004a79;
      display: flex;
      flex-flow: column;
      font-size: 1.25rem;
      font-weight: 700;
      justify-content: space-between;
      width: 75%;
    }
  }
`
