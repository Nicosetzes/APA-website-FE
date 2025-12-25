import styled from 'styled-components'

export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto;
`

export const StepTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--blue-900);
  margin: 0 0 0.5rem 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const StepDescription = styled.p`
  font-size: 1rem;
  color: #666;
  text-align: center;
  margin: 0 0 2rem 0;
`

export const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
`

export const PlayersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

export const PlayerCard = styled.div`
  border: 2px solid
    ${({ $selected }) => ($selected ? 'var(--green-900)' : '#ddd')};
  border-radius: 10px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ $selected }) => ($selected ? '#e8f5e9' : '#fff')};
  display: flex;
  align-items: center;
  gap: 1rem;

  &:hover {
    border-color: var(--green-900);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

export const PlayerCheckbox = styled.div`
  width: 28px;
  height: 28px;
  border: 2px solid
    ${({ $checked }) => ($checked ? 'var(--green-900)' : '#ddd')};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $checked }) => ($checked ? 'var(--green-900)' : '#fff')};
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
`

export const PlayerName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: #333;
`
