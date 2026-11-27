import styled from 'styled-components'

const differenceColor = (difference) => {
  if (difference > 0) return 'var(--green-900)'
  if (difference < 0) return 'var(--red-700)'
  return 'rgba(0, 0, 0, 0.65)'
}

const qualityStyle = {
  small: {
    background: 'rgba(170, 92, 0, 0.12)',
    color: '#7a4300',
  },
  acceptable: {
    background: 'rgba(0, 74, 121, 0.12)',
    color: 'var(--blue-900)',
  },
  stable: {
    background: 'rgba(0, 112, 60, 0.12)',
    color: 'var(--green-900)',
  },
}

export const Explanation = styled.p`
  color: rgba(0, 0, 0, 0.68);
  font-size: 0.9rem;
  line-height: 1.45;
  margin: -0.25rem auto 1rem auto;
  max-width: 720px;
  text-align: center;
`

export const TableScroll = styled.div`
  overflow-x: auto;
`

export const ImpactTable = styled.table`
  border-collapse: collapse;
  min-width: 900px;
  width: 100%;

  th,
  td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    padding: 0.65rem 0.45rem;
    text-align: center;
  }

  th {
    color: rgba(0, 0, 0, 0.65);
    font-size: 0.75rem;
    font-weight: 700;
  }

  tbody tr:last-child th,
  tbody tr:last-child td {
    border-bottom: none;
  }
`

export const Player = styled.th`
  color: var(--blue-900);
  font-size: 0.9rem;
  text-align: left !important;
  white-space: nowrap;
`

export const MetricValue = styled.span`
  color: ${({ $difference }) =>
    $difference === undefined
      ? 'rgba(0, 0, 0, 0.76)'
      : differenceColor($difference)};
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
  font-weight: ${({ $difference }) =>
    $difference === undefined ? 400 : 700};
  white-space: nowrap;
`

export const Sample = styled.span`
  align-items: center;
  display: inline-flex;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
  gap: 0.35rem;
  justify-content: center;
  white-space: nowrap;
`

export const QualityBadge = styled.span`
  background: ${({ $quality }) => qualityStyle[$quality].background};
  border-radius: 999px;
  color: ${({ $quality }) => qualityStyle[$quality].color};
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
`

export const EmptyState = styled.p`
  color: rgba(0, 0, 0, 0.58);
  font-size: 0.9rem;
  font-style: italic;
  margin: 0;
  text-align: center;
`
