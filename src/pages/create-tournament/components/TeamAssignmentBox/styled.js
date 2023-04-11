import styled from 'styled-components'

export const StyledTeamAssignmentBox = styled.div`
  .teams-assignment__container-team {
    align-items: center;
    color: #fff;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin: 0.5rem;
    padding: 0.25rem;
    outline: ${(props) =>
      props.active ? '#0beb0b 2px solid' : '#fff 2px solid'};
    text-align: center;
    width: 250px;
  }
`
