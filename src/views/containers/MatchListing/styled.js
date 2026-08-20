import styled from 'styled-components'

export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`

export const FilterCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

export const FilterSectionTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
`

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 600px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #4a5568;
  }
`

export const InlineInputs = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  &::placeholder {
    color: #94a3b8;
  }
`

export const StyledSelect = styled.select`
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: #ffffff;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #3b82f6;
  }
`

export const ClearButton = styled.button`
  align-self: flex-end;
  background: var(--blue-900);
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  color: #ffffff;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: #1e40af;
  }
`

export const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0 0.25rem;

  span {
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 500;
  }

  strong {
    color: #0f172a;
    font-weight: 700;
  }
`

export const ResultsBadge = styled.span`
  background-color: #e2e8f0;
  color: #334155 !important;
  font-weight: 600 !important;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem !important;
`

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
`
