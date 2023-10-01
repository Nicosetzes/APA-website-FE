import styled from 'styled-components'
export const StyledMatchPreview = styled.div`
  align-items: center;
  display: flex;
  flex-direction: ${(props) => (props.isSm ? 'row' : 'column')};
  /* height: ${(props) => (props.isSm ? '175px' : 'auto')}; */
  justify-content: space-evenly;
  margin: 0.5rem;
  max-width: ${(props) => (props.isSm ? 'none' : '300px')};
  outline: #157155 3px solid;
  padding: 0.5rem;
  width: 500px;
  .match__team {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: end;
    padding: 0.75rem 0.25rem;
    .team__position {
      color: #086128;
      font-size: 3.75rem;
      font-weight: 700;
    }
    .team__image {
      height: 100px;
      margin: ${(props) => (props.isSm ? '0' : '0 0 0 1rem')};
      width: 100px;
      &.small {
        height: 80px;
        width: 80px;
      }
    }
    .team__name,
    .team__player {
      font-size: 1.25rem;
      font-weight: 700;
    }
  }
  .match__separator {
    display: ${(props) => (props.isSm ? 'block' : 'none')};
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0.75rem;
  }
`
