import styled from 'styled-components'
import { Card } from '../../styled'

export const ChartCard = styled(Card)`
  margin: 0 auto 1.5rem auto;
  max-width: 900px;
  padding: 1rem 0.5rem 0.75rem 0.5rem;
`

export const ChartBox = styled.div`
  height: ${({ $extraHeight = 0 }) => 380 + $extraHeight}px;
  width: 100%;

  @media (max-width: 480px) {
    height: ${({ $extraHeight = 0 }) => 300 + $extraHeight}px;
  }
`

export const EmptyChart = styled.p`
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.9rem;
  font-style: italic;
  margin: 0;
  padding: 3rem 1rem;
  text-align: center;
`

export const TooltipBox = styled.div`
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 0.8rem;
  line-height: 1.35;
  max-width: 280px;
  padding: 0.6rem 0.75rem;
`

export const TooltipTitle = styled.div`
  color: var(--blue-900);
  font-weight: 700;
  margin-bottom: 0.4rem;
`

export const TooltipMatch = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.35rem 0;
`

export const TooltipPlayer = styled.div`
  align-items: center;
  display: flex;
  font-weight: 700;
  gap: 0.4rem;
  justify-content: space-between;

  > span:first-child {
    color: ${({ $color }) => $color};
  }
`

export const TooltipDetail = styled.div`
  color: rgba(0, 0, 0, 0.75);
`

export const TooltipOthers = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 0.35rem;
`

export const TooltipRow = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;

  span:first-child {
    color: ${({ $color }) => $color};
    font-weight: 600;
  }
`
