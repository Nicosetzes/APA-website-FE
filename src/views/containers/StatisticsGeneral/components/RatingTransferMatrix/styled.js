import styled from 'styled-components'
import { Card } from '../../styled'

const TONE_COLORS = {
  up: '#11610a',
  down: '#9f1239',
  flat: 'rgba(0, 0, 0, 0.68)',
}

export const MatrixCard = styled(Card)`
  margin: 0 auto 1.5rem auto;
  max-width: 900px;
  padding: 1.25rem 1rem;

  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
  }
`

export const Title = styled.h3`
  color: var(--blue-900);
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-align: center;
`

export const Intro = styled.p`
  color: rgba(0, 0, 0, 0.68);
  font-size: 0.9rem;
  line-height: 1.45;
  margin: 0 auto 1rem auto;
  max-width: 680px;
  text-align: center;
`

export const StateMessage = styled.p`
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.9rem;
  font-style: italic;
  margin: 1rem auto 0 auto;
  text-align: center;
`

export const TableScroll = styled.div`
  max-width: 100%;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  width: 100%;

  &:focus-visible {
    border-radius: 6px;
    outline: 2px solid var(--blue-900);
    outline-offset: 2px;
  }
`

export const MatrixTable = styled.table`
  border-collapse: collapse;
  min-width: 100%;
  width: max-content;

  th,
  td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    min-width: 128px;
    padding: 0.65rem 0.75rem;
    text-align: center;
    vertical-align: middle;
  }

  thead th {
    border-bottom: 2px solid var(--blue-900);
  }

  tbody tr:last-child th,
  tbody tr:last-child td {
    border-bottom: none;
  }
`

export const Caption = styled.caption`
  color: rgba(0, 0, 0, 0.62);
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  text-align: left;
`

export const CornerHeader = styled.th`
  color: rgba(0, 0, 0, 0.58);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-align: left !important;
  text-transform: uppercase;
`

export const PlayerHeader = styled.th`
  color: rgba(0, 0, 0, 0.88);
  font-size: 0.9rem;
  font-weight: 700;
  text-align: left !important;
  white-space: nowrap;
`

export const ColorDot = styled.span`
  background: ${({ $color }) => $color || 'rgba(0, 0, 0, 0.35)'};
  border-radius: 50%;
  display: inline-block;
  height: 10px;
  margin-right: 0.4rem;
  width: 10px;
`

export const CellValue = styled.span`
  color: ${({ $trend }) => TONE_COLORS[$trend]};
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
`

export const CellMatches = styled.small`
  color: rgba(0, 0, 0, 0.58);
  display: block;
  font-size: 0.72rem;
  margin-top: 0.15rem;
  white-space: nowrap;
`

export const NoMatches = styled.span`
  color: rgba(0, 0, 0, 0.45);
  display: block;
  font-size: 0.9rem;

  small {
    display: block;
    font-size: 0.72rem;
    margin-top: 0.15rem;
    white-space: nowrap;
  }
`
