import styled from 'styled-components'
export const StyledPlayerBox = styled.div`
  align-items: center;
  background-color: beige;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin: 1rem auto;
  outline: #0d8499 3px solid;
  padding: 3rem 0;
  width: 600px;
  .player-box-name {
    color: #004a79;
    font-size: 3rem;
    font-weight: 700;
    line-height: 2.5rem;
  }
  .player-box-trophies {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 2rem;
    img {
      height: 175px;
      margin: 0.5rem 0;
    }
  }
`
