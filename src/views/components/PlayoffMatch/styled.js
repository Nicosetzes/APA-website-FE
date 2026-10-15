import styled from 'styled-components'

export const StyledPlayoffMatch = styled.div`
  background-color: rgb(0, 26, 42);
  border: ${(props) =>
    props.isThisTheFinal
      ? '2px solid var(--orange-900)'
      : '1px solid rgba(255, 255, 255, 0.15)'};
  border-radius: 10px;
  box-shadow: ${(props) =>
    props.isThisTheFinal
      ? '0 0 16px rgba(255, 195, 11, 0.25)'
      : '0 2px 6px rgba(0, 0, 0, 0.35)'};
  box-sizing: border-box;
  display: flex;
  flex-direction: ${(props) =>
    props.$side === 'right' ? 'row-reverse' : 'row'};
  flex-shrink: 0;
  height: 115px;
  justify-content: ${(props) =>
    props.$align === 'start' ? 'flex-start' : 'center'};
  padding: 0 0.5rem;
  width: 340px;
  .container__team {
    align-items: center;
    display: flex;
    flex-direction: ${(props) =>
      props.$side === 'right' ? 'row-reverse' : 'row'};
    & + .container__team {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .team-seed {
      align-items: center;
      color: #fff;
      display: flex;
      font-weight: 700;
      height: 40px;
      justify-content: center;
      margin: 0.5rem 0.3rem;
      width: 20px;
    }
    .team-logo {
      img {
        width: 25px;
      }
    }
    .team-name {
      align-items: center;
      color: #fff;
      display: flex;
      font-size: 0.75rem;
      height: 40px;
      justify-content: ${(props) =>
        props.$side === 'right' ? 'flex-end' : 'flex-start'};
      margin: 0 0.3rem;
      overflow-wrap: anywhere;
      text-align: ${(props) => (props.$side === 'right' ? 'right' : 'left')};
      width: 100px;
    }

    .team-prediction,
    .team-prediction-slot {
      box-sizing: border-box;
      flex-shrink: 0;
      width: 3rem;
    }
    .team-prediction {
      background-color: rgba(255, 255, 255, 0.08);
      border: 1px solid transparent;
      border-radius: 999px;
      color: #cbd5e1;
      cursor: help;
      font-size: 0.7rem;
      font-weight: 700;
      line-height: 1.4;
      text-align: center;
      &:focus-visible {
        outline: 2px solid var(--orange-900);
        outline-offset: 1px;
      }
      &[data-upset] {
        background-color: rgba(255, 140, 26, 0.2);
        color: var(--orange-900);
      }
    }
    .team-user {
      align-items: center;
      color: #fff;
      display: flex;
      font-size: 0.8rem;
      height: 40px;
      margin: 0.5rem;
    }
    .team-score {
      color: #fff;
      font-weight: 700;
    }
    .team-score,
    .team-inputs {
      align-items: center;
      display: flex;
      flex-shrink: 0;
      justify-content: center;
      margin: ${(props) =>
        props.$side === 'right' ? '0 0.25rem 0 0' : '0 0 0 0.25rem'};
      width: 2.85rem;
    }
    .team-score-value {
      align-items: baseline;
      display: inline-flex;
    }
    .penalty-score {
      color: #cbd5e1;
      font-size: 0.62rem;
      line-height: 1;
      margin-left: 0.08rem;
      position: relative;
      top: -0.35em;
    }
    .team-walkover {
      align-items: center;
      display: inline-flex;
      font-size: 0.9rem;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }
    .team-inputs {
      gap: 0.1rem;
      input {
        box-sizing: border-box;
        height: 1.5rem;
        padding: 0;
        text-align: center;
        width: 1.35rem;
      }
    }
  }

  .team-draw-divider {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    height: 0;
    position: relative;
  }
  .team-draw {
    background-color: rgb(0, 26, 42);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 999px;
    box-sizing: border-box;
    color: #cbd5e1;
    cursor: help;
    font-size: 0.7rem;
    font-weight: 700;
    line-height: 1.4;
    position: absolute;
    text-align: center;
    top: 0;
    white-space: nowrap;
    width: 3rem;
    z-index: 1;
    ${(props) =>
      props.$side === 'right'
        ? 'left: 4.6rem; transform: translate(-50%, -50%);'
        : 'right: 4.6rem; transform: translate(50%, -50%);'}
    &:focus-visible {
      outline: 2px solid var(--orange-900);
      outline-offset: 1px;
    }
  }
  .match__deletion {
    align-items: center;
    align-self: stretch;
    display: inline-flex;
    flex-shrink: 0;
    justify-content: center;
    margin: 0.5rem 0.5rem 0.25rem;
  }
  .match__confirmation {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0.5rem 0.5rem 0.25rem 0.5rem;
    input {
      margin: auto;
    }
  }
`
