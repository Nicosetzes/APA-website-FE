import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import Divider from '@mui/material/Divider'
import { NavLink } from 'react-router-dom'
import { StyledExtendedNavMenu } from './styled'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'
import { removeAuthToken } from 'utils/auth'
import { useLogin } from 'context/LoginContext'
import { useState } from 'react'
import withReactContent from 'sweetalert2-react-content'

const ExtendedNavMenu = () => {
  const MySwal = withReactContent(Swal)
  const { loginStatus, setLoginStatus } = useLogin()

  const { status } = loginStatus

  const [menuStatus, setMenuStatus] = useState(false)

  const handleLogout = () => {
    MySwal.fire({
      background: `rgba(28, 25, 25, 0.95)`,
      color: `#fff`,
      icon: 'info',
      iconColor: '#0a15d1',
      toast: true,
      title: 'Cerrando sesión...',
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      customClass: { timerProgressBar: 'toast-progress-dark' },
      didClose: () => {
        removeAuthToken()
        setLoginStatus({})
        window.location.href = '/'
      },
    })
  }

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
      {status ? (
        <button onClick={handleLogout} className="nav-link logout-button">
          CERRAR SESIÓN
        </button>
      ) : (
        <NavLink to="/users/login" className="nav-link login">
          LOGIN
        </NavLink>
      )}
    </StyledExtendedNavMenu>
  )
}

export default ExtendedNavMenu
