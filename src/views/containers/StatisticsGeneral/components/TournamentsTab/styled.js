import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Card } from '../../styled'

const trendColor = (trend) => {
  if (trend === 'positive') return 'var(--green-900)'
  if (trend === 'negative') return 'var(--red-700)'
  return 'rgba(0, 0, 0, 0.76)'
}

export const Intro = styled.p`
  color: rgba(0, 0, 0, 0.68);
  font-size: 0.95rem;
  line-height: 1.45;
  margin: -0.75rem auto 1.5rem auto;
  max-width: 720px;
  text-align: center;
`

export const Summaries = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  margin: 0 auto 2rem auto;
  max-width: 1200px;
`

export const SummaryCard = styled(Card)`
  border-top: 4px solid var(--blue-900);
  padding: 0;
  overflow: hidden;
`

export const SummaryHeader = styled.div`
  background: linear-gradient(135deg, rgba(26, 71, 115, 0.09), transparent);
  padding: 0.85rem 1rem 0.75rem;
`

export const SummaryPlayer = styled.h3`
  color: var(--blue-900);
  font-size: 1.1rem;
  margin: 0;
`

export const SummaryHint = styled.p`
  color: rgba(0, 0, 0, 0.56);
  font-size: 0.72rem;
  margin: 0.2rem 0 0;
`

export const SummaryMetrics = styled.div`
  display: grid;
  padding: 0.35rem 1rem 0.75rem;
`

export const SummaryGroup = styled.section`
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding: 0.6rem 0;

  &:last-child {
    border-bottom: none;
  }

  h4 {
    color: rgba(0, 0, 0, 0.72);
    font-size: 0.76rem;
    margin: 0 0 0.4rem;
  }
`

export const SummaryExtremes = styled.dl`
  display: grid;
  gap: 0.65rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0;

  div {
    min-width: 0;
  }

  dt {
    color: rgba(0, 0, 0, 0.52);
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  dd {
    color: rgba(0, 0, 0, 0.78);
    font-size: 0.75rem;
    margin: 0.15rem 0 0;
    overflow-wrap: anywhere;
  }
`

export const SummaryValue = styled.span`
  color: ${({ $trend }) => trendColor($trend)};
  display: block;
  font-size: 0.86rem;
  font-variant-numeric: tabular-nums;
  font-weight: 800;
  margin-bottom: 0.1rem;
`

export const NoComparable = styled.p`
  color: rgba(0, 0, 0, 0.58);
  font-size: 0.76rem;
  font-style: italic;
  margin: 0;
`

export const TableControls = styled.div`
  background: rgba(26, 71, 115, 0.05);
  border: 1px solid rgba(26, 71, 115, 0.14);
  border-radius: 10px;
  margin: 0 auto 1.25rem;
  max-width: 1200px;
  padding: 1rem;
`

export const ModeSelector = styled.fieldset`
  border: 0;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin: 0 0 1rem;
  padding: 0;

  legend {
    color: rgba(0, 0, 0, 0.68);
    font-size: 0.78rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-align: center;
    width: 100%;
  }

  label {
    cursor: pointer;
    position: relative;
  }

  input {
    height: 1px;
    opacity: 0;
    position: absolute;
    width: 1px;
  }

  span {
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.22);
    border-radius: 999px;
    color: rgba(0, 0, 0, 0.68);
    display: block;
    font-size: 0.85rem;
    font-weight: 700;
    padding: 0.45rem 0.9rem;
  }

  input:checked + span {
    background: var(--blue-900);
    border-color: var(--blue-900);
    color: #fff;
  }

  input:focus-visible + span {
    outline: 2px solid var(--orange-900);
    outline-offset: 2px;
  }
`

export const Filters = styled.div`
  align-items: end;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`

export const FilterField = styled.label`
  color: rgba(0, 0, 0, 0.72);
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  font-weight: 700;
  gap: 0.35rem;
  min-width: min(240px, 100%);

  select {
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.28);
    border-radius: 6px;
    color: rgba(0, 0, 0, 0.82);
    font-family: inherit;
    font-size: 0.95rem;
    padding: 0.55rem 2rem 0.55rem 0.65rem;
  }

  select:focus-visible {
    outline: 2px solid var(--orange-900);
    outline-offset: 2px;
  }
`

export const TournamentDetailLink = styled(Link)`
  align-self: center;
  color: var(--blue-900);
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0.55rem 0;
`

export const MobileSortControls = styled.div`
  display: none;

  @media (max-width: 760px) {
    align-items: end;
    border-top: 1px solid rgba(26, 71, 115, 0.14);
    display: grid;
    gap: 0.65rem;
    grid-template-columns: minmax(0, 1fr) auto;
    margin-top: 1rem;
    padding-top: 1rem;

    ${FilterField} {
      min-width: 0;
    }

    button {
      background: #fff;
      border: 1px solid rgba(0, 0, 0, 0.28);
      border-radius: 6px;
      color: var(--blue-900);
      cursor: pointer;
      font-family: inherit;
      font-size: 0.8rem;
      font-weight: 700;
      min-height: 38px;
      padding: 0.5rem 0.65rem;
    }

    button:focus-visible {
      outline: 2px solid var(--orange-900);
      outline-offset: 2px;
    }
  }
`

export const TableScroll = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  overflow-x: auto;
  width: 100%;

  @media (max-width: 760px) {
    overflow: visible;
  }
`

export const PerformancesTable = styled.table`
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;

  caption {
    color: var(--blue-900);
    font-size: 1.05rem;
    font-weight: 700;
    padding: 0 0 0.75rem;
    text-align: left;
  }

  th,
  td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    padding: 0.65rem 0.3rem;
    text-align: center;
    vertical-align: top;
  }

  thead th {
    color: rgba(0, 0, 0, 0.65);
    font-size: 0.69rem;
    font-weight: 700;
  }

  thead th:first-child {
    width: 17%;
  }

  tbody tr:last-child th,
  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr[data-comparable='false'] {
    background: rgba(255, 164, 0, 0.06);
  }

  @media (max-width: 760px) {
    display: block;

    thead {
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }

    tbody {
      display: grid;
      gap: 0.85rem;
    }

    tr {
      background: #fff;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
      display: block;
      padding: 0.4rem 0.75rem;
    }

    th,
    td {
      align-items: start;
      border-bottom: 1px solid rgba(0, 0, 0, 0.07);
      display: grid;
      gap: 0.75rem;
      grid-template-columns: minmax(90px, 38%) minmax(0, 1fr);
      padding: 0.55rem 0;
      text-align: right;
    }

    td::before {
      color: rgba(0, 0, 0, 0.56);
      content: attr(data-label);
      font-size: 0.72rem;
      font-weight: 700;
      text-align: left;
    }

    th:last-child,
    td:last-child {
      border-bottom: none;
    }
  }
`

export const SortButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-weight: inherit;
  gap: 0.2rem;
  justify-content: center;
  padding: 0.2rem;
  width: 100%;

  &:focus-visible {
    border-radius: 3px;
    outline: 2px solid var(--orange-900);
    outline-offset: 1px;
  }
`

export const SortIndicator = styled.span`
  flex: 0 0 0.7rem;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  width: 0.7rem;
`

export const EntityCell = styled.th`
  color: var(--blue-900);
  font-size: 0.86rem;
  text-align: left !important;

  a {
    color: var(--blue-900);
    font-weight: 700;
  }

  @media (max-width: 760px) {
    display: block !important;
    font-size: 0.95rem;
    padding: 0.65rem 0 !important;
  }
`

export const Range = styled.span`
  color: rgba(0, 0, 0, 0.55);
  display: block;
  font-size: 0.68rem;
  font-weight: 400;
  margin-top: 0.15rem;
`

export const CellValues = styled.div`
  display: grid;
  gap: 0.3rem;
  min-width: 0;
`

export const PerformanceLine = styled.div`
  min-width: 0;
`

export const ComparisonName = styled.span`
  color: rgba(0, 0, 0, 0.52);
  display: block;
  font-size: 0.62rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const NumericValue = styled.span`
  color: ${({ $trend }) => trendColor($trend)};
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
  font-weight: ${({ $trend }) => ($trend === 'neutral' ? 500 : 700)};
  white-space: nowrap;
`

export const MissingValue = styled.span`
  color: rgba(0, 0, 0, 0.52);
  font-size: 0.72rem;
  font-style: italic;
`

export const SampleTag = styled.span`
  background: rgba(255, 164, 0, 0.18);
  border-radius: 4px;
  color: #704700;
  display: block;
  font-size: 0.6rem;
  font-weight: 700;
  margin: 0.2rem auto 0;
  padding: 0.1rem 0.25rem;
  width: fit-content;

  @media (max-width: 760px) {
    margin-right: 0;
  }
`

export const StatusMessage = styled.p`
  color: rgba(0, 0, 0, 0.62);
  font-size: 0.95rem;
  margin: 2rem auto;
  max-width: 600px;
  text-align: center;
`
