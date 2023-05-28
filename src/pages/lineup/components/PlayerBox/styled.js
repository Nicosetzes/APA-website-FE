import styled from 'styled-components'
export const StyledPlayerBox = styled.div`
  align-items: center;
  border: black 2px solid;
  cursor: grab;
  display: flex;
  flex-direction: column;
  height: 80px;
  justify-content: center;
  margin: 0 auto;
  width: 80px;
  .drop-zone {
    align-items: center;
    display: flex;
    flex-direction: column;
    .drop-zone-name {
      color: #fff;
      font-weight: 700;
      margin-top: 0.25rem;
    }
  }
`
