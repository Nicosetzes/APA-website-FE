import styled from 'styled-components'

export const SegmentedList = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--blue-900);
  border-radius: 999px;
  display: flex;
  gap: 0.25rem;
  margin: 0 auto 1.5rem auto;
  max-width: 420px;
  padding: 0.25rem;
`

export const SegmentedTab = styled.button`
  background: ${({ $selected }) =>
    $selected ? 'var(--blue-900)' : 'transparent'};
  border: none;
  border-radius: 999px;
  color: ${({ $selected }) => ($selected ? 'white' : 'var(--blue-900)')};
  cursor: pointer;
  flex: 1;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: ${({ $selected }) => ($selected ? 700 : 600)};
  padding: 0.5rem 0.75rem;

  &:hover {
    background: ${({ $selected }) =>
      $selected ? 'var(--blue-900)' : 'rgba(0, 74, 121, 0.08)'};
  }

  &:focus-visible {
    outline: 2px solid var(--blue-900);
    outline-offset: 2px;
  }

  @media (max-width: 420px) {
    font-size: 0.85rem;
    padding: 0.5rem;
  }
`
