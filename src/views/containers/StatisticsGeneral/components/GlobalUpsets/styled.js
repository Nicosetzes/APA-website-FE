import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Section } from '../../styled'

export const UpsetsSection = styled(Section)`
  margin-left: auto;
  margin-right: auto;
  max-width: 1232px;
`

export const Intro = styled.p`
  color: rgba(0, 0, 0, 0.68);
  margin: -1rem auto 1.25rem;
  max-width: 720px;
  text-align: center;
`

export const Filters = styled.div`
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(0, 74, 121, 0.14);
  border-radius: 12px;
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0 auto 1.5rem;
  padding: 1rem;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

export const FilterField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;

  span {
    color: rgba(0, 0, 0, 0.68);
    font-size: 0.78rem;
    font-weight: 700;
  }

  input,
  select {
    background: #fff;
    border: 1px solid rgba(0, 74, 121, 0.3);
    border-radius: 7px;
    color: var(--blue-900);
    font: inherit;
    min-height: 42px;
    min-width: 0;
    padding: 0.55rem 0.65rem;
  }

  input:disabled,
  select:disabled {
    background: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.45);
    cursor: not-allowed;
  }

  input:focus-visible,
  select:focus-visible {
    outline: 2px solid var(--blue-900);
    outline-offset: 2px;
  }
`

export const StateBox = styled.div`
  align-items: center;
  color: rgba(0, 0, 0, 0.68);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  justify-content: center;
  min-height: 130px;
  text-align: center;
`

export const RetryButton = styled.button`
  background: var(--blue-900);
  border: 0;
  border-radius: 7px;
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  padding: 0.6rem 1rem;

  &:focus-visible {
    outline: 2px solid var(--blue-900);
    outline-offset: 3px;
  }
`

export const ResultsSummary = styled.p`
  color: rgba(0, 0, 0, 0.65);
  font-size: 0.85rem;
  margin: 0 0 0.75rem;
  text-align: center;
`

export const TableContainer = styled.div`
  background: #fff;
  border: 1px solid rgba(0, 74, 121, 0.13);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  overflow-x: auto;
`

export const Table = styled.table`
  border-collapse: collapse;
  min-width: 960px;
  width: 100%;

  th {
    background: var(--blue-900);
    color: #fff;
    font-size: 0.75rem;
    letter-spacing: 0.02em;
    padding: 0.75rem;
    text-align: left;
    text-transform: uppercase;
  }

  th:first-child,
  td:first-child,
  th:nth-child(3),
  td:nth-child(3),
  th:nth-child(5),
  td:nth-child(5) {
    text-align: center;
  }

  td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
    color: rgba(0, 0, 0, 0.78);
    padding: 0.65rem 0.75rem;
    vertical-align: middle;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`

export const Position = styled.span`
  align-items: center;
  background: rgba(0, 74, 121, 0.08);
  border-radius: 50%;
  color: var(--blue-900);
  display: inline-flex;
  font-size: 0.78rem;
  font-weight: 800;
  height: 28px;
  justify-content: center;
  width: 28px;
`

export const MatchIdentity = styled.div`
  align-items: center;
  display: grid;
  gap: 0.45rem;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  min-width: 310px;

  > span {
    color: rgba(0, 0, 0, 0.42);
    font-size: 0.72rem;
  }
`

export const TeamIdentity = styled.div`
  align-items: center;
  display: flex;
  gap: 0.5rem;
  min-width: 0;

  > img,
  > [role='img'] {
    flex: 0 0 auto;
    height: 34px;
    object-fit: contain;
    width: 34px;
  }

  > span {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  strong,
  small {
    overflow-wrap: anywhere;
  }

  strong {
    color: var(--blue-900);
    font-size: 0.88rem;
  }

  small {
    color: rgba(0, 0, 0, 0.56);
    font-size: 0.7rem;
    margin-top: 0.12rem;
  }
`

export const ImageFallback = styled.span`
  align-items: center;
  background: rgba(0, 74, 121, 0.08);
  border: 1px solid rgba(0, 74, 121, 0.14);
  border-radius: 50%;
  color: var(--blue-900);
  display: inline-flex;
  font-size: 0.68rem;
  font-weight: 800;
  justify-content: center;
`

export const Score = styled.strong`
  color: var(--blue-900);
  font-size: 1rem;
  white-space: nowrap;

  small {
    display: block;
    font-size: 0.66rem;
    margin-top: 0.15rem;
  }
`

export const Probability = styled.span`
  color: ${({ $negative }) => ($negative ? '#9f1239' : '#11610a')};
  font-size: 0.82rem;
  font-weight: 700;
`

export const RatingChange = styled.span`
  color: ${({ $trend }) =>
    $trend === 'up' ? '#11610a' : $trend === 'down' ? '#9f1239' : 'inherit'};
  font-weight: 800;
  white-space: nowrap;
`

export const ContextCell = styled.div`
  align-items: center;
  display: grid;
  font-size: 0.72rem;
  gap: 0.65rem;
  grid-template-columns: 58px minmax(0, 1fr);
  min-width: 190px;
`

export const TournamentVisual = styled.span`
  align-items: center;
  display: flex;
  height: 58px;
  justify-content: center;
  width: 58px;

  > img,
  > [role='img'] {
    flex: 0 0 auto;
    height: 58px;
    object-fit: contain;
    width: 58px;
  }
`

export const TournamentDetails = styled.span`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;

  strong {
    color: var(--blue-900);
    font-size: 0.76rem;
    overflow-wrap: anywhere;
  }
`

export const MatchLink = styled(Link)`
  color: var(--blue-900);
  font-weight: 700;
  margin-top: 0.2rem;

  &:focus-visible {
    border-radius: 3px;
    outline: 2px solid var(--blue-900);
    outline-offset: 3px;
  }
`
