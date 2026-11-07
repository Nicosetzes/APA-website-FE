import styled from 'styled-components'

export const Content = styled.div`
  opacity: ${({ $loading }) => ($loading ? 0.5 : 1)};
  transition: opacity 0.2s ease;
`

export const Notice = styled.p`
  color: ${({ $tone }) =>
    $tone === 'error' ? 'var(--red-700)' : 'rgba(0, 0, 0, 0.65)'};
  font-size: 0.95rem;
  margin: 0 auto 1.5rem auto;
  max-width: 600px;
  text-align: center;
`

export const RetryButton = styled.button`
  background: var(--blue-900);
  border: none;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  display: block;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0.75rem auto 0 auto;
  padding: 0.45rem 1.1rem;

  &:focus-visible {
    outline: 2px solid var(--orange-900);
    outline-offset: 2px;
  }
`

export const TournamentHeading = styled.div`
  margin: 0 auto 1rem auto;
  max-width: 900px;
`

export const TournamentTitle = styled.h3`
  color: var(--blue-900);
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
`

export const TournamentMeta = styled.p`
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.85rem;
  margin: 0.25rem 0 0 0;
`
