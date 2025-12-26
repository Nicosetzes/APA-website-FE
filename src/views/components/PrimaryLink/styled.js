import styled from 'styled-components'

export const Button = styled.button`
  background-color: var(--red-700);
  border: none;
  border-radius: 0.25rem;
  color: white;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  padding: 0.75em 1.5em;
  &:disabled {
    background-color: var(--disabled);
    cursor: not-allowed;
  }
  &:hover:enabled {
    background-color: var(--red-900);
  }
`

export const Link = styled.a`
  color: var(--red-700);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`
