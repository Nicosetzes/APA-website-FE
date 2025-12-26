import styled from 'styled-components'
import { Image } from 'cloudinary-react'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  justify-content: center;
  margin: 0 auto;
  max-width: 1200px;
  min-height: 100%;
  padding: 2.5rem 1.5rem;
`

export const ContentWrapper = styled.div`
  align-items: center;
  background: #fff;
  border: var(--blue-900) 2px solid;
  border-radius: 0.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 auto;
  max-width: 300px;
  width: 100%;

  @media (min-width: 992px) {
    flex-direction: row;
    justify-content: center;
    max-width: none;
  }
`

export const ImageWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 1.5rem;
  img {
    height: auto;
    max-width: 100%;
    object-fit: contain;
    width: 280px;
  }
  @media (min-width: 992px) {
    padding-left: 0;
  }
`

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

export const InfoCard = styled.div`
  padding: 1rem;
`

export const InfoTitle = styled.h3`
  color: var(--blue-900);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
`

export const InfoText = styled.p`
  color: #374151;
  font-size: 0.95rem;
  line-height: 1.6;
`

export const TeamLogo = styled(Image)`
  height: 60px;
  object-fit: contain;
  width: 60px;
`

export const TeamInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const TeamName = styled.h3`
  color: #000;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`

export const PlayerName = styled.p`
  color: #b3b3b3;
  font-size: 1rem;
  margin: 0;
`

export const ParticipantsTable = styled.table`
  background: #ffffff;
  border: var(--blue-900) 2px solid;
  border-radius: 0.5rem;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  width: 100%;
`

export const TableHeader = styled.th`
  background: #f1f5f9;
  color: #374151;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.9rem;
  text-transform: uppercase;
`

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f9fafb;
  }
`

export const TableCell = styled.td`
  color: #111827;
  font-size: 0.9rem;
  padding: 0.75rem;
  text-align: center;
`

export const RecentMatchesSection = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 300px;
  width: 100%;
  h2 {
    color: var(--blue-900);
    margin-bottom: 1rem;
  }
  @media (min-width: 992px) {
    max-width: none;
  }
`

export const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @media (min-width: 992px) {
    align-content: center;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`

export const MatchCard = styled.div`
  align-items: center;
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
  padding: 1rem;
  width: 100%;
  @media (min-width: 1200px) {
    max-width: 350px;
  }
`

export const MatchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const MatchTeam = styled.div`
  align-items: center;
  display: flex;
  gap: 0.25rem;
  max-width: 100px;
  width: 100%;
`

export const MatchScore = styled.p`
  align-items: flex-end;
  color: var(--blue-900);
  font-size: 1.5rem;
  font-weight: 700;
  margin: auto 0 0 0;
  white-space: nowrap;
`

export const MatchDate = styled.div`
  color: #b3b3b3;
  font-size: 0.85rem;
  text-align: center;
`

export const OutcomeWrapper = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`

export const OutcomeCard = styled.div`
  background: #fff;
  border: var(--blue-900) 2px solid;
  border-radius: 0.5rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  padding: 2rem;
`

export const OutcomeTitle = styled.span`
  color: var(--blue-900);
  font-size: 1.8rem;
  font-weight: 800;
`

export const OutcomeContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-top: 1rem;
`

export const OutcomeHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: ${(props) => (props.$centered ? 'center' : 'start')};
  margin: 0 0 1rem 0;
`
