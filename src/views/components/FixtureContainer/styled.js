import styled from 'styled-components'

export const StyledFixtureContainer = styled.div`
  align-items: start;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  margin: 0 auto;
  max-width: fit-content;
  min-height: 800px;
  padding-block: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    min-height: 500px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    min-height: 300px;
  }
`
