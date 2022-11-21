import styled from 'styled-components'
export const StyledPlayerBox = styled.div`
  align-items: center;
  background-color: beige;
  box-sizing: border-box;
  display: flex;
  height: 275px;
  justify-content: start;
  margin: 1rem auto;
  outline: #0d8499 3px solid;
  padding: 1rem;
  width: 550px;
  .player-box-name {
    color: #004a79;
    font-size: 3rem;
    font-weight: 700;
    line-height: 2.5rem;
  }
  .player-box-trophies {
    display: flex;
    flex-wrap: wrap;
    img {
      margin: 0.5rem 0;
      width: 100px;
    }
  }
`
