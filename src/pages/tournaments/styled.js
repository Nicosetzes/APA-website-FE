import styled from 'styled-components'
export const StyledTournamentsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin: 0 auto;
  max-width: 1200px;
  .container__card {
    align-items: center;
    display: flex;
    justify-content: center;
    outline: var(--yellow-900) 2px solid;
    padding: 1rem 0.25rem;
    width: 350px;
    a {
      display: flex;
      text-decoration: none;
    }
    img {
      height: 275px;
      max-width: 200px;
    }
    .container__card-name {
      color: var(--blue-900);
      display: flex;
      flex-flow: column;
      font-size: 1.25rem;
      font-weight: 700;
      justify-content: space-between;
      width: 75%;
    }
  }
`
