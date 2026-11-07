import styled from 'styled-components'
import { Card } from '../../styled'

export const SummaryCard = styled(Card)`
  margin: 0 auto 1.5rem auto;
  max-width: 900px;
  padding: 1.25rem 1rem;

  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
  }
`

export const SummaryTitle = styled.h3`
  color: var(--blue-900);
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-align: center;
`

export const PositionCell = styled.span`
  align-items: center;
  display: inline-flex;
  gap: 0.25rem;
  justify-content: center;
  white-space: nowrap;
`

export const DebutTag = styled.span`
  background: rgba(0, 74, 121, 0.12);
  border-radius: 4px;
  color: var(--blue-900);
  font-size: 0.65rem;
  font-weight: 700;
  margin-left: 0.4rem;
  padding: 0.1rem 0.35rem;
  text-transform: uppercase;
  vertical-align: middle;
`

export const ColorDot = styled.span`
  background: ${({ $color }) => $color};
  border-radius: 50%;
  display: inline-block;
  height: 10px;
  margin-right: 0.4rem;
  width: 10px;
`

export const UpsetGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
`

export const UpsetCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
`

export const UpsetPlayer = styled.h4`
  color: var(--blue-900);
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
`

export const UpsetBlock = styled.div`
  border-left: 4px solid
    ${({ $kind }) => ($kind === 'won' ? 'var(--green-900)' : 'var(--red-700)')};
  font-size: 0.9rem;
  line-height: 1.4;
  padding-left: 0.6rem;
`

export const UpsetLabel = styled.div`
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`

export const UpsetMeta = styled.div`
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.8rem;
`

export const UpsetEmpty = styled.div`
  color: rgba(0, 0, 0, 0.55);
  font-style: italic;
`

export const UpsetLink = styled.span`
  font-size: 0.8rem;
  font-weight: 600;

  a {
    color: var(--blue-900);
  }
`
