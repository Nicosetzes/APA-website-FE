import styled from 'styled-components'

export const PlayoffRoundContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: ${(props) =>
    props.firstRoundMatchesCount
      ? `calc(115px * ${props.firstRoundMatchesCount} + ${props.firstRoundMatchesCount} * 1.5rem)`
      : 'auto'};
`

export const RoundName = styled.div`
  color: #fff;
  display: flex;
  font-weight: 700;
  justify-content: center;
  margin-bottom: 2rem;
`

export const RoundMatches = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: ${(props) =>
    props.spread ? 'space-around' : 'space-between'};
  margin-bottom: 2rem;
`
