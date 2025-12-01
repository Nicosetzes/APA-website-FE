import styled from 'styled-components'

export const BracketContainer = styled.div`
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding: 2rem 1rem;
  min-height: 600px;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 1rem;
    padding: 1rem 0.5rem;
  }
`

export const BracketColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 320px;
  flex: 1;
  max-width: 500px;

  @media (max-width: 768px) {
    min-width: 280px;
  }
`

export const BracketColumnTitle = styled.h3`
  color: var(--blue-900);
  font-size: 1.125rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 1rem 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const BracketMatch = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(26, 61, 77, 0.2);
`

export const BracketSlot = styled.div`
  min-height: 60px;
  display: flex;
  align-items: center;
`

export const TeamSlotCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
  border: 2px solid var(--blue-900);
  width: 100%;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`

export const TeamSlotImage = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
`

export const TeamSlotInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`

export const TeamSlotName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--blue-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const PlayerSelect = styled.select`
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--blue-900);
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    border-color: var(--blue-900);
  }

  &:focus {
    outline: none;
    border-color: var(--blue-900);
    box-shadow: 0 0 0 3px rgba(26, 61, 77, 0.1);
  }
`

export const RemoveButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #dc3545;
  color: white;
  border: 2px solid white;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #c82333;
    transform: scale(1.1);
  }
`

export const BracketConnector = styled.div`
  width: 40px;
  flex-shrink: 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 80%;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(26, 61, 77, 0.3) 20%,
      rgba(26, 61, 77, 0.3) 80%,
      transparent
    );
  }

  @media (max-width: 768px) {
    width: 20px;
  }
`
