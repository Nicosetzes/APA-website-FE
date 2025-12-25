import styled from 'styled-components'

export const Container = styled.div`
  padding: 2rem 1rem;
`

export const ContentWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
`

export const ImageWrapper = styled.div`
  display: flex;
  height: 100%;
`

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const InfoCard = styled.div`
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid var(--blue-900);
`

export const InfoTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: var(--blue-900);
`

export const InfoText = styled.p`
  margin: 0.5rem 0;
`

export const OutcomeWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 2rem;
  justify-content: center;
`

export const OutcomeCard = styled.div`
  background-color: var(--blue-900);
  outline: var(--orange-900) 4px solid;
  padding: 1.5rem;
  flex: 1;
  min-width: 300px;
  max-width: 450px;
`

export const OutcomeHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: ${(props) => (props.$centered ? 'center' : 'start')};
  margin: 0 0 1rem 0;
`

export const OutcomeTitle = styled.span`
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0.5rem 0 0;
`

export const OutcomeContent = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: ${(props) => (props.$centered ? 'center' : 'start')};
  margin: 0 0 0 1rem;
  gap: 1rem;
  align-items: center;
`

export const TeamLogo = styled.img`
  width: 150px;
`

export const TeamInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const TeamName = styled.div`
  color: #fff;
  font-size: 1.75rem;
  font-weight: 700;
`

export const PlayerName = styled.div`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1rem 0 0 1rem;
`
