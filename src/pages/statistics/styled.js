import styled from 'styled-components'

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 auto;
  max-width: 1400px;
  padding: 1rem;
  width: 100%;
`

export const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
`

export const Title = styled.h1`
  color: var(--blue-900);
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
`

export const Section = styled.section`
  margin: 2rem 0;
`

export const SectionTitle = styled.h2`
  color: var(--blue-900);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-align: center;
`

export const SectionSubtitle = styled.h2`
  color: var(--blue-900);
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-align: center;
`

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

export const PlayersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

export const PlayerCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const PlayerName = styled.h3`
  color: var(--blue-900);
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
`

export const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  &:last-child {
    border-bottom: none;
  }
`

export const StatLabel = styled.span`
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
`

export const StatValue = styled.span`
  color: var(--blue-900);
  font-size: 1rem;
  font-weight: 700;
`

export const StreakBadge = styled.div`
  align-items: center;
  background: ${(props) =>
    props.$type === 'W'
      ? '#18890e'
      : props.$type === 'D'
      ? '#ffa400'
      : '#b30a0a'};
  border-radius: 6px;
  color: white;
  display: inline-flex;
  font-size: 0.85rem;
  font-weight: 700;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
`

export const RecentMatches = styled.div`
  display: flex;
  gap: 0.25rem;
  justify-content: center;
  margin-top: 0.5rem;
`

export const RecentMatchDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) =>
    props.$outcome === 'w'
      ? '#18890e'
      : props.$outcome === 'd'
      ? '#ffa400'
      : '#b30a0a'};
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.3);
  }
`

export const LeaderboardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

export const LeaderboardCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const LeaderboardTitle = styled.h3`
  color: var(--blue-900);
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`

export const LeaderboardItem = styled.div`
  align-items: center;
  display: flex;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  background: ${(props) =>
    props.$rank === 1 ? 'rgba(24, 137, 14, 0.1)' : 'transparent'};
`

export const Rank = styled.div`
  align-items: center;
  background: ${(props) =>
    props.$rank === 1
      ? '#FFD700'
      : props.$rank === 2
      ? '#C0C0C0'
      : props.$rank === 3
      ? '#CD7F32'
      : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 50%;
  color: ${(props) => (props.$rank <= 3 ? 'white' : 'rgba(0, 0, 0, 0.7)')};
  display: flex;
  font-size: 0.85rem;
  font-weight: 700;
  height: 28px;
  justify-content: center;
  width: 28px;
  flex-shrink: 0;
`

export const LeaderboardPlayerName = styled.span`
  flex: 1;
  font-weight: 600;
  font-size: 0.95rem;
`

export const LeaderboardValue = styled.span`
  color: var(--blue-900);
  font-weight: 700;
  font-size: 1rem;
`

export const RecordsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
  gap: 1rem;
`

export const RecordCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`

export const RecordTitle = styled.h3`
  color: var(--blue-900);
  font-size: 1rem;
  font-weight: 700;
  margin: 0 auto 0.5rem auto;
  max-width: 275px;
  text-align: center;
`

export const RecordValue = styled.div`
  color: #18890e;
  font-size: 2.25rem;
  font-weight: 800;
  margin: auto 0 0.25rem 0;
  text-align: center;
`

export const RecordDetail = styled.div`
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.9rem;
  line-height: 1.4;
  text-align: center;
`

export const RecordHolders = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 0.5rem;
`

export const HolderBadge = styled.div`
  background: ${(props) =>
    props.$isCurrent ? '#18890e' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 6px;
  color: ${(props) => (props.$isCurrent ? 'white' : 'rgba(0, 0, 0, 0.7)')};
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
`

export const SpinnerContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 400px;
  width: 100%;
`
