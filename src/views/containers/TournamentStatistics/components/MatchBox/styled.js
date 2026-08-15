import styled from 'styled-components'

export const StyledMatchBox = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-left: 4px solid ${(props) => props.$color};
  border-radius: 0.625rem;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin: 0 auto;
  max-width: 320px;
  padding: 0.875rem 1rem;
  width: 100%;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .match__body {
    align-items: center;
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
  }
`

export const OutcomeTag = styled.span`
  align-self: flex-start;
  background-color: ${(props) => `${props.$color}12`};
  border: 1px solid ${(props) => `${props.$color}40`};
  border-radius: 999px;
  color: ${(props) => props.$color};
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.55rem;
  text-transform: uppercase;
`

export const MatchTeam = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  gap: 0.375rem;
  min-width: 0;

  img {
    flex-shrink: 0;
    height: 36px;
    object-fit: contain;
    width: 36px;
  }

  .player-name {
    color: #374151;
    font-size: 0.8rem;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.team--right {
    flex-direction: row-reverse;
    text-align: right;
  }
`

export const MatchScore = styled.div`
  align-items: center;
  color: var(--blue-900);
  display: flex;
  flex-shrink: 0;
  font-size: 1.5rem;
  font-weight: 800;
  gap: 0.2rem;
  min-width: 3.25rem;
  justify-content: center;

  .separator {
    color: #9ca3af;
    font-size: 1.25rem;
    font-weight: 400;
  }
`

export const MatchDate = styled.div`
  border-top: 1px solid #f1f5f9;
  color: #9ca3af;
  font-size: 0.7rem;
  padding-top: 0.5rem;
  text-align: center;
`
