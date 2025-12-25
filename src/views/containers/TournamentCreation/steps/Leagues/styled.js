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

export const LeaguesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

export const LeagueCard = styled.div`
  border: 2px solid
    ${({ $selected }) => ($selected ? 'var(--green-900)' : '#ddd')};
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ $selected }) => ($selected ? '#e8f5e9' : '#fff')};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    border-color: var(--green-900);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

export const LeagueName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  text-align: center;
  color: #333;
`

export const CountryName = styled.div`
  font-size: 0.875rem;
  text-align: center;
  color: #333;
`

export const TeamsSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
`

export const TeamsSectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--blue-900);
  margin: 0;
`

export const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`

export const TeamCard = styled.div`
  border: 2px solid
    ${({ $selected }) => ($selected ? 'var(--green-900)' : '#ddd')};
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ $selected }) => ($selected ? '#e8f5e9' : '#fff')};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: var(--green-900);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`

export const TeamImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
`

export const TeamName = styled.div`
  font-weight: 600;
  font-size: 0.75rem;
  text-align: center;
  color: #333;
  word-break: break-word;
`

export const Badge = styled.span`
  background: ${({ $variant }) =>
    $variant === 'success' ? 'var(--green-900)' : 'var(--blue-900)'};
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`
