import styled from 'styled-components'

export const StyledPlayerBox = styled.div`
  align-items: center;
  background-color: ${(props) =>
    props.$isActive ? 'var(--green-300)' : 'var(--blue-900)'};
  border: ${(props) =>
      props.$isActive ? 'var(--green-300)' : 'var(--blue-900)'}
    3px solid;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 2rem;
  font-weight: 700;
  min-height: 200px;
  justify-content: center;
  margin: 1rem;
  max-width: 200px;
  outline: ${(props) =>
      props.$isActive ? 'var(--yellow-900)' : 'var(--yellow-900)'}
    2px solid;
  padding: 2.75rem 1.25rem;
  width: 100%;
  transition: all 0.3s ease;
  transform: scale(1);
  box-shadow: ${(props) =>
    props.$isActive
      ? '0 6px 20px rgba(24, 137, 14, 0.4)'
      : '0 2px 8px rgba(0, 0, 0, 0.2)'};

  &:hover {
    transform: scale(1.025);
    box-shadow: ${(props) =>
      props.$isActive
        ? '0 8px 24px rgba(24, 137, 14, 0.5)'
        : '0 8px 24px rgba(0, 102, 204, 0.5)'};
  }
`
