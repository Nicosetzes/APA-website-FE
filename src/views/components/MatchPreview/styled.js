import styled from 'styled-components'

export const Container = styled.div`
  align-items: stretch;
  border: 2px solid var(--blue-900);
  border-radius: 12px;
  background: white;
  display: flex;
  gap: 1rem;
  justify-content: center;
  max-width: 350px;
  padding: 1rem;
  width: 100%;
`

export const Team = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.4rem;
  text-align: center;
`

export const TeamNameContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 0.25rem;
  justify-content: center;
`

export const Seed = styled.span`
  align-items: center;
  background: #086128;
  border-radius: 999px;
  color: white;
  display: flex;
  font-size: 0.9rem;
  font-weight: 700;
  height: 28px;
  justify-content: center;
  width: 28px;
`

export const TeamLogo = styled.img`
  height: 64px;
  object-fit: contain;
  width: 64px;
`

export const TeamName = styled.span`
  color: var(--blue-900);
  font-size: 1rem;
  font-weight: 700;
`

export const PlayerName = styled.span`
  color: #666;
  font-size: 0.875rem;
`

export const Versus = styled.div`
  align-items: center;
  color: var(--blue-900);
  display: flex;
  font-size: 0.875rem;
  font-weight: 800;
`
