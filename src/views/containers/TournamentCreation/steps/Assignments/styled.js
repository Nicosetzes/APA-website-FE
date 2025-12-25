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

export const AssignmentSection = styled.div`
  margin-top: 1.5rem;
`

export const AssignmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`

export const AssignmentCard = styled.div`
  border: 2px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  background: #fff;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--blue-900);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`

export const TeamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
`

export const TeamImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
`

export const PlayerSelect = styled.select`
  width: 100%;
  padding: 0.625rem;
  font-size: 0.875rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--blue-900);
  }

  &:hover {
    border-color: var(--blue-900);
  }
`

export const GroupSelect = styled(PlayerSelect)``
