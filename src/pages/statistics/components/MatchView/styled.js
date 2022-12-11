import styled from 'styled-components'

export const StyledMatchView = styled.div`
  background-color: #003013;
  border: 0;
  border-radius: 10px;
  box-shadow: 0px 4px 4px 0px #00000040;
  color: #e5e5e5;
  display: flex;
  flex-direction: column;
  height: 250px;
  justify-content: center;
  margin: 0.25rem;
  padding: 1rem 0.75rem;
  width: 125px;
  position: relative;
  .card__match-score {
    display: flex;
    justify-content: flex-end;
    .card__match-score-teams {
      align-items: flex-end;
      display: flex;
      flex-direction: column;
      font-weight: 700;
      justify-content: center;
      margin: 0 0.25rem;
      /* width: 80%; */
    }
    .card__match-score-result {
      display: flex;
      flex-direction: column;
      margin: 0 0.125rem;
      /* width: 20%; */
    }
  }
  .card__match-info {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    height: 100%;
    .card__match-info-tournament {
      bottom: 0;
      font-size: 0.875rem;
      font-style: italic;
      position: absolute;
      right: 0;
      transform: rotate(-90deg) translate(70%, -130%);
    }
    .card__match-info-date {
      font-size: 0.875rem;
      margin: 0.75rem 0.5rem;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
`
