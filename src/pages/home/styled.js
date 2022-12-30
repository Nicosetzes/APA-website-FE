import styled from 'styled-components'

export const StyledHome = styled.div`
  a {
    display: flex;
    height: 250px;
    text-decoration: none;
    width: 55vw;
    &:nth-child(odd) {
      margin: 1.75rem auto 1.75rem 1rem;
    }
    &:nth-child(even) {
      margin: 1.75rem 1rem 1.75rem auto;
    }
  }
`
