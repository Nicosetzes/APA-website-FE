import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const HeaderContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 350px;
  padding-inline: 0.5rem;
  width: 100%;

  @media (min-width: 576px) {
    max-width: 500px;
  }
`
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0 16px;
  width: 100%;
`

export const Title = styled.h1`
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 700;
  margin: 0;
`

export const StandingsLink = styled(Link)`
  border: 1px solid var(--blue-900);
  color: var(--blue-900);
  padding: 6px 12px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: var(--blue-900);
    color: #fff;
  }
`

export const Card = styled.section`
  margin: 0 8px 16px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
  width: 100%;
`

export const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`

export const GroupsTitle = styled.span`
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--blue-900);
`

export const GroupButtons = styled.div`
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
`

export const GroupButton = styled.button`
  appearance: none;
  border: 1px solid
    ${(p) => (p.$active ? 'var(--green-900)' : 'rgba(0,0,0,0.2)')};
  background: ${(p) => (p.$active ? 'rgba(0, 128, 0, 0.08)' : '#fff')};
  color: ${(p) => (p.$active ? 'var(--green-900)' : 'inherit')};
  border-radius: 8px;
  padding: 6px 10px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: ${(p) =>
      p.$active ? 'rgba(0, 128, 0, 0.15)' : 'rgba(0,0,0,0.04)'};
  }
`

export const Divider = styled.hr`
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  margin: 12px 0;
`

export const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 576px) {
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
`

export const FiltersTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--blue-900);
  margin-bottom: 1rem;
`

export const PlayerToggle = styled.label`
  display: inline-flex;
  align-items: center;
  margin: 2px 6px;
  cursor: pointer;
  user-select: none;

  input {
    appearance: none;
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  span {
    display: inline-flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    background: #fff;
    color: inherit;
    font-size: 0.95rem;
    font-weight: 600;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  }

  input:checked + span {
    border-color: var(--blue-900);
    color: var(--blue-900);
    background: rgba(0, 74, 121, 0.08);
  }

  input:disabled + span {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 1rem;
`

export const StatusChip = styled.span`
  border: 2px solid #ffdf21;
  border-radius: 999px;
  color: var(--blue-900);
  font-size: 1rem;
  font-weight: 700;
  padding: 0.5rem 0.75rem;
  opacity: ${(p) => (p.$dim ? 0.5 : 1)};
  text-align: center;
`

export const TeamInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const ClearButton = styled.button`
  border: 1px solid var(--blue-900);
  color: var(--blue-900);
  background: transparent;
  border-radius: 8px;
  padding: 4px 10px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: var(--blue-900);
    color: #fff;
  }
`

export const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  min-height: 800px;
  padding: 3rem 0 0;
`

export const PageButton = styled.button`
  appearance: none;
  border: 1px solid
    ${(p) => (p.$active ? 'var(--blue-900)' : 'rgba(0,0,0,0.2)')};
  background: ${(p) => (p.$active ? 'rgba(0, 74, 121, 0.08)' : '#fff')};
  color: ${(p) => (p.$active ? 'var(--blue-900)' : 'inherit')};
  border-radius: 8px;
  padding: 6px 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  min-width: 40px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const PageSelect = styled.select`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 6px 8px;
  background: #fff;
`
