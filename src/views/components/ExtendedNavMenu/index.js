import { StyledExtendedNavMenu } from './styled'
import { NavLink } from 'react-router-dom'
import { useLogin } from 'context/LoginContext'
import Divider from '@mui/material/Divider'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import { useState } from 'react'
import { motion } from 'framer-motion'

const ExtendedNavMenu = () => {
  const login = useLogin()

  const { loginStatus } = login

  console.log(loginStatus)

  const { status } = loginStatus

  const [menuStatus, setMenuStatus] = useState(false)

  console.log(menuStatus)

  const handleMenuCloseWhenClickingOutside = () => {
    menuStatus && setMenuStatus(false)
  }

  return (
    <StyledExtendedNavMenu>
      <NavLink to="/" className="nav-link">
        INICIO
      </NavLink>
      <NavLink to="/edits" className="nav-link">
        EDITS
      </NavLink>
      <ClickAwayListener onClickAway={handleMenuCloseWhenClickingOutside}>
        <div className="nav-link container__dropdown">
          <div
            className="dropdown-link"
            onClick={() => setMenuStatus(!menuStatus)}
          >
            TORNEOS <ArrowDropDownIcon />
          </div>
          {menuStatus && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="dropdown-menu"
            >
              <NavLink
                to="/tournaments"
                className="dropdown-menu-item"
                onClick={() => setMenuStatus(!menuStatus)}
              >
                VER TORNEOS
              </NavLink>
              <Divider sx={{ borderColor: 'var(--blue-900)' }} />
              <NavLink
                to="/tournaments/create-tournament"
                className="dropdown-menu-item"
                onClick={() => setMenuStatus(!menuStatus)}
              >
                CREAR TORNEO
              </NavLink>
              <Divider sx={{ borderColor: 'var(--blue-900)' }} />
              <NavLink
                to="/matches"
                className="dropdown-menu-item"
                onClick={() => setMenuStatus(!menuStatus)}
              >
                ARCHIVO DE PARTIDOS
              </NavLink>
            </motion.div>
          )}
        </div>
      </ClickAwayListener>
      <NavLink to="/statistics" className="nav-link">
        STATS
      </NavLink>
      <NavLink to="/hall-of-fame" className="nav-link">
        SALÓN DE LA FAMA
      </NavLink>
      <NavLink to="/users/login" className="nav-link login">
        {status ? 'MI PERFIL' : 'LOGIN'}
      </NavLink>
    </StyledExtendedNavMenu>
  )
}

export default ExtendedNavMenu
