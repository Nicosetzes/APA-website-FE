import styled from 'styled-components'

export const StyledLeaguesBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1.5rem;
  padding: 0.75rem;
  .leagues-box-title {
    font-weight: 700;
    margin: 1.5rem auto;
  }
  .leagues-box-container {
    background-color: #092c3c;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .teams__container {
    background-color: #022746;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 auto 0.5rem;
  }
  .teams-assignment__container {
    align-items: center;
    background-color: #000f1c;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    margin: 1rem auto 0 auto;
    .create-tournament-button {
      background-color: #305c0b;
      height: fit-content;
      margin: auto;
    }
  }
  button {
    align-items: center;
    background-clip: padding-box;
    background-color: #fa6400;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    font-family: system-ui, -apple-system, system-ui, 'Helvetica Neue',
      Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 600;
    justify-content: center;
    line-height: 1.25;
    margin: 0.5rem auto 0;
    min-height: 3rem;
    padding: calc(0.875rem - 1px) calc(1.5rem - 1px);
    position: relative;
    text-decoration: none;
    transition: all 250ms;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: baseline;
    width: fit-content;
    &:hover {
      background-color: #fb8332;
      box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
      transform: translateY(-1px);
    }
    &:active {
      background-color: #c85000;
      box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
      transform: translateY(0);
    }
  }
`
