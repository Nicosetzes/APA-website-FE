import styled from 'styled-components'

export const StyledStreakBox = styled.div`
  background-color: #fff;
  border: #004a79 2px solid;
  color: ${(props) => props.color};
  display: flex;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0.5rem;
  padding: 0.75rem;
  position: relative;
  &:first-child {
    border: #781010 2px solid;
    &::before {
      color: #000;
      content: 'Más reciente';
      font-size: 0.75rem;
      position: absolute;
      right: 0.25rem;
      bottom: 3.5rem;
    }
  }
`
