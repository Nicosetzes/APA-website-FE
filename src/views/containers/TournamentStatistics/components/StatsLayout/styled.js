import styled from 'styled-components'

export const StatsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const Section = styled.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;

  @media (max-width: 576px) {
    padding: 1.125rem;
  }
`

export const SectionTitle = styled.h2`
  align-items: center;
  color: var(--blue-900);
  display: flex;
  font-size: 1rem;
  font-weight: 800;
  gap: 0.625rem;
  letter-spacing: 0.03em;
  margin: 0 0 1.25rem;
  text-transform: uppercase;

  &::before {
    background: var(--blue-900);
    border-radius: 999px;
    content: '';
    height: 1.25rem;
    width: 4px;
  }
`

export const StatGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

export const StatCard = styled.div`
  align-items: center;
  background: ${(props) => (props.$accent ? `${props.$accent}08` : '#f8fafc')};
  border: 1px solid ${(props) => props.$accent || '#e5e7eb'};
  border-radius: 0.625rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  justify-content: center;
  min-height: 5.5rem;
  padding: 0.875rem 0.5rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }
`

export const StatValue = styled.span`
  color: ${(props) => props.$accent || 'var(--blue-900)'};
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1;
`

export const StatLabel = styled.span`
  color: #6b7280;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;
`

export const FormRow = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const FormBadge = styled.span`
  align-items: center;
  background-color: ${(props) => props.$color};
  border-radius: 50%;
  box-shadow: 0 2px 5px ${(props) => `${props.$color}40`};
  color: #fff;
  display: flex;
  font-size: 0.8rem;
  font-weight: 800;
  height: 2rem;
  justify-content: center;
  width: 2rem;
`

export const StreakBadge = styled.span`
  align-items: center;
  background-color: ${(props) => `${props.$color}10`};
  border: 1px solid ${(props) => `${props.$color}50`};
  border-radius: 999px;
  color: ${(props) => props.$color};
  display: inline-flex;
  font-size: 0.78rem;
  font-weight: 700;
  margin-left: 0.25rem;
  padding: 0.3rem 0.75rem;
`

export const TeamCompareRow = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 575px) {
    flex-direction: column;
  }
`

export const TeamCompareCard = styled.div`
  align-items: center;
  background: ${(props) => `${props.$accent}08`};
  border: 1px solid ${(props) => `${props.$accent}50`};
  border-top: 3px solid ${(props) => props.$accent};
  border-radius: 0.625rem;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1.25rem 1rem;
`

export const TeamCompareBadge = styled.span`
  background-color: ${(props) => `${props.$color}15`};
  border: 1px solid ${(props) => `${props.$color}50`};
  border-radius: 999px;
  color: ${(props) => props.$color};
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  padding: 0.2rem 0.625rem;
  text-transform: uppercase;
`

export const TeamLogo = styled.img`
  height: 56px;
  margin: 0.25rem 0;
  object-fit: contain;
  width: 56px;
`

export const TeamName = styled.span`
  color: #1f2937;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
`

export const TeamEffectiveness = styled.div`
  align-items: center;
  color: ${(props) => props.$color};
  display: flex;
  flex-direction: column;
  margin-top: 0.25rem;

  strong {
    font-size: 1.75rem;
    font-weight: 800;
    line-height: 1;
  }

  span {
    color: #6b7280;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin-top: 0.25rem;
    text-transform: uppercase;
  }
`

export const TeamRecord = styled.span`
  color: #374151;
  font-size: 0.9rem;
  font-weight: 700;
`

export const TeamWinRate = styled.span`
  border-top: 1px solid #e5e7eb;
  color: #9ca3af;
  font-size: 0.72rem;
  margin-top: 0.125rem;
  padding-top: 0.5rem;
  width: 100%;
  text-align: center;

  strong {
    color: #6b7280;
    font-weight: 700;
  }
`

export const TeamsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  justify-content: center;
`

export const TeamChip = styled.div`
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 0.625rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  max-width: 90px;
  padding: 0.625rem 0.75rem;
  transition: border-color 0.15s ease, background-color 0.15s ease,
    transform 0.15s ease;
  width: 100%;

  &:hover {
    background: #fff;
    border-color: var(--blue-900);
    transform: translateY(-2px);
  }

  img {
    height: 38px;
    object-fit: contain;
    width: 38px;
  }

  span {
    color: #374151;
    font-size: 0.72rem;
    font-weight: 600;
    line-height: 1.2;
    text-align: center;
  }
`

export const MatchesGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 576px) {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
`
