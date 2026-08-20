import styled from 'styled-components'

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #002b49;
`

export const CustomTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 650px;
  color: #ffffff;
  font-family: system-ui, -apple-system, sans-serif;

  th {
    background: #001f35;
    color: #94a3b8;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 1rem 0.75rem;
    text-align: center;
    border-bottom: 2px solid #004a79;
  }

  td {
    padding: 0.85rem 0.75rem;
    border-bottom: 1px solid rgba(0, 74, 121, 0.5);
    font-size: 0.9rem;
    text-align: center;
  }

  tbody tr {
    transition: background-color 0.2s ease;
    &:hover {
      background-color: rgba(0, 74, 121, 0.4);
    }
    &:last-child td {
      border-bottom: none;
    }
  }
`

export const TournamentLink = styled.a`
  color: #38bdf8;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`

export const TypeBadge = styled.span`
  background-color: ${({ type }) =>
    type === 'playoff' ? '#ef4444' : type === 'playin' ? '#f59e0b' : '#3b82f6'};
  border-radius: 4px;
  color: #ffffff;
  display: flex;
  font-size: 0.75rem;
  font-weight: 700;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  text-transform: uppercase;
  width: 50px;
`

export const Scoreboard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-width: 280px;
`

export const TeamBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  justify-content: ${({ align }) =>
    align === 'right' ? 'flex-end' : 'flex-start'};
  font-weight: ${({ isWinner }) => (isWinner ? '700' : '400')};
  color: ${({ isWinner }) => (isWinner ? '#ffffff' : '#94a3b8')};

  img {
    width: 22px;
    height: 22px;
    object-fit: contain;
  }
`

export const PlayerTag = styled.span`
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  color: #e2e8f0;
  margin: 0 0.2rem;
`

export const ScoreBadge = styled.div`
  background: #001728;
  border: 1px solid #004a79;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: 0.05em;
  white-space: nowrap;
  color: #ffffff;
`

export const DateText = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: #cbd5e1;
  span {
    display: block;
    font-size: 0.7rem;
    color: #64748b;
  }
`
