import styled from 'styled-components'

export const StyledLeagueBox = styled.div`
  cursor: pointer;
  display: flex;
  height: 150px;
  justify-content: center;
  margin: 0.5rem;
  outline: ${(props) =>
    props.active ? '#0beb0b 2px solid' : '#fff 2px solid'};
  width: 125px;
  &:hover {
    background-color: #2a2929;
    transition: transform 0.3s linear;
    transform: scale(1.025, 1.025);
  }
  div {
    align-items: center;
    color: #fff;
    display: flex;
    justify-content: center;
    height: 100%;
    text-align: center;
    width: 100%;
  }
`
