import styled from 'styled-components'

export const StyledStreakBox = styled.div`
  background-color: #fff;
  border: var(--blue-900) 2px solid;
  color: ${(props) => props.color};
  display: flex;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0.5rem;
  padding: 0.75rem;
  position: relative;
  &:last-child {
    border: #781010 2px solid;
    &::before {
      color: #000;
      content: 'Más reciente';
      font-size: 0.75rem;
      position: absolute;
      left: 0.25rem;
      top: 3.25rem;
    }
  }
`
