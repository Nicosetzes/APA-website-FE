import styled from 'styled-components'
import BreadCrumbs from '@mui/material/Breadcrumbs'

export const StyledBreadCrumbsMUI = styled(BreadCrumbs)`
  display: flex;
  margin: 1.75rem auto !important;
  padding: 0 0.75rem;
  width: fit-content;
  ol {
    flex-direction: ${(props) => props.direction};
    justify-content: flex-start;
    .MuiBreadcrumbs-separator {
      margin: 0.5rem;
    }
    a {
      color: var(--blue-900);
      font-weight: 700;
      text-decoration: none;
    }
  }
`
