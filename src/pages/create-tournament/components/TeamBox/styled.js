import styled from 'styled-components'

export const StyledTeamBox = styled.div`
  margin: 1rem;
  .teams__container-team {
    align-items: center;
    color: #fff;
    cursor: pointer;
    display: flex;
    height: 40px;
    justify-content: center;
    outline: ${(props) =>
      props.active ? '#0beb0b 2px solid' : '#fff 2px solid'};
    text-align: center;
    width: 150px;
    &:hover {
      background-color: #2a2929;
      outline: rgb(116, 232, 220) 2px solid;
    }
    img {
      margin: 0 0.25rem;
      width: 25px;
    }
  }
`
