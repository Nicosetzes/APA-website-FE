import styled from 'styled-components'

export const StyledPlayerBox = styled.button`
  background-color: ${(props) =>
    props.$isActive ? 'var(--blue-900)' : 'transparent'};
  border: var(--blue-900) 2px solid;
  border-radius: 2rem;
  color: ${(props) => (props.$isActive ? '#fff' : 'var(--blue-900)')};
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.4rem 1.1rem;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: var(--blue-900);
    color: #fff;
  }
`
