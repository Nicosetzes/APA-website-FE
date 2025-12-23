import styled from 'styled-components'

export const StyledPlayerInformationModal = styled.div`
  display: flex;
  flex-direction: column;
  .container__stats {
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
    /* outline: #f5d87f 2px solid; */
    .stats-item {
      align-items: center;
      color: #fff;
      display: flex;
      justify-content: center;
      margin: 2rem;
      padding: 0.5rem 0.75rem;
      outline: #f5d87f 2px solid;
    }
  }
`
