import styled from 'styled-components'

export const Delta = styled.span`
  color: rgba(0, 0, 0, 0.6);
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  white-space: nowrap;

  &[data-trend='up'] {
    color: var(--green-900);
  }

  &[data-trend='down'] {
    color: var(--red-700);
  }
`
