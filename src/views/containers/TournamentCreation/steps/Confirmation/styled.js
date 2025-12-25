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

export const ConfirmationSection = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  @media (max-width: 575px) {
    padding: 2rem 1rem;
  }
`

export const ConfirmationItem = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const ConfirmationLabel = styled.div`
  font-weight: 700;
  font-size: 1rem;
  color: var(--blue-900);
  margin-bottom: 0.5rem;
`

export const ConfirmationValue = styled.div`
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
`

export const TeamsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.75rem;
`

export const TeamItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`

export const TeamImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
`

export const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 1.125rem;
  font-weight: 700;
  background: var(--green-900);
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin: 0 auto;
  max-width: 400px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #16a085;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
