import styled from 'styled-components'

export const HeadToHeadSection = styled.section`
  margin: 2rem auto;
  max-width: 1240px;
  padding: 0 1rem 2rem;
  text-align: center;

  > h2 {
    color: var(--blue-900);
    font-size: 1.75rem;
    margin: 0 0 1.75rem;
  }

  h3 {
    color: var(--blue-900);
  }
`

export const PairGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 370px), 1fr));
`

export const PairCard = styled.button`
  background: #fff;
  border: 1px solid rgba(0, 74, 121, 0.16);
  border-left: 4px solid rgba(0, 74, 121, 0.55);
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.065);
  color: inherit;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font: inherit;
  overflow: hidden;
  padding: 0;
  text-align: left;
  transition: border-color 160ms ease, box-shadow 160ms ease;

  &:hover {
    border-color: rgba(0, 74, 121, 0.38);
    border-left-color: var(--orange-900);
    box-shadow: 0 5px 15px rgba(0, 74, 121, 0.11);
  }

  &:focus-visible {
    outline: 2px solid var(--orange-900);
    outline-offset: 3px;
  }

  .pair-card__best-wins {
    border-top: 1px solid rgba(0, 0, 0, 0.07);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
  }

  .pair-card__link {
    align-items: center;
    align-self: flex-end;
    color: var(--blue-900);
    display: flex;
    font-size: 0.74rem;
    font-weight: 700;
    gap: 0.25rem;
    padding: 0.65rem 0.85rem;

    svg {
      font-size: 0.95rem;
    }
  }
`

export const PairSummary = styled.div`
  align-items: stretch;
  background: linear-gradient(135deg, rgba(0, 74, 121, 0.045), transparent);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  min-height: 142px;
  padding: 1rem;
  width: 100%;

  .pair-card__center {
    align-items: center;
    border-left: 1px solid rgba(0, 74, 121, 0.12);
    border-right: 1px solid rgba(0, 74, 121, 0.12);
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 82px;
    padding: 0 0.7rem;

    strong {
      color: var(--blue-900);
      font-size: 1.55rem;
      line-height: 1;
    }

    span,
    small {
      color: rgba(0, 0, 0, 0.58);
      font-size: 0.72rem;
      margin-top: 0.25rem;
    }
  }
`

export const PairPlayer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 0 0.5rem;
  text-align: center;

  h3 {
    font-size: 1rem;
    margin: 0 0 0.5rem;
    overflow-wrap: anywhere;
  }

  > strong {
    color: var(--blue-900);
    font-size: 1.7rem;
    line-height: 1;
  }

  > span {
    color: rgba(0, 0, 0, 0.6);
    font-size: 0.7rem;
  }

  > small {
    color: rgba(0, 0, 0, 0.7);
    font-size: 0.72rem;
    font-weight: 700;
    margin-top: 0.5rem;
  }
`

export const BestWinCompact = styled.div`
  align-items: center;
  background: rgba(245, 216, 127, 0.075);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 84px;
  padding: 0.65rem;
  text-align: center;

  & + & {
    border-left: 1px solid rgba(0, 0, 0, 0.07);
  }

  > span {
    color: rgba(0, 0, 0, 0.57);
    font-size: 0.65rem;
    margin-bottom: 0.4rem;
  }

  > strong {
    color: rgba(0, 0, 0, 0.55);
    font-size: 0.78rem;
  }
`

export const TeamScore = styled.div`
  align-items: center;
  display: flex;
  gap: 0.5rem;
  justify-content: center;

  img {
    height: 30px;
    object-fit: contain;
    width: 30px;
  }

  strong {
    color: var(--blue-900);
    font-size: 1.2rem;
    white-space: nowrap;
  }
`

export const BackButton = styled.button`
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--blue-900);
  cursor: pointer;
  display: flex;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  gap: 0.3rem;
  margin: 0 0 1rem;
  padding: 0.35rem 0;

  svg {
    font-size: 1.1rem;
  }

  &:hover {
    text-decoration: underline;
  }
`

export const FilterBar = styled.div`
  align-items: end;
  background: rgba(0, 74, 121, 0.045);
  border: 1px solid rgba(0, 74, 121, 0.14);
  border-radius: 12px;
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0 auto 1.5rem;
  max-width: 900px;
  padding: 1rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`

export const SelectField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  text-align: left;

  span {
    color: rgba(0, 0, 0, 0.65);
    font-size: 0.78rem;
    font-weight: 700;
  }

  select {
    background: #fff;
    border: 1px solid rgba(0, 74, 121, 0.3);
    border-radius: 7px;
    color: var(--blue-900);
    font: inherit;
    min-height: 42px;
    padding: 0.55rem 0.65rem;
  }
`

export const DetailPanel = styled.div`
  opacity: ${({ $loading }) => ($loading ? 0.65 : 1)};
  transition: opacity 160ms ease;
`

export const Scoreboard = styled.div`
  align-items: stretch;
  background: var(--blue-900);
  border-radius: 14px 14px 0 0;
  color: #fff;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  margin: 0 auto;
  max-width: 900px;
  overflow: hidden;
`

export const ComparisonSide = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.6rem 1rem;

  h3 {
    color: #fff;
    font-size: clamp(1.1rem, 4vw, 1.65rem);
    margin: 0 0 0.45rem;
    overflow-wrap: anywhere;
  }

  > strong {
    color: #f5d87f;
    font-size: clamp(2rem, 7vw, 3.6rem);
    line-height: 1;
  }

  span,
  small {
    font-size: 0.78rem;
    opacity: 0.78;
  }

  small {
    font-weight: 700;
    margin-top: 0.55rem;
  }
`

export const ScoreCenter = styled.div`
  align-items: center;
  background: rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 112px;
  padding: 1rem;

  > strong {
    font-size: 1.9rem;
  }

  span,
  small {
    font-size: 0.75rem;
    opacity: 0.76;
  }

  small {
    margin-top: 0.55rem;
  }
`

export const ComparisonBar = styled.div`
  background: linear-gradient(
    to right,
    #d9ad35 0%,
    #d9ad35 ${({ $left }) => $left}%,
    #aeb7bd ${({ $left }) => $left}%,
    #aeb7bd ${({ $left, $draw }) => $left + $draw}%,
    #0d8499 ${({ $left, $draw }) => $left + $draw}%,
    #0d8499 100%
  );
  height: 8px;
  margin: 0 auto 1.25rem;
  max-width: 900px;
`

export const MetricsGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 190px), 1fr));
  margin: 0 auto 1.25rem;
  max-width: 1000px;
`

export const Metric = styled.div`
  background: #fff;
  border: 1px solid rgba(0, 74, 121, 0.12);
  border-radius: 9px;
  display: flex;
  flex-direction: column;
  padding: 0.9rem;

  span {
    color: rgba(0, 0, 0, 0.58);
    font-size: 0.76rem;
    margin-bottom: 0.35rem;
  }

  strong {
    color: var(--blue-900);
    font-size: 1rem;
  }
`

export const BestWins = styled.div`
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0 auto 1.75rem;
  max-width: 1000px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export const BestWinCard = styled.div`
  background: rgba(245, 216, 127, 0.12);
  border: 1px solid rgba(201, 163, 61, 0.3);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 120px;
  padding: 1rem;

  > span,
  > small {
    color: rgba(0, 0, 0, 0.62);
    font-size: 0.78rem;
  }

  ${TeamScore} {
    margin: 0.55rem 0;

    img {
      height: 48px;
      width: 48px;
    }

    strong {
      font-size: 1.75rem;
    }
  }

  > strong {
    color: var(--blue-900);
    margin-top: 0.55rem;
  }
`

export const MatchList = styled.div`
  display: grid;
  gap: 0.75rem;
  margin: 0 auto;
  max-width: 860px;
`

export const MatchItem = styled.article`
  align-items: center;
  background: linear-gradient(115deg, rgba(0, 74, 121, 0.055), transparent 42%),
    #fff;
  border: 1px solid rgba(0, 74, 121, 0.16);
  border-left: 3px solid rgba(13, 132, 153, 0.62);
  border-radius: 11px;
  box-shadow: 0 3px 9px rgba(0, 55, 89, 0.07);
  display: grid;
  gap: 0.8rem;
  grid-template-columns: minmax(0, 1fr) 180px minmax(0, 1fr);
  min-height: 88px;
  overflow: hidden;
  padding: 0.8rem 1rem;

  .match-item__team {
    align-items: center;
    display: grid;
    gap: 0.55rem;
    min-width: 0;

    img {
      height: 44px;
      object-fit: contain;
      width: 44px;
    }

    strong {
      overflow-wrap: anywhere;
    }

    span {
      color: var(--blue-900);
      font-size: 1.5rem;
      font-weight: 800;
    }
  }

  .match-item__team--left {
    grid-template-columns: auto minmax(0, 1fr) auto;
    text-align: left;
  }

  .match-item__team--right {
    grid-template-columns: auto minmax(0, 1fr) auto;
    text-align: right;
  }

  .match-item__meta {
    align-items: center;
    align-self: stretch;
    background: rgba(0, 74, 121, 0.055);
    border-left: 1px solid rgba(0, 74, 121, 0.09);
    border-right: 1px solid rgba(0, 74, 121, 0.09);
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: -0.8rem 0;
    padding: 0.65rem;

    > strong {
      color: var(--blue-900);
      font-size: 0.8rem;
      line-height: 1.2;
      overflow-wrap: anywhere;
    }
  }

  .match-item__context {
    color: rgba(0, 0, 0, 0.55);
    display: flex;
    flex-wrap: wrap;
    font-size: 0.66rem;
    gap: 0.25rem 0.45rem;
    justify-content: center;
    margin-top: 0.25rem;

    span + span::before {
      content: '·';
      margin-right: 0.45rem;
    }
  }

  .match-item__rating {
    align-items: center;
    background: #fff;
    border: 1px solid rgba(0, 74, 121, 0.14);
    border-radius: 999px;
    color: var(--blue-900);
    display: grid;
    font-size: 0.68rem;
    font-weight: 750;
    gap: 0.35rem;
    grid-template-columns: 1fr auto 1fr;
    margin-top: 0.45rem;
    padding: 0.2rem 0.45rem;
    width: 100%;

    span:first-child {
      text-align: right;
    }

    span:last-child {
      text-align: left;
    }

    small {
      color: rgba(0, 0, 0, 0.48);
      font-size: 0.58rem;
      text-transform: uppercase;
    }
  }

  @media (max-width: 700px) {
    gap: 0.6rem;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    padding-bottom: 0;

    .match-item__meta {
      border-left: 0;
      border-right: 0;
      border-top: 1px solid rgba(0, 74, 121, 0.09);
      grid-column: 1 / -1;
      grid-row: 2;
      margin: 0 -1rem;
      padding: 0.6rem 1rem;
    }

    .match-item__team {
      img {
        height: 34px;
        width: 34px;
      }

      strong {
        font-size: 0.82rem;
      }
    }
  }
`

export const AllMatchesLink = styled.a`
  border: 1px solid rgba(0, 74, 121, 0.28);
  border-radius: 7px;
  color: var(--blue-900);
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 700;
  margin-top: 1rem;
  padding: 0.55rem 0.85rem;
  text-decoration: none;

  &:hover {
    background: rgba(0, 74, 121, 0.06);
  }
`

export const EmptyState = styled.p`
  color: rgba(0, 0, 0, 0.62);
  margin: 2rem auto;
`

export const ErrorState = styled(EmptyState)`
  color: #b30a0a;
`
