import styled from 'styled-components'

export const StyledFormatsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  .format__container {
    align-items: center;
    border: #004a79 2.5px solid;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    height: 225px;
    justify-content: space-between;
    max-width: 175px;
    padding: 1rem 0.75rem;
    &:hover {
      border: rgb(7, 150, 114) 2.5px solid;
    }
    .formats__box-title {
      font-weight: 700;
      text-align: center;
    }
    & > img {
      max-width: 100%;
    }
  }
`
