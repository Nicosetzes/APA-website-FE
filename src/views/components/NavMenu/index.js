import * as React from 'react'
import AccountCircle from '@mui/icons-material/AccountCircle'
import BarChartIcon from '@mui/icons-material/BarChart'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CreateIcon from '@mui/icons-material/Create'
import Divider from '@mui/material/Divider'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import ExtensionIcon from '@mui/icons-material/Extension'
import HomeIcon from '@mui/icons-material/Home'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import { NavLink } from 'react-router-dom'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import { StyledMenu } from './styled'
import Swal from 'sweetalert2'
import { removeAuthToken } from 'utils/auth'
import { useLogin } from 'context/LoginContext'
import withReactContent from 'sweetalert2-react-content'

const NavMenu = ({ handleClose, isOpen, anchorEl }) => {
  const MySwal = withReactContent(Swal)
  const { loginStatus, setLoginStatus } = useLogin()

  const { status } = loginStatus

  const handleLogout = () => {
    handleClose()
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

  return (
    <StyledMenu
      id="basic-menu"
      anchorEl={anchorEl}
      open={isOpen}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <MenuList>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <HomeIcon htmlColor="var(--blue-900)" fontSize="small" />
          </ListItemIcon>
          <NavLink to="/">
            <div>INICIO</div>
          </NavLink>
        </MenuItem>
        <Divider sx={{ borderColor: 'var(--blue-900)' }} />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ExtensionIcon htmlColor="var(--blue-900)" fontSize="small" />
          </ListItemIcon>
          <NavLink to="/edits">
            <div>EDITS</div>
          </NavLink>
        </MenuItem>
        <Divider sx={{ borderColor: 'var(--blue-900)' }} />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CalendarMonthIcon htmlColor="var(--blue-900)" fontSize="small" />
          </ListItemIcon>
          <NavLink to="/tournaments">
            <div>VER TORNEOS</div>
          </NavLink>
        </MenuItem>
        <Divider sx={{ borderColor: 'var(--blue-900)' }} />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CreateIcon htmlColor="var(--blue-900)" fontSize="small" />
          </ListItemIcon>
          <NavLink to="/tournaments/create-tournament">
            <div>CREAR TORNEO</div>
          </NavLink>
        </MenuItem>
        <Divider sx={{ borderColor: 'var(--blue-900)' }} />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <SportsSoccerIcon htmlColor="var(--blue-900)" fontSize="small" />
          </ListItemIcon>
          <NavLink to="/matches">
            <div>ARCHIVO DE PARTIDOS</div>
          </NavLink>
        </MenuItem>
        <Divider sx={{ borderColor: 'var(--blue-900)' }} />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <BarChartIcon htmlColor="var(--blue-900)" fontSize="small" />
          </ListItemIcon>
          <NavLink to="/statistics">
            <div>STATS</div>
          </NavLink>
        </MenuItem>
        <Divider sx={{ borderColor: 'var(--blue-900)' }} />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <EmojiEventsIcon htmlColor="var(--blue-900)" fontSize="small" />
          </ListItemIcon>
          <NavLink to="/hall-of-fame">
            <div>SALÓN DE LA FAMA</div>
          </NavLink>
        </MenuItem>
        <Divider sx={{ borderColor: 'var(--blue-900)' }} />
        {status ? (
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <AccountCircle htmlColor="var(--blue-900)" fontSize="small" />
            </ListItemIcon>
            <div>CERRAR SESIÓN</div>
          </MenuItem>
        ) : (
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AccountCircle htmlColor="var(--blue-900)" fontSize="small" />
            </ListItemIcon>
            <NavLink to="/users/login">
              <div>LOGIN</div>
            </NavLink>
          </MenuItem>
        )}
      </MenuList>
    </StyledMenu>
  )
}

export default NavMenu
