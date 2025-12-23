import styled from 'styled-components'
export const StyledTeamCard = styled.div`
  align-items: center;
  background-color: #161426;
  border-radius: 10px;
  color: #fff;
  display: flex;
  flex-direction: column;
  height: 275px;
  justify-content: center;
  margin: 1rem;
  outline: black 2px solid;
  padding: 1.75rem 1.25rem;
  width: 175px;
  .header {
    width: 100%;
    .header-name {
      font-size: 1.25rem;
      font-weight: 700;
      width: fit-content;
    }
    .header-logo {
      margin: 1rem 0 1rem auto;
      width: fit-content;
      img {
        width: 100px;
      }
    }
    .header-player {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 auto 0 3rem;
      width: fit-content;
    }
  }
  .body {
    display: flex;
    flex-direction: column;
    margin: 2rem auto 0 auto;
    .body-squad {
      a {
        color: #ff4377;
        font-size: 1.5rem;
        font-weight: 700;
        margin: auto;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`
