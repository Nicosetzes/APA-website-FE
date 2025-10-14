import styled from 'styled-components'
import Menu from '@mui/material/Menu'

export const StyledMenu = styled(Menu)`
  ul {
    background-color: #f5d87f;
    a {
      color: var(--blue-900);
      text-decoration: none;
      div {
        font-weight: 700;
      }
    }
  }
`
