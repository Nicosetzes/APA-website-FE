import styled from 'styled-components'

export const StyledAccolades = styled.section`
  border-top: 1px solid rgba(229, 199, 132, 0.16);
  padding: 3rem clamp(1rem, 4vw, 3rem) 3.5rem;

  .accolades__intro {
    margin: 0 auto 2rem;
    max-width: 1180px;

    h2 {
      align-items: center;
      color: #f5f0e6;
      display: flex;
      gap: 0.6em;
      font-size: clamp(1.75rem, 4vw, 2.6rem);
      line-height: 1.1;
      margin: 0;
      text-transform: uppercase;
    }

    .section-title__logo {
      flex: 0 0 auto;
      height: 1.5em;
      width: auto;
    }
  }

  .accolades__grid {
    align-items: stretch;
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 25rem));
    justify-content: center;
    margin: 0 auto;
    max-width: 1180px;
  }
`
