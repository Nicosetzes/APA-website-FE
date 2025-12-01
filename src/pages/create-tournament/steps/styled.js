import styled from 'styled-components'

// Common Step Components
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

// Step 1: Format
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
  width: 100%;
  max-width: 120px;
  height: auto;
  object-fit: contain;
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

// Step 2: Players
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

// Step 3: Leagues
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

// Step 4: Assignments
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

// Step 5: Confirmation
export const ConfirmationSection = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
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
