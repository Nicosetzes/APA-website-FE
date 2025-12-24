import { StyledTooltip } from './styled'

/**
 * Custom Tooltip component with consistent styling
 * @param {React.ReactNode} title - Content to display in the tooltip
 * @param {React.ReactNode} children - Element that triggers the tooltip
 * @param {string} placement - Position of tooltip (top, bottom, left, right, etc.)
 * @param {object} ...props - Additional MUI Tooltip props
 */
const Tooltip = ({ title, children, placement = 'top', ...props }) => {
  return (
    <StyledTooltip title={title} placement={placement} arrow {...props}>
      {children}
    </StyledTooltip>
  )
}

export default Tooltip
