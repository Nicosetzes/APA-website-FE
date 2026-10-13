import styled from 'styled-components'
import { Card } from '../../styled'

const TREND_COLORS = {
  up: '#18890e',
  down: '#b30a0a',
  flat: 'rgba(0, 0, 0, 0.55)',
}

export const RatingsCard = styled(Card)`
  margin: 0 auto 2rem auto;
  max-width: 640px;
  padding: 1.25rem 1rem;

  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
  }
`

export const RatingsTitle = styled.h3`
  align-items: center;
  color: var(--blue-900);
  display: flex;
  font-size: 1.25rem;
  font-weight: 700;
  justify-content: center;
  margin: 0 0 1rem 0;
  text-align: center;
`

export const TableScroll = styled.div`
  overflow-x: auto;
  width: 100%;
`

export const RatingsTable = styled.table`
  border-collapse: collapse;
  width: 100%;

  th,
  td {
    padding: 0.6rem 0.5rem;
    text-align: center;
  }

  thead th {
    border-bottom: 2px solid var(--blue-900);
    color: rgba(0, 0, 0, 0.6);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  tbody tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  tbody tr:last-child {
    border-bottom: none;
  }

  @media (max-width: 480px) {
    th,
    td {
      padding: 0.5rem 0.25rem;
    }

    thead th {
      white-space: normal;
    }
  }
`

export const PlayerCell = styled.th`
  font-weight: 600;
  text-align: left !important;
`

export const PlayerNameText = styled.span`
  color: rgba(0, 0, 0, 0.9);
  font-size: 0.95rem;
`

export const MatchesNote = styled.div`
  color: rgba(0, 0, 0, 0.55);
  font-size: 0.75rem;
  font-weight: 500;
`

export const ProvisionalTag = styled.span`
  background: rgba(255, 164, 0, 0.18);
  border-radius: 4px;
  color: #7a4d00;
  font-size: 0.65rem;
  font-weight: 700;
  margin-left: 0.4rem;
  padding: 0.1rem 0.35rem;
  text-transform: uppercase;
  vertical-align: middle;
`

export const RatingValue = styled.span`
  color: var(--blue-900);
  font-size: 1.15rem;
  font-weight: 800;
`

export const PeakValue = styled.span`
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.95rem;
  font-weight: 600;
`

export const ChangeValue = styled.span`
  align-items: center;
  color: ${({ $trend }) => TREND_COLORS[$trend]};
  display: inline-flex;
  font-size: 0.95rem;
  font-weight: 700;
  justify-content: center;
  white-space: nowrap;

  svg {
    height: 1.4rem;
    margin-right: -0.2rem;
    width: 1.4rem;
  }
`
