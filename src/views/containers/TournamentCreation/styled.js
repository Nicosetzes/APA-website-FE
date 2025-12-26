import styled from 'styled-components'

export const WizardContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
`

export const WizardHeader = styled.div`
  background: linear-gradient(135deg, var(--blue-900) 0%, #1a3d4d 100%);
  padding: 2rem;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

export const WizardTitle = styled.h1`
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 2rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`

export const StepDot = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: ${({ $active, $completed }) =>
    $completed
      ? 'var(--green-900)'
      : $active
      ? '#fff'
      : 'rgba(255, 255, 255, 0.2)'};
  color: ${({ $active, $completed }) =>
    $completed ? '#fff' : $active ? 'var(--blue-900)' : '#fff'};
  border: 2px solid ${({ $active }) => ($active ? '#fff' : 'transparent')};
  box-shadow: ${({ $active, $completed }) =>
    $active || $completed ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none'};

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 0.875rem;
  }
`

export const StepLine = styled.div`
  width: 60px;
  height: 3px;
  background: ${({ $completed }) =>
    $completed ? 'var(--green-900)' : 'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 30px;
    height: 2px;
  }
`

export const StepLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ $active }) => ($active ? '#fff' : 'rgba(255, 255, 255, 0.7)')};
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  margin-top: 0.5rem;
  text-align: center;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`

export const WizardContent = styled.div`
  background: #fff;
  padding: 2.5rem;
  min-height: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const WizardActions = styled.div`
  background: #f8f9fa;
  padding: 1.5rem 2rem;
  border-radius: 0 0 12px 12px;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

// Legacy styles for backwards compatibility
export const StyledFormatsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  .format__container {
    align-items: center;
    border: var(--blue-900) 2.5px solid;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    height: 225px;
    justify-content: space-between;
    max-width: 175px;
    padding: 1rem 0.75rem;
    &:hover {
      border: rgb(7, 150, 114) 2.5px solid;
    }
    .formats__box-title {
      font-weight: 700;
      text-align: center;
    }
    & > img {
      max-width: 100%;
    }
  }
`
