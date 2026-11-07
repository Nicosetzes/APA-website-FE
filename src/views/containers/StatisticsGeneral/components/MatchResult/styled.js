import styled from 'styled-components'

export const Scoreboard = styled.div`
  align-items: center;
  display: grid;
  gap: ${({ $compact }) => ($compact ? '0.4rem' : '0.6rem')};
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  margin: ${({ $compact }) => ($compact ? '0.2rem 0' : '0.35rem 0')};
`

export const Side = styled.div`
  color: rgba(0, 0, 0, 0.6);
  font-size: ${({ $compact }) => ($compact ? '0.75rem' : '0.85rem')};
  font-weight: ${({ $winner }) => ($winner ? 700 : 400)};
  line-height: 1.25;
  min-width: 0;
  overflow-wrap: anywhere;
  text-align: ${({ $align }) => $align};

  ${({ $winner }) => $winner && 'color: rgba(0, 0, 0, 0.9);'}
`

export const SideName = styled.span`
  display: block;
  ${({ $strong }) => $strong && 'font-weight: 700;'}
`

export const SideTeam = styled.span`
  align-items: center;
  display: flex;
  font-size: 0.85em;
  gap: ${({ $compact }) => ($compact ? '0.25rem' : '0.35rem')};
  justify-content: ${({ $crestFirst }) =>
    $crestFirst ? 'flex-start' : 'flex-end'};
  letter-spacing: 0.03em;
`

export const Crest = styled.img`
  flex-shrink: 0;
  height: ${({ $compact }) => ($compact ? '16px' : '20px')};
  object-fit: contain;
  width: ${({ $compact }) => ($compact ? '16px' : '20px')};
`

export const ScoreBox = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`

export const ScoreBadge = styled.span`
  background: var(--blue-900);
  border-radius: 6px;
  color: #fff;
  font-size: ${({ $compact }) => ($compact ? '0.85rem' : '1rem')};
  font-variant-numeric: tabular-nums;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: ${({ $compact }) =>
    $compact ? '0.15rem 0.45rem' : '0.2rem 0.6rem'};
  white-space: nowrap;
`

export const PenaltyNote = styled.span`
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
`
