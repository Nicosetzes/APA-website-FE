import styled from 'styled-components'

export const StyledTeamBox = styled.div`
  .teams__container-team {
    align-items: center;
    color: #fff;
    cursor: pointer;
    display: flex;
    height: 40px;
    justify-content: center;
    margin: 1rem;
    outline: ${(props) =>
      props.active ? '#0beb0b 2px solid' : '#fff 2px solid'};
    text-align: center;
    width: 150px;
    &:hover {
      /* background-color: #5e5b5b; */
      background-color: #2a2929;
      transition: transform 0.3s linear;
      transform: scale(1.025, 1.025);
    }
    img {
      margin: 0 0.25rem;
      width: 25px;
    }
  }
`
