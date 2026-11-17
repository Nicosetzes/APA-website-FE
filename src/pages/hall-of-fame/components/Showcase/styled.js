import styled from 'styled-components'

export const StyledShowcase = styled.section`
  padding: clamp(2.5rem, 6vw, 5rem) clamp(1rem, 4vw, 3rem) 3rem;

  .showcase__intro {
    margin: 0 auto 2rem;
    max-width: 1180px;

    h1 {
      align-items: center;
      color: #f5f0e6;
      display: flex;
      gap: 0.6em;
      font-size: clamp(2rem, 5vw, 3.25rem);
      line-height: 1.05;
      margin: 0;
      text-transform: uppercase;
    }

    .section-title__logo {
      flex: 0 0 auto;
      height: 1.5em;
      width: auto;
    }
  }

  .showcase__grid {
    align-items: stretch;
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 24rem), 1fr));
    margin: 0 auto;
    max-width: 1180px;
  }
`
