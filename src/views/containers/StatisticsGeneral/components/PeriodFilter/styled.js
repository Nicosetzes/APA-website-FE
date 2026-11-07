import styled from 'styled-components'
import { Card } from '../../styled'

export const FilterCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 auto 1.5rem auto;
  max-width: 900px;
  padding: 1rem;
`

export const FilterTitle = styled.h3`
  color: var(--blue-900);
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
`

export const ShortcutRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const ShortcutButton = styled.button`
  background: ${({ $active }) => ($active ? 'var(--blue-900)' : '#fff')};
  border: 1px solid var(--blue-900);
  border-radius: 999px;
  color: ${({ $active }) => ($active ? '#fff' : 'var(--blue-900)')};
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.4rem 0.9rem;

  &:hover {
    background: ${({ $active }) =>
      $active ? 'var(--blue-900)' : 'rgba(0, 74, 121, 0.08)'};
  }

  &:focus-visible {
    outline: 2px solid var(--orange-900);
    outline-offset: 2px;
  }
`

export const FieldsRow = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  label {
    color: #4a5568;
    font-size: 0.85rem;
    font-weight: 600;
  }
`

export const YearSelect = styled.select`
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 0.95rem;
  padding: 0.6rem 0.8rem;
  width: 100%;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    outline: none;
  }
`

export const PeriodNote = styled.p`
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.85rem;
  margin: 0;
`
