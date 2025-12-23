import * as React from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import { StyledHamburger } from './styled'

const Hamburger = ({ handleClick, isOpen }) => {
  return (
    <StyledHamburger
      id="hamburger"
      aria-label="display menu"
      aria-controls={isOpen ? 'basic-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={isOpen ? 'true' : undefined}
      onClick={handleClick}
    >
      <MenuIcon />
    </StyledHamburger>
  )
}

export default Hamburger
