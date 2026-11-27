import styled from 'styled-components'

const differenceColor = (difference) => {
  if (difference > 0) return 'var(--green-900)'
  if (difference < 0) return 'var(--red-700)'
  return 'rgba(0, 0, 0, 0.65)'
}

export const Explanation = styled.ul`
  color: rgba(0, 0, 0, 0.68);
  font-size: 0.9rem;
  line-height: 1.45;
  margin: -0.25rem auto 1rem auto;
  max-width: 700px;
  padding-left: 1.25rem;
  text-align: left;

  li + li {
    margin-top: 0.35rem;
  }
`

export const Toggle = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
`

export const ToggleLabel = styled.span`
  color: rgba(0, 0, 0, 0.65);
  font-size: 0.85rem;
  font-weight: 600;
`

export const TableScroll = styled.div`
  overflow-x: auto;
`

export const PerformanceTable = styled.table`
  border-collapse: collapse;
  min-width: 700px;
  width: 100%;

  th,
  td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    padding: 0.65rem 0.5rem;
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
  color: rgba(0, 0, 0, 0.76);
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`

export const AdjustmentValue = styled(MetricValue)`
  color: ${({ $difference }) => differenceColor($difference)};
  font-weight: 700;
`

export const DifferenceCell = styled.div`
  margin: 0 auto;
  min-width: 130px;
  width: 100%;
`

export const DifferenceValue = styled.span`
  color: ${({ $difference }) => differenceColor($difference)};
  display: block;
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  margin-bottom: 0.25rem;
  white-space: nowrap;
`

export const DifferenceBar = styled.span`
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.04) 0%,
    rgba(0, 0, 0, 0.04) calc(50% - 1px),
    rgba(0, 0, 0, 0.35) calc(50% - 1px),
    rgba(0, 0, 0, 0.35) calc(50% + 1px),
    rgba(0, 0, 0, 0.04) calc(50% + 1px),
    rgba(0, 0, 0, 0.04) 100%
  );
  border-radius: 3px;
  display: block;
  height: 8px;
  overflow: hidden;
  position: relative;
  width: 100%;
`

export const DifferenceFill = styled.span`
  background: ${({ $difference }) =>
    $difference >= 0 ? 'var(--green-900)' : 'var(--red-700)'};
  height: 100%;
  left: ${({ $positive, $width }) => ($positive ? '50%' : `${50 - $width}%`)};
  position: absolute;
  top: 0;
  width: ${({ $width }) => `${$width}%`};
`

export const EmptyState = styled.p`
  color: rgba(0, 0, 0, 0.58);
  font-size: 0.9rem;
  font-style: italic;
  margin: 0;
  text-align: center;
`
