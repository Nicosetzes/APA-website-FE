import styled from 'styled-components'

export const PickerWrapper = styled.fieldset`
  border: none;
  margin: 0 auto 1rem auto;
  max-width: 900px;
  min-width: 0;
  padding: 0;
`

export const PickerLegend = styled.legend`
  color: var(--blue-900);
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  padding: 0;
`

export const PickerActions = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`

export const ActionButton = styled.button`
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: var(--blue-900);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.35rem 0.8rem;

  &:hover {
    background: rgba(0, 74, 121, 0.08);
  }

  &:focus-visible {
    outline: 2px solid var(--orange-900);
    outline-offset: 2px;
  }
`

export const SearchInput = styled.input`
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  box-sizing: border-box;
  flex: 1;
  font-family: inherit;
  font-size: 0.9rem;
  min-width: 160px;
  padding: 0.4rem 0.7rem;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    outline: none;
  }
`

export const PlayerList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const PlayerChip = styled.label`
  align-items: center;
  background: ${({ $checked }) => ($checked ? '#fff' : 'rgba(0, 0, 0, 0.04)')};
  border: 2px solid
    ${({ $checked, $color }) => ($checked ? $color : 'transparent')};
  border-radius: 999px;
  color: ${({ $checked }) =>
    $checked ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.55)'};
  cursor: pointer;
  display: inline-flex;
  font-size: 0.9rem;
  font-weight: 600;
  gap: 0.4rem;
  padding: 0.3rem 0.8rem 0.3rem 0.6rem;
  position: relative;
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &:focus-within {
    outline: 2px solid var(--orange-900);
    outline-offset: 2px;
  }
`

export const Swatch = styled.span`
  background: ${({ $color }) => $color};
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
  height: 12px;
  opacity: ${({ $checked }) => ($checked ? 1 : 0.35)};
  width: 12px;
`

export const NoResults = styled.span`
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.85rem;
  font-style: italic;
`
