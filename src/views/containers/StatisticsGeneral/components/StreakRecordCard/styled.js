import styled, { keyframes } from 'styled-components'
import { RecordCard, RecordValue } from '../../styled'

// Positivo verde, neutral amarillo (con texto oscuro), negativo rojo.
export const TONES = {
  positive: { accent: '#18890e', text: '#18890e' },
  neutral: { accent: '#ffa400', text: '#8a5a00' },
  negative: { accent: 'var(--red-700)', text: 'var(--red-700)' },
}

const getTone = (tone) => TONES[tone] || TONES.positive

export const StyledStreakCard = styled(RecordCard)`
  border-top: 4px solid ${({ $tone }) => getTone($tone).accent};
  gap: 0.75rem;
  /* Lugar para el tag de categoría sin pisar el título. */
  padding-top: 2.25rem;
  position: relative;
`

export const CategoryTag = styled.span`
  background: rgba(0, 74, 121, 0.08);
  border-radius: 4px;
  color: var(--blue-900);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 0.1rem 0.45rem;
  position: absolute;
  right: 0.75rem;
  text-transform: uppercase;
  top: 0.6rem;
`

// Texto oscuro sobre dorado (contraste > 4.5:1).
export const RecordTag = styled.span`
  align-self: center;
  background: #ffd700;
  border-radius: 999px;
  color: #1f1f1f;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.1rem 0.6rem;
`

export const ActiveHint = styled.div`
  color: rgba(0, 0, 0, 0.65);
  font-size: 0.75rem;
  text-align: center;
`

export const ValueBlock = styled.div`
  align-items: baseline;
  display: flex;
  gap: 0.4rem;
  justify-content: center;
`

export const StreakValue = styled(RecordValue)`
  color: ${({ $tone }) => getTone($tone).text};
  line-height: 1;
  margin: 0;
`

export const ValueUnit = styled.span`
  color: rgba(0, 0, 0, 0.65);
  font-size: 0.95rem;
  font-weight: 600;
`

export const HolderList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
`

export const HolderItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  & + & {
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    padding-top: 0.75rem;
  }
`

export const HolderLine = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
`

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.8); }
  70% { box-shadow: 0 0 0 5px rgba(255, 255, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
`

export const ActivePill = styled.span`
  align-items: center;
  background: #18890e;
  border-radius: 999px;
  color: white;
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 700;
  gap: 0.35rem;
  padding: 0.15rem 0.6rem;
`

export const ActiveDot = styled.span`
  background: white;
  border-radius: 50%;
  display: inline-block;
  height: 7px;
  width: 7px;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${pulse} 1.8s ease-out infinite;
  }
`

export const RangeText = styled.div`
  color: rgba(0, 0, 0, 0.75);
  font-size: 0.85rem;
  text-align: center;
`

export const DurationText = styled.div`
  color: var(--blue-900);
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
`

export const MatchesGrid = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  margin-top: 0.25rem;

  &[hidden] {
    display: none;
  }

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`

export const ToggleButton = styled.button`
  align-self: center;
  background: transparent;
  border: 1px solid var(--blue-900);
  border-radius: 6px;
  color: var(--blue-900);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;

  &:hover {
    background: rgba(0, 74, 121, 0.08);
  }

  &:focus-visible {
    outline: 2px solid var(--blue-900);
    outline-offset: 2px;
  }
`

export const VisuallyHidden = styled.span`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`
