import styled from 'styled-components'

export const StyledMatch = styled.form`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  max-width: 400px;
  outline: var(--red-700) 3px solid;
  padding: 1rem;

  .fixture-edit {
    background-color: #ff852d;
    border: 0;
    border-radius: 10px;
    color: #fff;
    font-size: 0.675rem;
    outline: #000 2px solid;
    padding: 0.25rem 0.5rem;
  }

  .fixture-delete {
    background-color: #ce0404;
    border: 0;
    border-radius: 10px;
    color: #fff;
    font-size: 0.675rem;
    margin-left: 0.375rem;
    outline: #000 2px solid;
    padding: 0.25rem 0.5rem;
  }

  .fixture-submit {
    background-color: rgb(81, 179, 72);
    border: 0;
    border-radius: 10px;
    color: #fff;
    font-size: 0.675rem;
    outline: #000 2px solid;
    padding: 0.25rem 0.5rem;
  }
`

export const MatchHeader = styled.div`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
`

export const MatchView = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-evenly;
`

export const MatchInfo = styled.div`
  align-items: center;
  color: #000;
  display: flex;
  flex-direction: column;
  text-decoration: none;
`

export const MatchScore = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: auto 0 1rem 0;
`

export const MatchContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
`

export const InputContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`

export const MatchDate = styled.div`
  display: flex;
  font-style: italic;
  font-size: 0.8rem;
  margin: 1rem 0 0 0;
`

export const PlayedMatchesCount = styled.div`
  color: var(--green-900);
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  min-width: 24px;
  text-align: center;
`

export const TeamTextarea = styled.textarea`
  border: 0;
  font-size: 0.875rem;
  font-weight: 800;
  resize: none;
  text-align: center;
  width: 100px;

  &:focus {
    outline: 0;
  }
`

export const TeamLogo = styled.img`
  cursor: pointer;
  margin-bottom: 1rem;
  max-height: 70px;
  max-width: 70px;
`

export const PlayerInput = styled.input`
  border: 0;
  display: flex;
  flex-wrap: wrap;
  font-size: 0.875rem;
  font-weight: 800;
  justify-content: center;
  text-align: center;
  width: 50px;

  &:focus {
    outline: 0;
  }
`

export const ScoreInput = styled.input`
  border: 0;
  display: flex;
  font-size: 2rem;
  justify-content: center;
  text-align: center;
  width: 35px;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: 0;
  }
`

export const VersusSpan = styled.span`
  font-size: 1rem;
`

export const OutcomeChipsRow = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: center;
  margin-top: 0.75rem;
`

export const OutcomeChipCell = styled.div`
  box-sizing: border-box;
  display: flex;
  flex: 0 0 ${({ $position }) => ($position === 'side' ? '100px' : 'auto')};
  justify-content: center;
  min-width: ${({ $position }) => ($position === 'side' ? '100px' : '5.5rem')};
`

export const OutcomeChip = styled.span`
  background-color: rgba(0, 0, 0, 0.06);
  border-radius: 999px;
  box-sizing: border-box;
  color: #4b5563;
  cursor: help;
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.4;
  padding: 0 0.5rem;
  white-space: nowrap;
  &:focus-visible {
    outline: 2px solid var(--orange-900);
    outline-offset: 1px;
  }
  &[data-upset] {
    background-color: rgba(255, 140, 26, 0.18);
    color: #b45309;
  }
`
