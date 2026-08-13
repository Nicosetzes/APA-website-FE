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

export const FormatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const FormatCard = styled.div`
  border: 3px solid
    ${({ $selected }) => ($selected ? 'var(--green-900)' : 'var(--blue-900)')};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ $selected }) => ($selected ? '#e8f5e9' : '#fff')};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  &:hover {
    border-color: var(--green-900);
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const FormatImage = styled.img`
  height: auto;
  max-height: 125px;
  max-width: 125px;
  object-fit: contain;
  width: 100%;
`

export const FormatTitle = styled.div`
  font-weight: 700;
  font-size: 1rem;
  text-align: center;
  color: var(--blue-900);
`

export const InputLabel = styled.label`
  display: block;
  font-weight: 600;
  font-size: 1rem;
  color: var(--blue-900);
  margin-bottom: 0.5rem;
`

export const InputField = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid ${({ $error }) => ($error ? '#d32f2f' : '#ddd')};
  border-radius: 8px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ $error }) => ($error ? '#d32f2f' : 'var(--blue-900)')};
    box-shadow: 0 0 0 3px
      ${({ $error }) =>
        $error ? 'rgba(211, 47, 47, 0.1)' : 'rgba(21, 101, 192, 0.1)'};
  }

  &::placeholder {
    color: #999;
  }
`

export const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 0.75rem;
`

export const ImageCard = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  padding: 0.75rem;

  border: 2px solid ${({ $selected }) => ($selected ? '#1976d2' : '#e0e0e0')};
  border-radius: 10px;

  background: ${({ $selected }) => ($selected ? '#f0f7ff' : '#fff')};

  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: #1976d2;
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid #1976d2;
    outline-offset: 2px;
  }
`

export const TournamentImage = styled.img`
  display: block;

  width: 100%;
  height: 180px;

  object-fit: contain;
  border-radius: 6px;
`

export const ImageTitle = styled.span`
  margin-top: 0.75rem;

  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  text-align: center;
`
