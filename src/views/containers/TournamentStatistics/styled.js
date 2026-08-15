import styled from 'styled-components'

export const StatisticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1.5rem 0.875rem 3rem;
  }
`

export const PlayerSelector = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;

  width: 100%;
  margin-bottom: 2rem;
  padding: 1rem 1.25rem;

  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);

  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--blue-900);
    border-radius: 0.75rem 0 0 0.75rem;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 1.25rem;
    padding: 0.875rem;

    &::before {
      width: 3px;
    }
  }
`
