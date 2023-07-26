import styled from 'styled-components'

export const StyledTeamBox = styled.div`
  align-items: center;
  background-color: #004a79;
  color: #fff;
  cursor: pointer;
  justify-content: center;
  margin: 1rem;
  outline: ${(props) =>
    props.active ? '#0beb0b 3px solid' : '#ff3b27 3px solid'};
  min-width: 280px;
  & > div {
    align-items: center;
    display: flex;
    flex-flow: column wrap;
    padding: 0.75em 1.25em;
    .teambox__team {
      align-items: center;
      display: flex;
      img {
        width: 100px;
      }
      span {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0 0.5rem;
      }
    }
    .teambox__player {
    }
  }
`
