import styled from 'styled-components'

export const StyledHallOfFame = styled.main`
  background: radial-gradient(circle at 50% 0%, #143b50 0%, transparent 34rem),
    linear-gradient(180deg, #081923 0%, #0c2332 100%);
  min-height: 100vh;
  overflow: hidden;

  .hall-of-fame__loader {
    align-items: center;
    display: flex;
    justify-content: center;
    min-height: 60vh;
  }

  .hall-of-fame__message {
    color: #f5f0e6;
    margin: 0 auto;
    padding: 3rem 1rem;
    text-align: center;
  }
`
