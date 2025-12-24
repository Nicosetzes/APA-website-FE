import styled from 'styled-components'
import MuiTooltip, { tooltipClasses } from '@mui/material/Tooltip'

export const StyledTooltip = styled(({ className, ...props }) => (
  <MuiTooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    border: '1px solid #dadde9',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: '0.75rem',
    fontFamily: 'Fira Sans, sans-serif',
    maxWidth: 275,
    padding: '0.75rem 1rem',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#f5f5f9',
    '&::before': {
      border: '1px solid #dadde9',
    },
  },
}))
