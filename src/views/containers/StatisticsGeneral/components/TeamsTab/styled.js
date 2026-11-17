import styled from 'styled-components'

export const TeamsSection = styled.section`
  margin: 2rem auto;
  max-width: 1240px;
  padding: 0 1rem;
  text-align: center;

  > h2 {
    color: var(--blue-900);
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }
`

export const TeamsGrid = styled.div`
  align-items: start;
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const Leaderboard = styled.div`
  background: #fff;
  border: 1px solid rgba(0, 74, 121, 0.13);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  overflow: hidden;
`

export const LeaderboardHeader = styled.header`
  background: var(--blue-900);
  color: #fff;
  padding: 1rem 1.25rem;
  text-align: left;

  h3 {
    font-size: 1.15rem;
    margin: 0;
  }

  p {
    font-size: 0.8rem;
    margin: 0.3rem 0 0;
    opacity: 0.75;
  }
`

export const TeamRow = styled.div`
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  display: grid;
  gap: 0.75rem;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  padding: 0.75rem 1rem;

  &:last-child {
    border-bottom: 0;
  }

  @media (max-width: 520px) {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }
`

export const Rank = styled.span`
  align-items: center;
  background: rgba(0, 74, 121, 0.08);
  border-radius: 50%;
  color: var(--blue-900);
  display: flex;
  flex: 0 0 auto;
  font-size: 0.78rem;
  font-weight: 800;
  height: 28px;
  justify-content: center;
  width: 28px;
`

export const TeamIdentity = styled.div`
  align-items: center;
  display: flex;
  gap: 0.7rem;
  min-width: 0;
  text-align: left;

  img {
    height: 42px;
    object-fit: contain;
    width: 42px;
  }

  div {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  strong {
    color: var(--blue-900);
    overflow-wrap: anywhere;
  }

  span {
    color: rgba(0, 0, 0, 0.58);
    font-size: 0.74rem;
    margin-top: 0.2rem;
    overflow-wrap: anywhere;
  }
`

export const Stat = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 56px;
  text-align: right;

  strong {
    color: var(--blue-900);
  }

  span {
    color: rgba(0, 0, 0, 0.52);
    font-size: 0.68rem;
  }

  @media (max-width: 520px) {
    display: ${({ $secondary }) => ($secondary ? 'none' : 'flex')};
  }
`

export const EmptyState = styled.p`
  color: ${({ $error }) => ($error ? '#b30a0a' : 'rgba(0, 0, 0, 0.58)')};
  margin: 2rem auto;
  padding: 0 1rem;
  text-align: center;
`
